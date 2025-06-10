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
const usersFile = path.join(__dirname, '../data/users.json');
let properties = [];
let users = [];

// Load users data - reload to get latest data
const loadUsers = () => {
  try {
    if (fs.existsSync(usersFile)) {
      users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
      console.log('Users loaded, count:', users.length);
    }
  } catch (error) {
    console.error('Error loading users:', error);
    users = [];
  }
};

// Load properties and users from file
try {
  if (fs.existsSync(propertiesFile)) {
    const data = JSON.parse(fs.readFileSync(propertiesFile, 'utf8'));
    // Handle both formats: array or object with properties key
    properties = Array.isArray(data) ? data : (data.properties || []);
  }
} catch (error) {
  console.log('No existing properties file found, starting fresh');
  properties = [];
}

// Initial load of users
loadUsers();

// Save properties to file
const saveProperties = () => {
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  // Save as array format for consistency
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
    // Reload users data to get latest information
    loadUsers();
    
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

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

    // Add basic owner information to each property
    const propertiesWithOwners = paginatedProperties.map(property => {
      const owner = users.find(u => u.id === property.ownerId);
      return {
        ...property,
        ownerName: owner ? owner.name : 'Unknown Owner',
        area: property.address ? property.address.split(',')[0] : property.city
      };
    });

    res.json({
      properties: propertiesWithOwners,
      totalCount: filteredProperties.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(filteredProperties.length / limit)
    });
  } catch (error) {
    console.error('Properties fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single property
router.get('/:id', (req, res) => {
  try {
    // Reload users data to get latest information
    loadUsers();
    
    const property = properties.find(p => p.id === req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Find owner information
    const owner = users.find(u => u.id === property.ownerId);
    
    // Add owner information to property
    const propertyWithOwner = {
      ...property,
      ownerName: owner ? owner.name : 'Unknown Owner',
      ownerEmail: owner ? owner.email : 'No email available',
      contactNumber: property.contactPhone || (owner ? owner.phone : 'No contact available'),
      // Better area extraction - take everything before first comma or use city as fallback
      area: property.address ? 
        (property.address.includes(',') ? 
          property.address.split(',')[0].trim() : 
          property.address.trim()) : 
        property.city,
      // Ensure full address is available
      fullAddress: property.address || `${property.city}, India`
    };

    console.log('Property with owner info:', {
      id: propertyWithOwner.id,
      title: propertyWithOwner.title,
      ownerName: propertyWithOwner.ownerName,
      ownerEmail: propertyWithOwner.ownerEmail,
      area: propertyWithOwner.area,
      fullAddress: propertyWithOwner.fullAddress
    });

    res.json(propertyWithOwner);
  } catch (error) {
    console.error('Single property fetch error:', error);
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
    console.log('=== Property Creation Request ===');
    console.log('User:', req.user);
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
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
    console.log('Processed images:', images);

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

    console.log('New property object:', property);

    properties.push(property);
    console.log('Properties array length after push:', properties.length);
    
    saveProperties();
    console.log('Properties saved successfully');

    res.status(201).json(property);
  } catch (error) {
    console.error('Property creation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Server error', details: error.message });
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

module.exports = router;
