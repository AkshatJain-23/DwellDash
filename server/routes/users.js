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

const loadUsers = () => {
try {
  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
      console.log('Users loaded:', users.length, 'users found');
  }
} catch (error) {
    console.log('Error loading users file:', error);
}
};

// Initial load
loadUsers();

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

// Delete user account
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Reload users to ensure we have the latest data
    loadUsers();
    
    console.log('Delete user request:', {
      requestedId: id,
      requestingUserId: req.user.userId,
      requestingUserRole: req.user.role
    });
    
    // Check if user is deleting their own account or is admin
    if (req.user.userId !== id && req.user.role !== 'admin') {
      console.log('Authorization failed: User can only delete their own account');
      return res.status(403).json({ error: 'Not authorized to delete this account' });
    }

    // Find user index
    const userIndex = users.findIndex(u => u.id === id);
    console.log('User lookup:', {
      searchingForId: id,
      userIndex: userIndex,
      totalUsers: users.length,
      existingUserIds: users.map(u => u.id)
    });
    
    if (userIndex === -1) {
      console.log('User not found in database');
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[userIndex];
    console.log('Found user for deletion:', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    // Load other data files for cleanup
    const propertiesFile = path.join(__dirname, '../data/properties.json');
    const messagesFile = path.join(__dirname, '../data/messages.json');
    const conversationsFile = path.join(__dirname, '../data/conversations.json');

    let properties = [];
    let messages = [];
    let conversations = [];

    // Load existing data
    try {
      if (fs.existsSync(propertiesFile)) {
        properties = JSON.parse(fs.readFileSync(propertiesFile, 'utf8'));
      }
      if (fs.existsSync(messagesFile)) {
        messages = JSON.parse(fs.readFileSync(messagesFile, 'utf8'));
      }
      if (fs.existsSync(conversationsFile)) {
        conversations = JSON.parse(fs.readFileSync(conversationsFile, 'utf8'));
      }
    } catch (error) {
      console.log('Error loading data files:', error);
    }

    // If user is owner, delete all their properties first
    if (user.role === 'owner') {
      const userProperties = properties.filter(p => p.ownerId === id);
      
      // Remove user properties
      for (let i = properties.length - 1; i >= 0; i--) {
        if (properties[i].ownerId === id) {
          properties.splice(i, 1);
        }
      }

      // Save updated properties
      fs.writeFileSync(propertiesFile, JSON.stringify(properties, null, 2));
      console.log(`Deleted ${userProperties.length} properties for user ${user.name}`);
    }

    // Remove user from conversations and messages
    // For tenants, match by email; for owners, match by ID
    const userConversations = conversations.filter(c => 
      c.ownerId === id || c.tenantEmail === user.email || c.tenantId === id
    );

    console.log(`Found ${userConversations.length} conversations involving user ${user.name}`);

    // Remove messages for user conversations
    for (const conv of userConversations) {
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].conversationId === conv.id) {
          messages.splice(i, 1);
        }
      }
    }

    // Also remove standalone messages that might reference this user
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].ownerId === id || messages[i].senderEmail === user.email) {
        messages.splice(i, 1);
      }
    }

    // Remove conversations involving the user
    let deletedConversationsCount = 0;
    for (let i = conversations.length - 1; i >= 0; i--) {
      if (conversations[i].ownerId === id || conversations[i].tenantEmail === user.email || conversations[i].tenantId === id) {
        conversations.splice(i, 1);
        deletedConversationsCount++;
      }
    }

    console.log(`Deleted ${deletedConversationsCount} conversations and associated messages for user ${user.name}`);

    // Save updated messages and conversations
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
    fs.writeFileSync(conversationsFile, JSON.stringify(conversations, null, 2));

    // Remove user
    users.splice(userIndex, 1);
    saveUsers();

    console.log(`User account deleted: ${user.name} (${user.email})`);

    res.json({ 
      message: 'Account deleted successfully',
      deletedUser: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 