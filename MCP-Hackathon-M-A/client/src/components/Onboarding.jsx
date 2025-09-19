import React, { useState } from 'react'
import axios from 'axios'

const Onboarding = ({ user, onComplete }) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    lifeStage: '',
    maritalStatus: '',
    householdSize: 1,
    goals: [],
    naturalLanguageGoals: ''
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleGoalAdd = () => {
    const title = prompt('What is your financial goal? (e.g., Trip to Paris)')
    const targetDate = prompt('When do you want to achieve this? (YYYY-MM-DD)')
    const estCost = prompt('Estimated cost in USD?')
    
    if (title && targetDate && estCost) {
      const newGoal = {
        title,
        target_date: targetDate,
        est_cost_usd: parseFloat(estCost)
      }
      
      setFormData(prev => ({
        ...prev,
        goals: [...prev.goals, newGoal]
      }))
    }
  }

  const removeGoal = (index) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }))
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append('transactions', file)

    try {
      const response = await axios.post('/api/data/upload-transactions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      if (response.data.success) {
        alert(`Successfully uploaded ${response.data.count} transactions!`)
      }
    } catch (error) {
      alert('Failed to upload transactions. Please try again.')
      console.error('Upload error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    
    try {
      console.log('🎯 Completing onboarding with real data flow...')
      
      // Store user profile data
      const profileData = {
        life_stage: formData.lifeStage,
        marital_status: formData.maritalStatus,
        household_size: formData.householdSize,
        onboarding_completed_at: new Date().toISOString()
      }
      
      await axios.post('/api/data/store-profile', {
        user_id: user.id,
        profile_data: profileData
      })
      
      // Store goals with MCP data fetching
      const goalsWithIds = formData.goals.map((goal, index) => ({
        goal_id: `goal_${user.id}_${index}_${Date.now()}`,
        title: goal.title,
        target_date: goal.target_date,
        est_cost_usd: goal.est_cost_usd,
        category: determineGoalCategory(goal.title),
        status: 'active',
        created_at: new Date().toISOString()
      }))
      
      const goalsResponse = await axios.post('/api/data/store-goals', {
        user_id: user.id,
        goals: goalsWithIds
      })
      
      if (goalsResponse.data.success) {
        console.log('✅ Onboarding completed with MCP data:', goalsResponse.data.goals)
        onComplete()
      } else {
        console.error('Failed to store goals with MCP data')
        alert('Failed to save onboarding data. Please try again.')
      }
    } catch (error) {
      alert('Failed to save onboarding data. Please try again.')
      console.error('Onboarding error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to determine goal category
  const determineGoalCategory = (title) => {
    const titleLower = title.toLowerCase()
    if (titleLower.includes('trip') || titleLower.includes('travel') || titleLower.includes('vacation')) {
      return 'travel'
    } else if (titleLower.includes('laptop') || titleLower.includes('computer') || titleLower.includes('phone')) {
      return 'technology'
    } else if (titleLower.includes('wedding') || titleLower.includes('party') || titleLower.includes('event')) {
      return 'events'
    } else if (titleLower.includes('school') || titleLower.includes('education') || titleLower.includes('semester')) {
      return 'education'
    } else {
      return 'other'
    }
  }

  // Parse natural language goals into structured format
  const parseNaturalLanguageGoals = async (text) => {
    try {
      console.log('🧠 Parsing natural language goals:', text)
      
      // Send to LLM for parsing
      const response = await axios.post('/api/chat/parse-goals', {
        user_id: user.id,
        natural_language_text: text
      })
      
      if (response.data.success) {
        console.log('✅ Parsed goals:', response.data.goals)
        return response.data.goals
      } else {
        // Fallback to simple parsing
        return parseGoalsFallback(text)
      }
    } catch (error) {
      console.error('❌ Error parsing goals:', error)
      // Fallback to simple parsing
      return parseGoalsFallback(text)
    }
  }

  // Fallback parsing for when LLM is not available
  const parseGoalsFallback = (text) => {
    const goals = []
    const lines = text.split('\n').filter(line => line.trim())
    
    for (const line of lines) {
      const goal = parseSingleGoal(line.trim())
      if (goal) {
        goals.push(goal)
      }
    }
    
    return goals
  }

  // Parse a single goal line
  const parseSingleGoal = (line) => {
    // Look for common patterns
    const patterns = [
      // "Trip to Paris in May 2025 for $2500"
      /(?:trip to|visit|go to)\s+([^,]+?)(?:\s+in\s+(\w+\s+\d{4}))?(?:\s+for\s+\$?(\d+(?:,\d{3})*))?/i,
      // "Buy a laptop for $1200 in March"
      /(?:buy|purchase|get)\s+(?:a\s+)?([^,]+?)(?:\s+for\s+\$?(\d+(?:,\d{3})*))?(?:\s+in\s+(\w+\s+\d{4}))?/i,
      // "Wedding in June 2025 costing $5000"
      /(?:wedding|party|event)\s+(?:in\s+(\w+\s+\d{4}))?(?:\s+costing\s+\$?(\d+(?:,\d{3})*))?/i,
      // "School semester starting September 2024 for $3000"
      /(?:school|education|semester|college)\s+(?:starting\s+(\w+\s+\d{4}))?(?:\s+for\s+\$?(\d+(?:,\d{3})*))?/i
    ]
    
    for (const pattern of patterns) {
      const match = line.match(pattern)
      if (match) {
        const [, item, date, cost] = match
        return {
          title: item || line,
          target_date: date ? parseDate(date) : getDefaultDate(),
          est_cost_usd: cost ? parseInt(cost.replace(/,/g, '')) : 1000,
          category: determineGoalCategory(item || line)
        }
      }
    }
    
    // If no pattern matches, create a basic goal
    return {
      title: line,
      target_date: getDefaultDate(),
      est_cost_usd: 1000,
      category: 'other'
    }
  }

  // Parse date string to YYYY-MM-DD format
  const parseDate = (dateStr) => {
    try {
      const date = new Date(dateStr)
      return date.toISOString().split('T')[0]
    } catch {
      return getDefaultDate()
    }
  }

  // Get default date (6 months from now)
  const getDefaultDate = () => {
    const date = new Date()
    date.setMonth(date.getMonth() + 6)
    return date.toISOString().split('T')[0]
  }

  // Handle natural language goals input
  const handleNaturalLanguageGoals = async () => {
    if (!formData.naturalLanguageGoals.trim()) return
    
    setLoading(true)
    try {
      const parsedGoals = await parseNaturalLanguageGoals(formData.naturalLanguageGoals)
      setFormData(prev => ({
        ...prev,
        goals: [...prev.goals, ...parsedGoals],
        naturalLanguageGoals: ''
      }))
    } catch (error) {
      console.error('Error parsing goals:', error)
      alert('Error parsing goals. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Welcome, {user.name}!</h2>
            <p className="text-gray-600">Let's set up your Chronos profile</p>
          </div>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step > stepNum ? 'bg-indigo-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Life Stage */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Tell us about your life stage</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Life Stage
                  </label>
                  <select
                    value={formData.lifeStage}
                    onChange={(e) => handleInputChange('lifeStage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select your life stage</option>
                    <option value="student">Student</option>
                    <option value="early_career">Early Career</option>
                    <option value="mid_career">Mid Career</option>
                    <option value="family">Family</option>
                    <option value="retirement">Retirement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status
                  </label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select marital status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Household Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.householdSize}
                    onChange={(e) => handleInputChange('householdSize', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Goals */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">What are your financial goals?</h3>
              
              {/* Natural Language Input */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-lg font-medium text-blue-900 mb-2">Tell us about your goals in your own words:</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Examples: "Trip to Paris in May 2025 for $2500", "Buy a laptop for $1200 in March", "Wedding in June 2025 costing $5000"
                </p>
                <div className="space-y-3">
                  <textarea
                    placeholder="I want to take a trip to Paris in May 2025 for $2500, buy a new laptop for $1200 in March, and plan a wedding in June 2025 costing $5000..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                    value={formData.naturalLanguageGoals}
                    onChange={(e) => setFormData(prev => ({ ...prev, naturalLanguageGoals: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={handleNaturalLanguageGoals}
                    disabled={loading || !formData.naturalLanguageGoals.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Parsing...' : 'Parse Goals'}
                  </button>
                </div>
              </div>

              {/* Manual Goal Entry */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Or add goals manually:</h4>
                <button
                  type="button"
                  onClick={handleGoalAdd}
                  className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-indigo-500 hover:text-indigo-500"
                >
                  + Add a Goal Manually
                </button>

                {formData.goals.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-900">Your Goals:</h4>
                    {formData.goals.map((goal, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                        <div>
                          <div className="font-medium text-green-900">{goal.title}</div>
                          <div className="text-sm text-green-700">
                            {goal.target_date} • ${goal.est_cost_usd} • {goal.category}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {goal.category}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeGoal(index)}
                            className="text-red-600 hover:text-red-500 px-2 py-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Transactions */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Upload your transaction data</h3>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    Upload a CSV file with your transaction history
                  </p>
                </div>

                <div className="text-sm text-gray-500">
                  <p>CSV format should include columns: date, amount, merchant, category, card_id</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Completing...' : 'Complete Setup'}
              </button>
            )}
          </div>
          
          {/* Skip button for testing */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                console.log('⏭️ Skipping onboarding for testing')
                onComplete()
              }}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Skip Onboarding (Demo)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
