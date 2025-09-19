# 🚀 Quick Setup Guide for Chronos

Since you have free access to Redis Cloud and Bright Data, let's get everything set up quickly!

## 📋 **Step-by-Step Setup**

### **1. Run the Setup Script**
```bash
cd MCP-Hackathon-M-A
node setup-services.js
```

This interactive script will ask for your credentials and create the `.env` file.

### **2. Redis Cloud Setup**
Since you have a free Redis Cloud account:

1. **Get your connection details:**
   - Go to your Redis Cloud dashboard
   - Find your database
   - Copy the connection URL (looks like: `redis://username:password@host:port`)

2. **When prompted by the setup script, enter:**
   - Redis URL: `redis://username:password@host:port`
   - Redis Password: (usually included in the URL)

### **3. Bright Data Setup**
Since you have access through [seemlify.com/brightdata](https://seemlify.com/brightdata):

1. **Get your API key:**
   - Visit the Bright Data MCP page
   - Get your API key (5,000 free requests)

2. **When prompted by the setup script, enter:**
   - Bright Data API Key: `your_api_key_here`

### **4. Optional Services**
For Senso.ai, LlamaIndex, and Stytch, you can:
- **Skip for now** (press Enter) - the app will run in demo mode
- **Set up later** if you get accounts

## 🧪 **Testing Your Setup**

After running the setup script:

### **1. Start the Servers**
```bash
npm run dev
```

### **2. Test Service Status**
```bash
curl http://localhost:3001/api/services/status
```

You should see something like:
```json
{
  "success": true,
  "services": {
    "redis": { "status": "connected" },
    "brightdata": { "status": "connected" },
    "senso": { "status": "demo_mode" },
    "llamaindex": { "status": "demo_mode" },
    "stytch": { "status": "demo_mode" }
  }
}
```

### **3. Test Real Scraping**
```bash
# Test card offers scraping
curl -X POST http://localhost:3001/api/services/scrape/offers

# Test travel prices scraping
curl -X POST http://localhost:3001/api/services/scrape/travel \
  -H "Content-Type: application/json" \
  -d '{"destination": "Paris", "departure_date": "2025-05-10"}'
```

### **4. Test the Frontend**
- Go to http://localhost:3000
- Login with any email (demo mode)
- Complete onboarding
- Upload the sample CSV: `demo-data/sample-transactions.csv`
- Test the chat interface

## 🎯 **What You'll Get**

With Redis Cloud and Bright Data configured:

✅ **Real-time card offers** scraped from major issuers  
✅ **Live travel prices** for your goals  
✅ **Vector storage** for AI embeddings  
✅ **Fast caching** for better performance  
✅ **Persistent data** across sessions  

## 🔧 **Manual Setup (Alternative)**

If you prefer to set up manually, create `server/.env`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Redis Configuration (YOUR CREDENTIALS)
REDIS_URL=redis://username:password@host:port
REDIS_PASSWORD=your_password

# Bright Data Configuration (YOUR CREDENTIALS)
BRIGHT_DATA_API_KEY=your_bright_data_api_key_here
BRIGHT_DATA_BASE_URL=https://api.brightdata.com

# Other services (demo mode)
SENSO_API_KEY=your_senso_api_key_here
SENSO_BASE_URL=https://api.senso.ai
STYTCH_PROJECT_ID=your_stytch_project_id_here
STYTCH_SECRET=your_stytch_secret_here
LLAMA_INDEX_API_KEY=your_llama_index_api_key_here
LLAMA_INDEX_BASE_URL=https://api.llamaindex.ai

# Demo Configuration
DEMO_MODE=false
```

## 🚨 **Troubleshooting**

### **Port Conflicts**
If you see "address already in use" errors:
```bash
# Kill existing processes
taskkill /f /im node.exe  # Windows
# or
pkill -f node  # Linux/Mac
```

### **Redis Connection Issues**
- Verify your Redis Cloud URL is correct
- Check if your Redis instance is active
- Ensure firewall allows the connection

### **Bright Data Issues**
- Verify your API key is correct
- Check if you have remaining requests
- Ensure the API endpoint is accessible

## 🎉 **Ready to Demo!**

Once everything is set up, you'll have:

1. **Real card offers** from Chase, Amex, Capital One, etc.
2. **Live travel prices** for destinations
3. **Persistent data storage** in Redis
4. **AI-powered recommendations** with real data
5. **Complete user journey** from login to recommendations

The application will automatically detect which services are available and run in the appropriate mode (full integration or demo fallback).

## 📞 **Need Help?**

If you run into issues:
1. Check the service status endpoint
2. Look at the server logs
3. Verify your credentials
4. Test individual services

The app is designed to gracefully handle service failures and provide helpful error messages.
