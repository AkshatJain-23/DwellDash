const mongoose = require('mongoose');
require('dotenv').config();

const finalTest = async () => {
  try {
    console.log('🔗 Final MongoDB Atlas Connection Test');
    console.log('=====================================');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found');
      return;
    }

    console.log('📡 Attempting connection...');
    console.log('👤 Username: akshatt23');
    console.log('🌐 Cluster: cluster0.px1ra7o.mongodb.net');
    console.log('🗄️ Database: dwelldash');
    
    // Set connection options for more detailed error reporting
    const options = {
      authSource: 'admin',
      retryWrites: true,
      w: 'majority'
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log('✅ SUCCESS! Connected to MongoDB Atlas!');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📁 Collections: ${collections.length}`);
    
    // Test creating a simple document
    const testCollection = mongoose.connection.db.collection('connectionTest');
    const testDoc = await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'MongoDB Atlas connection successful!' 
    });
    console.log('✅ Test document created successfully');
    
    // Clean up test document
    await testCollection.deleteOne({ _id: testDoc.insertedId });
    console.log('🧹 Test document cleaned up');

  } catch (error) {
    console.error('❌ Connection Failed:');
    console.error('Error Type:', error.name);
    console.error('Error Message:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔐 Authentication Issue Detected:');
      console.log('1. ✅ Username is correct: akshatt23');
      console.log('2. ❓ Password might be incorrect');
      console.log('3. 💡 Solutions:');
      console.log('   - Go to MongoDB Atlas → Database Access');
      console.log('   - Click "Edit" on user akshatt23');
      console.log('   - Click "Edit Password"');
      console.log('   - Set a new simple password (like "newpassword123")');
      console.log('   - Update your .env file with the new password');
    } else if (error.message.includes('network')) {
      console.log('\n🌐 Network Issue:');
      console.log('Check your internet connection and MongoDB Atlas network access');
    } else {
      console.log('\n🐛 Unexpected Error:');
      console.log('This might be a different configuration issue');
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
  }
};

finalTest().then(() => {
  console.log('🏁 Test completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Test script error:', error);
  process.exit(1);
}); 