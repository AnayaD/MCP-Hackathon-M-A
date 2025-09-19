# 🏆 Chronos - AI Credit Card Optimization Platform

> **MCP AI Hackathon Project** - Your Personal AI Strategist for Credit Card Rewards

![Chronos Logo](https://img.shields.io/badge/Chronos-AI%20Credit%20Optimizer-blue?style=for-the-badge&logo=credit-card)
![MCP Hackathon](https://img.shields.io/badge/MCP-Hackathon-2025-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Demo%20Ready-orange?style=for-the-badge)

## 🎯 **The Problem**

Credit card rewards have become a complex but incredibly valuable "game." The difference between playing it well and not playing at all can be **thousands of dollars a year** in free travel, cash back, and benefits. However, the game is rigged against the average person:

- Rules scattered across dozens of blogs
- Best strategies hidden in forum threads  
- Optimal choices change every month
- Small group of "financial hobbyists" vs. everyone else

## 💡 **The Solution: Chronos**

Chronos acts as the **great equalizer** - your personal AI strategist that plays this complex game for you. It takes the expertise that was once only accessible to the obsessive few and makes it available to everyone.

## 🚀 **Key Features**

### 🔍 **Rearview Analysis**
- **Deterministic reward calculation** showing exactly what you missed
- Detailed breakdown of past transactions and missed opportunities
- Category-wise analysis of spending patterns

### 🎯 **Natural Language Goal Input**
- Tell us your goals in plain English: *"Trip to Paris in May 2025 for $2500"*
- AI-powered parsing extracts structured data automatically
- MCP integration fetches real-time pricing and reviews

### 📊 **Intelligent Planning**
- **Credit card timeline generation** based on your spending patterns
- Optimal card recommendations for each goal
- Dynamic strategy adaptation as life changes

### 🔄 **Real-time Data Integration**
- **MCP Server integration** with Bright Data for web scraping
- Live credit card offers and travel pricing
- Automated data collection and processing

## 🛠 **Tech Stack**

### **Frontend**
- ⚛️ **React** with Vite for fast development
- 🎨 **Tailwind CSS** for modern UI
- 🔄 **React Router** for navigation
- 📱 **Responsive design** for all devices

### **Backend**
- 🚀 **Express.js** REST API
- 🗄️ **Redis Cloud** for data storage and caching
- 🤖 **OpenAI GPT** for natural language processing
- 🔌 **MCP Protocol** for external service integration

### **External Services**
- 🌐 **Bright Data MCP Server** for web scraping
- 🧠 **LlamaIndex** for document indexing
- 🔐 **Stytch** for authentication
- 📊 **Senso.ai** for data normalization

## 🏗 **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Express API   │    │  External APIs │
│                 │    │                 │    │                 │
│ • Login/Onboard │◄──►│ • Auth Routes   │◄──►│ • Bright Data   │
│ • Dashboard     │    │ • Data Routes  │    │ • OpenAI LLM    │
│ • Chat Interface│    │ • Chat Routes   │    │ • Redis Cloud   │
│ • Goal Planning │    │ • MCP Client    │    │ • Senso.ai      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+
- Redis Cloud account
- OpenAI API key
- Bright Data MCP access

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/AnayaD/MCP-Hackathon-M-A.git
cd MCP-Hackathon-M-A
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies  
cd ../client && npm install
```

3. **Environment Setup**
```bash
# Copy environment template
cp server/env.example server/.env

# Add your API keys to server/.env
OPENAI_API_KEY=your_openai_key
REDIS_URL=your_redis_url
BRIGHTDATA_API_KEY=your_brightdata_key
# ... other keys
```

4. **Run the application**
```bash
# Start both client and server
npm run dev

# Or start individually:
# Server: cd server && node index.js
# Client: cd client && npm run dev
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/api/health

## 📱 **User Journey**

### **1. The Revelation (Rearview Mirror)**
> *"Last year, you missed out on an estimated $1,250 in rewards."*

Users see exactly what they missed - the flight they booked, groceries they bought - where a different choice would have unlocked huge bonuses.

### **2. The Conversation (Future Goals)**
> *"I want to plan a trip to Paris for my anniversary next May."*

Natural language input gets parsed into structured goals with real-time pricing data.

### **3. The Strategy (Forking Paths)**
> *"October: Apply for Card X. January: 80,000 point bonus. February: Book flights."*

AI presents optimal credit card timeline with actionable steps.

### **4. The Adaptation (Living Plan)**
> *"Actually, I also need to buy a new laptop in November."*

System instantly re-evaluates and presents an even better strategy.

## 🔧 **API Endpoints**

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### **Data Management**
- `POST /api/data/store-profile` - Store user profile
- `POST /api/data/store-goals` - Store goals with MCP data
- `GET /api/data/goals/:user_id` - Retrieve user goals
- `POST /api/data/calculate-rewards` - Calculate missed rewards
- `POST /api/data/generate-timeline` - Generate credit card timeline

### **Chat & Planning**
- `POST /api/chat/message` - Send message to AI strategist
- `POST /api/chat/parse-goals` - Parse natural language goals

### **Services**
- `GET /api/services/status` - Check service health
- `POST /api/services/scrape/offers` - Scrape credit card offers
- `POST /api/services/scrape/travel` - Scrape travel prices

## 🎯 **MCP Integration**

This project leverages the **Model Context Protocol (MCP)** for seamless integration with external services:

- **Bright Data MCP Server** for real-time web scraping
- **Structured data ingestion** and normalization
- **Automated context management** for AI agents
- **Real-time data fetching** for goals and offers

## 📊 **Demo Data**

The application includes comprehensive demo data:
- **15 detailed missed reward transactions** with merchant, category, amount, and recommendations
- **Sample goals** for travel, technology, and events
- **Credit card optimization plans** with timelines and point calculations
- **Realistic spending patterns** and reward calculations

## 🏆 **Hackathon Achievements**

✅ **3+ Sponsor Tools Used:**
- Redis Cloud (Vector Database)
- Bright Data (MCP Web Scraping)  
- OpenAI (LLM Integration)
- Senso.ai (Data Normalization)
- LlamaIndex (Document Indexing)

✅ **Core Features Implemented:**
- Natural language goal input
- Deterministic reward calculation
- Real-time MCP data fetching
- Credit card timeline generation
- Comprehensive demo data

✅ **Technical Excellence:**
- Full-stack React + Express application
- Redis database integration
- MCP protocol implementation
- Professional UI/UX design

## 🤝 **Contributing**

This is a hackathon project, but contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 **Team**

Built for the **MCP AI Hackathon 2025** by the Chronos team.

---

**Ready to optimize your credit card rewards?** 🚀

[Live Demo](http://localhost:3000) | [API Docs](http://localhost:3001/api/health) | [GitHub](https://github.com/AnayaD/MCP-Hackathon-M-A)