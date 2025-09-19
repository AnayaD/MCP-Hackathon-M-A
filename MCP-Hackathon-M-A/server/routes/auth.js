const express = require('express');
const router = express.Router();

// Mock authentication routes for demo
// In production, these would integrate with Stytch

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Mock user creation/login
    const user = {
      id: 'demo_user_123',
      email: email,
      name: 'Demo User',
      created_at: new Date().toISOString()
    };

    res.json({
      success: true,
      user: user,
      message: 'Login successful (demo mode)'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Logout successful' 
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  // Mock user data for demo
  const user = {
    id: 'demo_user_123',
    email: 'demo@chronos.com',
    name: 'Demo User',
    created_at: new Date().toISOString()
  };

  res.json({ user });
});

module.exports = router;
