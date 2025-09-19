const express = require('express');
const router = express.Router();

// Import services
const llmService = require('../services/llm');
const redisService = require('../services/redis');
const sensoService = require('../services/senso');

// POST /api/chat/message - Send message to AI
router.post('/message', async (req, res) => {
  try {
    const { message, user_id, context_id } = req.body;
    
    if (!message || !user_id) {
      return res.status(400).json({
        success: false,
        error: 'Message and user_id are required'
      });
    }

    // Get user context from Senso
    let context = {};
    if (context_id) {
      const contextResult = await sensoService.getContext(context_id, 'chat');
      if (contextResult.success) {
        context = contextResult.context;
      }
    }

    // Generate AI response
    const aiResponse = await llmService.generateRecommendation(context, message);

    // Store conversation in Redis
    const conversation = {
      user_id,
      message,
      response: aiResponse.response,
      timestamp: new Date().toISOString(),
      context_id
    };

    await redisService.storeConversation(conversation);

    res.json({
      success: true,
      response: aiResponse.response,
      reasoning: aiResponse.reasoning,
      confidence: aiResponse.confidence,
      timestamp: conversation.timestamp
    });
  } catch (error) {
    console.error('Chat message error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process chat message' 
    });
  }
});

// POST /api/chat/calculate-rewards - Calculate missed rewards
router.post('/calculate-rewards', async (req, res) => {
  try {
    const { user_id, context_id } = req.body;
    
    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Get user data from Redis
    const userData = await redisService.getUserData(user_id);
    const cardOffers = await redisService.getCardOffers();

    if (!userData || !userData.transactions) {
      return res.status(400).json({
        success: false,
        error: 'User transaction data not found'
      });
    }

    // Calculate missed rewards using LLM
    const result = await llmService.calculateMissedRewards(
      userData.transactions,
      cardOffers
    );

    res.json(result);
  } catch (error) {
    console.error('Calculate rewards error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to calculate missed rewards' 
    });
  }
});

// POST /api/chat/generate-timeline - Generate optimization timeline
router.post('/generate-timeline', async (req, res) => {
  try {
    const { goal, user_id, context_id } = req.body;
    
    if (!goal || !user_id) {
      return res.status(400).json({
        success: false,
        error: 'Goal and user_id are required'
      });
    }

    // Get user data
    const userData = await redisService.getUserData(user_id);
    const cardOffers = await redisService.getCardOffers();

    if (!userData) {
      return res.status(400).json({
        success: false,
        error: 'User data not found'
      });
    }

    // Generate timeline using LLM
    const result = await llmService.generateTimeline(
      goal,
      userData,
      cardOffers
    );

    res.json(result);
  } catch (error) {
    console.error('Generate timeline error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate timeline' 
    });
  }
});

// GET /api/chat/history/:user_id - Get chat history
router.get('/history/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { limit = 20 } = req.query;

    const history = await redisService.getConversationHistory(user_id, limit);

    res.json({
      success: true,
      history,
      count: history.length
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get chat history' 
    });
  }
});

// POST /api/chat/parse-goals - Parse natural language goals using LLM
router.post('/parse-goals', async (req, res) => {
  const { user_id, natural_language_text } = req.body;

  if (!user_id || !natural_language_text) {
    return res.status(400).json({ success: false, error: 'User ID and natural language text are required' });
  }

  try {
    console.log(`🧠 Parsing natural language goals for user ${user_id}:`, natural_language_text);

    // Use LLM to parse natural language goals
    const llmResponse = await llmService.parseNaturalLanguageGoals(natural_language_text);

    if (llmResponse.success) {
      res.json({ success: true, goals: llmResponse.goals });
    } else {
      res.status(500).json({ success: false, error: llmResponse.error });
    }
  } catch (error) {
    console.error('Parse goals error:', error);
    res.status(500).json({ success: false, error: 'Failed to parse goals' });
  }
});

module.exports = router;
