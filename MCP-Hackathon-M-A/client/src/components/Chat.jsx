import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { demoPlans, demoCardOffers } from '../data/demoData'

const Chat = ({ user }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm Chronos, your credit card optimization AI. I can help you analyze your spending patterns and create personalized strategies to maximize your rewards. What would you like to know?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Send message to LLM API
      const chatResponse = await axios.post('/api/chat/message', {
        message: input,
        user_id: user.id,
        context_id: user.context_id
      })

      let response = ''
      
      if (chatResponse.data.success) {
        response = chatResponse.data.response
      } else {
        // Fallback to demo responses if LLM fails
        if (input.toLowerCase().includes('paris') || input.toLowerCase().includes('trip')) {
          const plan = demoPlans.paris_trip
          response = `Great! I'd love to help you plan for your trip to Paris. Based on your spending patterns, here's your personalized strategy:

**🎯 Goal: ${plan.goal}**
**💰 Total Value: $${plan.total_value}**
**📈 Coverage: ${plan.coverage_percentage}% of flight costs**

**📅 Timeline Recommendation:**

${plan.timeline.map((step, index) => `
**${index + 1}. ${step.month}**: ${step.action}
   - 💡 ${step.reason}
   - 📋 Requirements: ${step.requirements}
   - 🎁 Points: ${step.estimated_points > 0 ? '+' : ''}${step.estimated_points.toLocaleString()}
`).join('')}

**🚀 Result**: ${plan.upgrade_possibility}

**💳 Recommended Card**: Chase Sapphire Preferred
- 80,000 point signup bonus (worth $1,000+)
- 2x points on travel and dining
- Transfer partners: United, Southwest, Hyatt, and more

This strategy will cover 100% of your flight costs and potentially upgrade you to business class!`
        } else if (input.toLowerCase().includes('missed') || input.toLowerCase().includes('reward')) {
          response = `Based on your transaction history, you missed out on **$1,250** in rewards last year.

**Top missed opportunities:**
• Whole Foods: $450 → Could have earned $18 more with Amex Gold
• Starbucks: $200 → Could have earned $8 more with Chase Sapphire
• Shell Gas: $300 → Could have earned $6 more with Capital One Venture

**Recommendation:** Apply for the Chase Sapphire Preferred to maximize your rewards going forward.`
        } else if (input.toLowerCase().includes('laptop') || input.toLowerCase().includes('computer')) {
          const plan = demoPlans.laptop_purchase
          response = `Perfect! Let me create a strategy for your laptop purchase. Here's your personalized plan:

**🎯 Goal: ${plan.goal}**
**💰 Total Value: $${plan.total_value}**
**📈 Coverage: ${plan.coverage_percentage}% of laptop cost**

**📅 Timeline Recommendation:**

${plan.timeline.map((step, index) => `
**${index + 1}. ${step.month}**: ${step.action}
   - 💡 ${step.reason}
   - 📋 Requirements: ${step.requirements}
   - 🎁 Points: ${step.estimated_points > 0 ? '+' : ''}${step.estimated_points.toLocaleString()}
`).join('')}

**🚀 Result**: ${plan.upgrade_possibility}

**💳 Recommended Card**: Capital One Venture Rewards
- 75,000 point signup bonus (worth $750)
- 2x points on all purchases
- Simple redemption for statement credits

This strategy will cover 62.5% of your laptop cost!`
        } else if (input.toLowerCase().includes('card') || input.toLowerCase().includes('apply')) {
          response = `Here are the top credit cards I recommend for your spending profile:

${demoCardOffers.map((card, index) => `
**${index + 1}. ${card.name}**
- ${card.signup_bonus_points.toLocaleString()} point signup bonus ($${(card.signup_bonus_points * card.point_value_usd).toFixed(0)}+ value)
- ${Object.entries(card.category_multipliers).map(([cat, mult]) => `${mult}x on ${cat}`).join(', ')}
- $${card.annual_fee} annual fee
- Best for: ${Object.entries(card.category_multipliers).filter(([_, mult]) => mult > 1).map(([cat, _]) => cat).join(' and ')} spend
`).join('')}

Would you like me to create a personalized timeline for any of these cards?`
        } else {
          response = `I'm here to help you optimize your credit card strategy! You can ask me about:
- Planning for specific goals (trips, purchases)
- Analyzing your missed rewards
- Credit card recommendations
- Creating spending timelines

What would you like to explore?`
        }
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      }

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage])
        setLoading(false)
      }, 1000)

    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Chronos Chat</h1>
              <p className="text-gray-600">Your AI credit card strategist</p>
            </div>
            <Link
              to="/dashboard"
              className="text-indigo-600 hover:text-indigo-700"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-indigo-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  <span>Chronos is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Chronos about your credit card strategy..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </form>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setInput("Plan for my trip to Paris")}
            className="p-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-left"
          >
            <div className="font-medium">Plan for Trip</div>
            <div className="text-sm text-gray-600">Get travel optimization strategy</div>
          </button>
          
          <button
            onClick={() => setInput("How much did I miss in rewards?")}
            className="p-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-left"
          >
            <div className="font-medium">Missed Rewards</div>
            <div className="text-sm text-gray-600">Analyze past opportunities</div>
          </button>
          
          <button
            onClick={() => setInput("What credit cards should I apply for?")}
            className="p-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-left"
          >
            <div className="font-medium">Card Recommendations</div>
            <div className="text-sm text-gray-600">Find the best cards for you</div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat
