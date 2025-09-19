# Chronos - Credit Card Optimization AI

Chronos is an AI-powered credit card optimization platform that acts as your personal financial strategist. It analyzes past spending patterns, identifies missed reward opportunities, and creates personalized timelines for achieving financial goals through optimal credit card usage.

## 🚀 Features

- **Rearview Analysis**: Shows users exactly how much they missed in rewards over the past year
- **Future Planning**: Creates actionable timelines for credit card applications and spending strategies  
- **Dynamic Adaptation**: Continuously updates recommendations based on new life events and goals
- **AI Chat Interface**: Natural language interaction with your credit card strategist
- **MCP Integration**: Uses Model Context Protocol for seamless AI agent communication

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │   MCP Servers   │    │   Senso.ai      │
│   (Stytch Auth) │◄──►│   (Context API) │◄──►│   (Context OS)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Redis Vector  │◄──►│   LlamaIndex    │    │   Bright Data   │
│   (Embeddings)  │    │   (Retrieval)   │    │   (Scraping)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Technology Stack

### Sponsor Tools Used (≥3 Required)
- **Senso.ai** - Context OS for data ingestion and normalization
- **Bright Data** - Web scraping for real-time card offers and travel prices
- **Redis** - Vector database for embeddings and fast lookups
- **LlamaIndex** - Document indexing and retrieval system
- **Stytch** - Passwordless authentication system

### Supporting Technologies
- **MCP (Model Context Protocol)** - Agent-server communication
- **React** - Frontend framework
- **Node.js/Express** - Backend API server
- **Tailwind CSS** - Styling framework

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Redis (for production)
- API keys for sponsor tools

### Quick Start

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd MCP-Hackathon-M-A
npm run install:all
```

2. **Set up environment variables:**
```bash
cd server
cp env.example .env
# Edit .env with your API keys
```

3. **Start the development servers:**
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:3001
- Frontend on http://localhost:3000

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

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

# Demo Configuration
DEMO_MODE=true
```

## 🎯 Demo Scenarios

### Scenario 1: Initial Analysis
1. User logs in with demo credentials
2. Uploads transaction CSV (200+ transactions)
3. Sets goal: "Trip to Paris, May 2025"
4. System shows: "You missed $1,250 in rewards last year"
5. Displays evidence: Top 3 transactions with missed opportunities
6. Shows timeline: Apply for Chase Sapphire in October

### Scenario 2: Dynamic Replanning
1. User adds new event: "Buying laptop in November"
2. Clicks "Recompute Plan"
3. System updates timeline with better card recommendation
4. Shows improved reward estimate: "Now $1,800 in rewards"
5. Explains why laptop purchase enables bigger bonus

### Scenario 3: Evidence Deep Dive
1. User clicks on evidence transaction
2. Shows detailed breakdown:
   - Original card: 1x groceries
   - Optimal card: 3x groceries
   - Missed: $47.50 on this transaction
3. Links to card offer details from Bright Data scrape

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### MCP Endpoints
- `POST /api/mcp/context/ingest` - Ingest user data
- `GET /api/mcp/retrieve/agent` - Retrieve context for AI agent
- `POST /api/mcp/calc/rewards` - Calculate missed rewards

### Data Management
- `POST /api/data/upload-transactions` - Upload transaction CSV
- `POST /api/data/goals` - Create financial goal
- `GET /api/data/goals` - Get user goals

## 🧪 Testing

### Demo Data
Sample transaction data is provided in `demo-data/sample-transactions.csv` with 100+ realistic transactions across various categories.

### Manual Testing
1. Start the development servers
2. Navigate to http://localhost:3000
3. Use any email to login (demo mode)
4. Complete onboarding flow
5. Upload sample transaction CSV
6. Test chat interface with sample queries

## 🚀 Deployment

### Production Setup
1. Set up Redis instance
2. Configure all API keys in environment variables
3. Set `NODE_ENV=production`
4. Build frontend: `npm run build`
5. Start server: `npm start`

### Docker (Optional)
```bash
docker build -t chronos .
docker run -p 3001:3001 chronos
```

## 📈 Performance Considerations

- **Caching**: Redis TTL for scraped offers
- **Pagination**: Large transaction datasets
- **Error Handling**: Graceful fallbacks for API failures
- **Data Validation**: JSON schema validation for all inputs

## 🔒 Security

- **Data Privacy**: No real bank data stored
- **API Security**: Rate limiting and input validation
- **Demo Mode**: Safe testing environment
- **Environment Variables**: Secure credential management

## 🤝 Contributing

This is a hackathon project. For production use, consider:
- Real bank API integration
- Enhanced security measures
- Comprehensive testing suite
- Performance optimization
- User feedback system

## 📄 License

MIT License - see LICENSE file for details

## 🏆 Hackathon Notes

This project demonstrates:
- **5 Sponsor Tools Integration**: Senso.ai, Bright Data, Redis, LlamaIndex, Stytch
- **MCP Protocol**: Seamless AI agent communication
- **Deterministic Calculations**: Explainable reward math
- **Real-time Adaptation**: Dynamic strategy updates
- **Demo-Ready**: Complete user journey in <5 minutes

Built for the MCP AI Hackathon 2024.