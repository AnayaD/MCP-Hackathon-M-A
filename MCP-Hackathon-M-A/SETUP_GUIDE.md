# Chronos External Services Setup Guide

This guide will help you set up all the external services required for Chronos to function at full capacity.

## 🚀 Quick Setup (Demo Mode)

If you want to test Chronos immediately without setting up external services, the application runs in **demo mode** with mock data. Simply start the servers:

```bash
npm run dev
```

## 🔧 Full Setup (Production Mode)

### 1. Redis Setup (Critical)

Redis is used for vector storage, caching, and fast data retrieval.

#### Option A: Redis Cloud (Recommended)
1. Go to [Redis Cloud](https://redis.com/try-free/)
2. Sign up for a free account
3. Create a new database (30MB free tier)
4. Copy the connection details
5. Add to your `.env` file:

```env
REDIS_URL=redis://username:password@host:port
REDIS_PASSWORD=your_password
```

#### Option B: Local Redis
1. Install Redis locally:
   ```bash
   # Windows (using Chocolatey)
   choco install redis-64
   
   # macOS (using Homebrew)
   brew install redis
   
   # Ubuntu/Debian
   sudo apt-get install redis-server
   ```
2. Start Redis:
   ```bash
   redis-server
   ```
3. Add to your `.env` file:
   ```env
   REDIS_URL=redis://localhost:6379
   REDIS_PASSWORD=
   ```

### 2. Senso.ai Setup (Context OS)

Senso.ai provides the Context OS for data ingestion and normalization.

1. Go to [Senso.ai](https://senso.ai)
2. Sign up for an account
3. Get your API credentials from the dashboard
4. Add to your `.env` file:

```env
SENSO_API_KEY=your_senso_api_key_here
SENSO_BASE_URL=https://api.senso.ai
```

### 3. Bright Data Setup (Web Scraping)

Bright Data provides real-time web scraping for card offers and travel prices.

1. Go to [Bright Data](https://brightdata.com)
2. Sign up for an account
3. Get your API credentials
4. Add to your `.env` file:

```env
BRIGHT_DATA_API_KEY=your_bright_data_api_key_here
BRIGHT_DATA_BASE_URL=https://api.brightdata.com
```

### 4. LlamaIndex Setup (Document Retrieval)

LlamaIndex provides document indexing and retrieval capabilities.

1. Go to [LlamaIndex](https://llamaindex.ai)
2. Sign up for an account
3. Get your API credentials
4. Add to your `.env` file:

```env
LLAMA_INDEX_API_KEY=your_llama_index_api_key_here
LLAMA_INDEX_BASE_URL=https://api.llamaindex.ai
```

### 5. Stytch Setup (Authentication)

Stytch provides passwordless authentication.

1. Go to [Stytch](https://stytch.com)
2. Sign up for an account
3. Create a new project
4. Get your project credentials
5. Add to your `.env` file:

```env
STYTCH_PROJECT_ID=your_stytch_project_id_here
STYTCH_SECRET=your_stytch_secret_here
```

## 📋 Complete .env File

Create a `.env` file in the `server` directory with all your credentials:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Senso.ai Configuration
SENSO_API_KEY=your_senso_api_key_here
SENSO_BASE_URL=https://api.senso.ai

# Bright Data Configuration
BRIGHT_DATA_API_KEY=your_bright_data_api_key_here
BRIGHT_DATA_BASE_URL=https://api.brightdata.com

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Stytch Configuration
STYTCH_PROJECT_ID=your_stytch_project_id_here
STYTCH_SECRET=your_stytch_secret_here

# LlamaIndex Configuration
LLAMA_INDEX_API_KEY=your_llama_index_api_key_here
LLAMA_INDEX_BASE_URL=https://api.llamaindex.ai

# Demo Configuration
DEMO_MODE=false
```

## 🧪 Testing Your Setup

After setting up the services, test them:

1. **Start the servers:**
   ```bash
   npm run dev
   ```

2. **Test the health endpoints:**
   ```bash
   curl http://localhost:3001/api/health
   curl http://localhost:3001/api/services/status
   ```

3. **Test the frontend:**
   - Go to http://localhost:3000
   - Complete the onboarding flow
   - Upload sample transaction data
   - Test the chat interface

## 🔍 Service Status Check

The application includes a service status endpoint that shows which services are configured and connected:

```bash
curl http://localhost:3001/api/services/status
```

This will return:
```json
{
  "redis": { "status": "connected" },
  "senso": { "status": "connected" },
  "brightdata": { "status": "connected" },
  "llamaindex": { "status": "connected" },
  "stytch": { "status": "connected" }
}
```

## 🚨 Troubleshooting

### Common Issues:

1. **Redis Connection Failed**
   - Check if Redis is running
   - Verify connection URL and password
   - Check firewall settings

2. **API Key Invalid**
   - Verify API keys are correct
   - Check if services are active
   - Ensure no extra spaces in keys

3. **Service Timeout**
   - Check internet connection
   - Verify service URLs
   - Check rate limits

### Demo Mode Fallback:

If any service fails to connect, the application automatically falls back to demo mode with mock data, ensuring the application remains functional.

## 📊 Service Usage Limits

### Free Tier Limits:
- **Redis Cloud**: 30MB storage
- **Senso.ai**: Check their pricing page
- **Bright Data**: Check their pricing page
- **LlamaIndex**: Check their pricing page
- **Stytch**: Check their pricing page

### Production Considerations:
- Monitor usage and upgrade plans as needed
- Implement caching to reduce API calls
- Use Redis TTL for data expiration
- Implement error handling and fallbacks

## 🎯 Next Steps

After setting up all services:

1. **Test the complete flow:**
   - User registration/login
   - Data ingestion
   - AI analysis
   - Recommendation generation

2. **Monitor performance:**
   - Check service response times
   - Monitor error rates
   - Track API usage

3. **Optimize configuration:**
   - Adjust caching strategies
   - Fine-tune API parameters
   - Implement monitoring

## 📞 Support

If you encounter issues:

1. Check the service documentation
2. Verify your API credentials
3. Test with demo mode first
4. Check the application logs
5. Contact service support if needed

The application is designed to work in demo mode even without external services, so you can always test the core functionality while setting up the integrations.
