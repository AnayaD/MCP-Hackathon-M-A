const axios = require('axios');

async function testServices() {
  try {
    console.log('🧪 Testing Chronos Services...\n');
    
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:3001/api/health');
    console.log('✅ Health check:', healthResponse.data);
    
    // Test services status
    console.log('\n2. Testing services status...');
    const servicesResponse = await axios.get('http://localhost:3001/api/services/status');
    console.log('✅ Services status:', JSON.stringify(servicesResponse.data, null, 2));
    
    // Test service initialization
    console.log('\n3. Testing service initialization...');
    const initResponse = await axios.post('http://localhost:3001/api/services/initialize');
    console.log('✅ Service initialization:', JSON.stringify(initResponse.data, null, 2));
    
    // Test card offers scraping
    console.log('\n4. Testing card offers scraping...');
    const offersResponse = await axios.post('http://localhost:3001/api/services/scrape/offers');
    console.log('✅ Card offers:', JSON.stringify(offersResponse.data, null, 2));
    
    // Test travel prices scraping
    console.log('\n5. Testing travel prices scraping...');
    const travelResponse = await axios.post('http://localhost:3001/api/services/scrape/travel', {
      destination: 'Paris',
      departure_date: '2025-05-10',
      return_date: '2025-05-17'
    });
    console.log('✅ Travel prices:', JSON.stringify(travelResponse.data, null, 2));
    
    console.log('\n🎉 All service tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Service test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testServices();
