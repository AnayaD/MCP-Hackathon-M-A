import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import Onboarding from './components/Onboarding'
import Dashboard from './components/Dashboard'
import Chat from './components/Chat'
import TestLogin from './components/TestLogin'
import ChatTest from './components/ChatTest'
import './App.css'

// Wrapper component to handle redirects
function AppContent({ user, onboardingComplete, onLogin, onOnboardingComplete }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      console.log('🔄 User logged in, checking redirect...')
      if (onboardingComplete) {
        console.log('🔄 Redirecting to /dashboard')
        navigate('/dashboard', { replace: true })
      } else {
        console.log('🔄 Redirecting to /onboarding')
        navigate('/onboarding', { replace: true })
      }
    }
  }, [user, onboardingComplete, navigate])

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          user ? (
            onboardingComplete ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/onboarding" replace />
            )
          ) : (
            <Login onLogin={onLogin} />
          )
        } 
      />
      <Route 
        path="/login" 
        element={<Login onLogin={onLogin} />} 
      />
      <Route 
        path="/onboarding" 
        element={
          user ? (
            <Onboarding 
              user={user} 
              onComplete={onOnboardingComplete} 
            />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          user && onboardingComplete ? (
            <Dashboard user={user} />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/chat" 
        element={
          user ? (
            <Chat user={user} />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/test" 
        element={<TestLogin />} 
      />
      <Route 
        path="/chat-test" 
        element={<ChatTest />} 
      />
    </Routes>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [onboardingComplete, setOnboardingComplete] = useState(false)

  console.log('🔍 App render - user:', user, 'onboardingComplete:', onboardingComplete)

  const handleLogin = (userData) => {
    console.log('🚀 handleLogin called with:', userData)
    setUser(userData)
    console.log('✅ User state updated')
  }

  const handleOnboardingComplete = () => {
    console.log('🎯 Onboarding completed!')
    setOnboardingComplete(true)
    console.log('✅ Onboarding state updated to true')
  }

  return (
    <Router>
      <div className="App">
        <AppContent 
          user={user}
          onboardingComplete={onboardingComplete}
          onLogin={handleLogin}
          onOnboardingComplete={handleOnboardingComplete}
        />
      </div>
    </Router>
  )
}

export default App
