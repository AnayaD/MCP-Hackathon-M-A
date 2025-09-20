import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { demoMissedRewards, demoGoals, demoTransactions } from '../data/demoData'

const Dashboard = ({ user }) => {
  const [missedRewards, setMissedRewards] = useState(null)
  const [goals, setGoals] = useState(demoGoals)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    console.log('🔍 Dashboard fetchDashboardData called with user:', user)
    
    // Always start with demo data for immediate display
    setMissedRewards(demoMissedRewards)
    setGoals(demoGoals)
    
    if (!user || !user.id) {
      console.error('❌ No user or user.id found:', user)
      setLoading(false)
      return
    }

    try {
      console.log('📡 Fetching missed rewards for user:', user.id)
      // Fetch missed rewards calculation
      const rewardsResponse = await axios.post('/api/data/calculate-rewards', {
        user_id: user.id,
        lookback_months: 12
      })

      console.log('✅ Rewards response:', rewardsResponse.data)
      if (rewardsResponse.data.success && rewardsResponse.data.calculation.total_transactions > 0) {
        setMissedRewards(rewardsResponse.data.calculation)
      }
      // Keep demo data if no real transactions

      console.log('📡 Fetching goals for user:', user.id)
      // Fetch goals
      const goalsResponse = await axios.get(`/api/data/goals/${user.id}`)
      console.log('✅ Goals response:', goalsResponse.data)
      if (goalsResponse.data.success && goalsResponse.data.goals.length > 0) {
        setGoals(goalsResponse.data.goals)
      }
      // Keep demo goals if no real goals
    } catch (error) {
      console.error('Dashboard data fetch error:', error)
      // Demo data is already set, so just continue
    } finally {
      setLoading(false)
    }
  }

  const handleUploadCSV = () => {
    console.log('📁 Upload CSV clicked')
    // Create a file input element
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        console.log('📁 File selected:', file.name)
        // Here you would typically upload the file
        alert(`File "${file.name}" selected! Upload functionality would be implemented here.`)
      }
    }
    input.click()
  }

  const handleAddGoal = () => {
    console.log('🎯 Add Goal clicked')
    // For demo purposes, create a sample goal
    const newGoal = {
      goal_id: `goal_${Date.now()}`,
      title: 'Trip to Paris',
      target_date: '2025-05-15',
      est_cost_usd: 2500,
      status: 'active'
    }
    
    setGoals(prev => [...prev, newGoal])
    alert('Sample goal added: Trip to Paris!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chronos Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/simple-chat"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Start Planning
              </Link>
              <Link
                to="/simple-chat"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                🚀 Direct Chat
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Rearview Analysis */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rearview Analysis</h2>
            
            {missedRewards ? (
              <div className="space-y-4">
                <div className="text-center p-6 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">
                    ${missedRewards.missed_usd_total.toFixed(2)}
                  </div>
                  <div className="text-red-800 font-medium">
                    You missed out on rewards last year
                  </div>
                </div>

                {missedRewards.evidence && missedRewards.evidence.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-900">All missed opportunities:</h3>
                      <span className="text-sm text-gray-500">
                        {missedRewards.total_transactions} transactions analyzed
                      </span>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {missedRewards.evidence.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{item.transaction.merchant}</div>
                            <div className="text-sm text-gray-600">
                              {item.transaction.category} • ${item.transaction.amount} • {item.transaction.date}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {item.reason}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="font-medium text-red-600">
                              -${item.missed_usd.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.best_card.name}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Summary by category */}
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Breakdown by Category:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(
                          missedRewards.evidence.reduce((acc, item) => {
                            const category = item.transaction.category
                            acc[category] = (acc[category] || 0) + item.missed_usd
                            return acc
                          }, {})
                        ).map(([category, amount]) => (
                          <div key={category} className="flex justify-between">
                            <span className="capitalize">{category}:</span>
                            <span className="font-medium text-red-600">-${amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No transaction data available. Upload your transactions to see analysis.
              </div>
            )}
          </div>
        </div>

        {/* Credit Card Recommendations */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Credit Cards</h2>
            <p className="text-gray-600 mb-6">Based on your spending patterns, these cards could maximize your rewards:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900">American Express Gold Card</h3>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">4x Dining</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sign-up Bonus:</span>
                    <span className="font-medium">60,000 points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Spend:</span>
                    <span>$4,000 in 6 months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Fee:</span>
                    <span>$250</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Potential Savings:</span>
                    <span className="font-medium text-green-600">$450/year</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm">
                  Apply Now
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900">Chase Sapphire Preferred</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">2x Travel</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sign-up Bonus:</span>
                    <span className="font-medium">80,000 points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Spend:</span>
                    <span>$4,000 in 3 months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Fee:</span>
                    <span>$95</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Potential Savings:</span>
                    <span className="font-medium text-green-600">$320/year</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm">
                  Apply Now
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900">Capital One Venture</h3>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">2x Everything</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sign-up Bonus:</span>
                    <span className="font-medium">75,000 points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Spend:</span>
                    <span>$4,000 in 3 months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Fee:</span>
                    <span>$95</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Potential Savings:</span>
                    <span className="font-medium text-green-600">$480/year</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Goals</h2>
            
            {goals.length > 0 ? (
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.goal_id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{goal.title}</h3>
                        <p className="text-sm text-gray-600">
                          Target: {goal.target_date} • Cost: ${goal.est_cost_usd}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No goals set yet. Add a goal to start planning.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium text-gray-900 mb-2">Upload Transactions</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload your transaction history to get personalized analysis
            </p>
            <button 
              onClick={handleUploadCSV}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Upload CSV
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium text-gray-900 mb-2">Add Goal</h3>
            <p className="text-sm text-gray-600 mb-4">
              Set a new financial goal to optimize your credit card strategy
            </p>
            <button 
              onClick={handleAddGoal}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Add Goal
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium text-gray-900 mb-2">Start Planning</h3>
            <p className="text-sm text-gray-600 mb-4">
              Chat with Chronos to create your personalized credit card strategy
            </p>
            <Link
              to="/simple-chat"
              className="block w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 text-center"
            >
              Start Chat
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
