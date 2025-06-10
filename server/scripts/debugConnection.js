require('dotenv').config();

console.log('🔍 MongoDB Connection Debug Info:');
console.log('=====================================');

// Check if .env file is loaded
if (process.env.MONGODB_URI) {
  console.log('✅ MONGODB_URI found in environment');
  
  // Show the connection string (with password hidden)
  const uri = process.env.MONGODB_URI;
  const hiddenUri = uri.replace(/:(.*?)@/, ':***@');
  console.log('📝 Connection string format:', hiddenUri);
  
  // Parse the connection string to check components
  try {
    if (uri.startsWith('mongodb+srv://')) {
      console.log('✅ Using MongoDB Atlas (SRV format)');
      
      // Extract username
      const userMatch = uri.match(/mongodb\+srv:\/\/([^:]+):/);
      if (userMatch) {
        console.log('👤 Username:', userMatch[1]);
      }
      
      // Extract host
      const hostMatch = uri.match(/@([^\/]+)/);
      if (hostMatch) {
        console.log('🌐 Host:', hostMatch[1]);
      }
      
      // Check for database name
      const dbMatch = uri.match(/\/([^?]+)\?/);
      if (dbMatch) {
        console.log('🗄️ Database:', dbMatch[1]);
      } else {
        console.log('⚠️ No database specified in connection string');
      }
      
      // Check for required parameters
      if (uri.includes('retryWrites=true')) {
        console.log('✅ retryWrites parameter found');
      } else {
        console.log('⚠️ retryWrites parameter missing');
      }
      
    } else {
      console.log('❌ Not a valid MongoDB Atlas connection string');
      console.log('   Should start with: mongodb+srv://');
    }
    
  } catch (error) {
    console.log('❌ Error parsing connection string:', error.message);
  }
  
} else {
  console.log('❌ MONGODB_URI not found in environment variables');
  console.log('📝 Make sure you have a .env file in the server directory');
}

console.log('\n🔧 Expected format:');
console.log('mongodb+srv://akshatt23:password123@cluster0.xxxxx.mongodb.net/dwelldash?retryWrites=true&w=majority');

console.log('\n💡 Troubleshooting tips:');
console.log('1. Make sure password matches what you set in MongoDB Atlas');
console.log('2. Check that cluster URL is exactly as shown in Atlas');
console.log('3. Ensure database name is "dwelldash"');
console.log('4. URL-encode special characters in password'); 