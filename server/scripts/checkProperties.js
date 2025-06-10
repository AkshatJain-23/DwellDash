const mongoose = require('mongoose');
require('dotenv').config();

const Property = require('../models/Property');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to MongoDB');
  
  // Find a property with the specific ID from favorites
  const targetPropertyId = "1749545967172";
  
  // Try different search methods
  console.log('\n=== Looking for property with ID:', targetPropertyId, '===');
  
  // Method 1: Search by title
  const propByTitle = await Property.findOne({ title: "Comfortable PG for Bachelores" });
  if (propByTitle) {
    console.log('Found by title - MongoDB _id:', propByTitle._id);
    console.log('Has originalId field?', propByTitle.originalId);
  }
  
  // Method 2: Check all properties for any custom ID fields
  const allProps = await Property.find({}).limit(3);
  console.log('\n=== Sample properties in DB ===');
  allProps.forEach((prop, index) => {
    console.log(`Property ${index + 1}:`, {
      _id: prop._id,
      title: prop.title,
      originalId: prop.originalId || 'Not set'
    });
  });
  
  // Method 3: Count total
  const total = await Property.countDocuments();
  console.log('\nTotal properties in DB:', total);
  
  mongoose.disconnect();
}).catch(console.error); 