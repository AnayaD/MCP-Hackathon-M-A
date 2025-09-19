const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupServices() {
  console.log('🚀 Chronos Service Setup');
  console.log('========================\n');
  
  console.log('This script will help you configure all external services for Chronos.');
  console.log('You mentioned you have free access to Redis Cloud and Bright Data.\n');

  const envPath = path.join(__dirname, 'server', '.env');
  let envContent = '';

  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    console.log('📄 Found existing .env file');
  } else {
    console.log('📄 Creating new .env file');
  }

  console.log('\n🔧 Service Configuration:\n');

  // Redis Cloud Setup
  console.log('1. REDIS CLOUD SETUP');
  console.log('====================');
  console.log('You mentioned you have a free Redis Cloud account.');
  console.log('Please provide your Redis Cloud connection details:\n');
  
  const redisUrl = await question('Redis URL (e.g., redis://username:password@host:port): ');
  const redisPassword = await question('Redis Password (if any, press Enter for none): ');
  
  console.log('\n✅ Redis configuration saved\n');

  // Bright Data Setup
  console.log('2. BRIGHT DATA SETUP');
  console.log('====================');
  console.log('You have access to Bright Data through: https://seemlify.com/brightdata');
  console.log('This provides 5,000 free requests for web scraping.\n');
  
  const brightDataApiKey = await question('Bright Data API Key: ');
  
  console.log('\n✅ Bright Data configuration saved\n');

  // Senso.ai Setup
  console.log('3. SENSO.AI SETUP');
  console.log('=================');
  console.log('Senso.ai provides the Context OS for data normalization.');
  console.log('If you don\'t have an account, we can skip this for now.\n');
  
  const sensoApiKey = await question('Senso.ai API Key (or press Enter to skip): ');
  
  console.log('\n✅ Senso.ai configuration saved\n');

  // LlamaIndex Setup
  console.log('4. LLAMAINDEX SETUP');
  console.log('===================');
  console.log('LlamaIndex provides document indexing and retrieval.');
  console.log('If you don\'t have an account, we can skip this for now.\n');
  
  const llamaIndexApiKey = await question('LlamaIndex API Key (or press Enter to skip): ');
  
  console.log('\n✅ LlamaIndex configuration saved\n');

  // Stytch Setup
  console.log('5. STYTCH SETUP');
  console.log('===============');
  console.log('Stytch provides passwordless authentication.');
  console.log('If you don\'t have an account, we can skip this for now.\n');
  
  const stytchProjectId = await question('Stytch Project ID (or press Enter to skip): ');
  const stytchSecret = await question('Stytch Secret (or press Enter to skip): ');
  
  console.log('\n✅ Stytch configuration saved\n');

  // Generate .env content
  const newEnvContent = `# Server Configuration
PORT=3001
NODE_ENV=development

# Senso.ai Configuration
SENSO_API_KEY=${sensoApiKey || 'your_senso_api_key_here'}
SENSO_BASE_URL=https://api.senso.ai

# Bright Data Configuration
BRIGHT_DATA_API_KEY=${brightDataApiKey || 'your_bright_data_api_key_here'}
BRIGHT_DATA_BASE_URL=https://api.brightdata.com

# Redis Configuration
REDIS_URL=${redisUrl || 'redis://localhost:6379'}
REDIS_PASSWORD=${redisPassword || ''}

# Stytch Configuration
STYTCH_PROJECT_ID=${stytchProjectId || 'your_stytch_project_id_here'}
STYTCH_SECRET=${stytchSecret || 'your_stytch_secret_here'}

# LlamaIndex Configuration
LLAMA_INDEX_API_KEY=${llamaIndexApiKey || 'your_llama_index_api_key_here'}
LLAMA_INDEX_BASE_URL=https://api.llamaindex.ai

# Demo Configuration
DEMO_MODE=false
`;

  // Write .env file
  fs.writeFileSync(envPath, newEnvContent);
  console.log('📄 .env file created successfully!');

  // Summary
  console.log('\n📊 Configuration Summary:');
  console.log('========================');
  console.log(`✅ Redis: ${redisUrl ? 'Configured' : 'Using localhost'}`);
  console.log(`✅ Bright Data: ${brightDataApiKey ? 'Configured' : 'Demo mode'}`);
  console.log(`✅ Senso.ai: ${sensoApiKey ? 'Configured' : 'Demo mode'}`);
  console.log(`✅ LlamaIndex: ${llamaIndexApiKey ? 'Configured' : 'Demo mode'}`);
  console.log(`✅ Stytch: ${stytchProjectId ? 'Configured' : 'Demo mode'}`);

  console.log('\n🚀 Next Steps:');
  console.log('==============');
  console.log('1. Start the servers: npm run dev');
  console.log('2. Test the services: curl http://localhost:3001/api/services/status');
  console.log('3. Visit the frontend: http://localhost:3000');
  console.log('4. Upload sample data and test the AI features');

  console.log('\n💡 Service Setup Guides:');
  console.log('=========================');
  console.log('• Redis Cloud: https://redis.io/try-free/');
  console.log('• Bright Data: https://seemlify.com/brightdata');
  console.log('• Senso.ai: https://senso.ai');
  console.log('• LlamaIndex: https://llamaindex.ai');
  console.log('• Stytch: https://stytch.com');

  rl.close();
}

setupServices().catch(console.error);
