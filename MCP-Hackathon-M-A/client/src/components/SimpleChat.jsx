import React, { useState } from 'react'
import axios from 'axios'

const SimpleChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: "Hi! I'm Chronos. Ask me about credit cards!" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage = { id: Date.now(), type: 'user', text: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      console.log('Sending message:', input)
      const response = await axios.post('/api/chat/message', {
        message: input,
        user_id: 'demo_user_123'
      })
      
      console.log('Response:', response.data)
      
      // Add bot response
      const botMessage = { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: response.data.response || 'Sorry, I had trouble responding.' 
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: 'Sorry, there was an error. Please try again.' 
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: '#333',
        marginBottom: '30px',
        fontSize: '2rem'
      }}>
        🚀 Chronos Chat - WORKING!
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px',
        minHeight: '400px',
        border: '2px solid #ddd'
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            marginBottom: '15px',
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: msg.type === 'user' ? '#007bff' : '#e9ecef',
            color: msg.type === 'user' ? 'white' : 'black',
            marginLeft: msg.type === 'user' ? '50px' : '0',
            marginRight: msg.type === 'user' ? '0' : '50px'
          }}>
            <strong>{msg.type === 'user' ? 'You' : 'Chronos'}:</strong> {msg.text}
          </div>
        ))}
        
        {loading && (
          <div style={{
            padding: '10px',
            backgroundColor: '#e9ecef',
            borderRadius: '8px',
            color: '#666'
          }}>
            Chronos is thinking...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about credit cards..."
          style={{
            flex: 1,
            padding: '12px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            fontSize: '16px'
          }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            opacity: loading || !input.trim() ? 0.5 : 1
          }}
        >
          Send
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={() => setInput('When should I apply for a credit card?')}
          style={{
            margin: '5px',
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test: When to apply
        </button>
        <button
          onClick={() => setInput('Which card should I choose?')}
          style={{
            margin: '5px',
            padding: '8px 16px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test: Which card
        </button>
        <button
          onClick={() => setInput('Plan my Paris trip')}
          style={{
            margin: '5px',
            padding: '8px 16px',
            backgroundColor: '#6f42c1',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test: Paris trip
        </button>
      </div>
    </div>
  )
}

export default SimpleChat
