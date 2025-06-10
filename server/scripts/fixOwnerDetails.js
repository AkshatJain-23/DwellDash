const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Property = require('../models/Property');

console.log('🔧 Fixing Owner Details for All Properties...');

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

const fixOwnerDetails = async () => {
  try {
    // Find or create a default owner
    let defaultOwner = await User.findOne({ role: 'owner' });
    
    if (!defaultOwner) {
      console.log('📝 Creating default property owner...');
      defaultOwner = new User({
        name: 'Akshat Jain',
        email: 'akshatjain6574@gmail.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        role: 'owner',
        phone: '+918426076800',
        verified: true
      });
      await defaultOwner.save();
      console.log('✅ Created default owner:', defaultOwner.email);
    } else {
      console.log('✅ Found existing owner:', defaultOwner.email);
    }

    // Update all properties without owners
    const propertiesWithoutOwners = await Property.find({
      $or: [
        { owner: { $exists: false } },
        { owner: null }
      ]
    });

    console.log(`📊 Found ${propertiesWithoutOwners.length} properties without owners`);

    if (propertiesWithoutOwners.length > 0) {
      const updateResult = await Property.updateMany(
        {
          $or: [
            { owner: { $exists: false } },
            { owner: null }
          ]
        },
        { 
          $set: { owner: defaultOwner._id }
        }
      );

      console.log(`✅ Updated ${updateResult.modifiedCount} properties with owner details`);
    }

    // Verify the fix
    const allProperties = await Property.find().populate('owner', 'name email phone');
    console.log('\n📋 Property-Owner Verification:');
    
    allProperties.slice(0, 5).forEach(property => {
      console.log(`   - ${property.title} → Owner: ${property.owner?.name || 'STILL MISSING'} (${property.owner?.email || 'NO EMAIL'})`);
    });

    // Create additional owners if needed
    const ownerCount = await User.countDocuments({ role: 'owner' });
    if (ownerCount < 2) {
      console.log('\n👥 Creating additional property owners for variety...');
      
      const additionalOwners = [
        {
          name: 'Rahul Sharma',
          email: 'rahul.properties@gmail.com',
          password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
          role: 'owner',
          phone: '+919876543210',
          verified: true
        },
        {
          name: 'Priya Gupta',
          email: 'priya.realestate@gmail.com',
          password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
          role: 'owner',
          phone: '+919123456789',
          verified: true
        }
      ];

      for (const ownerData of additionalOwners) {
        const existingOwner = await User.findOne({ email: ownerData.email });
        if (!existingOwner) {
          const newOwner = new User(ownerData);
          await newOwner.save();
          console.log(`✅ Created owner: ${newOwner.name} (${newOwner.email})`);
        }
      }
    }

    console.log('\n🎉 Owner details fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing owner details:', error);
  }
};

const run = async () => {
  const connected = await connectDB();
  if (connected) {
    await fixOwnerDetails();
  }
  await mongoose.disconnect();
  console.log('\n📡 Disconnected from MongoDB');
  process.exit(0);
};

run().catch(console.error); 