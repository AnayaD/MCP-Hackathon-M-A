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

async function setupOpenAI() {
  console.log('🤖 OpenAI API Key Setup');
  console.log('========================\n');
  
  console.log('Chronos requires an OpenAI API key for the LLM functionality.');
  console.log('This is essential for the AI-powered credit card recommendations.\n');

  console.log('📋 How to get your OpenAI API key:');
  console.log('1. Go to https://platform.openai.com/api-keys');
  console.log('2. Sign in to your OpenAI account');
  console.log('3. Click "Create new secret key"');
  console.log('4. Copy the key (it starts with "sk-")');
  console.log('5. Keep it secure - you won\'t be able to see it again\n');

  const openaiApiKey = await question('Enter your OpenAI API key: ');

  if (!openaiApiKey || !openaiApiKey.startsWith('sk-')) {
    console.log('❌ Invalid API key format. OpenAI keys start with "sk-"');
    rl.close();
    return;
  }

  // Read current .env file
  const envPath = path.join(__dirname, 'server', '.env');
  let envContent = '';

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Update or add OpenAI API key
  if (envContent.includes('OPENAI_API_KEY=')) {
    envContent = envContent.replace(
      /OPENAI_API_KEY=.*/,
      `OPENAI_API_KEY=${openaiApiKey}`
    );
  } else {
    // Add OpenAI API key after the server configuration
    const lines = envContent.split('\n');
    const serverConfigEnd = lines.findIndex(line => line.includes('NODE_ENV='));
    if (serverConfigEnd !== -1) {
      lines.splice(serverConfigEnd + 1, 0, '', '# OpenAI Configuration (Required for LLM)', `OPENAI_API_KEY=${openaiApiKey}`);
      envContent = lines.join('\n');
    } else {
      envContent = `# OpenAI Configuration (Required for LLM)\nOPENAI_API_KEY=${openaiApiKey}\n\n${envContent}`;
    }
  }

  // Write updated .env file
  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ OpenAI API key configured successfully!');
  console.log('\n🚀 Next Steps:');
  console.log('1. Restart the server: npm run server:dev');
  console.log('2. Test the LLM: curl http://localhost:3001/api/services/status');
  console.log('3. Start the frontend: npm run client:dev');
  console.log('4. Test the chat functionality in the UI');

  console.log('\n💡 What you can now do:');
  console.log('• Ask AI questions about credit card optimization');
  console.log('• Get personalized recommendations');
  console.log('• Calculate missed rewards');
  console.log('• Generate optimization timelines');

  rl.close();
}

setupOpenAI().catch(console.error);
