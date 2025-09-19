# Chronos: Credit Card Optimization AI - Implementation Plan

## Project Overview

**Chronos** is an AI-powered credit card optimization platform that acts as a personal financial strategist. It analyzes past spending patterns, identifies missed reward opportunities, and creates personalized timelines for achieving financial goals through optimal credit card usage.

### Core Value Proposition
- **Rearview Analysis**: Shows users exactly how much they missed in rewards over the past year
- **Future Planning**: Creates actionable timelines for credit card applications and spending strategies
- **Dynamic Adaptation**: Continuously updates recommendations based on new life events and goals

## Architecture Overview

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

## Technology Stack (Sponsor Tools Used)

### Primary Tools (≥3 Required)
1. **Senso.ai** - Context OS for data ingestion and normalization
2. **Bright Data** - Web scraping for real-time card offers and travel prices
3. **Redis** - Vector database for embeddings and fast lookups
4. **LlamaIndex** - Document indexing and retrieval system
5. **Stytch** - Passwordless authentication system

### Supporting Technologies
- **MCP (Model Context Protocol)** - Agent-server communication
- **React** - Frontend framework
- **Node.js/Express** - Backend API server
- **JSON Schema** - Data normalization

## Data Models & Schemas

### User Profile Schema
```json
{
  "user_id": "u_123",
  "life_stage": "early_career",
  "marital_status": "single", 
  "household_size": 1,
  "timezone": "America/Los_Angeles",
  "created_at": "2024-09-19T10:00:00Z"
}
```

### Transaction Schema
```json
{
  "tx_id": "t_987",
  "user_id": "u_123",
  "date": "2024-08-21",
  "amount": 57.42,
  "merchant": "Whole Foods",
  "category": "groceries",
  "card_id": "card_visa_1",
  "card_name": "Chase Freedom Unlimited"
}
```

### Goal Schema
```json
{
  "goal_id": "g_11",
  "user_id": "u_123", 
  "title": "Trip to Paris",
  "target_date": "2025-05-10",
  "est_cost_usd": 1200,
  "notes": "anniversary trip",
  "created_at": "2024-09-19T10:00:00Z"
}
```

### Card Offer Schema
```json
{
  "card_id": "chase_sapphire_24",
  "issuer": "Chase",
  "name": "Chase Sapphire Preferred", 
  "signup_bonus_points": 80000,
  "bonus_min_spend": 4000,
  "bonus_period_days": 90,
  "category_multipliers": {
    "travel": 2,
    "dining": 2,
    "groceries": 1
  },
  "annual_fee": 95,
  "point_value_usd": 0.0125,
  "link": "https://example.com",
  "last_updated": "2024-09-19T10:00:00Z"
}
```

### Recommendation Schema
```json
{
  "rec_id": "r_1",
  "user_id": "u_123",
  "goal_id": "g_11",
  "timeline": [
    {
      "when": "2024-10",
      "action": "Apply for chase_sapphire_24",
      "why": "fits grocery/dining spend pattern"
    },
    {
      "when": "2025-01", 
      "action": "Hit signup spend target",
      "why": "100% of flight cost covered"
    }
  ],
  "estimated_rewards_usd": 1200,
  "confidence": "deterministic",
  "evidence_transactions": ["t_987", "t_988"],
  "evidence_offers": ["chase_sapphire_24"]
}
```

## Implementation Phases

### Phase 1: Core Infrastructure (2-3 hours)
**Priority: CRITICAL**

#### 1.1 Project Setup
- Initialize Node.js/Express backend
- Set up React frontend with Vite
- Configure environment variables
- Set up Git repository structure

#### 1.2 Authentication (Stytch)
- Create Stytch project
- Implement magic link authentication
- Set up user session management
- Create protected routes

#### 1.3 Senso.ai Integration
- Set up Senso.ai account and API credentials
- Create data ingestion endpoints
- Implement schema validation
- Set up webhook handlers for data processing

### Phase 2: Data Collection & Processing (2-3 hours)
**Priority: HIGH**

#### 2.1 Mock Data Generation
- Create sample transaction CSV (200+ transactions)
- Generate realistic spending patterns across categories
- Include various merchant types and amounts

#### 2.2 Bright Data Scraping
- Set up Bright Data MCP server
- Create scrapers for major credit card offers:
  - Chase Sapphire Preferred
  - American Express Gold Card
  - Capital One Venture
- Scrape travel price samples for demo destinations
- Implement data normalization pipeline

#### 2.3 Data Ingestion Pipeline
- CSV parser for transaction data
- Senso.ai integration for normalization
- Data validation and error handling
- Batch processing for large datasets

### Phase 3: Retrieval & Intelligence (2-3 hours)
**Priority: HIGH**

#### 3.1 Redis Vector Database
- Set up Redis Cloud instance
- Implement vector embeddings for:
  - Card offer descriptions
  - Transaction categories
  - User goals and preferences
- Create similarity search functions

#### 3.2 LlamaIndex Integration
- Build document index from Senso normalized data
- Create retrieval pipeline for:
  - Relevant card offers
  - Historical transaction patterns
  - Goal-specific recommendations
- Implement query routing and ranking

#### 3.3 MCP Server Implementation
- Create `mcp/context/ingest` endpoint
- Create `mcp/retrieve/agent` endpoint
- Implement context aggregation
- Add error handling and logging

### Phase 4: Reward Calculation Engine (2-3 hours)
**Priority: CRITICAL**

#### 4.1 Deterministic Algorithm
```javascript
function calculateMissedRewards(transactions, cardOffers) {
  let totalMissedUSD = 0;
  const evidence = [];
  
  for (const tx of transactions) {
    const bestCard = findBestCardForCategory(tx.category, cardOffers);
    const currentMultiplier = getCurrentCardMultiplier(tx.card_id);
    const bestMultiplier = bestCard.category_multipliers[tx.category];
    
    const missedPoints = tx.amount * (bestMultiplier - currentMultiplier);
    const missedUSD = missedPoints * bestCard.point_value_usd;
    
    totalMissedUSD += missedUSD;
    
    if (missedUSD > 10) { // Only track significant misses
      evidence.push({
        transaction: tx,
        bestCard: bestCard,
        missedUSD: missedUSD
      });
    }
  }
  
  return { totalMissedUSD, evidence };
}
```

#### 4.2 Future Planning Algorithm
- Analyze spending patterns vs. card requirements
- Calculate feasibility of signup bonuses
- Generate timeline recommendations
- Estimate reward accumulation rates

#### 4.3 Evidence Collection
- Track top missed opportunities
- Link transactions to optimal cards
- Calculate confidence scores
- Generate explainable recommendations

### Phase 5: LLM Agent & Conversation (2-3 hours)
**Priority: HIGH**

#### 5.1 Agent Prompt Engineering
```javascript
const SYSTEM_PROMPT = `
You are Chronos, a credit card optimization AI. Your role is to:

1. Present ONLY deterministic calculations from the reward calculator
2. Show evidence with specific transaction IDs and card offers
3. Create clear, actionable timelines
4. Never guess numbers - always use MCP endpoint data

When user asks about rewards:
1. Call mcp/retrieve/agent with user context
2. Call mcp/calc_rewards with transaction data
3. Present results with evidence snippets
4. Generate timeline recommendations

Always be specific and data-driven.
`;
```

#### 5.2 Conversation Flow
- Parse user intents (goal setting, analysis requests)
- Route to appropriate MCP endpoints
- Format responses with evidence
- Handle follow-up questions

#### 5.3 Dynamic Replanning
- Detect new events (purchases, goal changes)
- Trigger recalculation pipeline
- Update recommendations in real-time
- Maintain conversation context

### Phase 6: Frontend Development (3-4 hours)
**Priority: MEDIUM**

#### 6.1 Core UI Components
- Login page with Stytch integration
- Onboarding flow (life stage, goals, transaction upload)
- Dashboard with rearview summary
- Chat interface for LLM interaction
- Timeline visualization component

#### 6.2 Key Screens
**Login Screen**
- Stytch magic link authentication
- Demo user credentials for judges

**Onboarding Flow**
- Life stage selection (student, early career, etc.)
- Goal creation form
- CSV upload for transactions
- Progress indicators

**Rearview Dashboard**
- One-sentence missed rewards summary
- Evidence cards with transaction details
- Visual breakdown by category

**Chat Interface**
- Natural language input
- Timeline cards with actions
- Evidence snippets with links
- Recompute button for updates

#### 6.3 Timeline Visualization
- Vertical timeline with dates
- Action cards (Apply, Spend, Alert)
- Progress indicators
- Interactive elements

### Phase 7: Integration & Testing (1-2 hours)
**Priority: MEDIUM**

#### 7.1 End-to-End Testing
- Test complete user journey
- Verify MCP endpoint functionality
- Validate reward calculations
- Test dynamic replanning

#### 7.2 Demo Preparation
- Create demo script
- Prepare sample data
- Set up demo scenarios
- Practice presentation flow

#### 7.3 Error Handling
- Graceful fallbacks for API failures
- User-friendly error messages
- Logging and debugging tools

## Demo Scenarios

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

## Technical Implementation Details

### MCP Server Endpoints

#### POST /mcp/context/ingest
```javascript
{
  "action": "ingest_transactions",
  "user_id": "u_123",
  "data": {
    "transactions": [...],
    "goals": [...],
    "profile": {...}
  }
}
```

#### GET /mcp/retrieve/agent
```javascript
{
  "context_id": "ctx_456",
  "query_type": "reward_analysis",
  "goal_id": "g_11"
}
```

#### POST /mcp/calc_rewards
```javascript
{
  "user_id": "u_123",
  "lookback_months": 12,
  "goal_id": "g_11"
}
```

### Redis Data Structure
```
user:u_123:transactions -> List of transaction IDs
user:u_123:goals -> List of goal IDs
card_offers:embeddings -> Vector embeddings for similarity search
tx:t_987 -> Transaction details
goal:g_11 -> Goal details
```

### Senso.ai Webhook Flow
1. Frontend uploads CSV → Senso.ai
2. Senso normalizes data → Returns context_id
3. Webhook triggers Redis indexing
4. LlamaIndex builds document index
5. MCP endpoints ready for queries

## Risk Mitigation & Fallbacks

### API Failures
- **Bright Data**: Use hardcoded card offers for demo
- **Senso.ai**: Simulate normalized JSON locally
- **Redis**: Use in-memory fallback for demo

### Data Quality Issues
- Validate all inputs with JSON schemas
- Implement data sanitization
- Add error logging and monitoring

### Performance Concerns
- Cache frequent calculations
- Use Redis TTL for scraped data
- Implement pagination for large datasets

## Success Metrics

### Technical Metrics
- ✅ All 5 sponsor tools integrated
- ✅ MCP endpoints functional
- ✅ Deterministic reward calculations
- ✅ Real-time data updates

### Demo Metrics
- ✅ Complete user journey in <5 minutes
- ✅ Clear evidence presentation
- ✅ Dynamic replanning demonstration
- ✅ Judges can understand value proposition

## Deliverables Checklist

### Core Functionality
- [ ] Stytch authentication working
- [ ] Senso.ai data ingestion pipeline
- [ ] Bright Data scraping (3+ card offers)
- [ ] Redis + LlamaIndex retrieval system
- [ ] Deterministic reward calculator
- [ ] MCP server endpoints
- [ ] LLM agent with conversation flow
- [ ] React frontend with all screens

### Demo Assets
- [ ] Sample transaction CSV (200+ transactions)
- [ ] Demo user credentials
- [ ] Scraped card offers (3+ cards)
- [ ] Travel price samples
- [ ] Demo script with scenarios
- [ ] Presentation slides

### Documentation
- [ ] API documentation
- [ ] Setup instructions
- [ ] Demo guide
- [ ] Architecture diagram

## Timeline Summary

**Total Time: 12-16 hours (1 day)**

- **Phase 1**: Core Infrastructure (2-3h)
- **Phase 2**: Data Collection (2-3h)  
- **Phase 3**: Retrieval System (2-3h)
- **Phase 4**: Reward Engine (2-3h)
- **Phase 5**: LLM Agent (2-3h)
- **Phase 6**: Frontend (3-4h)
- **Phase 7**: Integration (1-2h)

**Buffer Time**: 2-4 hours for debugging and polish

This implementation plan provides a clear roadmap for building Chronos as a compelling, demo-ready MVP that showcases the power of AI-driven financial optimization using the sponsor tools effectively.
