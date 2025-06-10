const express = require('express');
const router = express.Router();
const { auth, optionalAuth } = require('../middleware/auth');
const Property = require('../models/Property');
const User = require('../models/User');

// Import email service
let sendContactEmail;
try {
  const emailService = require('../services/emailService');
  sendContactEmail = emailService.sendContactEmail;
} catch (error) {
  console.log('⚠️  Email service not available for contact forms');
  sendContactEmail = async () => ({ success: false, error: 'Email service unavailable' });
}

// Property Owners Support
router.get('/property-owners', (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'Property Owners',
      description: 'List your property and start earning',
      icon: '🏠',
      sections: [
        {
          title: 'Getting Started',
          content: [
            'Create your property owner account',
            'Complete profile verification with documents',
            'Add property details and high-quality photos',
            'Set pricing and availability',
            'Submit for review and approval'
          ]
        },
        {
          title: 'Benefits',
          content: [
            'Zero upfront listing fees',
            'Verified tenant connections',
            'Secure payment processing',
            'Marketing and promotion support',
            '24/7 customer support'
          ]
        },
        {
          title: 'Requirements',
          content: [
            'Valid property ownership documents',
            'Government issued ID verification',
            'Property photos (minimum 5)',
            'Contact information',
            'Basic property amenities list'
          ]
        }
      ],
      actions: [
        {
          label: 'List Property',
          type: 'primary',
          link: '/list-property'
        },
        {
          label: 'Contact Support',
          type: 'secondary',
          link: '/contact'
        }
      ]
    }
  });
});

// Tenants Support
router.get('/tenants', (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'Tenants',
      description: 'Find your perfect PG accommodation',
      icon: '🏡',
      sections: [
        {
          title: 'How to Search',
          content: [
            'Use location filters to find properties in your preferred area',
            'Set budget range to match your affordability',
            'Filter by amenities you need (WiFi, AC, Meals, etc.)',
            'Check property photos and reviews',
            'Contact property owners directly'
          ]
        },
        {
          title: 'Booking Process',
          content: [
            'Browse verified property listings',
            'Contact owners through our platform',
            'Schedule property visits',
            'Negotiate terms and pricing',
            'Complete booking through secure payment'
          ]
        },
        {
          title: 'Safety Tips',
          content: [
            'Always visit properties before booking',
            'Verify property owner identity',
            'Check all amenities mentioned in listing',
            'Read terms and conditions carefully',
            'Keep all communication records'
          ]
        }
      ],
      actions: [
        {
          label: 'Browse PGs',
          type: 'primary',
          link: '/properties'
        },
        {
          label: 'Search Tips',
          type: 'secondary',
          link: '/search-guide'
        }
      ]
    }
  });
});

// Safety & Security Support
router.get('/safety-security', (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'Safety & Security',
      description: 'Report safety concerns or issues',
      icon: '🔒',
      sections: [
        {
          title: 'Property Verification',
          content: [
            'All properties undergo strict verification',
            'Document verification (ownership/legal authority)',
            'Physical property inspection by our team',
            'Amenity confirmation and quality checks',
            'Owner background verification'
          ]
        },
        {
          title: 'Report Issues',
          content: [
            'Property not matching description',
            'Safety concerns or hazards',
            'Fraudulent listings or activities',
            'Inappropriate behavior by users',
            'Payment or booking disputes'
          ]
        },
        {
          title: 'Emergency Contacts',
          content: [
            'DwellDash 24/7 Support: +91 8426076800',
            'Email: dwelldash3@gmail.com',
            'Police Emergency: 100',
            'Women\'s Helpline: 1091',
            'Cyber Crime: 1930'
          ]
        }
      ],
      actions: [
        {
          label: 'Report Issue',
          type: 'primary',
          link: '/report-issue'
        },
        {
          label: 'Safety Guidelines',
          type: 'secondary',
          link: '/safety-guide'
        }
      ]
    }
  });
});

// Technical Support
router.get('/technical-support', (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'Technical Support',
      description: 'App or website related issues',
      icon: '🛠️',
      sections: [
        {
          title: 'Common Issues',
          content: [
            'Login or registration problems',
            'Password reset issues',
            'Property listing not displaying',
            'Search filters not working',
            'Payment processing errors',
            'Image upload problems'
          ]
        },
        {
          title: 'Troubleshooting',
          content: [
            'Clear browser cache and cookies',
            'Try using incognito/private browsing mode',
            'Check internet connection stability',
            'Update your browser to latest version',
            'Disable browser extensions temporarily'
          ]
        },
        {
          title: 'Contact Technical Support',
          content: [
            'Email: dwelldash3@gmail.com',
            'Phone: +91 8426076800',
            'Live Chat: Available on website',
            'Response Time: 2-4 hours for urgent issues',
            'Business Hours: Monday-Saturday, 9 AM-8 PM'
          ]
        }
      ],
      actions: [
        {
          label: 'Get Help',
          type: 'primary',
          link: '/contact'
        },
        {
          label: 'FAQ',
          type: 'secondary',
          link: '/faq'
        }
      ]
    }
  });
});

// Get all support categories
router.get('/categories', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'property-owners',
        title: 'Property Owners',
        description: 'List your property and start earning',
        icon: '🏠',
        link: '/api/support/property-owners'
      },
      {
        id: 'tenants',
        title: 'Tenants',
        description: 'Find your perfect PG accommodation',
        icon: '🏡',
        link: '/api/support/tenants'
      },
      {
        id: 'safety-security',
        title: 'Safety & Security',
        description: 'Report safety concerns or issues',
        icon: '🔒',
        link: '/api/support/safety-security'
      },
      {
        id: 'technical-support',
        title: 'Technical Support',
        description: 'App or website related issues',
        icon: '🛠️',
        link: '/api/support/technical-support'
      }
    ]
  });
});

// Submit support ticket
router.post('/ticket', optionalAuth, [
  require('express-validator').body('category').notEmpty().withMessage('Category is required'),
  require('express-validator').body('subject').trim().isLength({ min: 5 }).withMessage('Subject must be at least 5 characters'),
  require('express-validator').body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  require('express-validator').body('email').isEmail().withMessage('Valid email is required'),
  require('express-validator').body('name').trim().isLength({ min: 2 }).withMessage('Name is required')
], async (req, res) => {
  try {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { category, subject, message, email, name, phone } = req.body;

    // Log the support ticket
    console.log('\n📧 NEW SUPPORT TICKET');
    console.log('Category:', category);
    console.log('From:', `${name} (${email})`);
    console.log('Phone:', phone || 'Not provided');
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('User ID:', req.user?.userId || 'Anonymous');
    console.log('Timestamp:', new Date().toISOString());
    console.log('─'.repeat(50));

    const ticketId = 'TKT-' + Date.now();

    // Send email notification to support team
    try {
      const contactData = {
        firstName: name.split(' ')[0] || name,
        lastName: name.split(' ').slice(1).join(' ') || '',
        email: email,
        subject: `[${category.toUpperCase()}] ${subject}`,
        message: `Support Ticket ID: ${ticketId}\nCategory: ${category}\nPhone: ${phone || 'Not provided'}\nUser ID: ${req.user?.userId || 'Anonymous'}\n\n${message}`
      };
      
      const emailResult = await sendContactEmail(contactData);
      
      if (emailResult.success) {
        console.log('✅ Support ticket email sent to dwelldash3@gmail.com');
        console.log('📧 Email ID:', emailResult.messageId);
        
        if (emailResult.previewUrl) {
          console.log('🔗 Preview URL:', emailResult.previewUrl);
        }
      } else {
        console.log('⚠️ Failed to send support ticket email:', emailResult.error);
      }
      
    } catch (emailError) {
      console.error('❌ Error sending support ticket email:', emailError.message);
      // Continue processing even if email fails
    }

    res.json({
      success: true,
      message: 'Support ticket submitted successfully. We will get back to you within 24 hours.',
      ticketId: ticketId,
      data: {
        ticketId,
        category,
        subject,
        status: 'open',
        submittedAt: new Date().toISOString(),
        estimatedResponse: '24 hours',
        contactEmail: 'dwelldash3@gmail.com'
      }
    });

  } catch (error) {
    console.error('Support ticket submission error:', error);
    res.status(500).json({ 
      error: 'Failed to submit support ticket. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Add a dedicated contact form endpoint
router.post('/contact-form', [
  require('express-validator').body('firstName').trim().isLength({ min: 2 }).withMessage('First name is required'),
  require('express-validator').body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'), 
  require('express-validator').body('email').isEmail().withMessage('Valid email is required'),
  require('express-validator').body('subject').trim().isLength({ min: 5 }).withMessage('Subject must be at least 5 characters'),
  require('express-validator').body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
], async (req, res) => {
  try {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, subject, message } = req.body;

    console.log('\n📧 NEW CONTACT FORM MESSAGE');
    console.log('From:', `${firstName} ${lastName} (${email})`);
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('Timestamp:', new Date().toISOString());
    console.log('─'.repeat(50));

    // Send email to dwelldash3@gmail.com
    try {
      const emailResult = await sendContactEmail({
        firstName,
        lastName,
        email,
        subject,
        message
      });
      
      if (emailResult.success) {
        console.log('✅ Contact form email sent to dwelldash3@gmail.com');
        console.log('📧 Email ID:', emailResult.messageId);
        
        res.json({
          success: true,
          message: 'Your message has been sent successfully! We will get back to you soon.',
          data: {
            sentAt: new Date().toISOString(),
            estimatedResponse: '24-48 hours',
            contactEmail: 'dwelldash3@gmail.com'
          }
        });
        
      } else {
        throw new Error(emailResult.error);
      }
      
    } catch (emailError) {
      console.error('❌ Failed to send contact form email:', emailError.message);
      
      res.status(500).json({
        error: 'Failed to send your message. Please try again or contact us directly.',
        fallback: {
          email: 'dwelldash3@gmail.com',
          phone: '+91 8426076800'
        }
      });
    }

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      error: 'Failed to process contact form. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Contact information
router.get('/contact', (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'Contact Information',
      phone: '+91 8426076800',
      email: 'dwelldash3@gmail.com',
      businessHours: 'Monday-Saturday, 9 AM-8 PM',
      emergencySupport: '24/7 for safety concerns',
      offices: [
        {
          city: 'Gurgaon',
          address: 'Sector 44, Gurgaon, Haryana',
          phone: '+91 8426076800'
        },
        {
          city: 'Bangalore',
          address: 'Koramangala, Bangalore, Karnataka',
          phone: '+91 8426076800'
        },
        {
          city: 'Mumbai',
          address: 'Andheri West, Mumbai, Maharashtra',
          phone: '+91 8426076800'
        }
      ],
      socialMedia: {
        website: 'https://dwelldash.com',
        email: 'dwelldash3@gmail.com'
      }
    }
  });
});

module.exports = router; 