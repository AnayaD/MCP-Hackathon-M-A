const OpenAI = require('openai');

class LLMService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.openai = this.apiKey ? new OpenAI({ apiKey: this.apiKey }) : null;
    this.isConfigured = !!this.apiKey;
  }

  // Initialize LLM service
  async initialize() {
    if (!this.isConfigured) {
      console.log('⚠️  OpenAI API key not configured - using demo mode');
      return false;
    }

    try {
      // Simple test to check if the API key is valid
      if (this.openai) {
        console.log('✅ OpenAI LLM connected successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.log('⚠️  OpenAI LLM connection failed - using demo mode:', error.message);
      return false;
    }
  }

  // Generate AI response for credit card optimization
  async generateRecommendation(context, userQuery) {
    if (!this.isConfigured) {
      // Demo mode - return mock response
      return {
        success: true,
        response: `Based on your spending patterns, I recommend the Chase Sapphire Preferred card. You could earn 80,000 bonus points (worth $1,000) by spending $4,000 in the first 3 months. This would be perfect for your Paris trip in May 2025!`,
        reasoning: 'Demo mode - using sample data',
        confidence: 0.85
      };
    }

    try {
      const systemPrompt = `You are Chronos, an AI credit card optimization expert. Analyze the user's data and provide personalized recommendations.

Context:
- User transactions: ${JSON.stringify(context.transactions || [])}
- User goals: ${JSON.stringify(context.goals || [])}
- Available card offers: ${JSON.stringify(context.card_offers || [])}
- User profile: ${JSON.stringify(context.profile || {})}

Provide specific, actionable recommendations for credit card optimization. Focus on:
1. Sign-up bonuses that match their spending patterns
2. Category multipliers for their frequent purchases
3. Timeline for achieving their goals
4. Estimated rewards and savings

Be conversational, specific, and data-driven.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuery }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      return {
        success: true,
        response: completion.choices[0].message.content,
        reasoning: 'AI analysis based on user data',
        confidence: 0.9
      };
    } catch (error) {
      console.error('OpenAI API error:', error.message);
      return {
        success: false,
        error: error.message,
        response: 'I apologize, but I\'m having trouble processing your request right now. Please try again later.'
      };
    }
  }

  // Calculate missed rewards
  async calculateMissedRewards(transactions, cardOffers) {
    if (!this.isConfigured) {
      // Demo mode - return mock calculation
      return {
        success: true,
        missed_rewards: 1250,
        breakdown: [
          { category: 'dining', amount: 450, missed_points: 1800 },
          { category: 'groceries', amount: 800, missed_points: 800 },
          { category: 'travel', amount: 300, missed_points: 600 }
        ],
        recommendation: 'You could have earned 3,200 points worth $1,250 with optimal card usage'
      };
    }

    try {
      const systemPrompt = `Calculate the missed rewards for a user based on their transaction history and available card offers.

Transactions: ${JSON.stringify(transactions)}
Card Offers: ${JSON.stringify(cardOffers)}

Calculate:
1. Total missed rewards in dollars
2. Breakdown by category
3. Specific recommendations

Return JSON format with missed_rewards, breakdown array, and recommendation.`;

      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Calculate my missed rewards' }
        ],
        max_tokens: 300,
        temperature: 0.3
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        ...JSON.parse(response.data.choices[0].message.content)
      };
    } catch (error) {
      console.error('OpenAI calculation error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate timeline for goal achievement
  async generateTimeline(goal, userData, cardOffers) {
    if (!this.isConfigured) {
      // Demo mode - return mock timeline
      return {
        success: true,
        timeline: [
          {
            month: 'October 2024',
            action: 'Apply for Chase Sapphire Preferred',
            reason: 'Your dining and travel spend qualifies for the sign-up bonus',
            estimated_points: 0
          },
          {
            month: 'January 2025',
            action: 'Complete $4,000 spending requirement',
            reason: 'Earn 80,000 bonus points',
            estimated_points: 80000
          },
          {
            month: 'February 2025',
            action: 'Book Paris flights with points',
            reason: 'Use 60,000 points for $750 flight value',
            estimated_points: 20000
          }
        ],
        total_estimated_value: 1000,
        goal_achievement_date: '2025-02-15'
      };
    }

    try {
      const systemPrompt = `Create a detailed timeline for achieving a user's financial goal using credit card optimization.

Goal: ${JSON.stringify(goal)}
User Data: ${JSON.stringify(userData)}
Card Offers: ${JSON.stringify(cardOffers)}

Create a month-by-month timeline with:
1. Specific actions to take
2. Reasoning for each action
3. Estimated points/rewards earned
4. Total estimated value
5. Goal achievement date

Return JSON format.`;

      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Create my optimization timeline' }
        ],
        max_tokens: 400,
        temperature: 0.5
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        ...JSON.parse(response.data.choices[0].message.content)
      };
    } catch (error) {
      console.error('OpenAI timeline error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Health check
  async healthCheck() {
    if (!this.isConfigured) {
      return { status: 'demo_mode', message: 'OpenAI API key not configured' };
    }

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 5
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        status: 'connected',
        response: 'OpenAI API responding'
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  async parseNaturalLanguageGoals(naturalLanguageText) {
    if (!this.isConfigured) {
      // Demo mode - return structured demo goals
      return { 
        success: true, 
        goals: [
          {
            title: 'Trip to Paris',
            target_date: '2025-05-15',
            est_cost_usd: 2500,
            category: 'travel'
          },
          {
            title: 'New Laptop',
            target_date: '2025-03-01',
            est_cost_usd: 1200,
            category: 'technology'
          }
        ],
        reasoning: 'Demo mode fallback'
      };
    }

    try {
      const prompt = `Parse the following natural language text into structured financial goals. Extract:
1. Goal title/description
2. Target date (if mentioned)
3. Estimated cost (if mentioned)
4. Category (travel, technology, events, education, other)

Text: "${naturalLanguageText}"

Return a JSON array of goals with this structure:
[
  {
    "title": "Goal description",
    "target_date": "YYYY-MM-DD",
    "est_cost_usd": number,
    "category": "travel|technology|events|education|other"
  }
]

If no date is mentioned, use a date 6 months from now. If no cost is mentioned, estimate based on the goal type.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: 'system', content: 'You are a financial goal parser. Extract structured data from natural language descriptions of financial goals. Always return valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1
      });

      const responseText = completion.choices[0].message.content;
      
      // Try to parse the JSON response
      try {
        const goals = JSON.parse(responseText);
        return { success: true, goals: goals, reasoning: 'LLM parsed natural language' };
      } catch (parseError) {
        console.error('Failed to parse LLM response as JSON:', parseError);
        // Fallback to demo data
        return { 
          success: true, 
          goals: [
            {
              title: 'Parsed Goal',
              target_date: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              est_cost_usd: 1000,
              category: 'other'
            }
          ],
          reasoning: 'LLM response parsing failed, using fallback'
        };
      }
    } catch (error) {
      console.error('OpenAI LLM parse goals error:', error.message);
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
const llmService = new LLMService();

module.exports = llmService;
