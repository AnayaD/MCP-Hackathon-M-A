const axios = require('axios');

class MCPClient {
  constructor() {
    this.brightDataApiKey = process.env.BRIGHT_DATA_API_KEY;
    this.isConfigured = !!this.brightDataApiKey;
  }

  // Initialize MCP connection
  async initialize() {
    if (!this.isConfigured) {
      console.log('⚠️  Bright Data MCP not configured - using demo mode');
      return false;
    }

    try {
      // Test MCP connection using Bright Data's MCP server
      // According to docs: https://docs.brightdata.com/mcp-server
      const response = await axios.post('https://mcp.brightdata.com/v1/initialize', {
        api_key: this.brightDataApiKey
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.brightDataApiKey}`
        }
      });

      console.log('✅ Bright Data MCP connected successfully');
      return true;
    } catch (error) {
      console.log('⚠️  Bright Data MCP connection failed - using demo mode:', error.message);
      return false;
    }
  }

  // Scrape web content using MCP
  async scrapeWebContent(url, selectors = {}) {
    if (!this.isConfigured) {
      // Demo mode - return mock data
      return {
        success: true,
        data: {
          url: url,
          title: 'Demo Credit Card Offer',
          content: 'Chase Sapphire Preferred - 80,000 point signup bonus',
          scraped_at: new Date().toISOString()
        },
        mode: 'demo'
      };
    }

    try {
      // Use Bright Data MCP server for web scraping
      // According to docs: https://docs.brightdata.com/mcp-server
      const response = await axios.post('https://mcp.brightdata.com/v1/scrape', {
        url: url,
        selectors: selectors
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.brightDataApiKey}`
        }
      });

      return {
        success: true,
        data: response.data,
        mode: 'live'
      };
    } catch (error) {
      console.error('MCP scraping error:', error.message);
      return {
        success: false,
        error: error.message,
        mode: 'demo'
      };
    }
  }

  // Scrape credit card offers from multiple sources
  async scrapeCardOffers() {
    const cardUrls = [
      'https://www.chase.com/personal/credit-cards/sapphire-preferred',
      'https://www.americanexpress.com/us/credit-cards/card/gold-card/',
      'https://www.capitalone.com/credit-cards/venture/'
    ];

    const offers = [];

    for (const url of cardUrls) {
      const result = await this.scrapeWebContent(url, {
        card_name: '.card-title, .product-name',
        signup_bonus: '.bonus-points, .signup-bonus',
        annual_fee: '.annual-fee, .fee-amount',
        category_multipliers: '.category-multiplier, .earn-rate'
      });

      if (result.success) {
        offers.push({
          url: url,
          data: result.data,
          scraped_at: new Date().toISOString()
        });
      }
    }

    return {
      success: true,
      offers: offers,
      total_scraped: offers.length,
      mode: offers.length > 0 ? 'live' : 'demo'
    };
  }

  // Scrape travel prices
  async scrapeTravelPrices(destination, departureDate) {
    const travelUrls = [
      `https://www.expedia.com/Flights-Search?destination=${destination}&departure=${departureDate}`,
      `https://www.kayak.com/flights/${destination}/${departureDate}`,
      `https://www.google.com/flights?q=Flights+to+${destination}+on+${departureDate}`
    ];

    const prices = [];

    for (const url of travelUrls) {
      const result = await this.scrapeWebContent(url, {
        airline: '.airline-name',
        price: '.price-amount',
        departure_time: '.departure-time',
        arrival_time: '.arrival-time',
        duration: '.flight-duration'
      });

      if (result.success) {
        prices.push({
          url: url,
          data: result.data,
          scraped_at: new Date().toISOString()
        });
      }
    }

    return {
      success: true,
      prices: prices,
      destination: destination,
      departure_date: departureDate,
      total_scraped: prices.length,
      mode: prices.length > 0 ? 'live' : 'demo'
    };
  }

  // Health check
  async healthCheck() {
    if (!this.isConfigured) {
      return { status: 'demo_mode', message: 'Bright Data MCP not configured' };
    }

    try {
      // Check MCP server status
      // According to docs: https://docs.brightdata.com/mcp-server
      const response = await axios.get('https://mcp.brightdata.com/v1/status', {
        headers: {
          'Authorization': `Bearer ${this.brightDataApiKey}`
        }
      });

      return {
        status: 'connected',
        response: response.data
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  // Fetch goal-related data using MCP (pricing, reviews, metadata)
  async fetchGoalData(goal) {
    console.log(`🔍 Fetching MCP data for goal: ${goal.title}`);
    
    let goalData = {
      goal_id: goal.goal_id,
      title: goal.title,
      category: goal.category,
      target_date: goal.target_date,
      est_cost_usd: goal.est_cost_usd,
      scraped_at: new Date().toISOString(),
      mode: 'demo'
    };

    if (this.isConfigured) {
      try {
        // Determine what data to fetch based on goal category
        if (goal.category === 'travel' || goal.title.toLowerCase().includes('trip')) {
          // Fetch travel data
          const travelData = await this.scrapeTravelPrices(goal.title, goal.target_date);
          goalData.travel_data = travelData;
          goalData.mode = travelData.mode;
        } else if (goal.category === 'technology' || goal.title.toLowerCase().includes('laptop')) {
          // Fetch tech product data
          const techData = await this.scrapeTechProductData(goal.title);
          goalData.tech_data = techData;
          goalData.mode = techData.mode;
        } else if (goal.category === 'events' || goal.title.toLowerCase().includes('wedding')) {
          // Fetch event data
          const eventData = await this.scrapeEventData(goal.title, goal.target_date);
          goalData.event_data = eventData;
          goalData.mode = eventData.mode;
        }

        // Fetch reviews and ratings
        const reviewData = await this.scrapeReviews(goal.title);
        goalData.reviews = reviewData;
        
        console.log(`✅ Successfully fetched MCP data for goal: ${goal.title}`);
      } catch (error) {
        console.error(`❌ Error fetching MCP data for goal ${goal.title}:`, error.message);
        goalData.mode = 'demo';
      }
    }

    // Add demo data if MCP fails or not configured
    if (goalData.mode === 'demo') {
      goalData = this.generateDemoGoalData(goal);
    }

    return goalData;
  }

  // Scrape tech product data
  async scrapeTechProductData(productName) {
    const productUrl = `https://www.amazon.com/s?k=${encodeURIComponent(productName)}`;
    const selectors = {
      price: '.a-price-whole, .a-offscreen',
      rating: '.a-icon-alt',
      reviews_count: '.a-size-base',
      availability: '.a-color-success'
    };

    if (this.isConfigured) {
      try {
        const result = await this.scrapeWebContent(productUrl, selectors);
        if (result.success && result.data) {
          return {
            success: true,
            products: [{
              name: productName,
              price: parseInt(result.data.price?.replace(/\D/g, '') || '0'),
              rating: parseFloat(result.data.rating?.replace(/[^\d.]/g, '') || '0'),
              reviews_count: parseInt(result.data.reviews_count?.replace(/\D/g, '') || '0'),
              availability: result.data.availability || 'In Stock'
            }],
            mode: result.mode
          };
        }
      } catch (error) {
        console.error(`Error scraping tech product data:`, error.message);
      }
    }

    return {
      success: true,
      products: [{
        name: productName,
        price: 1200,
        rating: 4.5,
        reviews_count: 1250,
        availability: 'In Stock'
      }],
      mode: 'demo'
    };
  }

  // Scrape event data
  async scrapeEventData(eventName, targetDate) {
    const eventUrl = `https://www.google.com/search?q=${encodeURIComponent(eventName)} venue cost`;
    const selectors = {
      venue_price: '.price, .cost',
      venue_name: '.venue-name, .location',
      capacity: '.capacity, .guests'
    };

    if (this.isConfigured) {
      try {
        const result = await this.scrapeWebContent(eventUrl, selectors);
        if (result.success && result.data) {
          return {
            success: true,
            venues: [{
              name: result.data.venue_name || 'Sample Venue',
              price: parseInt(result.data.venue_price?.replace(/\D/g, '') || '0'),
              capacity: parseInt(result.data.capacity?.replace(/\D/g, '') || '0'),
              date: targetDate
            }],
            mode: result.mode
          };
        }
      } catch (error) {
        console.error(`Error scraping event data:`, error.message);
      }
    }

    return {
      success: true,
      venues: [{
        name: 'Sample Wedding Venue',
        price: 5000,
        capacity: 150,
        date: targetDate
      }],
      mode: 'demo'
    };
  }

  // Scrape reviews
  async scrapeReviews(itemName) {
    const reviewUrl = `https://www.google.com/search?q=${encodeURIComponent(itemName)} reviews`;
    const selectors = {
      review_text: '.review-text, .comment',
      review_rating: '.rating, .stars',
      review_author: '.author, .reviewer'
    };

    if (this.isConfigured) {
      try {
        const result = await this.scrapeWebContent(reviewUrl, selectors);
        if (result.success && result.data) {
          return {
            success: true,
            reviews: [{
              text: result.data.review_text || 'Great product!',
              rating: parseFloat(result.data.review_rating?.replace(/[^\d.]/g, '') || '0'),
              author: result.data.review_author || 'Anonymous'
            }],
            mode: result.mode
          };
        }
      } catch (error) {
        console.error(`Error scraping reviews:`, error.message);
      }
    }

    return {
      success: true,
      reviews: [
        { text: 'Excellent value for money!', rating: 5, author: 'John D.' },
        { text: 'Highly recommended!', rating: 4, author: 'Sarah M.' },
        { text: 'Great experience overall', rating: 5, author: 'Mike R.' }
      ],
      mode: 'demo'
    };
  }

  // Generate demo goal data
  generateDemoGoalData(goal) {
    const baseData = {
      goal_id: goal.goal_id,
      title: goal.title,
      category: goal.category,
      target_date: goal.target_date,
      est_cost_usd: goal.est_cost_usd,
      scraped_at: new Date().toISOString(),
      mode: 'demo'
    };

    if (goal.category === 'travel' || goal.title.toLowerCase().includes('trip')) {
      baseData.travel_data = {
        success: true,
        prices: [
          { airline: 'American Airlines', price: 850, departure_time: '08:00', arrival_time: '14:30', duration: '6h 30m', stops: 0, class: 'Economy' },
          { airline: 'Delta', price: 920, departure_time: '12:15', arrival_time: '18:45', duration: '6h 30m', stops: 0, class: 'Economy' },
          { airline: 'United', price: 780, departure_time: '16:30', arrival_time: '23:00', duration: '6h 30m', stops: 1, class: 'Economy' }
        ],
        destination: goal.title,
        departure_date: goal.target_date,
        mode: 'demo'
      };
    } else if (goal.category === 'technology' || goal.title.toLowerCase().includes('laptop')) {
      baseData.tech_data = {
        success: true,
        products: [{
          name: goal.title,
          price: goal.est_cost_usd,
          rating: 4.5,
          reviews_count: 1250,
          availability: 'In Stock'
        }],
        mode: 'demo'
      };
    } else if (goal.category === 'events' || goal.title.toLowerCase().includes('wedding')) {
      baseData.event_data = {
        success: true,
        venues: [{
          name: 'Sample Wedding Venue',
          price: goal.est_cost_usd,
          capacity: 150,
          date: goal.target_date
        }],
        mode: 'demo'
      };
    }

    baseData.reviews = {
      success: true,
      reviews: [
        { text: 'Excellent value for money!', rating: 5, author: 'John D.' },
        { text: 'Highly recommended!', rating: 4, author: 'Sarah M.' },
        { text: 'Great experience overall', rating: 5, author: 'Mike R.' }
      ],
      mode: 'demo'
    };

    return baseData;
  }
}

// Create singleton instance
const mcpClient = new MCPClient();

module.exports = mcpClient;
