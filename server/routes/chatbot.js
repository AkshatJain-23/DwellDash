const express = require('express');
const router = express.Router();
const ragService = require('../services/ragService');
const rateLimit = require('express-rate-limit');

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

    // Get quick suggestions
    const suggestions = ragService.getQuickSuggestions(message);

    // Log conversation for analytics (optional)
    console.log(`Chatbot conversation - Session: ${sessionId || 'anonymous'}, Query: "${message}", Response Time: ${responseTime}ms`);

    res.json({
      success: true,
      data: {
        response: response,
        suggestions: suggestions,
        responseTime: responseTime,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again.',
      fallback: "I apologize for the technical difficulty. Please contact our support team at dwelldash3@gmail.com or +91 98765 43210 for immediate assistance."
    });
  }
});

// Get conversation suggestions
router.get('/suggestions', (req, res) => {
  try {
    const suggestions = [
      {
        category: "Getting Started",
        questions: [
          "How do I book a PG?",
          "How do I list my property?",
          "Is DwellDash free?"
        ]
      },
      {
        category: "Support",
        questions: [
          "How to contact support?",
          "What if I have issues?",
          "How to cancel booking?"
        ]
      },
      {
        category: "Safety",
        questions: [
          "Are properties verified?",
          "Is payment secure?",
          "What safety measures exist?"
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

// Get quick facts about DwellDash
router.get('/facts', (req, res) => {
  try {
    const facts = [
      "🏠 50+ cities covered across India",
      "✅ All properties verified by our team",
      "💰 Zero brokerage for tenants",
      "🔒 Secure payment processing",
      "📞 24/7 customer support",
      "⭐ Thousands of happy customers"
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

// Health check for chatbot service
router.get('/health', (req, res) => {
  try {
    const health = {
      status: 'healthy',
      service: 'DwellBot RAG Chatbot',
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      features: {
        rag_enabled: true,
        llm_provider: 'Groq',
        knowledge_base: 'loaded',
        rate_limiting: 'active'
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