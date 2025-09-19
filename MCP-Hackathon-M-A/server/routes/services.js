const express = require('express');
const router = express.Router();

// Import services
const redisService = require('../services/redis');
const sensoService = require('../services/senso');
const brightDataService = require('../services/brightdata');
const llamaIndexService = require('../services/llamaindex');
const llmService = require('../services/llm');
const mcpClient = require('../services/mcp-client');

// GET /api/services/status - Check status of all external services
router.get('/status', async (req, res) => {
  try {
    const status = {
      redis: await redisService.healthCheck(),
      senso: await sensoService.healthCheck(),
      brightdata: await brightDataService.healthCheck(),
      llamaindex: await llamaIndexService.healthCheck(),
      llm: await llmService.healthCheck(),
      mcp: await mcpClient.healthCheck(),
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      services: status,
      demo_mode: process.env.DEMO_MODE === 'true'
    });
  } catch (error) {
    console.error('Service status check error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to check service status' 
    });
  }
});

// POST /api/services/initialize - Initialize all services
router.post('/initialize', async (req, res) => {
  try {
    const results = {
      redis: await redisService.connect(),
      senso: await sensoService.initialize(),
      brightdata: await brightDataService.initialize(),
      llamaindex: await llamaIndexService.initialize()
    };

    const successCount = Object.values(results).filter(Boolean).length;
    const totalCount = Object.keys(results).length;

    res.json({
      success: successCount > 0,
      results: results,
      message: `${successCount}/${totalCount} services initialized successfully`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Service initialization error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to initialize services' 
    });
  }
});

// POST /api/services/scrape/offers - Scrape credit card offers using MCP
router.post('/scrape/offers', async (req, res) => {
  try {
    console.log('🔍 Scraping credit card offers using MCP...');
    
    // Use MCP client for real web scraping
    const result = await mcpClient.scrapeCardOffers();
    
    if (result.success && result.offers.length > 0) {
      // Store offers in Redis
      await redisService.storeCardOffers(result.offers);
      console.log(`✅ Successfully scraped ${result.total_scraped} card offers`);
    }

    // Return results with fallback demo data
    res.json({
      success: true,
      offers: result.offers.length > 0 ? result.offers : [
        {
          card_id: 'chase_sapphire_24',
          issuer: 'Chase',
          name: 'Chase Sapphire Preferred',
          signup_bonus_points: 80000,
          bonus_min_spend: 4000,
          bonus_period_days: 90,
          category_multipliers: {
            travel: 2,
            dining: 2,
            groceries: 1,
            gas: 1,
            other: 1
          },
          annual_fee: 95,
          point_value_usd: 0.0125,
          link: 'https://www.chase.com/personal/credit-cards/sapphire-preferred',
          last_updated: new Date().toISOString()
        },
        {
          card_id: 'amex_gold_24',
          issuer: 'American Express',
          name: 'American Express Gold Card',
          signup_bonus_points: 60000,
          bonus_min_spend: 4000,
          bonus_period_days: 180,
          category_multipliers: {
            dining: 4,
            groceries: 4,
            travel: 3,
            gas: 1,
            other: 1
          },
          annual_fee: 250,
          point_value_usd: 0.02,
          link: 'https://www.americanexpress.com/us/credit-cards/card/gold-card/',
          last_updated: new Date().toISOString()
        }
      ],
      scraped_at: new Date().toISOString(),
      mode: result.mode || 'demo',
      total_scraped: result.total_scraped || 0
    });
  } catch (error) {
    console.error('Card offers scraping error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to scrape card offers' 
    });
  }
});

// POST /api/services/scrape/travel - Scrape travel prices using MCP
router.post('/scrape/travel', async (req, res) => {
  try {
    const { destination, departure_date, return_date } = req.body;
    
    if (!destination || !departure_date) {
      return res.status(400).json({
        success: false,
        error: 'Destination and departure date are required'
      });
    }

    console.log(`🔍 Scraping travel prices for ${destination} on ${departure_date} using MCP...`);

    // Use MCP client for real web scraping
    const result = await mcpClient.scrapeTravelPrices(destination, departure_date);

    // Return results with fallback demo data
    res.json({
      success: true,
      prices: result.prices.length > 0 ? result.prices : [
        {
          airline: 'American Airlines',
          price: 850,
          departure_time: '08:00',
          arrival_time: '14:30',
          duration: '6h 30m',
          stops: 0,
          class: 'Economy'
        },
        {
          airline: 'Delta',
          price: 920,
          departure_time: '12:15',
          arrival_time: '18:45',
          duration: '6h 30m',
          stops: 0,
          class: 'Economy'
        },
        {
          airline: 'United',
          price: 780,
          departure_time: '16:30',
          arrival_time: '23:00',
          duration: '6h 30m',
          stops: 1,
          class: 'Economy'
        }
      ],
      destination: destination,
      departure_date: departure_date,
      return_date: return_date,
      scraped_at: new Date().toISOString(),
      mode: result.mode || 'demo',
      total_scraped: result.total_scraped || 0
    });
  } catch (error) {
    console.error('Travel prices scraping error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to scrape travel prices' 
    });
  }
});

// POST /api/services/index/create - Create document index
router.post('/index/create', async (req, res) => {
  try {
    const { documents, index_name } = req.body;
    
    if (!documents || !Array.isArray(documents)) {
      return res.status(400).json({
        success: false,
        error: 'Documents array is required'
      });
    }

    const result = await llamaIndexService.createIndex(
      documents, 
      index_name || `index_${Date.now()}`
    );

    res.json(result);
  } catch (error) {
    console.error('Index creation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create index' 
    });
  }
});

// POST /api/services/index/query - Query document index
router.post('/index/query', async (req, res) => {
  try {
    const { index_id, query, top_k } = req.body;
    
    if (!index_id || !query) {
      return res.status(400).json({
        success: false,
        error: 'Index ID and query are required'
      });
    }

    const result = await llamaIndexService.queryIndex(
      index_id, 
      query, 
      top_k || 5
    );

    res.json(result);
  } catch (error) {
    console.error('Index query error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to query index' 
    });
  }
});

module.exports = router;
