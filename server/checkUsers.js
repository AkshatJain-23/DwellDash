const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://akshatt23:AkshatJain2003@cluster0.px1ra7o.mongodb.net/dwelldash?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Connected to MongoDB');
    
    // Get all users
    const users = await User.find({}).select('name email role createdAt');
    
    console.log('\n👥 Users in Database:');
    console.log('Total users:', users.length);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
    });
    
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUsers(); 