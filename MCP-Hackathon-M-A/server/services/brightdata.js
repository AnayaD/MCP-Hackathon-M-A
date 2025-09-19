const axios = require('axios');

class BrightDataService {
  constructor() {
    this.apiKey = process.env.BRIGHT_DATA_API_KEY;
    this.baseUrl = process.env.BRIGHT_DATA_BASE_URL || 'https://api.brightdata.com';
    this.isConfigured = !!this.apiKey;
  }

  // Initialize Bright Data connection
  async initialize() {
    if (!this.isConfigured) {
      console.log('⚠️  Bright Data not configured - using demo mode');
      return false;
    }

    try {
      // Test connection with correct endpoint
      const response = await axios.get(`${this.baseUrl}/status`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Bright Data connected successfully');
      return true;
    } catch (error) {
      console.log('⚠️  Bright Data connection failed - using demo mode:', error.message);
      return false;
    }
  }

  // Scrape credit card offers
  async scrapeCardOffers() {
    if (!this.isConfigured) {
      // Demo mode - return mock card offers
      return {
        success: true,
        offers: [
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
          },
          {
            card_id: 'capital_one_venture_24',
            issuer: 'Capital One',
            name: 'Capital One Venture Rewards',
            signup_bonus_points: 75000,
            bonus_min_spend: 4000,
            bonus_period_days: 90,
            category_multipliers: {
              travel: 2,
              dining: 2,
              groceries: 2,
              gas: 2,
              other: 2
            },
            annual_fee: 95,
            point_value_usd: 0.01,
            link: 'https://www.capitalone.com/credit-cards/venture/',
            last_updated: new Date().toISOString()
          }
        ],
        scraped_at: new Date().toISOString()
      };
    }

    try {
      const response = await axios.post(`${this.baseUrl}/v1/scrape/card-offers`, {
        sources: [
          'chase.com',
          'americanexpress.com',
          'capitalone.com',
          'citi.com',
          'wellsfargo.com'
        ],
        selectors: {
          card_name: '.card-title, .product-name',
          signup_bonus: '.bonus-points, .signup-bonus',
          annual_fee: '.annual-fee, .fee-amount',
          category_multipliers: '.category-multiplier, .earn-rate'
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        offers: response.data.offers,
        scraped_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Bright Data scraping error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Scrape travel prices
  async scrapeTravelPrices(destination, departureDate, returnDate) {
    if (!this.isConfigured) {
      // Demo mode - return mock travel prices
      const basePrice = 800 + Math.random() * 400; // $800-$1200
      return {
        success: true,
        prices: [
          {
            airline: 'American Airlines',
            price: Math.round(basePrice),
            departure_time: '08:00',
            arrival_time: '14:30',
            duration: '6h 30m',
            stops: 0,
            class: 'Economy'
          },
          {
            airline: 'Delta',
            price: Math.round(basePrice + 50),
            departure_time: '12:15',
            arrival_time: '18:45',
            duration: '6h 30m',
            stops: 0,
            class: 'Economy'
          },
          {
            airline: 'United',
            price: Math.round(basePrice - 25),
            departure_time: '16:30',
            arrival_time: '23:00',
            duration: '6h 30m',
            stops: 1,
            class: 'Economy'
          }
        ],
        destination: destination,
        departure_date: departureDate,
        return_date: returnDate,
        scraped_at: new Date().toISOString()
      };
    }

    try {
      const response = await axios.post(`${this.baseUrl}/v1/scrape/travel-prices`, {
        destination: destination,
        departure_date: departureDate,
        return_date: returnDate,
        sources: [
          'expedia.com',
          'kayak.com',
          'google.com/flights',
          'skyscanner.com'
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        prices: response.data.prices,
        destination: destination,
        departure_date: departureDate,
        return_date: returnDate,
        scraped_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Bright Data travel scraping error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Scrape merchant category information
  async scrapeMerchantCategories(merchants) {
    if (!this.isConfigured) {
      // Demo mode - return mock categories
      const categoryMap = {
        'Whole Foods': 'groceries',
        'Safeway': 'groceries',
        'Costco': 'groceries',
        'Starbucks': 'dining',
        'Chipotle': 'dining',
        'McDonald\'s': 'dining',
        'Shell': 'gas',
        'Chevron': 'gas',
        'BP': 'gas',
        'Amazon': 'shopping',
        'Target': 'shopping',
        'Walmart': 'shopping',
        'Uber': 'transportation',
        'Lyft': 'transportation',
        'Netflix': 'entertainment',
        'Spotify': 'entertainment'
      };

      return {
        success: true,
        categories: merchants.map(merchant => ({
          merchant: merchant,
          category: categoryMap[merchant] || 'other',
          confidence: 0.95
        }))
      };
    }

    try {
      const response = await axios.post(`${this.baseUrl}/v1/scrape/merchant-categories`, {
        merchants: merchants,
        sources: [
          'merchant-category-codes.com',
          'visa.com/merchant-categories',
          'mastercard.com/merchant-categories'
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        categories: response.data.categories
      };
    } catch (error) {
      console.error('Bright Data merchant scraping error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Health check
  async healthCheck() {
    if (!this.isConfigured) {
      return { status: 'demo_mode', message: 'Bright Data not configured' };
    }

    try {
      const response = await axios.get(`${this.baseUrl}/health`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
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
}

// Create singleton instance
const brightDataService = new BrightDataService();

module.exports = brightDataService;
