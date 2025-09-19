const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const router = express.Router();
const redisService = require('../services/redis');
const mcpClient = require('../services/mcp-client');
const rewardCalculator = require('../services/reward-calculator');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// POST /api/data/upload-transactions
router.post('/upload-transactions', upload.single('transactions'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const transactions = [];
    
    // Parse CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        transactions.push({
          tx_id: `t_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          user_id: 'demo_user_123',
          date: row.date || new Date().toISOString().split('T')[0],
          amount: parseFloat(row.amount) || 0,
          merchant: row.merchant || 'Unknown',
          category: row.category || 'other',
          card_id: row.card_id || 'default_card'
        });
      })
      .on('end', () => {
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        
        res.json({
          success: true,
          transactions: transactions,
          count: transactions.length,
          message: 'Transactions uploaded successfully'
        });
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error);
        fs.unlinkSync(req.file.path);
        res.status(500).json({ error: 'Failed to parse CSV file' });
      });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// POST /api/data/goals
router.post('/goals', async (req, res) => {
  try {
    const { title, target_date, est_cost_usd, notes } = req.body;
    
    const goal = {
      goal_id: `g_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: 'demo_user_123',
      title: title,
      target_date: target_date,
      est_cost_usd: parseFloat(est_cost_usd) || 0,
      notes: notes || '',
      created_at: new Date().toISOString()
    };

    res.json({
      success: true,
      goal: goal,
      message: 'Goal created successfully'
    });
  } catch (error) {
    console.error('Goal creation error:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

// GET /api/data/goals
router.get('/goals', async (req, res) => {
  try {
    // Mock goals data
    const goals = [
      {
        goal_id: 'g_11',
        user_id: 'demo_user_123',
        title: 'Trip to Paris',
        target_date: '2025-05-10',
        est_cost_usd: 1200,
        notes: 'anniversary trip',
        created_at: '2024-09-19T10:00:00Z'
      }
    ];

    res.json({
      success: true,
      goals: goals
    });
  } catch (error) {
    console.error('Goals fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// POST /api/data/store-profile - Store user profile data
router.post('/store-profile', async (req, res) => {
  try {
    const { user_id, profile_data } = req.body;
    
    if (!user_id || !profile_data) {
      return res.status(400).json({ success: false, error: 'User ID and profile data are required' });
    }

    const success = await redisService.storeUserProfile(user_id, profile_data);
    
    if (success) {
      res.json({ success: true, message: 'Profile stored successfully' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to store profile' });
    }
  } catch (error) {
    console.error('Store profile error:', error);
    res.status(500).json({ success: false, error: 'Failed to store profile' });
  }
});

// POST /api/data/store-goals - Store user goals with MCP data fetching
router.post('/store-goals', async (req, res) => {
  try {
    const { user_id, goals } = req.body;
    
    if (!user_id || !goals || !Array.isArray(goals)) {
      return res.status(400).json({ success: false, error: 'User ID and goals array are required' });
    }

    console.log(`🔍 Processing ${goals.length} goals for user ${user_id}`);

    // Fetch MCP data for each goal
    const enrichedGoals = [];
    for (const goal of goals) {
      console.log(`📊 Fetching MCP data for goal: ${goal.title}`);
      
      // Fetch goal data using MCP
      const goalData = await mcpClient.fetchGoalData(goal);
      
      // Store goal data in Redis
      await redisService.storeGoalData(goal.goal_id, goalData);
      
      // Add enriched goal to array
      enrichedGoals.push({
        ...goal,
        mcp_data: goalData,
        scraped_at: new Date().toISOString()
      });
    }

    // Store enriched goals in Redis
    const success = await redisService.storeUserGoals(user_id, enrichedGoals);
    
    if (success) {
      res.json({ 
        success: true, 
        message: `Stored ${enrichedGoals.length} goals with MCP data`,
        goals: enrichedGoals
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to store goals' });
    }
  } catch (error) {
    console.error('Store goals error:', error);
    res.status(500).json({ success: false, error: 'Failed to store goals' });
  }
});

// GET /api/data/goals/:user_id - Get user goals with MCP data
router.get('/goals/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const goals = await redisService.getUserGoals(user_id);
    
    res.json({ success: true, goals });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ success: false, error: 'Failed to get goals' });
  }
});

// POST /api/data/calculate-rewards - Calculate missed rewards deterministically
router.post('/calculate-rewards', async (req, res) => {
  try {
    const { user_id, lookback_months = 12 } = req.body;
    
    if (!user_id) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    console.log(`💰 Calculating missed rewards for user ${user_id}`);

    // Get user transactions from Redis
    const transactions = await redisService.getUserTransactions(user_id);
    
    if (transactions.length === 0) {
      return res.json({ 
        success: true, 
        calculation: {
          missed_usd_total: 0,
          total_transactions: 0,
          evidence: [],
          recommendations: []
        }
      });
    }

    // Calculate missed rewards deterministically
    const calculation = rewardCalculator.calculateTotalMissedRewards(transactions);
    
    console.log(`✅ Calculated $${calculation.missed_usd_total.toFixed(2)} in missed rewards`);
    
    res.json({ success: true, calculation });
  } catch (error) {
    console.error('Calculate rewards error:', error);
    res.status(500).json({ success: false, error: 'Failed to calculate rewards' });
  }
});

// POST /api/data/generate-timeline - Generate credit card timeline
router.post('/generate-timeline', async (req, res) => {
  try {
    const { user_id, goal_id } = req.body;
    
    if (!user_id) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    console.log(`📅 Generating timeline for user ${user_id}`);

    // Get user data from Redis
    const userProfile = await redisService.getUserProfile(user_id);
    const goals = await redisService.getUserGoals(user_id);
    const transactions = await redisService.getUserTransactions(user_id);
    const cardOffers = await redisService.getCardOffers();

    // Calculate spending patterns from transactions
    const spendingPatterns = this.calculateSpendingPatterns(transactions);

    // Generate timeline
    const timelines = rewardCalculator.generateTimeline(
      userProfile,
      goal_id ? goals.filter(g => g.goal_id === goal_id) : goals,
      spendingPatterns,
      cardOffers
    );
    
    console.log(`✅ Generated ${timelines.length} timelines`);
    
    res.json({ success: true, timelines });
  } catch (error) {
    console.error('Generate timeline error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate timeline' });
  }
});

// Helper function to calculate spending patterns
function calculateSpendingPatterns(transactions) {
  const patterns = {};
  
  for (const transaction of transactions) {
    const category = transaction.category || 'other';
    patterns[category] = (patterns[category] || 0) + transaction.amount;
  }
  
  return patterns;
}

module.exports = router;
