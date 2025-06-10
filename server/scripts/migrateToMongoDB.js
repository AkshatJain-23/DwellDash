const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Property = require('../models/Property');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Favorite = require('../models/Favorite');

// File paths
const dataDir = path.join(__dirname, '../data');
const usersFile = path.join(dataDir, 'users.json');
const propertiesFile = path.join(dataDir, 'properties.json');
const conversationsFile = path.join(dataDir, 'conversations.json');
const messagesFile = path.join(dataDir, 'messages.json');
const favoritesFile = path.join(dataDir, 'favorites.json');

// Helper function to read JSON file
const readJSONFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.warn(`Warning: Could not read ${filePath}:`, error.message);
    return [];
  }
};

// Migration function
const migrate = async () => {
  try {
    console.log('🚀 Starting MongoDB migration...');

    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('your_mongodb_atlas_connection_string_here')) {
      console.error('❌ Please configure your MongoDB Atlas connection string in the .env file');
      console.log('📝 Update MONGODB_URI in server/.env with your actual Atlas connection string');
      process.exit(1);
    }

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas successfully!');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Property.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    await Favorite.deleteMany({});
    console.log('✅ Existing data cleared');

    // Migrate Users
    console.log('👥 Migrating users...');
    const users = readJSONFile(usersFile);
    const userIdMap = new Map(); // To map old IDs to new ObjectIds
    
    for (const userData of users) {
      try {
        // Hash password if it's not already hashed
        let hashedPassword = userData.password;
        if (!hashedPassword.startsWith('$2a$') && !hashedPassword.startsWith('$2b$')) {
          hashedPassword = await bcrypt.hash(userData.password, 12);
        }

        const user = new User({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role || 'tenant',
          phone: userData.phone || '',
          address: userData.address || '',
          bio: userData.bio || '',
          verified: userData.verified || false,
          createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
          updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : new Date()
        });

        const savedUser = await user.save();
        userIdMap.set(userData.id, savedUser._id);
        console.log(`✅ Migrated user: ${userData.name} (${userData.email})`);
      } catch (error) {
        console.error(`❌ Error migrating user ${userData.name}:`, error.message);
      }
    }

    // Migrate Properties
    console.log('🏠 Migrating properties...');
    const properties = readJSONFile(propertiesFile);
    const propertyIdMap = new Map(); // To map old IDs to new ObjectIds
    
    for (const propertyData of properties) {
      try {
        const ownerId = userIdMap.get(propertyData.ownerId);
        if (!ownerId) {
          console.warn(`⚠️ Skipping property ${propertyData.title} - owner not found`);
          continue;
        }

        const property = new Property({
          title: propertyData.title,
          description: propertyData.description,
          address: propertyData.address,
          city: propertyData.city,
          state: propertyData.state,
          zipCode: propertyData.zipCode,
          price: propertyData.price,
          type: propertyData.type,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          area: propertyData.area,
          furnished: propertyData.furnished || false,
          parking: propertyData.parking || false,
          petFriendly: propertyData.petFriendly || false,
          available: propertyData.available !== false, // Default to true
          availableFrom: propertyData.availableFrom ? new Date(propertyData.availableFrom) : new Date(),
          images: propertyData.images || [],
          amenities: propertyData.amenities || [],
          owner: ownerId,
          coordinates: propertyData.coordinates,
          createdAt: propertyData.createdAt ? new Date(propertyData.createdAt) : new Date(),
          updatedAt: propertyData.updatedAt ? new Date(propertyData.updatedAt) : new Date()
        });

        const savedProperty = await property.save();
        propertyIdMap.set(propertyData.id, savedProperty._id);
        console.log(`✅ Migrated property: ${propertyData.title}`);
      } catch (error) {
        console.error(`❌ Error migrating property ${propertyData.title}:`, error.message);
      }
    }

    // Migrate Conversations
    console.log('💬 Migrating conversations...');
    const conversations = readJSONFile(conversationsFile);
    const conversationIdMap = new Map();
    
    for (const convData of conversations) {
      try {
        const participants = [];
        
        // Map owner ID
        if (convData.ownerId) {
          const ownerId = userIdMap.get(convData.ownerId);
          if (ownerId) participants.push(ownerId);
        }
        
        // Map tenant ID (either by ID or email)
        if (convData.tenantId) {
          const tenantId = userIdMap.get(convData.tenantId);
          if (tenantId) participants.push(tenantId);
        } else if (convData.tenantEmail) {
          // Find user by email
          const tenant = await User.findOne({ email: convData.tenantEmail });
          if (tenant) participants.push(tenant._id);
        }

        if (participants.length < 2) {
          console.warn(`⚠️ Skipping conversation ${convData.id} - missing participants`);
          continue;
        }

        const propertyId = propertyIdMap.get(convData.propertyId);
        if (!propertyId) {
          console.warn(`⚠️ Skipping conversation ${convData.id} - property not found`);
          continue;
        }

        const conversation = new Conversation({
          participants,
          property: propertyId,
          unreadCounts: new Map(),
          createdAt: convData.createdAt ? new Date(convData.createdAt) : new Date(),
          updatedAt: convData.updatedAt ? new Date(convData.updatedAt) : new Date()
        });

        // Initialize unread counts
        participants.forEach(participantId => {
          conversation.unreadCounts.set(participantId.toString(), 0);
        });

        const savedConversation = await conversation.save();
        conversationIdMap.set(convData.id, savedConversation._id);
        console.log(`✅ Migrated conversation: ${convData.id}`);
      } catch (error) {
        console.error(`❌ Error migrating conversation ${convData.id}:`, error.message);
      }
    }

    // Migrate Messages
    console.log('📨 Migrating messages...');
    const messages = readJSONFile(messagesFile);
    
    for (const messageData of messages) {
      try {
        const conversationId = conversationIdMap.get(messageData.conversationId);
        if (!conversationId) {
          console.warn(`⚠️ Skipping message ${messageData.id} - conversation not found`);
          continue;
        }

        let senderId;
        if (messageData.senderId) {
          senderId = userIdMap.get(messageData.senderId);
        } else if (messageData.senderEmail) {
          const sender = await User.findOne({ email: messageData.senderEmail });
          if (sender) senderId = sender._id;
        }

        if (!senderId) {
          console.warn(`⚠️ Skipping message ${messageData.id} - sender not found`);
          continue;
        }

        const message = new Message({
          conversation: conversationId,
          sender: senderId,
          content: messageData.content || messageData.message,
          readBy: [senderId], // Sender has read their own message
          messageType: messageData.type || 'text',
          createdAt: messageData.createdAt ? new Date(messageData.createdAt) : new Date(),
          updatedAt: messageData.updatedAt ? new Date(messageData.updatedAt) : new Date()
        });

        const savedMessage = await message.save();

        // Update conversation's lastMessage
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: savedMessage._id,
          updatedAt: savedMessage.createdAt
        });

        console.log(`✅ Migrated message: ${messageData.id}`);
      } catch (error) {
        console.error(`❌ Error migrating message ${messageData.id}:`, error.message);
      }
    }

    // Migrate Favorites
    console.log('❤️ Migrating favorites...');
    const favorites = readJSONFile(favoritesFile);
    
    for (const favoriteData of favorites) {
      try {
        const userId = userIdMap.get(favoriteData.userId);
        const propertyId = propertyIdMap.get(favoriteData.propertyId);

        if (!userId || !propertyId) {
          console.warn(`⚠️ Skipping favorite ${favoriteData.id} - user or property not found`);
          continue;
        }

        const favorite = new Favorite({
          user: userId,
          property: propertyId,
          createdAt: favoriteData.addedAt ? new Date(favoriteData.addedAt) : new Date()
        });

        await favorite.save();
        console.log(`✅ Migrated favorite: ${favoriteData.id}`);
      } catch (error) {
        console.error(`❌ Error migrating favorite ${favoriteData.id}:`, error.message);
      }
    }

    console.log('🎉 Migration completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users: ${await User.countDocuments()}`);
    console.log(`🏠 Properties: ${await Property.countDocuments()}`);
    console.log(`💬 Conversations: ${await Conversation.countDocuments()}`);
    console.log(`📨 Messages: ${await Message.countDocuments()}`);
    console.log(`❤️ Favorites: ${await Favorite.countDocuments()}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
};

// Run migration
if (require.main === module) {
  migrate().then(() => {
    console.log('✅ Migration script completed');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  });
}

module.exports = { migrate }; 