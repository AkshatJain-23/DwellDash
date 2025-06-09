const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const router = express.Router();

// File storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// In-memory storage
const propertiesFile = path.join(__dirname, '../data/properties.json');
let properties = [];

// Load properties from file
try {
  if (fs.existsSync(propertiesFile)) {
    properties = JSON.parse(fs.readFileSync(propertiesFile, 'utf8'));
  }
} catch (error) {
  console.log('No existing properties file found, starting fresh');
}

// Save properties to file
const saveProperties = () => {
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(propertiesFile, JSON.stringify(properties, null, 2));
};

// Auth middleware
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Get all properties with search and filters
router.get('/', (req, res) => {
  try {
    let filteredProperties = [...properties];
    
    const { 
      search, 
      city, 
      minRent, 
      maxRent, 
      propertyType, 
      gender, 
      amenities,
      page = 1,
      limit = 12
    } = req.query;

    // Search by title or description
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProperties = filteredProperties.filter(property => 
        property.title.toLowerCase().includes(searchTerm) ||
        property.description.toLowerCase().includes(searchTerm) ||
        property.address.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by city
    if (city) {
      filteredProperties = filteredProperties.filter(property => 
        property.city.toLowerCase() === city.toLowerCase()
      );
    }

    // Filter by rent range
    if (minRent) {
      filteredProperties = filteredProperties.filter(property => 
        property.rent >= parseInt(minRent)
      );
    }
    if (maxRent) {
      filteredProperties = filteredProperties.filter(property => 
        property.rent <= parseInt(maxRent)
      );
    }

    // Filter by property type
    if (propertyType) {
      filteredProperties = filteredProperties.filter(property => 
        property.propertyType === propertyType
      );
    }

    // Filter by gender
    if (gender) {
      filteredProperties = filteredProperties.filter(property => 
        property.gender === gender || property.gender === 'any'
      );
    }

    // Filter by amenities
    if (amenities) {
      const requestedAmenities = amenities.split(',');
      filteredProperties = filteredProperties.filter(property => 
        requestedAmenities.every(amenity => 
          property.amenities.includes(amenity)
        )
      );
    }

    // Sort properties: Featured first, then verified, then by creation date
    filteredProperties.sort((a, b) => {
      // Featured properties first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      
      // Then verified properties
      if (a.isVerified && !b.isVerified) return -1;
      if (!a.isVerified && b.isVerified) return 1;
      
      // Finally by creation date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

    res.json({
      properties: paginatedProperties,
      totalCount: filteredProperties.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(filteredProperties.length / limit),
      featuredCount: filteredProperties.filter(p => p.isFeatured).length,
      verifiedCount: filteredProperties.filter(p => p.isVerified).length
    });
  } catch (error) {
    console.error('Properties fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single property
router.get('/:id', (req, res) => {
  try {
    const property = properties.find(p => p.id === req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new property
router.post('/', authenticateToken, upload.array('images', 10), [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('rent').isNumeric().withMessage('Rent must be a number'),
  body('city').trim().isLength({ min: 2 }).withMessage('City is required'),
  body('address').trim().isLength({ min: 10 }).withMessage('Address must be at least 10 characters'),
  body('propertyType').isIn(['single-room', 'shared-room', 'flat', 'hostel']).withMessage('Invalid property type'),
  body('gender').isIn(['male', 'female', 'any']).withMessage('Invalid gender preference')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      rent,
      deposit,
      city,
      address,
      propertyType,
      gender,
      amenities,
      contactPhone,
      availableFrom
    } = req.body;

    // Process uploaded images
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const property = {
      id: Date.now().toString(),
      title,
      description,
      rent: parseInt(rent),
      deposit: parseInt(deposit) || 0,
      city,
      address,
      propertyType,
      gender,
      amenities: typeof amenities === 'string' ? amenities.split(',') : (amenities || []),
      images,
      contactPhone,
      availableFrom,
      ownerId: req.user.userId,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    properties.push(property);
    saveProperties();

    res.status(201).json(property);
  } catch (error) {
    console.error('Property creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update property
router.put('/:id', authenticateToken, upload.array('images', 10), (req, res) => {
  try {
    const propertyIndex = properties.findIndex(p => p.id === req.params.id);
    if (propertyIndex === -1) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const property = properties[propertyIndex];
    
    // Check if user owns this property
    if (property.ownerId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update property fields
    const updates = { ...req.body };
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      updates.images = [...(property.images || []), ...newImages];
    }
    
    if (updates.amenities && typeof updates.amenities === 'string') {
      updates.amenities = updates.amenities.split(',');
    }

    properties[propertyIndex] = { ...property, ...updates, updatedAt: new Date().toISOString() };
    saveProperties();

    res.json(properties[propertyIndex]);
  } catch (error) {
    console.error('Property update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete property
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const propertyIndex = properties.findIndex(p => p.id === req.params.id);
    if (propertyIndex === -1) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const property = properties[propertyIndex];
    
    // Check if user owns this property
    if (property.ownerId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    properties.splice(propertyIndex, 1);
    saveProperties();

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Property deletion error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get properties by owner
router.get('/owner/my-properties', authenticateToken, (req, res) => {
  try {
    const ownerProperties = properties.filter(p => p.ownerId === req.user.userId);
    res.json(ownerProperties);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin route to verify property (admin only)
router.put('/:id/verify', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin (you can modify this check based on your admin system)
    const usersFile = path.join(__dirname, '../data/users.json');
    let users = [];
    
    try {
      if (fs.existsSync(usersFile)) {
        users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
      }
    } catch (error) {
      console.log('No users file found');
    }

    const user = users.find(u => u.id === req.user.userId);
    
    // For now, allow any authenticated user to verify (you can add admin role check later)
    // if (user?.role !== 'admin') {
    //   return res.status(403).json({ error: 'Only admins can verify properties' });
    // }

    const propertyIndex = properties.findIndex(p => p.id === req.params.id);
    if (propertyIndex === -1) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const { isVerified } = req.body;
    
    properties[propertyIndex].isVerified = isVerified;
    properties[propertyIndex].verifiedAt = isVerified ? new Date().toISOString() : null;
    properties[propertyIndex].verifiedBy = isVerified ? req.user.userId : null;
    properties[propertyIndex].updatedAt = new Date().toISOString();

    saveProperties();

    res.json({ 
      message: `Property ${isVerified ? 'verified' : 'unverified'} successfully`,
      property: properties[propertyIndex]
    });
  } catch (error) {
    console.error('Property verification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin route to feature property (admin only)
router.put('/:id/feature', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin (you can modify this check based on your admin system)
    const usersFile = path.join(__dirname, '../data/users.json');
    let users = [];
    
    try {
      if (fs.existsSync(usersFile)) {
        users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
      }
    } catch (error) {
      console.log('No users file found');
    }

    const user = users.find(u => u.id === req.user.userId);
    
    // For now, allow any authenticated user to feature (you can add admin role check later)
    // if (user?.role !== 'admin') {
    //   return res.status(403).json({ error: 'Only admins can feature properties' });
    // }

    const propertyIndex = properties.findIndex(p => p.id === req.params.id);
    if (propertyIndex === -1) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const { isFeatured, featuredUntil } = req.body;
    
    properties[propertyIndex].isFeatured = isFeatured;
    properties[propertyIndex].featuredAt = isFeatured ? new Date().toISOString() : null;
    properties[propertyIndex].featuredUntil = featuredUntil || null;
    properties[propertyIndex].featuredBy = isFeatured ? req.user.userId : null;
    properties[propertyIndex].updatedAt = new Date().toISOString();

    saveProperties();

    res.json({ 
      message: `Property ${isFeatured ? 'featured' : 'unfeatured'} successfully`,
      property: properties[propertyIndex]
    });
  } catch (error) {
    console.error('Property featuring error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get featured properties
router.get('/featured', (req, res) => {
  try {
    const now = new Date().toISOString();
    
    const featuredProperties = properties.filter(property => 
      property.isFeatured && 
      property.isActive &&
      (!property.featuredUntil || property.featuredUntil > now)
    ).sort((a, b) => new Date(b.featuredAt) - new Date(a.featuredAt));

    res.json(featuredProperties);
  } catch (error) {
    console.error('Featured properties fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get verified properties
router.get('/verified', (req, res) => {
  try {
    const verifiedProperties = properties.filter(property => 
      property.isVerified && property.isActive
    ).sort((a, b) => new Date(b.verifiedAt) - new Date(a.verifiedAt));

    res.json(verifiedProperties);
  } catch (error) {
    console.error('Verified properties fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin route to get property verification stats
router.get('/admin/verification-stats', authenticateToken, (req, res) => {
  try {
    const totalProperties = properties.length;
    const verifiedProperties = properties.filter(p => p.isVerified).length;
    const featuredProperties = properties.filter(p => p.isFeatured).length;
    const pendingVerification = properties.filter(p => !p.isVerified && p.isActive).length;

    res.json({
      totalProperties,
      verifiedProperties,
      featuredProperties,
      pendingVerification,
      verificationRate: totalProperties > 0 ? (verifiedProperties / totalProperties * 100).toFixed(1) : 0
    });
  } catch (error) {
    console.error('Verification stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
