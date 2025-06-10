const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Favorite = require('../models/Favorite');
const Property = require('../models/Property');
const { auth } = require('../middleware/auth');

// Get all favorites for a user
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.userId })
      .populate({
        path: 'property',
        populate: {
          path: 'owner',
          select: 'name email phone'
        }
      })
      .sort({ createdAt: -1 });

    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Error fetching favorites' });
  }
});

// Add a property to favorites
router.post('/:propertyId', auth, async (req, res) => {
  try {
    const { propertyId } = req.params;

    console.log(`🔍 Favorites: Attempting to add property ${propertyId} for user ${req.user.userId}`);

    // Check if property exists - handle both ObjectId and legacy numeric IDs
    let property;
    let actualPropertyId;
    
    // First try as MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(propertyId)) {
      console.log(`   Searching as ObjectId: ${propertyId}`);
      property = await Property.findById(propertyId);
      actualPropertyId = propertyId;
    }
    
    // If not found and it's a numeric string, find the property by any matching field
    if (!property && /^\d+$/.test(propertyId)) {
      console.log(`   Searching as legacy numeric ID: ${propertyId}`);
      
      // Search for properties where any ID field matches
      // This handles the case where properties have numeric IDs from JSON migration
      const properties = await Property.find({});
      property = properties.find(p => 
        p._id.toString() === propertyId ||
        p.id === propertyId ||
        p.legacyId === propertyId ||
        p.originalId === propertyId
      );
      
      if (property) {
        actualPropertyId = property._id; // Use the MongoDB ObjectId
        console.log(`   Found property by numeric ID, MongoDB ID: ${actualPropertyId}`);
      }
    }

    if (!property) {
      console.log(`   ❌ Property not found: ${propertyId}`);
      return res.status(404).json({ message: 'Property not found' });
    }

    console.log(`   ✅ Property found: ${property.title}`);

    // Check if already favorited (using the MongoDB ObjectId)
    const existingFavorite = await Favorite.findOne({
      user: req.user.userId,
      property: actualPropertyId
    });

    if (existingFavorite) {
      console.log(`   ⚠️ Already favorited`);
      return res.status(400).json({ message: 'Property already in favorites' });
    }

    // Create new favorite using the MongoDB ObjectId
    const favorite = new Favorite({
      user: req.user.userId,
      property: actualPropertyId
    });

    await favorite.save();
    console.log(`   ✅ Favorite created: ${favorite._id}`);

    await favorite.populate({
      path: 'property',
      populate: {
        path: 'owner',
        select: 'name email phone'
      }
    });

    res.status(201).json(favorite);
  } catch (error) {
    console.error('❌ Error adding to favorites:', error);
    res.status(500).json({ message: 'Error adding to favorites' });
  }
});

// Remove a property from favorites
router.delete('/:propertyId', auth, async (req, res) => {
  try {
    const { propertyId } = req.params;

    console.log(`🗑️ Favorites DELETE: Attempting to remove property ${propertyId} for user ${req.user.userId}`);
    console.log(`   Step 1: Property ID type: ${typeof propertyId}`);
    console.log(`   Step 2: Property ID length: ${propertyId.length}`);

    // Handle both ObjectId and legacy numeric IDs for deletion too
    let actualPropertyId;
    
    if (mongoose.Types.ObjectId.isValid(propertyId)) {
      console.log(`   Step 3a: Property ID is valid ObjectId: ${propertyId}`);
      actualPropertyId = propertyId;
    } else if (/^\d+$/.test(propertyId)) {
      console.log(`   Step 3b: Property ID is numeric string: ${propertyId}, searching for property...`);
      // Find the property to get its MongoDB ObjectId
      const properties = await Property.find({});
      console.log(`   Step 3b.1: Found ${properties.length} total properties`);
      
      const property = properties.find(p => 
        p._id.toString() === propertyId ||
        p.id === propertyId ||
        p.legacyId === propertyId ||
        p.originalId === propertyId
      );
      
      if (property) {
        actualPropertyId = property._id;
        console.log(`   Step 3b.2: Found property: ${property.title}, MongoDB ID: ${actualPropertyId}`);
      } else {
        console.log(`   Step 3b.3: ❌ Property not found with numeric ID: ${propertyId}`);
        
        // List a few properties for debugging
        console.log('   Available properties:');
        properties.slice(0, 3).forEach(p => {
          console.log(`     - ${p.title}: _id=${p._id}, id=${p.id}`);
        });
        
        return res.status(404).json({ message: 'Property not found' });
      }
    } else {
      console.log(`   Step 3c: ❌ Invalid property ID format: ${propertyId}`);
      return res.status(400).json({ message: 'Invalid property ID format' });
    }

    console.log(`   Step 4: Searching for favorite with property ID: ${actualPropertyId}`);

    const favorite = await Favorite.findOneAndDelete({
      user: req.user.userId,
      property: actualPropertyId
    });

    if (!favorite) {
      console.log(`   Step 5: ❌ Favorite not found for user ${req.user.userId} and property ${actualPropertyId}`);
      
      // Let's check what favorites this user actually has
      const userFavorites = await Favorite.find({ user: req.user.userId }).populate('property');
      console.log(`   Step 5.1: User has ${userFavorites.length} favorites:`);
      userFavorites.forEach(fav => {
        console.log(`     - Property: ${fav.property?.title || 'Unknown'} (ID: ${fav.property?._id})`);
      });
      
      return res.status(404).json({ message: 'Favorite not found' });
    }

    console.log(`   Step 6: ✅ Favorite removed successfully: ${favorite._id}`);
    res.json({ message: 'Property removed from favorites' });
  } catch (error) {
    console.error('❌ Error removing from favorites:', error);
    res.status(500).json({ message: 'Error removing from favorites' });
  }
});

// Check if a property is favorited by user
router.get('/check/:propertyId', auth, async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Handle both ObjectId and legacy numeric IDs
    let actualPropertyId;
    
    if (mongoose.Types.ObjectId.isValid(propertyId)) {
      actualPropertyId = propertyId;
    } else if (/^\d+$/.test(propertyId)) {
      // Find the property to get its MongoDB ObjectId
      const properties = await Property.find({});
      const property = properties.find(p => 
        p._id.toString() === propertyId ||
        p.id === propertyId ||
        p.legacyId === propertyId ||
        p.originalId === propertyId
      );
      
      if (property) {
        actualPropertyId = property._id;
      } else {
        return res.json({ isFavorited: false });
      }
    } else {
      return res.status(400).json({ message: 'Invalid property ID format' });
    }

    const favorite = await Favorite.findOne({
      user: req.user.userId,
      property: actualPropertyId
    });

    res.json({ isFavorited: !!favorite });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ message: 'Error checking favorite status' });
  }
});

// Get favorite count for a property
router.get('/count/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Handle both ObjectId and legacy numeric IDs
    let actualPropertyId;
    
    if (mongoose.Types.ObjectId.isValid(propertyId)) {
      actualPropertyId = propertyId;
    } else if (/^\d+$/.test(propertyId)) {
      // Find the property to get its MongoDB ObjectId
      const properties = await Property.find({});
      const property = properties.find(p => 
        p._id.toString() === propertyId ||
        p.id === propertyId ||
        p.legacyId === propertyId ||
        p.originalId === propertyId
      );
      
      if (property) {
        actualPropertyId = property._id;
      } else {
        return res.json({ count: 0 });
      }
    } else {
      return res.status(400).json({ message: 'Invalid property ID format' });
    }

    const count = await Favorite.countDocuments({ property: actualPropertyId });

    res.json({ count });
  } catch (error) {
    console.error('Error getting favorite count:', error);
    res.status(500).json({ message: 'Error getting favorite count' });
  }
});

// Get user's favorite property IDs (for quick checking)
router.get('/property-ids', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.userId }).select('property');
    const propertyIds = favorites.map(fav => fav.property.toString());

    res.json(propertyIds);
  } catch (error) {
    console.error('Error fetching favorite property IDs:', error);
    res.status(500).json({ message: 'Error fetching favorite property IDs' });
  }
});

module.exports = router; 