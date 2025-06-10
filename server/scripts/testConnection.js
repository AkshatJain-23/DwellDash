const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('🔗 Testing MongoDB Atlas connection...');
    
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      console.log('📝 Please create a .env file in the server directory with your MongoDB Atlas connection string');
      return;
    }

    if (process.env.MONGODB_URI.includes('your_mongodb_atlas_connection_string_here')) {
      console.error('❌ Please update MONGODB_URI in .env with your actual MongoDB Atlas connection string');
      console.log('🔗 Your connection string should look like:');
      console.log('   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dwelldash?retryWrites=true&w=majority');
      return;
    }

    // Attempt connection
    console.log('📡 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📁 Collections found: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('📋 Existing collections:');
      collections.forEach(col => console.log(`   - ${col.name}`));
    }

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('🔐 Authentication issue - check your username/password');
    } else if (error.message.includes('network timeout')) {
      console.log('🌐 Network issue - check your internet connection');
    } else if (error.message.includes('not authorized')) {
      console.log('🔒 Authorization issue - check database permissions');
    }
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
};

// Run test
testConnection().then(() => {
  console.log('🏁 Connection test completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Test failed:', error);
  process.exit(1);
}); 