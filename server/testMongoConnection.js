require('dotenv').config();
const mongoose = require('mongoose');

async function testMongoConnection() {
  try {
    console.log('🔄 Testing MongoDB Atlas Connection...');
    console.log('=====================================');
    
    // Log connection details (without password)
    const uri = process.env.MONGODB_URI;
    if (uri) {
      const uriParts = uri.split('@');
      if (uriParts.length > 1) {
        const hostPart = uriParts[1];
        const username = uriParts[0].split('//')[1].split(':')[0];
        console.log(`📡 Connecting to: ${hostPart}`);
        console.log(`👤 Username: ${username}`);
      }
    } else {
      console.log('❌ No MONGODB_URI found in environment variables');
      return;
    }
    
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test database operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`📚 Found ${collections.length} collections:`);
    collections.forEach((col, index) => {
      console.log(`   ${index + 1}. ${col.name}`);
    });
    
    // Test a simple query
    try {
      const User = require('./models/User');
      const userCount = await User.countDocuments();
      console.log(`👥 Total users in database: ${userCount}`);
    } catch (error) {
      console.log('⚠️ Could not count users:', error.message);
    }
    
    // Test connection state
    console.log(`🔗 Connection state: ${mongoose.connection.readyState}`);
    console.log('   0 = disconnected');
    console.log('   1 = connected');
    console.log('   2 = connecting');
    console.log('   3 = disconnecting');
    
    console.log('\n✅ MongoDB Atlas connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔑 Authentication Issue:');
      console.log('   - Check username and password in MONGODB_URI');
      console.log('   - Verify database user has correct permissions');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n🌐 Network Issue:');
      console.log('   - Check internet connection');
      console.log('   - Verify MongoDB Atlas cluster is running');
    } else if (error.message.includes('IP')) {
      console.log('\n🔒 IP Whitelist Issue:');
      console.log('   - Add your IP to MongoDB Atlas IP whitelist');
      console.log('   - Or allow access from anywhere (0.0.0.0/0)');
    }
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('📡 Disconnected from MongoDB Atlas');
    }
  }
}

testMongoConnection(); 