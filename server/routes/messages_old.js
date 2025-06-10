const express = require('express');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Property = require('../models/Property');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Helper function to find or create conversation
const findOrCreateConversation = async (propertyId, ownerId, tenantId, propertyTitle) => {
  try {
    let conversation = await Conversation.findOne({
      property: propertyId,
      participants: { $all: [ownerId, tenantId] }
    });
    
    if (!conversation) {
      conversation = new Conversation({
        participants: [ownerId, tenantId],
        property: propertyId,
        status: 'active',
        unreadCounts: {
          [ownerId]: 0,
          [tenantId]: 0
        }
      });
      await conversation.save();
      console.log(`✅ Created new conversation for property: ${propertyTitle}`);
    }
    
    return conversation;
  } catch (error) {
    console.error('Error finding/creating conversation:', error);
    throw error;
  }
};

// Send message to property owner
router.post('/', [
  body('propertyId').notEmpty().withMessage('Property ID is required'),
  body('ownerId').notEmpty().withMessage('Owner ID is required'),
  body('senderName').trim().isLength({ min: 2 }).withMessage('Sender name must be at least 2 characters'),
  body('senderEmail').isEmail().withMessage('Valid email is required'),
  body('senderPhone').optional({ nullable: true, checkFalsy: true }).matches(/^[+]?[0-9\s\-\(\)]{10,15}$/).withMessage('Valid phone number required if provided'),
  body('message').trim().isLength({ min: 1 }).withMessage('Message cannot be empty'),
  body('propertyTitle').trim().notEmpty().withMessage('Property title is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      propertyId,
      ownerId,
      senderName,
      senderEmail,
      senderPhone,
      message,
      propertyTitle
    } = req.body;

    // Find or create tenant user
    let tenant = await User.findOne({ email: senderEmail });
    if (!tenant) {
      tenant = new User({
        name: senderName,
        email: senderEmail,
        phone: senderPhone || '',
        role: 'tenant',
        verified: false
      });
      await tenant.save();
      console.log(`✅ Created new tenant user: ${senderEmail}`);
    }

    // Verify property and owner exist
    const property = await Property.findById(propertyId);
    const owner = await User.findById(ownerId);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    // Find or create conversation
    const conversation = await findOrCreateConversation(propertyId, ownerId, tenant._id, propertyTitle);

    // Create message
    const newMessage = new Message({
      conversation: conversation._id,
      sender: tenant._id,
      content: message,
      messageType: 'text',
      readBy: [tenant._id], // Sender has read it
      deleted: false
    });

    await newMessage.save();

    // Update conversation
    conversation.lastMessage = message;
    conversation.unreadCounts[ownerId] = (conversation.unreadCounts[ownerId] || 0) + 1;
    await conversation.save();

    console.log(`📨 New message sent for property "${propertyTitle}":`, {
      from: `${senderName} (${senderEmail})`,
      to: owner.email,
      message: message.substring(0, 50) + '...'
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      messageId: newMessage._id,
      conversationId: conversation._id,
      data: {
        messageId: newMessage._id,
        conversationId: conversation._id,
        sentAt: newMessage.createdAt,
        status: 'sent'
      }
    });

  } catch (error) {
    console.error('❌ Message sending error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to send message',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Reply to conversation
router.post('/reply', [
  body('conversationId').notEmpty().withMessage('Conversation ID is required'),
  body('message').trim().isLength({ min: 1 }).withMessage('Message is required'),
  body('senderEmail').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { conversationId, senderEmail, message } = req.body;

    // Find conversation
    const conversation = await Conversation.findById(conversationId)
      .populate('participants', 'email name role')
      .populate('property', 'title');
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Find sender
    const sender = await User.findOne({ email: senderEmail });
    if (!sender) {
      return res.status(404).json({ error: 'Sender not found' });
    }

    // Verify sender is participant
    const isParticipant = conversation.participants.some(p => p._id.toString() === sender._id.toString());
    if (!isParticipant) {
      return res.status(403).json({ error: 'Not authorized to reply to this conversation' });
    }

    // Create reply message
    const replyMessage = new Message({
      conversation: conversation._id,
      sender: sender._id,
      content: message,
      messageType: 'text',
      readBy: [sender._id],
      deleted: false
    });

    await replyMessage.save();

    // Update conversation
    conversation.lastMessage = message;
    
    // Update unread counts for other participants
    conversation.participants.forEach(participant => {
      if (participant._id.toString() !== sender._id.toString()) {
        conversation.unreadCounts[participant._id] = (conversation.unreadCounts[participant._id] || 0) + 1;
      }
    });

    await conversation.save();

    console.log(`💬 Reply sent in conversation ${conversationId}:`, {
      from: `${sender.name} (${sender.email})`,
      property: conversation.property?.title,
      message: message.substring(0, 50) + '...'
    });

    res.status(201).json({
      success: true,
      message: 'Reply sent successfully',
      data: {
        messageId: replyMessage._id,
        conversationId: conversation._id,
        sentAt: replyMessage.createdAt,
        status: 'sent'
      }
    });

  } catch (error) {
    console.error('❌ Reply sending error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to send reply',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get messages for a property (for property owner)
router.get('/property/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Find conversations for this property
    const conversations = await Conversation.find({ property: propertyId })
      .populate('participants', 'name email phone role')
      .populate('property', 'title')
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get message counts for each conversation
    const conversationsWithCounts = await Promise.all(
      conversations.map(async (conv) => {
        const messageCount = await Message.countDocuments({ conversation: conv._id });
        const lastMessage = await Message.findOne({ conversation: conv._id })
          .sort({ createdAt: -1 })
          .populate('sender', 'name email');

        return {
          id: conv._id,
          participants: conv.participants,
          property: conv.property,
          messageCount,
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            sender: lastMessage.sender,
            sentAt: lastMessage.createdAt
          } : null,
          unreadCount: conv.unreadCounts || {},
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt
        };
      })
    );

    const total = await Conversation.countDocuments({ property: propertyId });

    res.json({
      success: true,
      data: conversationsWithCounts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching property messages:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch messages',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get conversation messages
router.get('/conversation/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Verify conversation exists
    const conversation = await Conversation.findById(conversationId)
      .populate('participants', 'name email role')
      .populate('property', 'title');

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Get messages
    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments({ conversation: conversationId });

    res.json({
      success: true,
      data: {
        conversation: {
          id: conversation._id,
          participants: conversation.participants,
          property: conversation.property,
          status: conversation.status
        },
        messages: messages.reverse(), // Most recent at bottom
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching conversation messages:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch conversation',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Mark conversation as read
router.post('/conversation/:conversationId/read', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Reset unread count for this user
    conversation.unreadCounts[user._id] = 0;
    await conversation.save();

    // Mark all messages in conversation as read by this user
    await Message.updateMany(
      { 
        conversation: conversationId,
        readBy: { $ne: user._id }
      },
      { 
        $addToSet: { readBy: user._id }
      }
    );

    res.json({
      success: true,
      message: 'Conversation marked as read'
    });

  } catch (error) {
    console.error('❌ Error marking conversation as read:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to mark as read'
    });
  }
});

// Get all conversations for a user
router.get('/user/:userEmail/conversations', async (req, res) => {
  try {
    const { userEmail } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const conversations = await Conversation.find({ 
      participants: user._id 
    })
      .populate('participants', 'name email role')
      .populate('property', 'title city price images')
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await Message.findOne({ conversation: conv._id })
          .sort({ createdAt: -1 })
          .populate('sender', 'name email');

        return {
          id: conv._id,
          participants: conv.participants,
          property: conv.property,
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            sender: lastMessage.sender,
            sentAt: lastMessage.createdAt
          } : null,
          unreadCount: conv.unreadCounts[user._id] || 0,
          updatedAt: conv.updatedAt
        };
      })
    );

    const total = await Conversation.countDocuments({ participants: user._id });

    res.json({
      success: true,
      data: conversationsWithDetails,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching user conversations:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch conversations'
    });
  }
});

// Delete a conversation (soft delete)
router.delete('/conversation/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Verify user is participant
    const isParticipant = conversation.participants.includes(user._id);
    if (!isParticipant) {
      return res.status(403).json({ error: 'Not authorized to delete this conversation' });
    }

    // Mark conversation as deleted for this user
    conversation.status = 'deleted';
    await conversation.save();

    res.json({
      success: true,
      message: 'Conversation deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting conversation:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete conversation'
    });
  }
});

// Get message statistics
router.get('/stats', async (req, res) => {
  try {
    const [totalMessages, totalConversations, activeConversations] = await Promise.all([
      Message.countDocuments(),
      Conversation.countDocuments(),
      Conversation.countDocuments({ status: 'active' })
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentMessages = await Message.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      success: true,
      data: {
        totalMessages,
        totalConversations,
        activeConversations,
        recentMessages,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error fetching message stats:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

module.exports = router; 