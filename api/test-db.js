// Vercel serverless function to test MongoDB connection
require('dotenv').config();

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('🔄 Testing MongoDB connection in Vercel...');
    
    // Test environment variables
    const hasMongoURI = !!process.env.MONGODB_URI;
    const mongoURIPreview = process.env.MONGODB_URI ? 
      `${process.env.MONGODB_URI.substring(0, 20)}...${process.env.MONGODB_URI.slice(-20)}` : 
      'Not set';
    
    console.log('📋 Environment Check:');
    console.log('- MONGODB_URI exists:', hasMongoURI);
    console.log('- MONGODB_URI preview:', mongoURIPreview);
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- VERCEL:', process.env.VERCEL);
    
    if (!hasMongoURI) {
      return res.status(500).json({
        success: false,
        error: 'MONGODB_URI environment variable not set',
        debug: {
          environment: process.env.NODE_ENV,
          platform: process.env.VERCEL ? 'Vercel' : 'Local',
          mongoURIExists: hasMongoURI
        }
      });
    }

    // Direct MongoDB connection test using mongoose
    const mongoose = require('mongoose');
    
    // Attempt connection
    console.log('🔗 Attempting connection...');
    const startTime = Date.now();
    
    // Serverless-optimized connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      bufferCommands: false,
      bufferMaxEntries: 0,
      maxPoolSize: 1,
      minPoolSize: 0,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      retryReads: true,
      heartbeatFrequencyMS: 30000,
      ssl: true,
      authSource: 'admin',
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    
    const connectionTime = Date.now() - startTime;
    console.log(`✅ Connection successful in ${connectionTime}ms`);
    
    // Test database operations
    const dbName = mongoose.connection.db.databaseName;
    const collections = await mongoose.connection.db.listCollections().toArray();
    const connectionState = mongoose.connection.readyState;
    
    console.log('📊 Database info:');
    console.log('- Database name:', dbName);
    console.log('- Collections count:', collections.length);
    console.log('- Connection state:', connectionState);
    
    // Close connection after test
    await mongoose.disconnect();
    
    res.status(200).json({
      success: true,
      message: 'MongoDB Atlas connection successful!',
      connectionTime: `${connectionTime}ms`,
      database: {
        name: dbName,
        collections: collections.map(c => c.name),
        collectionsCount: collections.length,
        connectionState: connectionState
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        platform: process.env.VERCEL ? 'Vercel' : 'Local',
        mongoURIExists: hasMongoURI
      }
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    
    const errorInfo = {
      message: error.message,
      name: error.name,
      code: error.code,
      codeName: error.codeName
    };
    
    // Analyze error type
    let errorType = 'Unknown';
    let suggestion = 'Check Vercel function logs for more details';
    
    if (error.message.includes('IP') || error.message.includes('not allowed') || error.message.includes('whitelist')) {
      errorType = 'IP Whitelist Issue';
      suggestion = 'Add 0.0.0.0/0 to MongoDB Atlas Network Access';
    } else if (error.message.includes('authentication') || error.message.includes('auth')) {
      errorType = 'Authentication Issue';
      suggestion = 'Check MongoDB Atlas username/password and database permissions';
    } else if (error.message.includes('timeout') || error.message.includes('timed out')) {
      errorType = 'Timeout Issue';
      suggestion = 'MongoDB Atlas cluster might be slow or paused';
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) {
      errorType = 'DNS/Network Issue';
      suggestion = 'Check if MongoDB Atlas cluster is running and accessible';
    }
    
    res.status(500).json({
      success: false,
      error: errorInfo,
      errorType,
      suggestion,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        platform: process.env.VERCEL ? 'Vercel' : 'Local',
        mongoURIExists: !!process.env.MONGODB_URI
      },
      troubleshooting: [
        'Check Vercel Environment Variables (Settings → Environment Variables)',
        'Ensure MONGODB_URI is set correctly',
        'Add 0.0.0.0/0 to MongoDB Atlas Network Access',
        'Verify MongoDB Atlas cluster is not paused',
        'Check MongoDB Atlas Database Access permissions'
      ]
    });
  }
}; 