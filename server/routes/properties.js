const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Property = require('../models/Property');
const User = require('../models/User');

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
router.get('/', async (req, res) => {
  try {
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

    // Build MongoDB query
    let query = { available: true };

    // Search by title, description, or address
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { address: searchRegex }
      ];
    }

    // Filter by city
    if (city) {
      query.city = new RegExp(city, 'i');
    }

    // Filter by rent range (using price field from MongoDB)
    if (minRent) {
      query.price = { ...query.price, $gte: parseInt(minRent) };
    }
    if (maxRent) {
      query.price = { ...query.price, $lte: parseInt(maxRent) };
    }

    // Filter by property type
    if (propertyType) {
      query.type = propertyType;
    }

    // Filter by amenities
    if (amenities) {
      const requestedAmenities = amenities.split(',');
      query.amenities = { $in: requestedAmenities };
    }

    // Pagination
    const skip = (page - 1) * limit;
    
    // Get properties with owner information
    const [properties, totalCount] = await Promise.all([
      Property.find(query)
        .populate('owner', 'name email')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Property.countDocuments(query)
    ]);

    // Format response to match frontend expectations
    const formattedProperties = properties.map(property => ({
      id: property._id,
      title: property.title,
      description: property.description,
      rent: property.price, // Map price to rent for frontend compatibility
      price: property.price,
      deposit: property.price * 2, // Default deposit calculation
      city: property.city,
      address: property.address,
      state: property.state,
      zipCode: property.zipCode,
      propertyType: property.type,
      type: property.type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      furnished: property.furnished,
      parking: property.parking,
      petFriendly: property.petFriendly,
      available: property.available,
      isActive: property.available,
      availableFrom: property.availableFrom,
      images: property.images,
      amenities: property.amenities,
      coordinates: property.coordinates,
      ownerName: property.owner?.name || 'Unknown Owner',
      ownerEmail: property.owner?.email,
      ownerId: property.owner?._id,
      contactPhone: '+918426076800', // Default contact
      createdAt: property.createdAt,
      viewCount: property.viewCount || 0,
      featured: property.featured || false
    }));

    res.json({
      properties: formattedProperties,
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    console.error('Properties fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email phone');
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Increment view count
    property.viewCount = (property.viewCount || 0) + 1;
    await property.save();

    // Format response
    const formattedProperty = {
      id: property._id,
      title: property.title,
      description: property.description,
      rent: property.price,
      price: property.price,
      deposit: property.price * 2,
      city: property.city,
      address: property.address,
      state: property.state,
      zipCode: property.zipCode,
      propertyType: property.type,
      type: property.type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      furnished: property.furnished,
      parking: property.parking,
      petFriendly: property.petFriendly,
      available: property.available,
      isActive: property.available,
      availableFrom: property.availableFrom,
      images: property.images,
      amenities: property.amenities,
      coordinates: property.coordinates,
      ownerName: property.owner?.name || 'Unknown Owner',
      ownerEmail: property.owner?.email,
      ownerId: property.owner?._id,
      contactPhone: property.owner?.phone || '+918426076800',
      createdAt: property.createdAt,
      viewCount: property.viewCount,
      featured: property.featured || false
    };

    res.json(formattedProperty);
  } catch (error) {
    console.error('Property fetch error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid property ID' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new property (authenticated users only)
router.post('/', authenticateToken, [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required'),
  body('address').trim().isLength({ min: 1 }).withMessage('Address is required'),
  body('city').trim().isLength({ min: 1 }).withMessage('City is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('type').isIn(['apartment', 'house', 'condo', 'studio', 'room', 'pg', 'hostel', 'flat', 'single-room', 'shared-room']).withMessage('Invalid property type'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newProperty = new Property({
      title: req.body.title,
      description: req.body.description,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state || 'Unknown',
      zipCode: req.body.zipCode || '000000',
      price: parseFloat(req.body.price),
      type: req.body.type,
      bedrooms: parseInt(req.body.bedrooms) || 1,
      bathrooms: parseInt(req.body.bathrooms) || 1,
      area: parseInt(req.body.area) || 500,
      furnished: req.body.furnished === 'true',
      parking: req.body.parking === 'true',
      petFriendly: req.body.petFriendly === 'true',
      available: true,
      availableFrom: req.body.availableFrom ? new Date(req.body.availableFrom) : new Date(),
      images: req.body.images || [],
      amenities: req.body.amenities || [],
      owner: user._id,
      coordinates: req.body.coordinates || { lat: 26.9124, lng: 75.7873 }
    });

    const savedProperty = await newProperty.save();
    await savedProperty.populate('owner', 'name email');

    res.status(201).json({
      message: 'Property created successfully',
      property: {
        id: savedProperty._id,
        ...savedProperty.toObject(),
        ownerName: savedProperty.owner.name
      }
    });
  } catch (error) {
    console.error('Property creation error:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Update property (owner only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check if user is the owner
    if (property.owner.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this property' });
    }

    // Update fields
    const allowedUpdates = [
      'title', 'description', 'address', 'city', 'state', 'zipCode', 
      'price', 'type', 'bedrooms', 'bathrooms', 'area', 'furnished', 
      'parking', 'petFriendly', 'available', 'availableFrom', 'images', 
      'amenities', 'coordinates'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        property[field] = req.body[field];
      }
    });

    const updatedProperty = await property.save();
    await updatedProperty.populate('owner', 'name email');

    res.json({
      message: 'Property updated successfully',
      property: updatedProperty
    });
  } catch (error) {
    console.error('Property update error:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// Delete property (owner only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check if user is the owner
    if (property.owner.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this property' });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Property deletion error:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// Upload property images
router.post('/:id/images', authenticateToken, upload.array('images', 5), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check if user is the owner
    if (property.owner.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to upload images for this property' });
    }

    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    property.images.push(...imageUrls);
    
    await property.save();

    res.json({
      message: 'Images uploaded successfully',
      images: imageUrls
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

// Get cities with property counts
router.get('/meta/cities', async (req, res) => {
  try {
    const cities = await Property.aggregate([
      { $match: { available: true } },
      { 
        $group: { 
          _id: '$city', 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    const formattedCities = cities.map(city => ({
      name: city._id,
      count: city.count
    }));

    res.json(formattedCities);
  } catch (error) {
    console.error('Cities fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get property types with counts
router.get('/meta/types', async (req, res) => {
  try {
    const types = await Property.aggregate([
      { $match: { available: true } },
      { 
        $group: { 
          _id: '$type', 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } }
    ]);

    const formattedTypes = types.map(type => ({
      name: type._id,
      count: type.count
    }));

    res.json(formattedTypes);
  } catch (error) {
    console.error('Types fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
