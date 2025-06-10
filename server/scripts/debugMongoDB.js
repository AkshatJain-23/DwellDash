const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 MongoDB Connection Debug - Starting Analysis...\n');

// Step 1: Environment Variables Check
console.log('📋 STEP 1: Environment Variables');
console.log('================================');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('PORT:', process.env.PORT || 'Not set');
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');

if (process.env.MONGODB_URI) {
  const uri = process.env.MONGODB_URI;
  console.log('\n🔗 Connection String Analysis:');
  console.log('Length:', uri.length);
  console.log('Starts with mongodb+srv:', uri.startsWith('mongodb+srv://'));
  
  // Parse connection string safely
  try {
    const url = new URL(uri);
    console.log('Protocol:', url.protocol);
    console.log('Username:', url.username);
    console.log('Password length:', url.password ? url.password.length : 0);
    console.log('Password preview:', url.password ? url.password.substring(0, 3) + '***' : 'None');
    console.log('Hostname:', url.hostname);
    console.log('Database:', url.pathname.substring(1));
    console.log('Search params:', url.search);
  } catch (error) {
    console.log('❌ Invalid URL format:', error.message);
  }
} else {
  console.log('❌ MONGODB_URI not found!');
}

// Step 2: Connection Test with Detailed Logging
console.log('\n📡 STEP 2: Connection Test');
console.log('===========================');

const debugConnection = async () => {
  if (!process.env.MONGODB_URI) {
    console.log('❌ Cannot test - MONGODB_URI missing');
    return;
  }

  // Enable mongoose debugging
  mongoose.set('debug', true);
  
  console.log('🔄 Attempting connection...');
  console.log('Timestamp:', new Date().toISOString());
  
  try {
    // Connection options with timeouts
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    };
    
    console.log('⚙️ Connection options:', JSON.stringify(options, null, 2));
    
    // Add connection event listeners for detailed debugging
    mongoose.connection.on('connecting', () => {
      console.log('🔄 Mongoose connecting...');
    });
    
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected!');
    });
    
    mongoose.connection.on('open', () => {
      console.log('📂 Mongoose connection opened!');
    });
    
    mongoose.connection.on('disconnecting', () => {
      console.log('🔄 Mongoose disconnecting...');
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('❌ Mongoose disconnected');
    });
    
    mongoose.connection.on('error', (err) => {
      console.log('❌ Mongoose connection error:', err);
    });
    
    // Attempt connection
    await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log('\n🎉 CONNECTION SUCCESSFUL!');
    console.log('Database name:', mongoose.connection.db.databaseName);
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port);
    console.log('Ready state:', mongoose.connection.readyState);
    
    // Test database operations
    console.log('\n🧪 Testing Database Operations...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections found:', collections.length);
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // Test a simple operation
    const testResult = await mongoose.connection.db.admin().ping();
    console.log('Ping result:', testResult);
    
  } catch (error) {
    console.log('\n❌ CONNECTION FAILED!');
    console.log('Error type:', error.constructor.name);
    console.log('Error message:', error.message);
    console.log('Error code:', error.code);
    
    // Detailed error analysis
    if (error.message.includes('authentication failed')) {
      console.log('\n🔐 AUTHENTICATION ISSUE:');
      console.log('- Check username/password in MongoDB Atlas');
      console.log('- Verify user has correct database permissions');
      console.log('- Ensure password doesn\'t contain special characters');
    }
    
    if (error.message.includes('network timeout') || error.message.includes('ENOTFOUND')) {
      console.log('\n🌐 NETWORK ISSUE:');
      console.log('- Check internet connection');
      console.log('- Verify MongoDB Atlas cluster is running');
      console.log('- Check firewall/proxy settings');
    }
    
    if (error.message.includes('not authorized')) {
      console.log('\n🔒 AUTHORIZATION ISSUE:');
      console.log('- Check database access permissions');
      console.log('- Verify IP whitelist in MongoDB Atlas');
    }
    
    console.log('\nFull error details:');
    console.log(error);
  } finally {
    try {
      await mongoose.disconnect();
      console.log('\n📡 Disconnected from MongoDB');
    } catch (disconnectError) {
      console.log('Error during disconnect:', disconnectError.message);
    }
  }
};

// Step 3: System Information
console.log('\n💻 STEP 3: System Information');
console.log('==============================');
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);
console.log('Current working directory:', process.cwd());
console.log('Mongoose version:', mongoose.version);

// Step 4: Network Test
console.log('\n🌐 STEP 4: Network Connectivity');
console.log('================================');

const testNetworkConnectivity = async () => {
  const dns = require('dns');
  const { promisify } = require('util');
  const lookup = promisify(dns.lookup);
  
  try {
    console.log('🔍 Testing DNS resolution for cluster0.px1ra7o.mongodb.net...');
    const result = await lookup('cluster0.px1ra7o.mongodb.net');
    console.log('✅ DNS resolved:', result);
  } catch (error) {
    console.log('❌ DNS resolution failed:', error.message);
  }
};

// Run all tests
const runAllTests = async () => {
  console.log('\n🚀 Starting MongoDB Debug Session...\n');
  
  await testNetworkConnectivity();
  await debugConnection();
  
  console.log('\n🏁 Debug session completed!');
  console.log('\nNext steps:');
  console.log('1. Review the error details above');
  console.log('2. Fix any identified issues');
  console.log('3. Re-run this script to verify fixes');
  process.exit(0);
};

runAllTests().catch(error => {
  console.error('💥 Debug session failed:', error);
  process.exit(1);
}); 