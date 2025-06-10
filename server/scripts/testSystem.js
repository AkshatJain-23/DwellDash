const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Property = require('../models/Property');
const Favorite = require('../models/Favorite');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('🔍 Testing Current System Status...\n');
  
  // 1. Check users in database
  console.log('=== Users in Database ===');
  const users = await User.find({});
  users.forEach(user => {
    console.log(`ID: ${user._id}, Email: ${user.email}, Role: ${user.role}`);
  });
  
  // 2. Check if the specific user from favorites exists
  console.log('\n=== Looking for Favorite User ===');
  const targetUserId = "1749563494664";
  console.log(`Looking for user with ID: ${targetUserId}`);
  
  const userByEmail = await User.findOne({ email: "jain2003akshat@gmail.com" });
  if (userByEmail) {
    console.log(`✅ Found user by email: ${userByEmail._id}`);
  } else {
    console.log('❌ User not found by email');
  }
  
  // 3. Check properties
  console.log('\n=== Properties in Database ===');
  const propertyCount = await Property.countDocuments();
  console.log(`Total properties: ${propertyCount}`);
  
  const targetProperty = await Property.findOne({ title: "Comfortable PG for Bachelores" });
  if (targetProperty) {
    console.log(`✅ Target property found: ${targetProperty._id}`);
  }
  
  // 4. Test creating a favorite manually
  console.log('\n=== Testing Favorite Creation ===');
  if (userByEmail && targetProperty) {
    try {
      // Check if favorite already exists
      const existingFav = await Favorite.findOne({
        user: userByEmail._id,
        property: targetProperty._id
      });
      
      if (existingFav) {
        console.log('⚠️  Favorite already exists');
      } else {
        const newFavorite = new Favorite({
          user: userByEmail._id,
          property: targetProperty._id
        });
        
        await newFavorite.save();
        console.log('✅ Favorite created successfully!');
      }
    } catch (error) {
      console.log('❌ Error creating favorite:', error.message);
    }
  }
  
  // 5. Test creating a new property
  console.log('\n=== Testing New Property Creation ===');
  try {
    const owner = await User.findOne({ role: 'owner' });
    if (owner) {
      const testProperty = new Property({
        title: 'Test Property from MongoDB',
        description: 'This is a test property created directly in MongoDB',
        address: 'Test Address, Test City',
        city: 'Test City',
        state: 'Test State',
        zipCode: '123456',
        price: 5000,
        type: 'pg',
        bedrooms: 1,
        bathrooms: 1,
        area: 300,
        owner: owner._id,
        coordinates: { lat: 26.9124, lng: 75.7873 }
      });
      
      await testProperty.save();
      console.log('✅ New property created successfully!');
      console.log(`   Property ID: ${testProperty._id}`);
      console.log(`   Title: ${testProperty.title}`);
    }
  } catch (error) {
    console.log('❌ Error creating property:', error.message);
  }
  
  // 6. Final status
  console.log('\n=== Final Database Status ===');
  const finalCounts = {
    users: await User.countDocuments(),
    properties: await Property.countDocuments(),
    favorites: await Favorite.countDocuments()
  };
  
  console.log(`Users: ${finalCounts.users}`);
  console.log(`Properties: ${finalCounts.properties}`);
  console.log(`Favorites: ${finalCounts.favorites}`);
  
  mongoose.disconnect();
}).catch(console.error); 