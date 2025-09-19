const redis = require('redis');

class RedisService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      // For demo purposes, we'll use a local Redis instance
      // In production, replace with Redis Cloud URL
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      
      this.client = redis.createClient({
        url: redisUrl,
        password: process.env.REDIS_PASSWORD || undefined,
        socket: {
          connectTimeout: 5000, // 5 second timeout
          reconnectStrategy: (retries) => {
            if (retries > 3) {
              console.log('⚠️  Redis connection failed - running in demo mode');
              return false; // Stop retrying
            }
            return Math.min(retries * 100, 1000);
          }
        }
      });

      this.client.on('error', (err) => {
        console.log('⚠️  Redis Client Error:', err.message);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('✅ Redis connected successfully');
        this.isConnected = true;
      });

      await this.client.connect();
      return true;
    } catch (error) {
      console.log('⚠️  Redis connection failed:', error.message);
      console.log('💡 Running in demo mode without Redis');
      this.isConnected = false;
      this.client = null;
      return false;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
    }
  }

  // Vector operations for embeddings
  async storeVector(key, vector, metadata = {}) {
    if (!this.isConnected) {
      throw new Error('Redis not connected');
    }

    try {
      const data = {
        vector: JSON.stringify(vector),
        metadata: JSON.stringify(metadata),
        timestamp: new Date().toISOString()
      };

      await this.client.hSet(key, data);
      await this.client.expire(key, 86400); // 24 hours TTL
      return true;
    } catch (error) {
      console.error('Error storing vector:', error);
      return false;
    }
  }

  async getVector(key) {
    if (!this.isConnected) {
      throw new Error('Redis not connected');
    }

    try {
      const data = await this.client.hGetAll(key);
      if (Object.keys(data).length === 0) {
        return null;
      }

      return {
        vector: JSON.parse(data.vector),
        metadata: JSON.parse(data.metadata),
        timestamp: data.timestamp
      };
    } catch (error) {
      console.error('Error retrieving vector:', error);
      return null;
    }
  }

  // Transaction storage
  async storeTransactions(userId, transactions) {
    if (!this.isConnected) {
      throw new Error('Redis not connected');
    }

    try {
      const key = `user:${userId}:transactions`;
      const data = JSON.stringify(transactions);
      
      await this.client.set(key, data);
      await this.client.expire(key, 86400 * 7); // 7 days TTL
      return true;
    } catch (error) {
      console.error('Error storing transactions:', error);
      return false;
    }
  }

  async getTransactions(userId) {
    if (!this.isConnected) {
      throw new Error('Redis not connected');
    }

    try {
      const key = `user:${userId}:transactions`;
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error retrieving transactions:', error);
      return null;
    }
  }

  // Card offers storage
  async storeCardOffers(offers) {
    if (!this.isConnected) {
      throw new Error('Redis not connected');
    }

    try {
      const key = 'card_offers:latest';
      const data = JSON.stringify(offers);
      
      await this.client.set(key, data);
      await this.client.expire(key, 86400); // 24 hours TTL
      return true;
    } catch (error) {
      console.error('Error storing card offers:', error);
      return false;
    }
  }

  async getCardOffers() {
    if (!this.isConnected) {
      throw new Error('Redis not connected');
    }

    try {
      const key = 'card_offers:latest';
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error retrieving card offers:', error);
      return null;
    }
  }

  // Cache operations
  async set(key, value, ttl = 3600) {
    if (!this.isConnected) {
      throw new Error('Redis not connected');
    }

    try {
      const data = JSON.stringify(value);
      await this.client.set(key, data);
      if (ttl > 0) {
        await this.client.expire(key, ttl);
      }
      return true;
    } catch (error) {
      console.error('Error setting cache:', error);
      return false;
    }
  }

  async get(key) {
    if (!this.isConnected) {
      throw new Error('Redis not connected');
    }

    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  }

  async delete(key) {
    if (!this.isConnected) {
      throw new Error('Redis not connected');
    }

    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Error deleting key:', error);
      return false;
    }
  }

  // Store user data
  async storeUserData(userId, data) {
    if (!this.isConnected || !this.client) {
      console.log('⚠️  Redis not connected. Cannot store user data.');
      return false;
    }

    try {
      await this.client.set(`user:${userId}`, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Redis store user data error:', error);
      return false;
    }
  }

  // Get user data
  async getUserData(userId) {
    if (!this.isConnected || !this.client) {
      console.log('⚠️  Redis not connected. Cannot get user data.');
      return null;
    }

    try {
      const data = await this.client.get(`user:${userId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis get user data error:', error);
      return null;
    }
  }

  // Store card offers
  async storeCardOffers(offers) {
    if (!this.isConnected || !this.client) {
      console.log('⚠️  Redis not connected. Cannot store card offers.');
      return false;
    }

    try {
      await this.client.set('card_offers', JSON.stringify(offers));
      return true;
    } catch (error) {
      console.error('Redis store card offers error:', error);
      return false;
    }
  }

  // Get card offers
  async getCardOffers() {
    if (!this.isConnected || !this.client) {
      console.log('⚠️  Redis not connected. Cannot get card offers.');
      return [];
    }

    try {
      const offers = await this.client.get('card_offers');
      return offers ? JSON.parse(offers) : [];
    } catch (error) {
      console.error('Redis get card offers error:', error);
      return [];
    }
  }

  // Store conversation
  async storeConversation(conversation) {
    if (!this.isConnected || !this.client) {
      console.log('⚠️  Redis not connected. Cannot store conversation.');
      return false;
    }

    try {
      const conversationId = `conv:${conversation.user_id}:${Date.now()}`;
      await this.client.set(conversationId, JSON.stringify(conversation));
      
      // Add to user's conversation list
      await this.client.lPush(`conversations:${conversation.user_id}`, conversationId);
      return true;
    } catch (error) {
      console.error('Redis store conversation error:', error);
      return false;
    }
  }

  // Store user profile data
  async storeUserProfile(userId, profileData) {
    if (!this.isConnected || !this.client) {
      console.log('⚠️  Redis not connected. Cannot store user profile.');
      return false;
    }

    try {
      const profileKey = `profile:${userId}`;
      await this.client.set(profileKey, JSON.stringify(profileData));
      console.log(`✅ Stored user profile for ${userId}`);
      return true;
    } catch (error) {
      console.error('Redis store user profile error:', error);
      return false;
    }
  }

  // Get user profile data
  async getUserProfile(userId) {
    if (!this.isConnected || !this.client) {
      console.log('⚠️  Redis not connected. Cannot get user profile.');
      return null;
    }

    try {
      const profileKey = `profile:${userId}`;
      const profileData = await this.client.get(profileKey);
      return profileData ? JSON.parse(profileData) : null;
    } catch (error) {
      console.error('Redis get user profile error:', error);
      return null;
    }
  }

  // Store user goals with MCP-fetched data
  async storeUserGoals(userId, goals) {
    if (!this.isConnected || !this.client) {
      console.log('⚠️  Redis not connected. Cannot store user goals.');
      return false;
    }

    try {
      const goalsKey = `goals:${userId}`;
      await this.client.set(goalsKey, JSON.stringify(goals));
      console.log(`✅ Stored ${goals.length} goals for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Redis store user goals error:', error);
      return false;
    }
  }

  // Get user goals
  async getUserGoals(userId) {
    if (!this.isConnected || !this.client) {
      console.log('⚠️  Redis not connected. Cannot get user goals.');
      return [];
    }

    try {
      const goalsKey = `goals:${userId}`;
      const goalsData = await this.client.get(goalsKey);
      return goalsData ? JSON.parse(goalsData) : [];
    } catch (error) {
      console.error('Redis get user goals error:', error);
      return [];
    }
  }

  // Store transactions with reward analysis
  async storeTransactions(userId, transactions) {
    if (!this.isConnected || !this.client) {
      console.log('⚠️  Redis not connected. Cannot store transactions.');
      return false;
    }

    try {
      const transactionsKey = `transactions:${userId}`;
      await this.client.set(transactionsKey, JSON.stringify(transactions));
      console.log(`✅ Stored ${transactions.length} transactions for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Redis store transactions error:', error);
      return false;
    }
  }

  // Get user transactions
  async getUserTransactions(userId) {
    if (!this.isConnected || !this.client) {
      console.log('⚠️  Redis not connected. Cannot get transactions.');
      return [];
    }

    try {
      const transactionsKey = `transactions:${userId}`;
      const transactionsData = await this.client.get(transactionsKey);
      return transactionsData ? JSON.parse(transactionsData) : [];
    } catch (error) {
      console.error('Redis get transactions error:', error);
      return [];
    }
  }

  // Store MCP-fetched goal data (pricing, reviews, metadata)
  async storeGoalData(goalId, goalData) {
    if (!this.isConnected || !this.client) {
      console.log('⚠️  Redis not connected. Cannot store goal data.');
      return false;
    }

    try {
      const goalDataKey = `goal_data:${goalId}`;
      await this.client.set(goalDataKey, JSON.stringify(goalData));
      console.log(`✅ Stored MCP data for goal ${goalId}`);
      return true;
    } catch (error) {
      console.error('Redis store goal data error:', error);
      return false;
    }
  }

  // Get MCP-fetched goal data
  async getGoalData(goalId) {
    if (!this.isConnected || !this.client) {
      console.log('⚠️  Redis not connected. Cannot get goal data.');
      return null;
    }

    try {
      const goalDataKey = `goal_data:${goalId}`;
      const goalData = await this.client.get(goalDataKey);
      return goalData ? JSON.parse(goalData) : null;
    } catch (error) {
      console.error('Redis get goal data error:', error);
      return null;
    }
  }

  // Store MCP-fetched card offers
  async storeCardOffers(offers) {
    if (!this.isConnected || !this.client) {
      console.log('⚠️  Redis not connected. Cannot store card offers.');
      return false;
    }

    try {
      const offersKey = 'card_offers:latest';
      await this.client.set(offersKey, JSON.stringify(offers));
      console.log(`✅ Stored ${offers.length} card offers from MCP`);
      return true;
    } catch (error) {
      console.error('Redis store card offers error:', error);
      return false;
    }
  }

  // Get MCP-fetched card offers
  async getCardOffers() {
    if (!this.isConnected || !this.client) {
      console.log('⚠️  Redis not connected. Cannot get card offers.');
      return [];
    }

    try {
      const offersKey = 'card_offers:latest';
      const offersData = await this.client.get(offersKey);
      return offersData ? JSON.parse(offersData) : [];
    } catch (error) {
      console.error('Redis get card offers error:', error);
      return [];
    }
  }

  // Get conversation history
  async getConversationHistory(userId, limit = 20) {
    if (!this.isConnected || !this.client) {
      console.log('⚠️  Redis not connected. Cannot get conversation history.');
      return [];
    }

    try {
      const conversationIds = await this.client.lRange(`conversations:${userId}`, 0, limit - 1);
      const conversations = [];

      for (const id of conversationIds) {
        const conversation = await this.client.get(id);
        if (conversation) {
          conversations.push(JSON.parse(conversation));
        }
      }

      return conversations.reverse(); // Most recent first
    } catch (error) {
      console.error('Redis get conversation history error:', error);
      return [];
    }
  }

  // Health check
  async healthCheck() {
    if (!this.isConnected) {
      return { status: 'disconnected', error: 'Redis not connected' };
    }

    try {
      const pong = await this.client.ping();
      return { status: 'connected', response: pong };
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }
}

// Create singleton instance
const redisService = new RedisService();

module.exports = redisService;
