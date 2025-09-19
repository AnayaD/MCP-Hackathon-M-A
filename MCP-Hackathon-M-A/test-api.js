const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing Chronos API...');
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:3001/api/health');
    console.log('✅ Health check:', healthResponse.data);
    
    // Test auth endpoint
    const authResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'test@chronos.com'
    });
    console.log('✅ Auth login:', authResponse.data);
    
    // Test MCP ingest endpoint
    const ingestResponse = await axios.post('http://localhost:3001/api/mcp/context/ingest', {
      action: 'ingest_transactions',
      user_id: 'test_user',
      data: {
        transactions: [
          {
            tx_id: 't_001',
            user_id: 'test_user',
            date: '2024-08-21',
            amount: 57.42,
            merchant: 'Whole Foods',
            category: 'groceries',
            card_id: 'card_visa_1'
          }
        ]
      }
    });
    console.log('✅ MCP Ingest:', ingestResponse.data);
    
    // Test MCP retrieve endpoint
    const retrieveResponse = await axios.get('http://localhost:3001/api/mcp/retrieve/agent', {
      params: {
        context_id: 'test_context',
        query_type: 'reward_analysis'
      }
    });
    console.log('✅ MCP Retrieve:', retrieveResponse.data);
    
    console.log('\n🎉 All API tests passed!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI();
