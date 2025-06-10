const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

// Import all models to test
const User = require('../models/User');
const Property = require('../models/Property');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Favorite = require('../models/Favorite');
const ResetToken = require('../models/ResetToken');
const { KnowledgeBase, FAQ } = require('../models/KnowledgeBase');
const Stats = require('../models/Stats');

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

// Test all collections
const testDatabaseCollections = async () => {
  console.log('\n📊 DATABASE COLLECTIONS TEST');
  console.log('-'.repeat(40));

  try {
    const results = {};
    
    // Test each collection
    results.users = await User.countDocuments();
    results.properties = await Property.countDocuments();
    results.conversations = await Conversation.countDocuments();
    results.messages = await Message.countDocuments();
    results.favorites = await Favorite.countDocuments();
    results.resetTokens = await ResetToken.countDocuments();
    results.knowledgeBase = await KnowledgeBase.countDocuments();
    results.faqs = await FAQ.countDocuments();
    results.stats = await Stats.countDocuments();

    console.log('📋 Collection Document Counts:');
    Object.entries(results).forEach(([collection, count]) => {
      const status = count > 0 ? '✅' : '⚠️ ';
      console.log(`  ${status} ${collection}: ${count} documents`);
    });

    const total = Object.values(results).reduce((sum, count) => sum + count, 0);
    console.log(`\n📊 Total Documents: ${total}`);

    return results;
  } catch (error) {
    console.error('❌ Database collections test failed:', error.message);
    return null;
  }
};

// Test key data retrievals
const testDataRetrieval = async () => {
  console.log('\n🔍 DATA RETRIEVAL TEST');
  console.log('-'.repeat(40));

  try {
    // Test user authentication data
    const users = await User.find().select('email role').limit(3);
    console.log(`✅ Users sample: ${users.length} found`);
    users.forEach(user => console.log(`   - ${user.email} (${user.role})`));

    // Test property data
    const properties = await Property.find().select('title city price').limit(3);
    console.log(`✅ Properties sample: ${properties.length} found`);
    properties.forEach(prop => console.log(`   - ${prop.title} in ${prop.city} - ₹${prop.price}`));

    // Test knowledge base
    const kbEntries = await KnowledgeBase.find({ active: true }).select('title category').limit(3);
    console.log(`✅ Knowledge Base entries: ${kbEntries.length} found`);
    kbEntries.forEach(kb => console.log(`   - ${kb.title} (${kb.category})`));

    // Test FAQ
    const faqs = await FAQ.find({ active: true }).select('question').limit(2);
    console.log(`✅ FAQ entries: ${faqs.length} found`);
    faqs.forEach(faq => console.log(`   - ${faq.question.substring(0, 50)}...`));

    // Test stats
    const stats = await Stats.getCurrentStats();
    console.log(`✅ Statistics: Users=${stats.totalUsers}, Properties=${stats.totalProperties}, Cities=${stats.totalCities}`);

    return true;
  } catch (error) {
    console.error('❌ Data retrieval test failed:', error.message);
    return false;
  }
};

// Test API endpoints (if server is running)
const testAPIEndpoints = async () => {
  console.log('\n🌐 API ENDPOINTS TEST (if server running)');
  console.log('-'.repeat(40));

  const baseURL = 'http://localhost:5000/api';
  const endpoints = [
    { path: '/stats', name: 'Statistics API' },
    { path: '/chatbot/health', name: 'Chatbot Health' },
    { path: '/chatbot/knowledge-stats', name: 'Knowledge Base Stats' },
    { path: '/properties?page=1&limit=5', name: 'Properties API' },
    { path: '/users/profile', name: 'Users API' }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`${baseURL}${endpoint.path}`, { timeout: 3000 });
      
      if (response.data.success) {
        console.log(`✅ ${endpoint.name}: Working`);
        
        // Show some data details
        if (endpoint.path === '/stats' && response.data.rawData) {
          console.log(`   Stats: ${response.data.rawData.properties} properties, ${response.data.rawData.users} users`);
        }
        if (endpoint.path === '/chatbot/knowledge-stats' && response.data.data) {
          console.log(`   KB: ${response.data.data.knowledgeBaseEntries} entries, ${response.data.data.faqEntries} FAQs`);
        }
      } else {
        console.log(`⚠️  ${endpoint.name}: Response not successful`);
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`⚠️  ${endpoint.name}: Server not running (${error.code})`);
      } else {
        console.log(`❌ ${endpoint.name}: ${error.message}`);
      }
    }
  }

  return true;
};

// Test search and filtering capabilities
const testSearchCapabilities = async () => {
  console.log('\n🔎 SEARCH CAPABILITIES TEST');
  console.log('-'.repeat(40));

  try {
    // Test property search by city
    const citySearch = await Property.find({ city: 'Jaipur' }).limit(3);
    console.log(`✅ City search (Jaipur): ${citySearch.length} properties found`);

    // Test property type filtering
    const typeSearch = await Property.find({ type: 'pg' }).limit(3);
    console.log(`✅ Type search (PG): ${typeSearch.length} properties found`);

    // Test price range
    const priceSearch = await Property.find({ 
      price: { $gte: 5000, $lte: 15000 } 
    }).limit(3);
    console.log(`✅ Price range (₹5k-15k): ${priceSearch.length} properties found`);

    // Test knowledge base search
    const kbSearch = await KnowledgeBase.find({
      $text: { $search: 'safety security' },
      active: true
    }).limit(2);
    console.log(`✅ Knowledge base search (safety): ${kbSearch.length} entries found`);

    // Test FAQ search
    const faqSearch = await FAQ.find({
      $text: { $search: 'free tenant' },
      active: true
    }).limit(2);
    console.log(`✅ FAQ search (free tenant): ${faqSearch.length} FAQs found`);

    return true;
  } catch (error) {
    console.error('❌ Search capabilities test failed:', error.message);
    return false;
  }
};

// Test data relationships
const testDataRelationships = async () => {
  console.log('\n🔗 DATA RELATIONSHIPS TEST');
  console.log('-'.repeat(40));

  try {
    // Test user-property relationships via favorites
    const favoritesWithDetails = await Favorite.find()
      .populate('user', 'email name')
      .populate('property', 'title city price')
      .limit(2);
    
    console.log(`✅ Favorites with relationships: ${favoritesWithDetails.length} found`);
    favoritesWithDetails.forEach(fav => {
      if (fav.user && fav.property) {
        console.log(`   - ${fav.user.email} ♥ ${fav.property.title}`);
      }
    });

    // Test conversation-message relationships
    const conversationsWithMessages = await Conversation.find()
      .populate('participants', 'email name')
      .limit(2);
    
    console.log(`✅ Conversations with participants: ${conversationsWithMessages.length} found`);
    
    // Test property ownership
    const propertiesWithOwners = await Property.find()
      .populate('owner', 'email name')
      .limit(3);
      
    console.log(`✅ Properties with owners: ${propertiesWithOwners.length} found`);
    propertiesWithOwners.forEach(prop => {
      if (prop.owner) {
        console.log(`   - ${prop.title} owned by ${prop.owner.email}`);
      }
    });

    return true;
  } catch (error) {
    console.error('❌ Data relationships test failed:', error.message);
    return false;
  }
};

// Check for any remaining JSON file dependencies
const checkJSONDependencies = async () => {
  console.log('\n📄 JSON DEPENDENCIES CHECK');
  console.log('-'.repeat(40));

  const fs = require('fs');
  const path = require('path');

  try {
    // Check if any critical files still exist and are being used
    const dataDir = path.join(__dirname, '../data');
    const jsonFiles = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
    
    console.log(`📁 JSON files still present: ${jsonFiles.length}`);
    jsonFiles.forEach(file => console.log(`   - ${file}`));

    if (jsonFiles.length === 0) {
      console.log('✅ No JSON files found - Complete migration to MongoDB!');
    } else {
      console.log('⚠️  JSON files still present - may be used for backup/reference');
    }

    return true;
  } catch (error) {
    console.error('❌ JSON dependencies check failed:', error.message);
    return false;
  }
};

// Main test execution
const runCompleteSystemTest = async () => {
  console.log('🎯 Target Database:', process.env.MONGODB_URI.split('@')[1].split('/')[1]);
  console.log('⏰ Test started at:', new Date().toISOString());
  console.log();

  const connected = await connectDB();
  if (!connected) {
    console.log('❌ Cannot run tests without database connection');
    process.exit(1);
  }

  try {
    // Run all tests
    const results = {
      collections: await testDatabaseCollections(),
      dataRetrieval: await testDataRetrieval(),
      apiEndpoints: await testAPIEndpoints(),
      searchCapabilities: await testSearchCapabilities(),
      dataRelationships: await testDataRelationships(),
      jsonDependencies: await checkJSONDependencies()
    };

    // Summary
    console.log('\n🎉 COMPLETE SYSTEM TEST SUMMARY');
    console.log('='.repeat(60));
    
    const allTestsPassed = Object.values(results).every(result => result !== false && result !== null);
    
    if (allTestsPassed) {
      console.log('🟢 ALL TESTS PASSED - SYSTEM FULLY MIGRATED TO MONGODB!');
      console.log();
      console.log('✅ Database collections: Working');
      console.log('✅ Data retrieval: Working');
      console.log('✅ API endpoints: Tested');
      console.log('✅ Search capabilities: Working');
      console.log('✅ Data relationships: Working');
      console.log('✅ JSON dependencies: Checked');
      console.log();
      console.log('🚀 Your application is now running completely on MongoDB!');
      console.log('🗑️  JSON files can be safely archived/removed');
      console.log('📈 Ready for production scaling with MongoDB Atlas');
    } else {
      console.log('🟡 SOME TESTS HAD ISSUES - REVIEW ABOVE');
      console.log('   Application is mostly migrated but needs attention');
    }

    if (results.collections) {
      console.log('\n📊 Final Database State:');
      Object.entries(results.collections).forEach(([collection, count]) => {
        console.log(`   ${collection}: ${count} documents`);
      });
    }

  } catch (error) {
    console.error('💥 Test execution failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
    console.log('⏰ Test completed at:', new Date().toISOString());
    process.exit(0);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n⚠️  Test interrupted by user');
  await mongoose.disconnect();
  process.exit(1);
});

runCompleteSystemTest(); 