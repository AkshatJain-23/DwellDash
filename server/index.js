const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// MongoDB connection
const connectDB = require('./config/database');

// Connect to database with error handling
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('🔧 Check your MONGODB_URI environment variable');
    process.exit(1);
  }
};

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/users', require('./routes/users'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/support', require('./routes/support'));

// Health check endpoints
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'PGFinder API is running successfully!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint for Railway health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'DwellDash API Server', 
    status: 'running',
    endpoints: ['/api/health', '/api/auth', '/api/properties']
  });
});

// Handle React routing - serve index.html for all non-API routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server after database connection
startServer().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API available at: ${process.env.NODE_ENV === 'production' ? 'https://your-app.railway.app' : `http://localhost:${PORT}`}/api`);
    console.log(`❤️  Health check: /api/health`);
    
    if (process.env.NODE_ENV === 'production') {
      console.log(`📁 Frontend served from: ${path.join(__dirname, '../client/dist')}`);
    }
  });
}); 