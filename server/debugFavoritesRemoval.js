require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

// Test user credentials
const testUser = {
  email: "jain2003akshat@gmail.com",
  password: "password123"
};

async function debugFavoritesRemoval() {
  try {
    console.log('🔧 Debugging Favorites Removal Issue');
    console.log('=====================================\n');
    
    // Connect to MongoDB directly to check data structure
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Import models
    const User = require('./models/User');
    const Property = require('./models/Property');
    const Favorite = require('./models/Favorite');
    
    // 1. Check user
    const user = await User.findOne({ email: testUser.email });
    if (!user) {
      console.log('❌ Test user not found');
      return;
    }
    console.log(`👤 User found: ${user.name} (ID: ${user._id})\n`);
    
    // 2. Check user's favorites in database
    const dbFavorites = await Favorite.find({ user: user._id }).populate('property');
    console.log(`❤️ User has ${dbFavorites.length} favorites in database:`);
    dbFavorites.forEach((fav, index) => {
      console.log(`   ${index + 1}. ${fav.property.title}`);
      console.log(`      Property _id: ${fav.property._id}`);
      console.log(`      Property id: ${fav.property.id}`);
      console.log(`      Favorite _id: ${fav._id}`);
    });
    console.log('');
    
    // 3. Test API login
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', testUser);
    const token = loginResponse.data.token;
    console.log('✅ API Login successful\n');
    
    // 4. Test API favorites fetch
    const favoritesResponse = await axios.get('http://localhost:5000/api/favorites', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log(`📡 API returned ${favoritesResponse.data.length} favorites:`);
    favoritesResponse.data.forEach((fav, index) => {
      console.log(`   ${index + 1}. ${fav.property.title}`);
      console.log(`      Property _id: ${fav.property._id}`);
      console.log(`      Property id: ${fav.property.id}`);
      console.log(`      API favorite structure:`, {
        favoriteId: fav._id,
        userId: fav.user,
        propertyId: fav.property._id
      });
    });
    console.log('');
    
    // 5. Test removal with the first favorite
    if (favoritesResponse.data.length > 0) {
      const firstFavorite = favoritesResponse.data[0];
      const propertyToRemove = firstFavorite.property;
      
      console.log(`🗑️ Testing removal of: ${propertyToRemove.title}`);
      console.log(`   Using property._id: ${propertyToRemove._id}`);
      console.log(`   Using property.id: ${propertyToRemove.id}`);
      
      // Test with MongoDB _id first
      try {
        const removeResponse = await axios.delete(`http://localhost:5000/api/favorites/${propertyToRemove._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('✅ Removal with _id successful:', removeResponse.status);
        
        // Add it back for further testing
        await axios.post(`http://localhost:5000/api/favorites/${propertyToRemove._id}`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('↩️ Added back for testing');
        
      } catch (error) {
        console.log('❌ Removal with _id failed:', error.response?.status, error.response?.data);
      }
      
      // Test with property.id if different
      if (propertyToRemove.id && propertyToRemove.id !== propertyToRemove._id.toString()) {
        try {
          const removeResponse2 = await axios.delete(`http://localhost:5000/api/favorites/${propertyToRemove.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          console.log('✅ Removal with .id successful:', removeResponse2.status);
          
        } catch (error) {
          console.log('❌ Removal with .id failed:', error.response?.status, error.response?.data);
        }
      }
    }
    
  } catch (error) {
    if (error.response) {
      console.log('❌ API Error:', error.response.status, error.response.data);
    } else {
      console.log('❌ Error:', error.message);
    }
  } finally {
    mongoose.disconnect();
    console.log('\n🔚 Done');
  }
}

debugFavoritesRemoval(); 