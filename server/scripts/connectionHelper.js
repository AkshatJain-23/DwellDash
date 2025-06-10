const mongoose = require('mongoose');

console.log('🔧 MongoDB Connection Helper');
console.log('============================\n');

const testConnection = async (password) => {
  const connectionString = `mongodb+srv://akshatt23:${password}@cluster0.px1ra7o.mongodb.net/dwelldash?retryWrites=true&w=majority&appName=Cluster0`;
  
  console.log(`🧪 Testing password: ${password.substring(0, 3)}***`);
  
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ SUCCESS! This password works!');
    console.log('📝 Update your .env file with this connection string:');
    console.log(`MONGODB_URI=${connectionString}`);
    
    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.log('❌ Failed:', error.message.split(':')[0]);
    await mongoose.disconnect();
    return false;
  }
};

// Test function - you can modify this
const testPasswords = async () => {
  console.log('🔍 Testing common password scenarios...\n');
  
  // Add your suspected passwords here
  const passwordsToTest = [
    'password',
    'password123', 
    // Add your actual password here when you find it
  ];
  
  for (const pwd of passwordsToTest) {
    const success = await testPasswords(pwd);
    if (success) {
      console.log('\n🎉 Found working password!');
      process.exit(0);
    }
    console.log(''); // Empty line
  }
  
  console.log('❌ None of the tested passwords worked.');
  console.log('\n📋 Next steps:');
  console.log('1. Go to MongoDB Atlas → Database Access');
  console.log('2. Find user "akshatt23"');
  console.log('3. Click "Edit" → "Edit Password"');
  console.log('4. Set a new password and copy it');
  console.log('5. Update your .env file with the new password');
  
  process.exit(1);
};

// Manual test function - uncomment and add your password
// testConnection('YOUR_ACTUAL_PASSWORD_HERE');

console.log('💡 Instructions:');
console.log('1. Uncomment the line above');
console.log('2. Replace YOUR_ACTUAL_PASSWORD_HERE with your actual password');
console.log('3. Run: node scripts/connectionHelper.js');
console.log('\nOr run testPasswords() to try multiple passwords...');

module.exports = { testConnection }; 