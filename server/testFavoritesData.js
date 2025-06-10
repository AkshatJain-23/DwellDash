const axios = require('axios');

async function testFavoritesData() {
  console.log('🧪 Testing Favorites Data Structure\n');
  
  try {
    // Try different login credentials
    const loginData = {
      email: 'jain2003akshat@gmail.com', // Using the actual tenant user
      password: 'Akshat@123' // Common password pattern
    };
    
    console.log('🔐 Attempting login with:', loginData.email);
    
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', loginData);
    
    const token = loginResponse.data.token;
    console.log('✅ Logged in successfully');
    console.log('User:', loginResponse.data.user.name, '(' + loginResponse.data.user.role + ')');
    
    // Get favorites data
    const favoritesResponse = await axios.get('http://localhost:5000/api/favorites', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('\n📊 Favorites Data Structure:');
    console.log('Total favorites:', favoritesResponse.data.length);
    
    if (favoritesResponse.data.length > 0) {
      const firstFavorite = favoritesResponse.data[0];
      console.log('\n🔍 First Favorite Object:');
      console.log(JSON.stringify(firstFavorite, null, 2));
      
      console.log('\n🆔 Property ID Analysis:');
      if (firstFavorite.property) {
        console.log('Property._id:', firstFavorite.property._id);
        console.log('Property.id:', firstFavorite.property.id);
        console.log('Property keys:', Object.keys(firstFavorite.property));
      }
      
      // Test remove with the actual property ID
      const propertyId = firstFavorite.property?.id || firstFavorite.property?._id;
      console.log('\n🗑️ Testing removal with ID:', propertyId);
      
      try {
        const removeResponse = await axios.delete(`http://localhost:5000/api/favorites/${propertyId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('✅ Remove response:', removeResponse.status, removeResponse.data);
        
        // Add it back for testing
        const addBackResponse = await axios.post(`http://localhost:5000/api/favorites/${propertyId}`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('✅ Added back:', addBackResponse.status);
        
      } catch (removeError) {
        console.log('❌ Remove failed:', removeError.response?.status, removeError.response?.data);
      }
    } else {
      console.log('\n📝 No favorites found. Let\'s add one for testing...');
      
      // Get a property to add to favorites
      const propertiesResponse = await axios.get('http://localhost:5000/api/properties');
      if (propertiesResponse.data.length > 0) {
        const testProperty = propertiesResponse.data[0];
        console.log('Adding property to favorites:', testProperty.title);
        console.log('Property ID:', testProperty.id);
        
        try {
          const addResponse = await axios.post(`http://localhost:5000/api/favorites/${testProperty.id}`, {}, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('✅ Added to favorites:', addResponse.status);
          
          // Now test removal
          const removeResponse = await axios.delete(`http://localhost:5000/api/favorites/${testProperty.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('✅ Removed from favorites:', removeResponse.status, removeResponse.data);
          
        } catch (favoriteError) {
          console.log('❌ Favorite operation failed:', favoriteError.response?.status, favoriteError.response?.data);
        }
      }
    }
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Error:', error.response.status, error.response.data);
    } else {
      console.log('❌ Network Error:', error.message);
    }
  }
}

testFavoritesData(); 