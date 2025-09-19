import React, { useState } from 'react'
import axios from 'axios'

const TestLogin = () => {
  const [email, setEmail] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult('')
    
    try {
      console.log('🧪 Testing login with email:', email)
      const response = await axios.post('/api/auth/login', { email })
      console.log('✅ Test response:', response.data)
      setResult(JSON.stringify(response.data, null, 2))
    } catch (error) {
      console.error('❌ Test error:', error)
      setResult(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Test Login
          </h2>
        </div>
        
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          
          <button
            onClick={testLogin}
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Login'}
          </button>
          
          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <h3 className="font-bold">Result:</h3>
              <pre className="text-sm">{result}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TestLogin
