const axios = require('axios');

class LlamaIndexService {
  constructor() {
    this.apiKey = process.env.LLAMA_INDEX_API_KEY;
    this.baseUrl = process.env.LLAMA_INDEX_BASE_URL || 'https://api.llamaindex.ai';
    this.isConfigured = !!this.apiKey;
  }

  // Initialize LlamaIndex connection
  async initialize() {
    if (!this.isConfigured) {
      console.log('⚠️  LlamaIndex not configured - using demo mode');
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

      console.log('✅ LlamaIndex connected successfully');
      return true;
    } catch (error) {
      console.log('⚠️  LlamaIndex connection failed - using demo mode:', error.message);
      return false;
    }
  }

  // Create index from documents
  async createIndex(documents, indexName) {
    if (!this.isConfigured) {
      // Demo mode - return mock index
      return {
        success: true,
        index_id: `demo_index_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        document_count: documents.length,
        message: 'Index created successfully (demo mode)'
      };
    }

    try {
      const payload = {
        index_name: indexName,
        documents: documents.map(doc => ({
          id: doc.id,
          content: doc.content,
          metadata: doc.metadata || {},
          embedding: doc.embedding || null
        }))
      };

      const response = await axios.post(`${this.baseUrl}/v1/indexes`, payload, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        index_id: response.data.index_id,
        document_count: documents.length,
        message: 'Index created successfully'
      };
    } catch (error) {
      console.error('LlamaIndex create index error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Query index for relevant documents
  async queryIndex(indexId, query, topK = 5) {
    if (!this.isConfigured) {
      // Demo mode - return mock results
      return {
        success: true,
        results: [
          {
            id: 'doc_1',
            content: 'Chase Sapphire Preferred offers 2x points on travel and dining',
            score: 0.95,
            metadata: {
              card_name: 'Chase Sapphire Preferred',
              category: 'travel',
              multiplier: 2
            }
          },
          {
            id: 'doc_2',
            content: 'American Express Gold Card offers 4x points on dining and groceries',
            score: 0.89,
            metadata: {
              card_name: 'American Express Gold Card',
              category: 'dining',
              multiplier: 4
            }
          },
          {
            id: 'doc_3',
            content: 'Capital One Venture offers 2x points on all purchases',
            score: 0.82,
            metadata: {
              card_name: 'Capital One Venture',
              category: 'general',
              multiplier: 2
            }
          }
        ],
        query: query,
        top_k: topK
      };
    }

    try {
      const response = await axios.post(`${this.baseUrl}/v1/indexes/${indexId}/query`, {
        query: query,
        top_k: topK
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        results: response.data.results,
        query: query,
        top_k: topK
      };
    } catch (error) {
      console.error('LlamaIndex query error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Add documents to existing index
  async addDocuments(indexId, documents) {
    if (!this.isConfigured) {
      console.log(`Demo: Adding ${documents.length} documents to index ${indexId}`);
      return {
        success: true,
        added_count: documents.length,
        message: 'Documents added successfully (demo mode)'
      };
    }

    try {
      const payload = {
        documents: documents.map(doc => ({
          id: doc.id,
          content: doc.content,
          metadata: doc.metadata || {},
          embedding: doc.embedding || null
        }))
      };

      const response = await axios.post(`${this.baseUrl}/v1/indexes/${indexId}/documents`, payload, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        added_count: documents.length,
        message: 'Documents added successfully'
      };
    } catch (error) {
      console.error('LlamaIndex add documents error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete index
  async deleteIndex(indexId) {
    if (!this.isConfigured) {
      console.log(`Demo: Deleting index ${indexId}`);
      return {
        success: true,
        message: 'Index deleted successfully (demo mode)'
      };
    }

    try {
      const response = await axios.delete(`${this.baseUrl}/v1/indexes/${indexId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        message: 'Index deleted successfully'
      };
    } catch (error) {
      console.error('LlamaIndex delete index error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get index information
  async getIndexInfo(indexId) {
    if (!this.isConfigured) {
      return {
        success: true,
        index: {
          id: indexId,
          name: 'demo_index',
          document_count: 10,
          created_at: new Date().toISOString(),
          status: 'active'
        }
      };
    }

    try {
      const response = await axios.get(`${this.baseUrl}/v1/indexes/${indexId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        index: response.data.index
      };
    } catch (error) {
      console.error('LlamaIndex get index info error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Health check
  async healthCheck() {
    if (!this.isConfigured) {
      return { status: 'demo_mode', message: 'LlamaIndex not configured' };
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
const llamaIndexService = new LlamaIndexService();

module.exports = llamaIndexService;
