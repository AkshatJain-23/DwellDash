const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Property = require('./models/Property');
const Favorite = require('./models/Favorite');

console.log('🧪 Testing Favorites System...');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
};

const testFavorites = async () => {
  try {
    // Check current favorites
    const favorites = await Favorite.find()
      .populate('user', 'name email')
      .populate('property', 'title city');

    console.log(`📊 Total Favorites: ${favorites.length}`);
    
    if (favorites.length > 0) {
      favorites.forEach(fav => {
        console.log(`   - ${fav.user?.name || 'Unknown'} ♥ ${fav.property?.title || 'Unknown Property'}`);
      });
    }

    // Test creating a new favorite
    const user = await User.findOne({ email: 'jain2003akshat@gmail.com' });
    const property = await Property.findOne({ title: /Comfortable PG/i });

    if (user && property) {
      console.log('\n🧪 Testing favorite creation...');
      
      // Check if already exists
      const existingFav = await Favorite.findOne({
        user: user._id,
        property: property._id
      });

      if (existingFav) {
        console.log('✅ Favorite already exists');
      } else {
        // Create new favorite
        const newFavorite = new Favorite({
          user: user._id,
          property: property._id
        });
        await newFavorite.save();
        console.log('✅ Created new favorite');
      }
    } else {
      console.log('⚠️  User or property not found for testing');
    }

    // Test favorites retrieval for user
    if (user) {
      const userFavorites = await Favorite.find({ user: user._id })
        .populate({
          path: 'property',
          populate: {
            path: 'owner',
            select: 'name email'
          }
        });

      console.log(`\n👤 Favorites for ${user.email}: ${userFavorites.length}`);
      userFavorites.forEach(fav => {
        console.log(`   - ${fav.property?.title} (Owner: ${fav.property?.owner?.name})`);
      });
    }

    console.log('\n✅ Favorites test completed!');

  } catch (error) {
    console.error('❌ Favorites test failed:', error);
  }
};

const run = async () => {
  const connected = await connectDB();
  if (connected) {
    await testFavorites();
  }
  await mongoose.disconnect();
  console.log('\n📡 Disconnected from MongoDB');
  process.exit(0);
};

run(); 