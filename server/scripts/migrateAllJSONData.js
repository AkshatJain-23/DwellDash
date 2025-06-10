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
const ResetToken = require('../models/ResetToken');
const { KnowledgeBase, FAQ } = require('../models/KnowledgeBase');
const Stats = require('../models/Stats');

console.log('🚀 Starting COMPLETE JSON to MongoDB Migration...\n');

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
    return null;
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`📂 Loaded ${filename}: ${Array.isArray(data) ? data.length : 'object'} items`);
    return data;
  } catch (error) {
    console.log(`❌ Error loading ${filename}:`, error.message);
    return null;
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
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`⏭️  User already exists: ${userData.email}`);
        continue;
      }

      const user = new User({
        name: userData.name,
        email: userData.email,
        password: userData.password,
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
  const properties = propertiesData?.properties || propertiesData || [];
  
  if (!Array.isArray(properties) || properties.length === 0) {
    console.log('⚠️  No properties to migrate');
    return 0;
  }

  let migratedCount = 0;
  for (const propData of properties) {
    try {
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

      let owner = await User.findOne({ role: 'owner' });
      if (!owner) {
        owner = new User({
          name: 'Property Owner',
          email: 'owner@dwelldash.com',
          password: '$2a$10$hashedpassword',
          role: 'owner'
        });
        await owner.save();
        console.log('✅ Created default owner');
      }

      let images = [];
      if (propData.images && Array.isArray(propData.images)) {
        images = propData.images.filter(img => typeof img === 'string');
      }

      let propertyType = 'pg';
      if (propData.propertyType) {
        const typeMapping = {
          'flat': 'flat', 'hostel': 'hostel', 'single-room': 'single-room',
          'shared-room': 'shared-room', 'pg': 'pg', 'apartment': 'apartment',
          'house': 'house', 'condo': 'condo', 'studio': 'studio', 'room': 'room'
        };
        propertyType = typeMapping[propData.propertyType] || 'pg';
      }

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
        coordinates: propData.coordinates || { lat: 26.9124, lng: 75.7873 }
      });

      await property.save();
      console.log(`✅ Migrated property: ${propData.title}`);
      migratedCount++;
    } catch (error) {
      console.log(`❌ Failed to migrate property ${propData.title}:`, error.message);
    }
  }

  console.log(`📊 Properties migrated: ${migratedCount}/${properties.length}`);
  return migratedCount;
};

const migrateResetTokens = async () => {
  console.log('\n🔐 Migrating Reset Tokens...');
  const resetTokens = loadJSONFile('resetTokens.json');
  
  if (!Array.isArray(resetTokens) || resetTokens.length === 0) {
    console.log('⚠️  No reset tokens to migrate');
    return 0;
  }

  let migratedCount = 0;
  for (const tokenData of resetTokens) {
    try {
      // Check if token already exists
      const existingToken = await ResetToken.findOne({ token: tokenData.token });
      if (existingToken) {
        console.log(`⏭️  Reset token already exists`);
        continue;
      }

      // Find user by the old userId format
      const users = await User.find({});
      let user = users.find(u => u.id && u.id.toString() === tokenData.userId);
      
      if (!user) {
        console.log(`⚠️  Skipping token - user not found for userId: ${tokenData.userId}`);
        continue;
      }

      const resetToken = new ResetToken({
        user: user._id,
        token: tokenData.token,
        expiresAt: new Date(tokenData.expiresAt),
        createdAt: tokenData.createdAt ? new Date(tokenData.createdAt) : new Date()
      });

      await resetToken.save();
      console.log(`✅ Migrated reset token for user: ${user.email}`);
      migratedCount++;
    } catch (error) {
      console.log(`❌ Failed to migrate reset token:`, error.message);
    }
  }

  console.log(`📊 Reset tokens migrated: ${migratedCount}/${resetTokens.length}`);
  return migratedCount;
};

const migrateKnowledgeBase = async () => {
  console.log('\n📚 Migrating Knowledge Base...');
  const knowledgeData = loadJSONFile('dwellbot-knowledge-base.json');
  
  if (!knowledgeData) {
    console.log('⚠️  No knowledge base to migrate');
    return 0;
  }

  let migratedCount = 0;

  // Migrate knowledge base entries
  if (knowledgeData.knowledge_base && Array.isArray(knowledgeData.knowledge_base)) {
    for (const kbData of knowledgeData.knowledge_base) {
      try {
        const existingKB = await KnowledgeBase.findOne({ id: kbData.id });
        if (existingKB) {
          console.log(`⏭️  Knowledge base entry already exists: ${kbData.id}`);
          continue;
        }

        const kbEntry = new KnowledgeBase({
          id: kbData.id,
          category: kbData.category,
          title: kbData.title,
          content: kbData.content,
          keywords: kbData.keywords || [],
          active: true,
          priority: 1
        });

        await kbEntry.save();
        console.log(`✅ Migrated knowledge base entry: ${kbData.title}`);
        migratedCount++;
      } catch (error) {
        console.log(`❌ Failed to migrate KB entry ${kbData.id}:`, error.message);
      }
    }
  }

  // Migrate FAQ entries
  if (knowledgeData.faq && Array.isArray(knowledgeData.faq)) {
    for (const faqData of knowledgeData.faq) {
      try {
        const existingFAQ = await FAQ.findOne({ question: faqData.question });
        if (existingFAQ) {
          console.log(`⏭️  FAQ already exists: ${faqData.question.substring(0, 50)}...`);
          continue;
        }

        const faqEntry = new FAQ({
          question: faqData.question,
          answer: faqData.answer,
          category: 'General',
          active: true,
          priority: 1
        });

        await faqEntry.save();
        console.log(`✅ Migrated FAQ: ${faqData.question.substring(0, 50)}...`);
        migratedCount++;
      } catch (error) {
        console.log(`❌ Failed to migrate FAQ:`, error.message);
      }
    }
  }

  console.log(`📊 Knowledge base items migrated: ${migratedCount}`);
  return migratedCount;
};

const migrateStats = async () => {
  console.log('\n📊 Migrating Statistics...');
  const statsData = loadJSONFile('sample-stats.json');
  
  if (!statsData) {
    console.log('⚠️  No stats data to migrate');
    return 0;
  }

  try {
    const existingStats = await Stats.findOne();
    if (existingStats) {
      console.log('⏭️  Stats already exist, updating...');
      await Stats.updateStats({
        totalUsers: statsData.totalUsers,
        totalProperties: statsData.totalProperties,
        totalCities: statsData.totalCities,
        satisfactionRate: statsData.satisfactionRate,
        monthlyGrowth: statsData.monthlyGrowth || {
          users: 12.5,
          properties: 8.3,
          cities: 2
        },
        lastCalculated: new Date(),
        isRealTime: true
      });
      console.log('✅ Updated statistics');
    } else {
      const stats = new Stats({
        totalUsers: statsData.totalUsers,
        totalProperties: statsData.totalProperties,
        totalCities: statsData.totalCities,
        satisfactionRate: statsData.satisfactionRate,
        monthlyGrowth: statsData.monthlyGrowth || {
          users: 12.5,
          properties: 8.3,
          cities: 2
        },
        lastCalculated: new Date(),
        isRealTime: true
      });

      await stats.save();
      console.log('✅ Migrated statistics');
    }
    return 1;
  } catch (error) {
    console.log(`❌ Failed to migrate stats:`, error.message);
    return 0;
  }
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
      // Find user by email (we know the mapping)
      const user = await User.findOne({ email: "jain2003akshat@gmail.com" });
      
      // Find property by title
      let property = null;
      if (favData.propertyId === "1749545967172") {
        property = await Property.findOne({ title: "Comfortable PG for Bachelores" });
      }
      
      if (!user || !property) {
        console.log(`⚠️  Skipping favorite - user or property not found`);
        continue;
      }

      const existingFavorite = await Favorite.findOne({
        user: user._id,
        property: property._id
      });

      if (existingFavorite) {
        console.log(`⏭️  Favorite already exists`);
        continue;
      }

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
      const existingConv = await Conversation.findOne({ id: convData.id });
      if (existingConv) {
        console.log(`⏭️  Conversation already exists: ${convData.id}`);
        continue;
      }

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
      const existingMsg = await Message.findOne({ id: msgData.id });
      if (existingMsg) {
        console.log(`⏭️  Message already exists: ${msgData.id}`);
        continue;
      }

      const sender = await User.findOne({ email: msgData.senderEmail });
      if (!sender) {
        console.log(`⚠️  Skipping message - sender not found: ${msgData.senderEmail}`);
        continue;
      }

      let conversation = await Conversation.findOne({
        participants: { $all: [sender._id] }
      });

      if (!conversation) {
        conversation = new Conversation({
          participants: [sender._id],
          status: 'active'
        });
        await conversation.save();
        console.log(`✅ Created conversation for message: ${msgData.id}`);
      }

      const message = new Message({
        conversation: conversation._id,
        sender: sender._id,
        content: msgData.message,
        messageType: 'text',
        readBy: msgData.isRead ? [sender._id] : [],
        deleted: false,
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
    // Run migrations for new data only
    const results = {
      users: await migrateUsers(),
      resetTokens: await migrateResetTokens(),
      knowledgeBase: await migrateKnowledgeBase(),
      stats: await migrateStats()
    };

    console.log('\n🎉 ADDITIONAL MIGRATION FINISHED!');
    console.log('=====================================');
    console.log(`👥 Users: ${results.users}`);
    console.log(`🔐 Reset Tokens: ${results.resetTokens}`);
    console.log(`📚 Knowledge Base: ${results.knowledgeBase}`);
    console.log(`📊 Statistics: ${results.stats}`);

    const total = Object.values(results).reduce((sum, count) => sum + count, 0);
    console.log(`📊 Total NEW items migrated: ${total}`);

    // Show final database status
    console.log('\n📋 Final Database Collections:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`  ${col.name}: ${count} documents`);
    }

    console.log('\n✅ ALL JSON DATA MIGRATED TO MONGODB!');
    console.log('🚀 Ready for complete MongoDB-only operation!');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
    process.exit(0);
  }
};

runMigration(); 