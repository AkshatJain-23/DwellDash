const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Load users from file (same as auth.js)
const usersFile = path.join(__dirname, '../data/users.json');
let users = [];

try {
  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  }
} catch (error) {
  console.log('No existing users file found');
}

const saveUsers = () => {
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
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

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').optional().isMobilePhone('en-IN').withMessage('Invalid phone number')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userIndex = users.findIndex(u => u.id === req.user.userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { name, phone } = req.body;
    const user = users[userIndex];

    if (name) user.name = name;
    if (phone) user.phone = phone;
    user.updatedAt = new Date().toISOString();

    users[userIndex] = user;
    saveUsers();

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Change password
router.put('/change-password', authenticateToken, [
  body('currentPassword').exists().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const userIndex = users.findIndex(u => u.id === req.user.userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[userIndex];

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.updatedAt = new Date().toISOString();

    users[userIndex] = user;
    saveUsers();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users (admin only - for future use)
router.get('/all', authenticateToken, (req, res) => {
  try {
    // For now, allow all authenticated users to see basic user info
    const userList = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }));

    res.json(userList);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete account permanently
router.delete('/delete-account', authenticateToken, [
  body('password').exists().withMessage('Password is required for account deletion'),
  body('confirmDelete').equals('DELETE').withMessage('Please type DELETE to confirm')
], async (req, res) => {
  try {
    console.log('=== DELETE ACCOUNT REQUEST ===');
    console.log('Request body:', req.body);
    console.log('User from token:', req.user);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { password } = req.body;
    const userIndex = users.findIndex(u => u.id === req.user.userId);
    
    console.log('User index found:', userIndex);
    
    if (userIndex === -1) {
      console.log('User not found for ID:', req.user.userId);
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[userIndex];
    console.log('User found:', { id: user.id, email: user.email });

    // Verify password before deletion
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      console.log('Password verification failed');
      return res.status(400).json({ error: 'Incorrect password' });
    }

    // Load properties to delete user's properties
    const propertiesFile = path.join(__dirname, '../data/properties.json');
    let properties = [];
    
    try {
      if (fs.existsSync(propertiesFile)) {
        properties = JSON.parse(fs.readFileSync(propertiesFile, 'utf8'));
        console.log('Loaded properties count:', properties.length);
      }
    } catch (error) {
      console.log('No properties file found or error loading:', error.message);
    }

    // Remove all properties owned by this user
    const updatedProperties = properties.filter(property => property.ownerId !== req.user.userId);
    console.log('Properties after filtering:', updatedProperties.length);
    
    // Save updated properties
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(propertiesFile, JSON.stringify(updatedProperties, null, 2));
    console.log('Properties file updated');

    // Remove user from users array
    users.splice(userIndex, 1);
    saveUsers();
    console.log('User removed and users file saved');

    const deletedPropertiesCount = properties.length - updatedProperties.length;
    console.log('Deleted properties count:', deletedPropertiesCount);

    res.json({ 
      message: 'Account deleted permanently',
      deletedPropertiesCount
    });
    
    console.log('=== DELETE ACCOUNT SUCCESS ===');
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({ error: 'Server error during account deletion' });
  }
});

module.exports = router; 