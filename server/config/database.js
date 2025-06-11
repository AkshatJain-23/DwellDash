require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  // If already connected, return the existing connection
  if (mongoose.connections[0].readyState) {
    console.log('✅ Using existing local MongoDB connection');
    return mongoose.connections[0];
  }

  try {
    // MongoDB connection string - supports both local and cloud
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dwelldash';
    
    // Determine if we're connecting to local or cloud MongoDB
    const isLocal = mongoURI.includes('localhost') || mongoURI.includes('127.0.0.1');
    const connectionType = isLocal ? 'Local' : 'Cloud';
    
    console.log('🏠 Database:', mongoURI.split('/').pop()?.split('?')[0] || 'dwelldash');
    if (isLocal) {
      console.log('🖥️  Host: localhost:27017');
    }
    
    // Optimized connection options for local MongoDB
    const options = {
      serverSelectionTimeoutMS: 5000,   // 5 seconds (faster for local)
      socketTimeoutMS: 30000,           // 30 seconds
      connectTimeoutMS: 5000,           // 5 seconds (faster for local)
      maxPoolSize: 10,                  // Connection pool size
      minPoolSize: 0,                   // Minimum connections
      maxIdleTimeMS: 30000,             // Close connections after 30 seconds
      heartbeatFrequencyMS: 10000,      // Check connection every 10 seconds
    };

    // Connect to MongoDB
    await mongoose.connect(mongoURI, options);
    
    console.log(`✅ ${connectionType} MongoDB connected successfully!`);
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`🌐 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
    console.log(`🔗 Connection State: ${mongoose.connection.readyState} (1=connected)`);
    
    // List collections for verification
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log(`📁 Collections (${collections.length}): ${collections.map(c => c.name).join(', ') || 'None'}`);
    } catch (listError) {
      console.log('⚠️  Could not list collections:', listError.message);
    }
    
    // Setup connection event handlers
    setupConnectionHandlers();
    
    return mongoose.connection;
    
  } catch (error) {
    console.error('❌ Local MongoDB connection failed:', error.message);
    
    // Provide specific help for local MongoDB issues
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n🔧 Connection Refused - MongoDB Service Issues:');
      console.error('   • MongoDB service is not running');
      console.error('   • Run: Get-Service MongoDB (to check status)');
      console.error('   • Run: Start-Service MongoDB (to start service)');
      console.error('   • Default port 27017 might be blocked');
    } else if (error.message.includes('timeout')) {
      console.error('\n🔧 Timeout Issue:');
      console.error('   • MongoDB service might be starting up');
      console.error('   • Check if MongoDB is installed correctly');
      console.error('   • Verify MongoDB is listening on port 27017');
    } else {
      console.error('\n🔧 Unknown Local MongoDB Issue:');
      console.error('   • Full error:', error.message);
      console.error('   • Check if MongoDB Community Server is installed');
      console.error('   • Verify MongoDB service is running');
    }
    
    throw error;
  }
};

function setupConnectionHandlers() {
  // Only setup handlers once
  if (mongoose.connection._eventSetup) return;
  
  mongoose.connection.on('error', (err) => {
    console.error('❌ Local MongoDB error:', err.message);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('⚠️  Local MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('✅ Local MongoDB reconnected successfully');
  });

  mongoose.connection.on('close', () => {
    console.log('🔌 Local MongoDB connection closed');
  });
  
  mongoose.connection._eventSetup = true;
}

module.exports = connectDB; 