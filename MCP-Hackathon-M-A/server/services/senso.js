const axios = require('axios');

class SensoService {
  constructor() {
    this.apiKey = process.env.SENSO_API_KEY;
    this.baseUrl = process.env.SENSO_BASE_URL || 'https://api.senso.ai';
    this.isConfigured = !!this.apiKey;
  }

  // Initialize Senso.ai connection
  async initialize() {
    if (!this.isConfigured) {
      console.log('⚠️  Senso.ai not configured - using demo mode');
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

      console.log('✅ Senso.ai connected successfully');
      return true;
    } catch (error) {
      console.log('⚠️  Senso.ai connection failed - using demo mode:', error.message);
      return false;
    }
  }

  // Ingest user data (transactions, goals, profile)
  async ingestUserData(userId, data) {
    if (!this.isConfigured) {
      // Demo mode - return mock context ID
      return {
        success: true,
        context_id: `demo_ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: 'Data ingested successfully (demo mode)'
      };
    }

    try {
      const payload = {
        user_id: userId,
        data: {
          transactions: data.transactions || [],
          goals: data.goals || [],
          profile: data.profile || {},
          timestamp: new Date().toISOString()
        }
      };

      const response = await axios.post(`${this.baseUrl}/v1/ingest`, payload, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        context_id: response.data.context_id,
        message: 'Data ingested successfully'
      };
    } catch (error) {
      console.error('Senso.ai ingest error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Normalize transaction data
  async normalizeTransactions(transactions) {
    if (!this.isConfigured) {
      // Demo mode - return normalized data
      return transactions.map(tx => ({
        tx_id: tx.tx_id || `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: tx.user_id,
        date: tx.date,
        amount: parseFloat(tx.amount) || 0,
        merchant: tx.merchant || 'Unknown',
        category: tx.category || 'other',
        card_id: tx.card_id || 'default_card',
        normalized_at: new Date().toISOString()
      }));
    }

    try {
      const response = await axios.post(`${this.baseUrl}/v1/normalize/transactions`, {
        transactions: transactions
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.normalized_transactions;
    } catch (error) {
      console.error('Senso.ai normalization error:', error.message);
      return transactions; // Return original data if normalization fails
    }
  }

  // Get context for AI agent
  async getContext(contextId, queryType = 'general') {
    if (!this.isConfigured) {
      // Demo mode - return mock context
      return {
        success: true,
        context: {
          transactions: [
            {
              tx_id: 't_987',
              user_id: 'demo_user_123',
              date: '2024-08-21',
              amount: 57.42,
              merchant: 'Whole Foods',
              category: 'groceries',
              card_id: 'card_visa_1'
            }
          ],
          card_offers: [
            {
              card_id: 'chase_sapphire_24',
              issuer: 'Chase',
              name: 'Chase Sapphire Preferred',
              signup_bonus_points: 80000,
              bonus_min_spend: 4000,
              bonus_period_days: 90,
              category_multipliers: { travel: 2, dining: 2, groceries: 1 },
              annual_fee: 95,
              point_value_usd: 0.0125
            }
          ],
          goals: [
            {
              goal_id: 'g_11',
              user_id: 'demo_user_123',
              title: 'Trip to Paris',
              target_date: '2025-05-10',
              est_cost_usd: 1200
            }
          ]
        }
      };
    }

    try {
      const response = await axios.get(`${this.baseUrl}/v1/context/${contextId}`, {
        params: {
          query_type: queryType
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        context: response.data.context
      };
    } catch (error) {
      console.error('Senso.ai context retrieval error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Trigger webhook for data processing
  async triggerWebhook(contextId, eventType = 'data_updated') {
    if (!this.isConfigured) {
      console.log(`Demo webhook triggered: ${eventType} for context ${contextId}`);
      return { success: true, message: 'Webhook triggered (demo mode)' };
    }

    try {
      const response = await axios.post(`${this.baseUrl}/v1/webhooks/trigger`, {
        context_id: contextId,
        event_type: eventType,
        timestamp: new Date().toISOString()
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        message: 'Webhook triggered successfully'
      };
    } catch (error) {
      console.error('Senso.ai webhook error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Health check
  async healthCheck() {
    if (!this.isConfigured) {
      return { status: 'demo_mode', message: 'Senso.ai not configured' };
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
const sensoService = new SensoService();

module.exports = sensoService;
