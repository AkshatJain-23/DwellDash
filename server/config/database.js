require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  const maxRetries = 3;
  let retryCount = 0;

  const atlasConnect = async () => {
    try {
      // Use the exact connection string provided
      const atlasURI = 'mongodb+srv://akshatt23:AkshatJain2003@cluster0.px1ra7o.mongodb.net/dwelldash?retryWrites=true&w=majority&appName=Cluster0';
      
      console.log(`🔄 Connecting to MongoDB Atlas... (Attempt ${retryCount + 1}/${maxRetries})`);
      console.log('🔗 Using connection string for: cluster0.px1ra7o.mongodb.net');
      console.log('👤 Username: akshatt23');
      console.log('🗄️ Target Database: dwelldash');
      
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000, // 30 seconds
        socketTimeoutMS: 75000, // 75 seconds
        connectTimeoutMS: 30000, // 30 seconds
        bufferCommands: false,
        maxPoolSize: 10,
        minPoolSize: 5,
        retryWrites: true,
        retryReads: true,
        heartbeatFrequencyMS: 10000,
      };

      await mongoose.connect(atlasURI, options);
      
      console.log('✅ MongoDB Atlas connected successfully!');
      console.log(`📊 Connected Database: ${mongoose.connection.db.databaseName}`);
      console.log(`🌐 Connected Host: ${mongoose.connection.host}`);
      console.log(`🔗 Connection State: ${mongoose.connection.readyState} (1=connected)`);
      
      // Debug: Check if we can list collections
      try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`📁 Available Collections (${collections.length}): ${collections.map(c => c.name).join(', ') || 'None (empty database)'}`);
      } catch (listError) {
        console.log('⚠️ Could not list collections:', listError.message);
      }
      
      return true;
      
    } catch (error) {
      console.error(`❌ MongoDB Atlas connection failed (Attempt ${retryCount + 1}):`, error.message);
      
      // Specific error handling with debugging
      if (error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) {
        console.error('🔧 DNS Resolution Issue:');
        console.error('   • Network/DNS cannot resolve cluster0.px1ra7o.mongodb.net');
        console.error('   • Try switching to mobile hotspot');
        console.error('   • Check if network blocks MongoDB Atlas');
      } else if (error.message.includes('authentication') || error.message.includes('auth')) {
        console.error('🔧 Authentication Issue:');
        console.error('   • Username: akshatt23');
        console.error('   • Check if password is correct: AkshatJain2003');
        console.error('   • Verify user exists in MongoDB Atlas');
      } else if (error.message.includes('timeout')) {
        console.error('🔧 Timeout Issue:');
        console.error('   • Network connection too slow');
        console.error('   • Try again with better internet connection');
      } else if (error.message.includes('IP') || error.message.includes('whitelist')) {
        console.error('🔧 IP Whitelist Issue:');
        console.error('   • Current IP needs to be added to Atlas Network Access');
        console.error('   • Check MongoDB Atlas Network Access settings');
      } else {
        console.error('🔧 Unknown Issue:');
        console.error('   • Full error details:', error);
      }
      
      retryCount++;
      
      if (retryCount < maxRetries) {
        const delay = retryCount * 5000; // Exponential backoff
        console.log(`⏳ Retrying in ${delay/1000} seconds...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return await atlasConnect();
      } else {
        throw error;
      }
    }
  };

  try {
    await atlasConnect();
    
    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Atlas error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB Atlas disconnected');
      console.log('🔄 Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB Atlas reconnected successfully');
    });

    mongoose.connection.on('close', () => {
      console.log('🔌 MongoDB Atlas connection closed');
    });

  } catch (finalError) {
    console.error('\n❌ Failed to connect to MongoDB Atlas after all attempts');
    console.error('Final error:', finalError.message);
    
    console.log('\n🔧 DEBUG INFORMATION:');
    console.log('Connection String: mongodb+srv://akshatt23:***@cluster0.px1ra7o.mongodb.net/dwelldash');
    console.log('Expected Database: dwelldash');
    console.log('Expected Username: akshatt23');
    
    console.log('\n🔧 TROUBLESHOOTING STEPS:');
    console.log('1. Verify MongoDB Atlas cluster is running');
    console.log('2. Check Network Access (IP whitelist) in Atlas');
    console.log('3. Verify username/password in Atlas Database Access');
    console.log('4. Try switching to mobile hotspot/different network');
    console.log('5. Check if firewall blocks MongoDB Atlas connections');
    
    // Don't exit process, but set a flag for the app to handle
    process.env.MONGODB_CONNECTION_FAILED = 'true';
  }
};

module.exports = connectDB; 