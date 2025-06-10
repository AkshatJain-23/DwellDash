const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import all models
const User = require('../models/User');
const Property = require('../models/Property');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Favorite = require('../models/Favorite');

console.log('🚀 Starting Complete JSON to MongoDB Migration...\n');

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

// Load JSON file safely
const loadJSONFile = (filename) => {
  const filePath = path.join(__dirname, '../data', filename);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filename}`);
    return [];
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`📂 Loaded ${filename}: ${Array.isArray(data) ? data.length : 'object'} items`);
    return data;
  } catch (error) {
    console.log(`❌ Error loading ${filename}:`, error.message);
    return [];
  }
};

// Migration functions
const migrateUsers = async () => {
  console.log('\n👥 Migrating Users...');
  const users = loadJSONFile('users.json');
  
  if (!Array.isArray(users) || users.length === 0) {
    console.log('⚠️  No users to migrate');
    return 0;
  }

  let migratedCount = 0;
  for (const userData of users) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`⏭️  User already exists: ${userData.email}`);
        continue;
      }

      // Create new user
      const user = new User({
        name: userData.name,
        email: userData.email,
        password: userData.password, // Already hashed
        role: userData.role || 'tenant',
        phone: userData.phone || '',
        verified: userData.verified || false,
        createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date()
      });

      await user.save();
      console.log(`✅ Migrated user: ${userData.email}`);
      migratedCount++;
    } catch (error) {
      console.log(`❌ Failed to migrate user ${userData.email}:`, error.message);
    }
  }

  console.log(`📊 Users migrated: ${migratedCount}/${users.length}`);
  return migratedCount;
};

const migrateProperties = async () => {
  console.log('\n🏠 Migrating Properties...');
  const propertiesData = loadJSONFile('properties.json');
  const properties = propertiesData.properties || propertiesData || [];
  
  if (!Array.isArray(properties) || properties.length === 0) {
    console.log('⚠️  No properties to migrate');
    return 0;
  }

  let migratedCount = 0;
  for (const propData of properties) {
    try {
      // Check if property already exists
      const existingProperty = await Property.findOne({ 
        $or: [
          { title: propData.title, address: propData.address },
          { id: propData.id }
        ]
      });
      
      if (existingProperty) {
        console.log(`⏭️  Property already exists: ${propData.title}`);
        continue;
      }

      // Find owner by email or create default owner
      let owner = await User.findOne({ role: 'owner' });
      if (!owner) {
        // Create a default owner if none exists
        owner = new User({
          name: 'Property Owner',
          email: 'owner@dwelldash.com',
          password: '$2a$10$hashedpassword', // Dummy hashed password
          role: 'owner'
        });
        await owner.save();
        console.log('✅ Created default owner');
      }

      // Convert images array to proper format (just URLs as strings)
      let images = [];
      if (propData.images && Array.isArray(propData.images)) {
        images = propData.images.filter(img => typeof img === 'string');
      }

      // Map property type from JSON to MongoDB enum
      let propertyType = 'pg'; // default
      if (propData.propertyType) {
        const typeMapping = {
          'flat': 'flat',
          'hostel': 'hostel',
          'single-room': 'single-room',
          'shared-room': 'shared-room',
          'pg': 'pg',
          'apartment': 'apartment',
          'house': 'house',
          'condo': 'condo',
          'studio': 'studio',
          'room': 'room'
        };
        propertyType = typeMapping[propData.propertyType] || 'pg';
      }

      // Create property with MongoDB structure
      const property = new Property({
        title: propData.title,
        description: propData.description,
        address: propData.address,
        city: propData.city,
        state: propData.state || 'Rajasthan',
        zipCode: propData.zipCode || propData.pincode || '302001',
        price: propData.rent || propData.price || 0,
        type: propertyType,
        bedrooms: parseInt(propData.bedrooms) || 1,
        bathrooms: parseInt(propData.bathrooms) || 1,
        area: parseInt(propData.area) || 500,
        furnished: propData.furnished || false,
        parking: propData.amenities?.includes('parking') || false,
        petFriendly: propData.petFriendly || false,
        available: propData.isActive !== false && propData.available !== false,
        availableFrom: propData.availableFrom ? new Date(propData.availableFrom) : new Date(),
        images: images,
        amenities: propData.amenities || [],
        owner: owner._id,
        coordinates: propData.coordinates || { lat: 26.9124, lng: 75.7873 }, // Default to Jaipur
        // Store original JSON ID for reference
        originalId: propData.id
      });

      await property.save();
      console.log(`✅ Migrated property: ${propData.title}`);
      migratedCount++;
    } catch (error) {
      console.log(`❌ Failed to migrate property ${propData.title}:`, error.message);
      console.log('Property data:', JSON.stringify(propData, null, 2));
    }
  }

  console.log(`📊 Properties migrated: ${migratedCount}/${properties.length}`);
  return migratedCount;
};

const migrateFavorites = async () => {
  console.log('\n❤️  Migrating Favorites...');
  const favorites = loadJSONFile('favorites.json');
  
  if (!Array.isArray(favorites) || favorites.length === 0) {
    console.log('⚠️  No favorites to migrate');
    return 0;
  }

  let migratedCount = 0;
  for (const favData of favorites) {
    try {
      // Find user by userId from JSON (convert to ObjectId if needed)
      let user = null;
      
      // Try to find user by the old userId format first
      const users = await User.find({});
      user = users.find(u => u.id && u.id.toString() === favData.userId);
      
      if (!user) {
        // Try to find by ObjectId if userId looks like one
        try {
          user = await User.findById(favData.userId);
        } catch (err) {
          // Not a valid ObjectId, skip
        }
      }

      // Find property by title (since we know the specific mapping)
      let property = null;
      if (favData.propertyId === "1749545967172") {
        property = await Property.findOne({ title: "Comfortable PG for Bachelores" });
      } else {
        // Try to find by any other method
        property = await Property.findOne({ 
          $or: [
            { id: favData.propertyId },
            { _id: favData.propertyId }
          ]
        });
      }
      
      if (!user) {
        console.log(`⚠️  Skipping favorite - user not found for userId: ${favData.userId}`);
        continue;
      }
      
      if (!property) {
        console.log(`⚠️  Skipping favorite - property not found for propertyId: ${favData.propertyId}`);
        continue;
      }

      // Check if favorite already exists
      const existingFavorite = await Favorite.findOne({
        user: user._id,
        property: property._id
      });

      if (existingFavorite) {
        console.log(`⏭️  Favorite already exists`);
        continue;
      }

      // Create favorite
      const favorite = new Favorite({
        user: user._id,
        property: property._id,
        createdAt: favData.addedAt ? new Date(favData.addedAt) : new Date()
      });

      await favorite.save();
      console.log(`✅ Migrated favorite: ${user.email} -> ${property.title}`);
      migratedCount++;
    } catch (error) {
      console.log(`❌ Failed to migrate favorite:`, error.message);
    }
  }

  console.log(`📊 Favorites migrated: ${migratedCount}/${favorites.length}`);
  return migratedCount;
};

const migrateConversations = async () => {
  console.log('\n💬 Migrating Conversations...');
  const conversations = loadJSONFile('conversations.json');
  
  if (!Array.isArray(conversations) || conversations.length === 0) {
    console.log('⚠️  No conversations to migrate');
    return 0;
  }

  let migratedCount = 0;
  for (const convData of conversations) {
    try {
      // Check if conversation already exists
      const existingConv = await Conversation.findOne({ id: convData.id });
      if (existingConv) {
        console.log(`⏭️  Conversation already exists: ${convData.id}`);
        continue;
      }

      // Find participants and property
      const participants = [];
      if (convData.participants) {
        for (const email of convData.participants) {
          const user = await User.findOne({ email });
          if (user) participants.push(user._id);
        }
      }

      let property = null;
      if (convData.propertyId) {
        property = await Property.findOne({ id: convData.propertyId });
      }

      // Create conversation
      const conversation = new Conversation({
        participants: participants,
        property: property ? property._id : null,
        lastMessage: convData.lastMessage || null,
        unreadCounts: convData.unreadCounts || {},
        status: convData.status || 'active'
      });

      await conversation.save();
      console.log(`✅ Migrated conversation: ${convData.id}`);
      migratedCount++;
    } catch (error) {
      console.log(`❌ Failed to migrate conversation ${convData.id}:`, error.message);
    }
  }

  console.log(`📊 Conversations migrated: ${migratedCount}/${conversations.length}`);
  return migratedCount;
};

const migrateMessages = async () => {
  console.log('\n📨 Migrating Messages...');
  const messages = loadJSONFile('messages.json');
  
  if (!Array.isArray(messages) || messages.length === 0) {
    console.log('⚠️  No messages to migrate');
    return 0;
  }

  let migratedCount = 0;
  for (const msgData of messages) {
    try {
      // Check if message already exists
      const existingMsg = await Message.findOne({ id: msgData.id });
      if (existingMsg) {
        console.log(`⏭️  Message already exists: ${msgData.id}`);
        continue;
      }

      // Find sender by email
      const sender = await User.findOne({ email: msgData.senderEmail });
      if (!sender) {
        console.log(`⚠️  Skipping message - sender not found: ${msgData.senderEmail}`);
        continue;
      }

      // Find or create conversation for this property and participants
      let conversation = await Conversation.findOne({
        participants: { $all: [sender._id] },
        // For now, we'll create general conversations, property can be added later
      });

      if (!conversation) {
        // Create a new conversation
        conversation = new Conversation({
          participants: [sender._id],
          // property: null, // We'll set this later when we have property relationships
          status: 'active'
        });
        await conversation.save();
        console.log(`✅ Created conversation for message: ${msgData.id}`);
      }

      // Create message with proper content field
      const message = new Message({
        conversation: conversation._id,
        sender: sender._id,
        content: msgData.message, // The field is called 'message' in JSON but 'content' in MongoDB
        messageType: 'text',
        readBy: msgData.isRead ? [sender._id] : [],
        deleted: false, // Boolean instead of array
        attachmentUrl: null,
        createdAt: msgData.sentAt ? new Date(msgData.sentAt) : new Date()
      });

      await message.save();
      console.log(`✅ Migrated message: ${msgData.id} - "${msgData.message}"`);
      migratedCount++;
    } catch (error) {
      console.log(`❌ Failed to migrate message ${msgData.id}:`, error.message);
    }
  }

  console.log(`📊 Messages migrated: ${migratedCount}/${messages.length}`);
  return migratedCount;
};

// Main migration function
const runMigration = async () => {
  console.log('🎯 Target Database:', process.env.MONGODB_URI.split('@')[1].split('/')[1]);
  console.log('⏰ Started at:', new Date().toISOString());
  
  const connected = await connectDB();
  if (!connected) {
    process.exit(1);
  }

  try {
    // Run migrations in order
    const results = {
      users: await migrateUsers(),
      properties: await migrateProperties(),
      favorites: await migrateFavorites(),
      conversations: await migrateConversations(),
      messages: await migrateMessages()
    };

    console.log('\n🎉 MIGRATION COMPLETED!');
    console.log('========================');
    console.log(`👥 Users: ${results.users}`);
    console.log(`🏠 Properties: ${results.properties}`);
    console.log(`❤️  Favorites: ${results.favorites}`);
    console.log(`💬 Conversations: ${results.conversations}`);
    console.log(`📨 Messages: ${results.messages}`);

    const total = Object.values(results).reduce((sum, count) => sum + count, 0);
    console.log(`📊 Total items migrated: ${total}`);

    // Show database status
    console.log('\n📋 Database Collections:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`  ${col.name}: ${count} documents`);
    }

    console.log('\n✅ Ready to switch to MongoDB-only mode!');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
    process.exit(0);
  }
};

runMigration(); 