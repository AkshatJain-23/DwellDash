const express = require('express');
const router = express.Router();
const RAGService = require('../services/ragService');
const rateLimit = require('express-rate-limit');

// Initialize RAG service
const ragService = new RAGService();

// Rate limiting for chatbot - 30 messages per minute per IP
const chatbotRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
  message: {
    success: false,
    error: 'Too many messages sent. Please wait a moment before sending another message.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Chat endpoint
router.post('/chat', chatbotRateLimit, async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a string'
      });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message cannot be empty'
      });
    }

    if (message.length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Message is too long. Please keep it under 500 characters.'
      });
    }

    // Generate response using RAG service
    const startTime = Date.now();
    const response = await ragService.chat(message);
    const responseTime = Date.now() - startTime;

    // Get contextual quick responses
    const quickResponses = ragService.getQuickResponses();

    // Log conversation for analytics (optional)
    console.log(`Chatbot conversation - Session: ${sessionId || 'anonymous'}, Query: "${message}", Response Time: ${responseTime}ms`);

    res.json({
      success: true,
      data: {
        response: response,
        quickResponses: quickResponses.slice(0, 3), // Limit to 3 suggestions
        responseTime: responseTime,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again.',
      fallback: "I apologize for the technical difficulty. Please contact our support team at dwelldash3@gmail.com or +91 8426076800 for immediate assistance."
    });
  }
});

// Get conversation suggestions with enhanced categories
router.get('/suggestions', (req, res) => {
  try {
    const suggestions = [
      {
        category: "Getting Started",
        icon: "🚀",
        questions: [
          "How do I get started with DwellDash?",
          "Complete guide for new users",
          "Step by step booking process"
        ]
      },
      {
        category: "Safety & Security",
        icon: "🔒",
        questions: [
          "Are properties verified?",
          "Safety guidelines for PG living",
          "Emergency contact information"
        ]
      },
      {
        category: "Learning Resources",
        icon: "📚",
        questions: [
          "Video tutorials available?",
          "How to search effectively?",
          "Tips for property visits"
        ]
      },
      {
        category: "Support",
        icon: "🎧",
        questions: [
          "How to contact support?",
          "Refund and cancellation policy",
          "Technical help needed"
        ]
      },
      {
        category: "About DwellDash",
        icon: "🏢",
        questions: [
          "What is DwellDash?",
          "Company mission and story",
          "Which cities are covered?"
        ]
      }
    ];

    res.json({
      success: true,
      data: suggestions
    });

  } catch (error) {
    console.error('Suggestions API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load suggestions'
    });
  }
});

// Get enhanced quick facts about DwellDash
router.get('/facts', (req, res) => {
  try {
    const facts = [
      {
        icon: "🏠",
        text: "50+ cities covered across India",
        category: "Coverage"
      },
      {
        icon: "✅",
        text: "All properties verified by our team",
        category: "Verification"
      },
      {
        icon: "💰",
        text: "Zero brokerage for tenants",
        category: "Pricing"
      },
      {
        icon: "🔒",
        text: "Secure payment processing",
        category: "Security"
      },
      {
        icon: "📞",
        text: "24/7 customer support",
        category: "Support"
      },
      {
        icon: "⭐",
        text: "50,000+ happy tenants",
        category: "Trust"
      },
      {
        icon: "📱",
        text: "Mobile-optimized web platform",
        category: "Access"
      },
      {
        icon: "🚀",
        text: "Founded in 2023, growing rapidly",
        category: "Company"
      }
    ];

    res.json({
      success: true,
      data: facts
    });

  } catch (error) {
    console.error('Facts API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load facts'
    });
  }
});

// Get knowledge base statistics
router.get('/stats', (req, res) => {
  try {
    const stats = ragService.getStats();
    
    res.json({
      success: true,
      data: {
        ...stats,
        service: 'DwellBot RAG Chatbot',
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Stats API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load stats'
    });
  }
});

// Health check for chatbot service
router.get('/health', (req, res) => {
  try {
    const stats = ragService.getStats();
    
    const health = {
      status: 'healthy',
      service: 'DwellBot RAG Chatbot',
      version: '2.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      features: {
        rag_enabled: true,
        llm_provider: 'Groq',
        knowledge_base: 'loaded',
        rate_limiting: 'active',
        intent_detection: 'enabled',
        enhanced_scoring: 'active'
      },
      knowledge_base: {
        total_items: stats.totalKnowledgeItems,
        total_faqs: stats.totalFAQs,
        categories: stats.categories.length
      }
    };

    res.json({
      success: true,
      data: health
    });

  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      error: 'Health check failed'
    });
  }
});

module.exports = router; 