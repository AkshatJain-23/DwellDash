require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  // If already connected, return the existing connection
  if (mongoose.connections[0].readyState) {
    console.log('Using existing MongoDB connection');
    return mongoose.connections[0];
  }

  const maxRetries = 3;
  let retryCount = 0;

  const atlasConnect = async () => {
    try {
      // Use environment variable for connection string
      const atlasURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dwelldash';
      
      if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI environment variable not found!');
        console.log('📝 Please set MONGODB_URI in your .env file or Vercel environment variables');
        throw new Error('MongoDB connection string not configured');
      }
      
      console.log(`🔄 Connecting to MongoDB Atlas... (Attempt ${retryCount + 1}/${maxRetries})`);
      console.log('🔗 Using connection string for:', process.env.MONGODB_URI.split('@')[1]?.split('/')[0] || 'localhost');
      console.log('👤 Username:', process.env.MONGODB_URI.split('://')[1]?.split(':')[0] || 'unknown');
      console.log('🗄️ Target Database:', process.env.MONGODB_URI.split('/').pop()?.split('?')[0] || 'dwelldash');
      
      // Serverless-optimized connection options
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000, // 10 seconds for serverless
        socketTimeoutMS: 45000, // 45 seconds for serverless
        connectTimeoutMS: 10000, // 10 seconds for serverless
        bufferCommands: false, // Disable mongoose buffering for serverless
        bufferMaxEntries: 0, // Disable mongoose buffering for serverless
        maxPoolSize: 1, // Maintain up to 1 socket connection for serverless
        minPoolSize: 0, // Maintain minimum 0 socket connections for serverless
        maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
        retryWrites: true,
        retryReads: true,
        heartbeatFrequencyMS: 30000, // Longer heartbeat for serverless
        // Add these for better Atlas compatibility
        ssl: true,
        authSource: 'admin',
      };

      // Ensure we're not trying to connect if already connected
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(atlasURI, options);
      }
      
      console.log('✅ MongoDB Atlas connected successfully!');
      console.log(`📊 Connected Database: ${mongoose.connection.db.databaseName}`);
      console.log(`🌐 Connected Host: ${mongoose.connection.host}`);
      console.log(`🔗 Connection State: ${mongoose.connection.readyState} (1=connected)`);
      
      // Debug: Check if we can list collections (but don't fail if we can't)
      try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`📁 Available Collections (${collections.length}): ${collections.map(c => c.name).join(', ') || 'None (empty database)'}`);
      } catch (listError) {
        console.log('⚠️ Could not list collections (this is OK in serverless):', listError.message);
      }
      
      return mongoose.connection;
      
    } catch (error) {
      console.error(`❌ MongoDB Atlas connection failed (Attempt ${retryCount + 1}):`, error.message);
      
      // Specific error handling with debugging
      if (error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) {
        console.error('🔧 DNS Resolution Issue:');
        console.error('   • Network/DNS cannot resolve MongoDB Atlas host');
        console.error('   • This often happens in serverless environments');
        console.error('   • Check if MongoDB Atlas cluster is running');
      } else if (error.message.includes('authentication') || error.message.includes('auth')) {
        console.error('🔧 Authentication Issue:');
        console.error('   • Check if username and password are correct');
        console.error('   • Verify user exists in MongoDB Atlas');
        console.error('   • Ensure MONGODB_URI is properly formatted');
        console.error('   • Check if database user has correct permissions');
      } else if (error.message.includes('timeout') || error.message.includes('timed out')) {
        console.error('🔧 Timeout Issue:');
        console.error('   • Network connection too slow for serverless');
        console.error('   • Try increasing timeout values');
        console.error('   • Check MongoDB Atlas cluster location');
      } else if (error.message.includes('IP') || error.message.includes('whitelist') || error.message.includes('not allowed')) {
        console.error('🔧 IP Whitelist Issue (VERY COMMON IN VERCEL):');
        console.error('   • Vercel uses dynamic IPs that change constantly');
        console.error('   • Go to MongoDB Atlas → Network Access');
        console.error('   • Add IP Address: 0.0.0.0/0 (Allow access from anywhere)');
        console.error('   • This is required for Vercel serverless functions');
      } else if (error.message.includes('buffering timed out')) {
        console.error('🔧 Buffering Issue:');
        console.error('   • Mongoose buffering disabled for serverless');
        console.error('   • Connection might be taking too long to establish');
      } else {
        console.error('🔧 Unknown Issue:');
        console.error('   • Full error details:', error);
        console.error('   • Error name:', error.name);
        console.error('   • Error code:', error.code);
      }
      
      retryCount++;
      
      if (retryCount < maxRetries) {
        const delay = Math.min(retryCount * 2000, 5000); // Cap at 5 seconds
        console.log(`⏳ Retrying in ${delay/1000} seconds...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return await atlasConnect();
      } else {
        throw error;
      }
    }
  };

  try {
    const connection = await atlasConnect();
    
    // Connection event handlers (only add once)
    if (!mongoose.connection._events || !mongoose.connection._events.error) {
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB Atlas error:', err.message);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB Atlas disconnected');
        // Don't auto-reconnect in serverless - let next request handle it
      });

      mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB Atlas reconnected successfully');
      });

      mongoose.connection.on('close', () => {
        console.log('🔌 MongoDB Atlas connection closed');
      });
    }

    return connection;

  } catch (finalError) {
    console.error('\n❌ Failed to connect to MongoDB Atlas after all attempts');
    console.error('Final error:', finalError.message);
    
    console.log('\n🔧 DEBUG INFORMATION:');
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('Platform:', process.env.VERCEL ? 'Vercel' : 'Local');
    console.log('Connection String: [Hidden for security]');
    console.log('Expected Database: dwelldash');
    
    console.log('\n🔧 VERCEL-SPECIFIC TROUBLESHOOTING:');
    console.log('1. ✅ Verify MONGODB_URI environment variable is set in Vercel');
    console.log('2. ✅ Check Network Access (IP whitelist) in Atlas - MUST allow 0.0.0.0/0');
    console.log('3. ✅ Verify username/password in Atlas Database Access');
    console.log('4. ✅ Ensure Atlas cluster is not paused');
    console.log('5. ✅ Check Vercel function logs for detailed errors');
    
    // In serverless, we want to throw the error so the function fails gracefully
    // Instead of setting a flag like in local development
    if (process.env.VERCEL) {
      throw finalError;
    } else {
      // For local development, set the flag
      process.env.MONGODB_CONNECTION_FAILED = 'true';
    }
  }
};

module.exports = connectDB; 