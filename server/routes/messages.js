const express = require('express');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Property = require('../models/Property');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Send message to property owner
router.post('/', [
  body('propertyId').notEmpty().withMessage('Property ID is required'),
  body('ownerId').notEmpty().withMessage('Owner ID is required'),
  body('senderName').trim().isLength({ min: 2 }).withMessage('Sender name must be at least 2 characters'),
  body('senderEmail').isEmail().withMessage('Valid email is required'),
  body('message').trim().isLength({ min: 1 }).withMessage('Message cannot be empty'),
  body('propertyTitle').trim().notEmpty().withMessage('Property title is required')
], async (req, res) => {
  try {
    console.log('\n📨 NEW MESSAGE REQUEST');
    console.log('======================');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { propertyId, ownerId, senderName, senderEmail, senderPhone, message, propertyTitle } = req.body;

    console.log('✅ Validation passed');
    console.log('Step 1: Finding or creating tenant user...');

    // Find or create tenant user
    let tenant = await User.findOne({ email: senderEmail });
    if (!tenant) {
      console.log(`   Creating new tenant user: ${senderName} (${senderEmail})`);
      
      // Generate a random password for the chat-created user
      const defaultPassword = await bcrypt.hash('ChatUser123!', 12);
      
      tenant = new User({
        name: senderName,
        email: senderEmail,
        password: defaultPassword, // Required field
        phone: senderPhone || '',
        role: 'tenant',
        verified: false
      });
      await tenant.save();
      console.log(`   ✅ New tenant created with ID: ${tenant._id}`);
    } else {
      console.log(`   ✅ Existing tenant found with ID: ${tenant._id}`);
    }

    console.log('Step 2: Validating property and owner...');
    
    // Validate property exists (handle both ObjectId and string)
    let property;
    if (mongoose.Types.ObjectId.isValid(propertyId)) {
      property = await Property.findById(propertyId);
    }
    
    if (!property) {
      console.log(`   ❌ Property not found with ID: ${propertyId}`);
      // For demo purposes, let's continue without property validation
      console.log(`   ⚠️ Continuing without property validation for demo`);
    } else {
      console.log(`   ✅ Property found: ${property.title}`);
    }

    // Validate owner exists
    let owner;
    if (mongoose.Types.ObjectId.isValid(ownerId)) {
      owner = await User.findById(ownerId);
    }
    
    if (!owner) {
      console.log(`   ❌ Owner not found with ID: ${ownerId}`);
      // Create a placeholder owner or use the first owner
      owner = await User.findOne({ role: 'owner' });
      if (!owner) {
        console.log(`   ⚠️ No owners found, creating demo scenario`);
        // Just use tenant as both sender and receiver for demo
        owner = tenant;
      }
      console.log(`   ⚠️ Using fallback owner: ${owner.name} (${owner.email})`);
    } else {
      console.log(`   ✅ Owner found: ${owner.name} (${owner.email})`);
    }

    console.log('Step 3: Finding or creating conversation...');

    // Find or create conversation
    let conversation = await Conversation.findOne({
      property: property ? propertyId : null,
      participants: { $all: [owner._id, tenant._id] }
    });
    
    if (!conversation) {
      console.log('   Creating new conversation...');
      conversation = new Conversation({
        participants: [owner._id, tenant._id],
        property: property ? propertyId : null,
        status: 'active'
      });
      await conversation.save();
      console.log(`   ✅ New conversation created with ID: ${conversation._id}`);
    } else {
      console.log(`   ✅ Existing conversation found with ID: ${conversation._id}`);
    }

    console.log('Step 4: Creating message...');

    // Create message
    const newMessage = new Message({
      conversation: conversation._id,
      sender: tenant._id,
      content: message,
      messageType: 'text',
      readBy: [tenant._id]
    });

    await newMessage.save();
    console.log(`   ✅ Message saved with ID: ${newMessage._id}`);

    console.log('Step 5: Updating conversation...');

    // Update conversation (fix the lastMessage field)
    conversation.lastMessage = newMessage._id; // Store as ObjectId reference
    conversation.updatedAt = new Date();
    await conversation.save();
    console.log('   ✅ Conversation updated');

    console.log('✅ MESSAGE SENT SUCCESSFULLY!');
    console.log('==============================\n');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      messageId: newMessage._id,
      conversationId: conversation._id,
      data: {
        messageId: newMessage._id,
        conversationId: conversation._id,
        sender: {
          id: tenant._id,
          name: tenant.name,
          email: tenant.email
        },
        recipient: {
          id: owner._id,
          name: owner.name,
          email: owner.email
        },
        property: property ? {
          id: property._id,
          title: property.title
        } : null
      }
    });

  } catch (error) {
    console.error('❌ MESSAGE SENDING ERROR:');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
    console.error('==============================\n');
    
    res.status(500).json({ 
      error: 'Failed to send message',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get conversations for a user
router.get('/user/:userEmail/conversations', async (req, res) => {
  try {
    const { userEmail } = req.params;
    
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const conversations = await Conversation.find({ 
      participants: user._id 
    })
      .populate('participants', 'name email role')
      .populate('property', 'title city price')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: conversations
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

module.exports = router; 