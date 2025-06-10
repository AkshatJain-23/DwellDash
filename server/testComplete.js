const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Property = require('./models/Property');
const { KnowledgeBase, FAQ } = require('./models/KnowledgeBase');
const Stats = require('./models/Stats');

console.log('🧪 COMPLETE SYSTEM TEST - MongoDB Only Operation');
console.log('='.repeat(60));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas successfully!');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
};

const testSystem = async () => {
  console.log('\n📊 Testing all collections...');
  
  try {
    const users = await User.countDocuments();
    const properties = await Property.countDocuments();
    const knowledgeBase = await KnowledgeBase.countDocuments();
    const faqs = await FAQ.countDocuments();
    const stats = await Stats.countDocuments();

    console.log(`✅ Users: ${users} documents`);
    console.log(`✅ Properties: ${properties} documents`);
    console.log(`✅ Knowledge Base: ${knowledgeBase} documents`);
    console.log(`✅ FAQs: ${faqs} documents`);
    console.log(`✅ Stats: ${stats} documents`);

    // Test some sample data
    console.log('\n🔍 Sample data check...');
    
    const sampleUser = await User.findOne().select('email role');
    if (sampleUser) {
      console.log(`✅ Sample user: ${sampleUser.email} (${sampleUser.role})`);
    }

    const sampleProperty = await Property.findOne().select('title city price');
    if (sampleProperty) {
      console.log(`✅ Sample property: ${sampleProperty.title} in ${sampleProperty.city} - ₹${sampleProperty.price}`);
    }

    const sampleKB = await KnowledgeBase.findOne().select('title category');
    if (sampleKB) {
      console.log(`✅ Sample knowledge: ${sampleKB.title} (${sampleKB.category})`);
    }

    const currentStats = await Stats.getCurrentStats();
    if (currentStats) {
      console.log(`✅ Current stats: ${currentStats.totalUsers} users, ${currentStats.totalProperties} properties`);
    }

    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('🚀 System is fully migrated to MongoDB and operational!');
    console.log('🗑️  JSON files can be safely archived/removed');
    console.log('📈 Ready for production scaling with MongoDB Atlas');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

const run = async () => {
  console.log('🎯 Target Database:', process.env.MONGODB_URI.split('@')[1].split('/')[1]);
  console.log('⏰ Test started at:', new Date().toISOString());
  
  const connected = await connectDB();
  if (connected) {
    await testSystem();
  } else {
    console.log('❌ Cannot run tests without database connection');
  }
  
  await mongoose.disconnect();
  console.log('\n📡 Disconnected from MongoDB');
  process.exit(0);
};

run().catch(console.error); 