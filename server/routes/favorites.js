const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(403).json({ error: 'Invalid token.' });
  }
};

const router = express.Router();

// File paths
const favoritesFile = path.join(__dirname, '../data/favorites.json');

// Load favorites data
let favorites = [];
const loadFavorites = () => {
  try {
    if (fs.existsSync(favoritesFile)) {
      const data = fs.readFileSync(favoritesFile, 'utf8');
      favorites = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading favorites:', error);
    favorites = [];
  }
};

// Save favorites data
const saveFavorites = () => {
  try {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(favoritesFile, JSON.stringify(favorites, null, 2));
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
};

// Initialize favorites data
loadFavorites();

// Get user's favorites
router.get('/', authenticateToken, (req, res) => {
  try {
    const userFavorites = favorites.filter(fav => fav.userId === req.user.userId);
    res.json(userFavorites);
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Add property to favorites
router.post('/add', [
  authenticateToken,
  body('propertyId').notEmpty().withMessage('Property ID is required')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { propertyId } = req.body;
    const userId = req.user.userId;

    // Check if already in favorites
    const existingFavorite = favorites.find(fav => 
      fav.userId === userId && fav.propertyId === propertyId
    );

    if (existingFavorite) {
      return res.status(400).json({ error: 'Property already in favorites' });
    }

    // Add to favorites
    const newFavorite = {
      id: Date.now().toString(),
      userId,
      propertyId,
      addedAt: new Date().toISOString()
    };

    favorites.push(newFavorite);
    saveFavorites();

    res.status(201).json({ message: 'Property added to favorites', favorite: newFavorite });
  } catch (error) {
    console.error('Failed to add favorite:', error);
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

// Remove property from favorites
router.delete('/remove/:propertyId', authenticateToken, (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user.userId;

    const favoriteIndex = favorites.findIndex(fav => 
      fav.userId === userId && fav.propertyId === propertyId
    );

    if (favoriteIndex === -1) {
      return res.status(404).json({ error: 'Property not found in favorites' });
    }

    favorites.splice(favoriteIndex, 1);
    saveFavorites();

    res.json({ message: 'Property removed from favorites' });
  } catch (error) {
    console.error('Failed to remove favorite:', error);
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
});

// Check if property is in user's favorites
router.get('/check/:propertyId', authenticateToken, (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user.userId;

    const isFavorite = favorites.some(fav => 
      fav.userId === userId && fav.propertyId === propertyId
    );

    res.json({ isFavorite });
  } catch (error) {
    console.error('Failed to check favorite status:', error);
    res.status(500).json({ error: 'Failed to check favorite status' });
  }
});

// Get user's favorite properties with details
router.get('/properties', authenticateToken, (req, res) => {
  try {
    const userFavorites = favorites.filter(fav => fav.userId === req.user.userId);
    
    // Load properties data
    const propertiesFile = path.join(__dirname, '../data/properties.json');
    let properties = [];
    if (fs.existsSync(propertiesFile)) {
      const propertiesData = fs.readFileSync(propertiesFile, 'utf8');
      properties = JSON.parse(propertiesData);
    }

    // Get favorite properties with details
    const favoriteProperties = userFavorites.map(fav => {
      const property = properties.find(p => p.id === fav.propertyId);
      return {
        ...fav,
        property: property || null
      };
    }).filter(fav => fav.property !== null);

    res.json(favoriteProperties);
  } catch (error) {
    console.error('Failed to fetch favorite properties:', error);
    res.status(500).json({ error: 'Failed to fetch favorite properties' });
  }
});

module.exports = router; 