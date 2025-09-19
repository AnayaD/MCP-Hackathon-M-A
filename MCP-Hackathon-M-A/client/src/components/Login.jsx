import React, { useState } from 'react'
import axios from 'axios'

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('🔍 Login form submitted with email:', email)
    setLoading(true)
    setError('')

    try {
      console.log('📡 Making API call to /api/auth/login')
      const response = await axios.post('/api/auth/login', { email })
      console.log('✅ API response:', response.data)
      
      if (response.data.success) {
        console.log('🎉 Login successful, calling onLogin with:', response.data.user)
        onLogin(response.data.user)
      } else {
        console.log('❌ Login failed - success was false')
        setError('Login failed')
      }
    } catch (err) {
      console.error('❌ Login error:', err)
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Chronos
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your AI-powered credit card optimization platform
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                console.log('📧 Email input changed to:', e.target.value)
                setEmail(e.target.value)
              }}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              onClick={() => console.log('🔘 Sign in button clicked')}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Demo Mode: Enter any email to continue
            </p>
            <button
              type="button"
              onClick={() => {
                console.log('🧪 Test button clicked')
                setEmail('test@example.com')
                console.log('📧 Email set to:', 'test@example.com')
              }}
              className="mt-2 px-4 py-2 bg-gray-500 text-white rounded text-sm"
            >
              Test: Set Email
            </button>
            <button
              type="button"
              onClick={() => {
                console.log('🧪 Manual redirect test')
                const testUser = { id: 'test123', email: 'test@example.com', name: 'Test User' }
                onLogin(testUser)
              }}
              className="mt-2 ml-2 px-4 py-2 bg-green-500 text-white rounded text-sm"
            >
              Test: Manual Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
