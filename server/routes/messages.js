const express = require('express');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Messages storage (now supporting conversations)
const messagesFile = path.join(__dirname, '../data/messages.json');
const conversationsFile = path.join(__dirname, '../data/conversations.json');
let messages = [];
let conversations = [];

// Load messages from file
try {
  if (fs.existsSync(messagesFile)) {
    messages = JSON.parse(fs.readFileSync(messagesFile, 'utf8'));
  }
} catch (error) {
  console.log('No existing messages file found, starting fresh');
}

// Load conversations from file
try {
  if (fs.existsSync(conversationsFile)) {
    conversations = JSON.parse(fs.readFileSync(conversationsFile, 'utf8'));
  }
} catch (error) {
  console.log('No existing conversations file found, starting fresh');
}

// Save messages to file
const saveMessages = () => {
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
};

// Save conversations to file
const saveConversations = () => {
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(conversationsFile, JSON.stringify(conversations, null, 2));
};

// Helper function to find or create conversation
const findOrCreateConversation = (propertyId, ownerId, tenantEmail, tenantName, propertyTitle) => {
  let conversation = conversations.find(conv => 
    conv.propertyId === propertyId && 
    conv.ownerId === ownerId && 
    conv.tenantEmail === tenantEmail
  );
  
  if (!conversation) {
    conversation = {
      id: Date.now().toString(),
      propertyId,
      ownerId,
      tenantEmail,
      tenantName,
      propertyTitle,
      createdAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
      messages: []
    };
    conversations.push(conversation);
  }
  
  return conversation;
};

// Send message to property owner
router.post('/', [
  body('propertyId').notEmpty().withMessage('Property ID is required'),
  body('ownerId').notEmpty().withMessage('Owner ID is required'),
  body('senderName').trim().isLength({ min: 2 }).withMessage('Sender name must be at least 2 characters'),
  body('senderEmail').isEmail().withMessage('Valid email is required'),
  body('senderPhone').matches(/^[+]?[0-9\s\-\(\)]{10,15}$/).withMessage('Valid phone number is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  body('propertyTitle').trim().notEmpty().withMessage('Property title is required')
], (req, res) => {
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

    // Create message object (backward compatibility)
    const newMessage = {
      id: Date.now().toString(),
      propertyId,
      ownerId,
      senderName,
      senderEmail,
      senderPhone,
      message,
      propertyTitle,
      sentAt: new Date().toISOString(),
      isRead: false,
      status: 'sent' // sent, delivered, read
    };

    messages.push(newMessage);

    // Also add to conversation system
    const conversation = findOrCreateConversation(propertyId, ownerId, senderEmail, senderName, propertyTitle);
    const conversationMessage = {
      id: Date.now().toString() + '_msg',
      text: message,
      sender: 'tenant',
      senderName,
      senderEmail,
      senderPhone,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    conversation.messages.push(conversationMessage);
    conversation.lastMessageAt = new Date().toISOString();

    saveMessages();
    saveConversations();

    console.log(`New message sent for property "${propertyTitle}":`, {
      from: `${senderName} (${senderEmail})`,
      to: ownerId,
      message: message.substring(0, 50) + '...'
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      messageId: newMessage.id,
      conversationId: conversation.id
    });

  } catch (error) {
    console.error('Message sending error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Reply to conversation (supports both owner and tenant)
router.post('/reply', [
  body('conversationId').notEmpty().withMessage('Conversation ID is required'),
  body('message').trim().isLength({ min: 1 }).withMessage('Message is required')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { conversationId, ownerId, ownerName, tenantEmail, tenantName, message, sender } = req.body;

    // Find conversation
    const conversation = conversations.find(conv => conv.id === conversationId);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Determine sender details
    let replyMessage;
    if (ownerId && ownerName) {
      // Owner reply
      if (conversation.ownerId !== ownerId) {
        return res.status(403).json({ error: 'Not authorized to reply to this conversation' });
      }
      replyMessage = {
        id: Date.now().toString() + '_owner_reply',
        text: message,
        sender: 'owner',
        senderName: ownerName,
        timestamp: new Date().toISOString(),
        status: 'sent'
      };
    } else if (tenantEmail && tenantName) {
      // Tenant reply
      if (conversation.tenantEmail !== tenantEmail) {
        return res.status(403).json({ error: 'Not authorized to reply to this conversation' });
      }
      replyMessage = {
        id: Date.now().toString() + '_tenant_reply',
        text: message,
        sender: 'tenant',
        senderName: tenantName,
        timestamp: new Date().toISOString(),
        status: 'sent'
      };
    } else {
      return res.status(400).json({ error: 'Either owner or tenant details must be provided' });
    }

    conversation.messages.push(replyMessage);
    conversation.lastMessageAt = new Date().toISOString();

    saveConversations();

    console.log(`${replyMessage.sender} reply sent in conversation ${conversationId}:`, {
      from: replyMessage.senderName,
      message: message.substring(0, 50) + '...'
    });

    res.status(201).json({
      success: true,
      message: 'Reply sent successfully',
      messageId: replyMessage.id
    });

  } catch (error) {
    console.error('Reply sending error:', error);
    res.status(500).json({ error: 'Failed to send reply' });
  }
});

// Get conversations for owner
router.get('/conversations/owner/:ownerId', (req, res) => {
  try {
    const { ownerId } = req.params;
    const ownerConversations = conversations.filter(conv => conv.ownerId === ownerId);
    
    // Sort by most recent activity
    ownerConversations.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
    
    // Add unread count for each conversation
    const conversationsWithUnread = ownerConversations.map(conv => ({
      ...conv,
      unreadCount: conv.messages.filter(msg => 
        msg.sender === 'tenant' && msg.status !== 'read'
      ).length,
      lastMessage: conv.messages[conv.messages.length - 1] || null
    }));
    
    res.json(conversationsWithUnread);
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get conversations for tenant
router.get('/conversations/tenant/:tenantEmail', (req, res) => {
  try {
    const { tenantEmail } = req.params;
    const decodedEmail = decodeURIComponent(tenantEmail);
    const tenantConversations = conversations.filter(conv => conv.tenantEmail === decodedEmail);
    
    // Sort by most recent activity
    tenantConversations.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
    
    // Add unread count for each conversation
    const conversationsWithUnread = tenantConversations.map(conv => ({
      ...conv,
      unreadCount: conv.messages.filter(msg => 
        msg.sender === 'owner' && msg.status !== 'read'
      ).length,
      lastMessage: conv.messages[conv.messages.length - 1] || null
    }));
    
    res.json(conversationsWithUnread);
  } catch (error) {
    console.error('Failed to fetch tenant conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get specific conversation with all messages
router.get('/conversations/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = conversations.find(conv => conv.id === conversationId);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    res.json(conversation);
  } catch (error) {
    console.error('Failed to fetch conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// Mark conversation messages as read
router.patch('/conversations/:conversationId/read', (req, res) => {
  try {
    const { conversationId } = req.params;
    const { readerId } = req.body; // ownerId or tenantEmail
    
    const conversation = conversations.find(conv => conv.id === conversationId);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Mark messages as read based on who is reading
    conversation.messages.forEach(msg => {
      if (msg.sender === 'tenant' && readerId === conversation.ownerId) {
        msg.status = 'read';
      } else if (msg.sender === 'owner' && readerId === conversation.tenantEmail) {
        msg.status = 'read';
      }
    });
    
    saveConversations();
    
    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    console.error('Failed to mark messages as read:', error);
    res.status(500).json({ error: 'Failed to update conversation' });
  }
});

// Get messages for a property owner (requires authentication in real app)
router.get('/owner/:ownerId', (req, res) => {
  try {
    const { ownerId } = req.params;
    const ownerMessages = messages.filter(msg => msg.ownerId === ownerId);
    
    // Sort by newest first
    ownerMessages.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
    
    res.json(ownerMessages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get messages for a specific property
router.get('/property/:propertyId', (req, res) => {
  try {
    const { propertyId } = req.params;
    const propertyMessages = messages.filter(msg => msg.propertyId === propertyId);
    
    // Sort by newest first
    propertyMessages.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
    
    res.json(propertyMessages);
  } catch (error) {
    console.error('Failed to fetch property messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Mark message as read
router.patch('/:messageId/read', (req, res) => {
  try {
    const { messageId } = req.params;
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    messages[messageIndex].isRead = true;
    messages[messageIndex].status = 'read';
    saveMessages();
    
    res.json({ success: true, message: 'Message marked as read' });
  } catch (error) {
    console.error('Failed to mark message as read:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// Get message statistics for owner
router.get('/stats/:ownerId', (req, res) => {
  try {
    const { ownerId } = req.params;
    const ownerMessages = messages.filter(msg => msg.ownerId === ownerId);
    const ownerConversations = conversations.filter(conv => conv.ownerId === ownerId);
    
    const totalUnreadConversations = ownerConversations.filter(conv => 
      conv.messages.some(msg => msg.sender === 'tenant' && msg.status !== 'read')
    ).length;
    
    const stats = {
      totalMessages: ownerMessages.length,
      unreadMessages: ownerMessages.filter(msg => !msg.isRead).length,
      totalConversations: ownerConversations.length,
      unreadConversations: totalUnreadConversations,
      todayMessages: ownerMessages.filter(msg => {
        const today = new Date().toDateString();
        const messageDate = new Date(msg.sentAt).toDateString();
        return today === messageDate;
      }).length,
      lastMessage: ownerMessages.length > 0 ? ownerMessages.sort((a, b) => 
        new Date(b.sentAt) - new Date(a.sentAt)
      )[0] : null
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Failed to fetch message stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get message statistics for tenant
router.get('/tenant-stats/:tenantEmail', (req, res) => {
  try {
    const { tenantEmail } = req.params;
    const decodedEmail = decodeURIComponent(tenantEmail);
    const tenantConversations = conversations.filter(conv => conv.tenantEmail === decodedEmail);
    
    const totalUnreadConversations = tenantConversations.filter(conv => 
      conv.messages.some(msg => msg.sender === 'owner' && msg.status !== 'read')
    ).length;
    
    const stats = {
      totalConversations: tenantConversations.length,
      unreadConversations: totalUnreadConversations
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Failed to fetch tenant stats:', error);
    res.status(500).json({ error: 'Failed to fetch tenant statistics' });
  }
});

module.exports = router; 