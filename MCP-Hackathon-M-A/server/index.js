const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth');
const mcpRoutes = require('./routes/mcp');
const dataRoutes = require('./routes/data');
const servicesRoutes = require('./routes/services');
const chatRoutes = require('./routes/chat');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mcp', mcpRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize services on startup
async function initializeServices() {
  console.log('🔧 Initializing external services...');
  
  try {
            // Import services
            const redisService = require('./services/redis');
            const sensoService = require('./services/senso');
            const brightDataService = require('./services/brightdata');
            const llamaIndexService = require('./services/llamaindex');
            const llmService = require('./services/llm');

    // Initialize services
    const results = {
      redis: await redisService.connect(),
      senso: await sensoService.initialize(),
      brightdata: await brightDataService.initialize(),
      llamaindex: await llamaIndexService.initialize(),
      llm: await llmService.initialize()
    };

    const successCount = Object.values(results).filter(Boolean).length;
    const totalCount = Object.keys(results).length;
    
    console.log(`✅ ${successCount}/${totalCount} services initialized successfully`);
    
    if (successCount < totalCount) {
      console.log('⚠️  Some services failed to initialize - running in demo mode');
    }
  } catch (error) {
    console.error('❌ Service initialization failed:', error.message);
    console.log('⚠️  Running in demo mode');
  }
}

app.listen(PORT, async () => {
  console.log(`🚀 Chronos server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Initialize services
  await initializeServices();
});

module.exports = app;
