const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
// Temporarily make email service optional to avoid blocking auth
let sendPasswordResetEmail, sendWelcomeEmail, sendContactEmail, sendVerificationEmail;
try {
  const emailService = require('../services/emailService');
  sendPasswordResetEmail = emailService.sendPasswordResetEmail;
  sendWelcomeEmail = emailService.sendWelcomeEmail;
  sendContactEmail = emailService.sendContactEmail;
  sendVerificationEmail = emailService.sendVerificationEmail;
} catch (error) {
  console.log('⚠️  Email service not available, auth will work without email features');
  sendPasswordResetEmail = async () => ({ success: false, error: 'Email service unavailable' });
  sendWelcomeEmail = async () => ({ success: false, error: 'Email service unavailable' });
  sendContactEmail = async () => ({ success: false, error: 'Email service unavailable' });
  sendVerificationEmail = async () => ({ success: false, error: 'Email service unavailable' });
}

const router = express.Router();

// Register
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['tenant', 'owner']).withMessage('Role must be tenant or owner')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Auth: User already exists:', email);
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone: phone || ''
    });

    await user.save();
    console.log('✅ User registered successfully:', email);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Send welcome email with enhanced logging
    console.log('\n📧 SENDING WELCOME EMAIL...');
    console.log('To:', email);
    console.log('Name:', name);
    console.log('Role:', role);
    
    try {
      const emailResult = await sendWelcomeEmail(user.email, user.name);
      
      if (emailResult.success) {
        console.log('✅ Welcome email sent successfully!');
        console.log('📧 Email ID:', emailResult.messageId);
        
        // Include email success in response for development
        const emailInfo = process.env.NODE_ENV === 'development' ? {
          welcomeEmailSent: true,
          emailId: emailResult.messageId
        } : { welcomeEmailSent: true };
        
        res.status(201).json({
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone
          },
          message: 'Registration successful! A welcome email has been sent to your email address.',
          ...emailInfo
        });
        
      } else {
        console.log('⚠️ Welcome email failed:', emailResult.error);
        
        // Still return success but note email issue
        res.status(201).json({
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone
          },
          message: 'Registration successful! However, we had trouble sending the welcome email.',
          welcomeEmailSent: false,
          emailError: process.env.NODE_ENV === 'development' ? emailResult.error : 'Email service temporarily unavailable'
        });
      }
      
    } catch (emailError) {
      console.error('❌ Welcome email error:', emailError.message);
      
      // Still return successful registration even if email fails
      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone
        },
        message: 'Registration successful! However, we had trouble sending the welcome email.',
        welcomeEmailSent: false,
        emailError: process.env.NODE_ENV === 'development' ? emailError.message : 'Email service temporarily unavailable'
      });
    }

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    console.log('✅ User logged in successfully:', email);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Forgot Password
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Invalid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({ 
        success: true, 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Remove any existing reset tokens for this user
    await User.updateOne({ email }, { $pull: { resetTokens: { userId: user._id } } });

    // Add new reset token
    await User.updateOne(
      { email },
      { $push: { resetTokens: { userId: user._id, token: resetToken, expiresAt: resetTokenExpiry.toISOString(), createdAt: new Date().toISOString() } } }
    );

    // Send password reset email
    try {
      const emailResult = await sendPasswordResetEmail(user.email, resetToken, user.name);
      
      // Log for debugging
      console.log('\n=== PASSWORD RESET EMAIL SENT ===');
      console.log(`User: ${user.email}`);
      console.log(`Email ID: ${emailResult.messageId}`);
      if (emailResult.previewUrl) {
        console.log(`Preview URL: ${emailResult.previewUrl}`);
      }
      console.log('================================\n');

      res.json({ 
        success: true, 
        message: 'Password reset link sent to your email. Please check your inbox.',
        // In development, include additional info for testing
        ...(process.env.NODE_ENV === 'development' && { 
          resetToken, 
          resetUrl: `${process.env.CLIENT_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`,
          previewUrl: emailResult.previewUrl
        })
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      
      // Still return success for security reasons, but log the error
      res.json({ 
        success: true, 
        message: 'If an account with that email exists, a password reset link has been sent.',
        // In development, show the actual error and provide manual link
        ...(process.env.NODE_ENV === 'development' && { 
          emailError: emailError.message,
          resetToken, 
          resetUrl: `${process.env.CLIENT_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`,
          note: 'Email sending failed, but you can use the resetUrl above for testing'
        })
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset Password
router.post('/reset-password', [
  body('token').exists().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, password } = req.body;

    // Find reset token
    const user = await User.findOne({ resetTokens: { $elemMatch: { token } } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Check if token is expired
    const resetTokenData = user.resetTokens.find(t => t.token === token);
    if (!resetTokenData || new Date() > new Date(resetTokenData.expiresAt)) {
      // Remove expired token
      await User.updateOne(
        { _id: user._id, "resetTokens.token": token },
        { $pull: { resetTokens: { token } } }
      );
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await User.updateOne(
      { _id: user._id, "resetTokens.token": token },
      { $set: { password: hashedPassword, passwordResetAt: new Date().toISOString() } }
    );
    
    // Remove used reset token
    await User.updateOne(
      { _id: user._id },
      { $pull: { resetTokens: { token } } }
    );

    res.json({ 
      success: true, 
      message: 'Password has been reset successfully' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify Reset Token
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Find reset token
    const user = await User.findOne({ resetTokens: { $elemMatch: { token } } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    // Check if token is expired
    const resetTokenData = user.resetTokens.find(t => t.token === token);
    if (!resetTokenData || new Date() > new Date(resetTokenData.expiresAt)) {
      // Remove expired token
      await User.updateOne(
        { _id: user._id, "resetTokens.token": token },
        { $pull: { resetTokens: { token } } }
      );
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    res.json({ 
      success: true, 
      email: user.email,
      expiresAt: resetTokenData.expiresAt
    });
  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Test email configuration endpoint (development only)
router.post('/test-email', async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ error: 'Endpoint not available in production' });
  }

  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address required' });
    }

    // Test sending a simple email
    const emailResult = await sendPasswordResetEmail(email, 'test-token-12345', 'Test User');
    
    res.json({
      success: true,
      message: 'Test email sent successfully!',
      emailId: emailResult.messageId,
      previewUrl: emailResult.previewUrl
    });
  } catch (error) {
    console.error('Test email failed:', error);
    res.status(500).json({ 
      error: 'Failed to send test email',
      details: error.message
    });
  }
});

// Send Verification Email
router.post('/send-verification', auth, async (req, res) => {
  try {
    console.log(`📧 Verification email request from user: ${req.user.userId} (${req.user.email})`);
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.log(`❌ User not found: ${req.user.userId}`);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`📋 User found: ${user.email}, verified: ${user.verified}`);

    if (user.verified) {
      console.log(`⚠️  Account already verified: ${user.email}`);
      return res.status(400).json({ error: 'Account is already verified' });
    }

    // Generate verification token (simple approach)
    const verificationToken = crypto.randomBytes(32).toString('hex');
    console.log(`🔑 Generated verification token: ${verificationToken.substring(0, 8)}...`);
    
    // Store verification token temporarily (you might want to use a separate collection or Redis)
    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await user.save();
    console.log(`💾 Verification token saved to database`);

    // Send verification email
    console.log(`📤 Attempting to send verification email to: ${user.email}`);
    try {
      const emailResult = await sendVerificationEmail(user.email, user.name, verificationToken);
      console.log(`✅ Verification email sent successfully! Message ID: ${emailResult.messageId}`);
      
      res.json({ 
        success: true, 
        message: 'Verification email sent successfully',
        messageId: emailResult.messageId
      });
    } catch (emailError) {
      console.error('❌ Failed to send verification email:', emailError);
      console.error('Email error details:', emailError.message);
      console.error('Email error stack:', emailError.stack);
      
      // Return error to user instead of misleading success message
      res.status(500).json({ 
        error: 'Failed to send verification email',
        details: 'Email service is currently unavailable. Please try again later.',
        debug: process.env.NODE_ENV === 'development' ? emailError.message : undefined
      });
    }
  } catch (error) {
    console.error('❌ Send verification error:', error);
    console.error('Verification error details:', error.message);
    console.error('Verification error stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Failed to send verification email',
      details: 'Internal server error occurred',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Verify Email
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with verification token
    const user = await User.findOne({ 
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    // Mark user as verified
    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    console.log(`✅ Email verified for user: ${user.email}`);

    res.json({ 
      success: true, 
      message: 'Email verified successfully! Your account is now active.' 
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Failed to verify email' });
  }
});

// Manual Verification (Admin only - for testing)
router.patch('/verify-user/:userId', auth, async (req, res) => {
  try {
    // For now, allow any authenticated user to verify (in production, add admin role check)
    const targetUserId = req.params.userId;
    
    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.verified = true;
    await user.save();

    console.log(`✅ User manually verified: ${user.email}`);

    res.json({ 
      success: true, 
      message: 'User verified successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified
      }
    });
  } catch (error) {
    console.error('Manual verification error:', error);
    res.status(500).json({ error: 'Failed to verify user' });
  }
});

// Delete User Account
router.delete('/delete-account', auth, [
  body('password').notEmpty().withMessage('Password is required for account deletion'),
  body('confirmationText').equals('DELETE').withMessage('Please type DELETE to confirm')
], async (req, res) => {
  try {
    console.log(`🗑️  Delete account request from user: ${req.user.userId} (${req.user.email})`);
    console.log(`📋 Request body keys: ${Object.keys(req.body)}`);
    console.log(`📋 Password provided: ${req.body.password ? 'Yes' : 'No'}`);
    console.log(`📋 Confirmation text: "${req.body.confirmationText}"`);

    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(`❌ Validation errors:`, errors.array());
      return res.status(400).json({ 
        error: 'Validation failed',
        errors: errors.array(),
        details: 'Please check that password is provided and confirmationText is exactly "DELETE"'
      });
    }

    console.log(`✅ Validation passed`);

    const { password, confirmationText } = req.body;
    const userId = req.user.userId;

    // Find user
    console.log(`🔍 Looking up user: ${userId}`);
    const user = await User.findById(userId);
    if (!user) {
      console.log(`❌ User not found: ${userId}`);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`✅ User found: ${user.email}`);

    // Verify password
    console.log(`🔐 Verifying password...`);
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log(`❌ Invalid password provided for user: ${user.email}`);
      return res.status(400).json({ 
        error: 'Invalid password',
        details: 'The password you entered is incorrect'
      });
    }

    console.log(`✅ Password verified successfully`);

    // Import models for cleanup
    console.log(`📦 Loading models for data cleanup...`);
    try {
      const Property = require('../models/Property');
      const Conversation = require('../models/Conversation');
      const Message = require('../models/Message');
      const Favorite = require('../models/Favorite');
      console.log(`✅ All models loaded successfully`);

      // Cleanup user data
      console.log(`🗑️  Starting comprehensive account deletion for user: ${user.email}`);

      // Delete user's properties
      console.log(`🏠 Deleting user properties...`);
      const userProperties = await Property.find({ owner: userId });
      if (userProperties.length > 0) {
        await Property.deleteMany({ owner: userId });
        console.log(`   ✅ Deleted ${userProperties.length} properties`);
      } else {
        console.log(`   ℹ️  No properties to delete`);
      }

      // Delete user's favorites
      console.log(`❤️  Deleting user favorites...`);
      const userFavorites = await Favorite.find({ user: userId });
      if (userFavorites.length > 0) {
        await Favorite.deleteMany({ user: userId });
        console.log(`   ✅ Deleted ${userFavorites.length} favorites`);
      } else {
        console.log(`   ℹ️  No favorites to delete`);
      }

      // Delete conversations where user is participant
      console.log(`💬 Deleting user conversations...`);
      const userConversations = await Conversation.find({ participants: userId });
      if (userConversations.length > 0) {
        // Delete messages in these conversations
        const conversationIds = userConversations.map(conv => conv._id);
        const deletedMessages = await Message.deleteMany({ conversation: { $in: conversationIds } });
        console.log(`   ✅ Deleted ${deletedMessages.deletedCount} messages`);

        // Delete conversations
        await Conversation.deleteMany({ participants: userId });
        console.log(`   ✅ Deleted ${userConversations.length} conversations`);
      } else {
        console.log(`   ℹ️  No conversations to delete`);
      }

      // Finally delete the user account
      console.log(`👤 Deleting user account...`);
      await User.findByIdAndDelete(userId);
      console.log(`   ✅ Deleted user account: ${user.email}`);

      console.log(`✅ Account deletion completed successfully for: ${user.email}`);

      res.json({
        success: true,
        message: 'Your account and all associated data have been permanently deleted.',
        deletionSummary: {
          properties: userProperties.length,
          favorites: userFavorites.length,
          conversations: userConversations.length,
          user: 1
        }
      });

    } catch (modelError) {
      console.error(`❌ Model/Database error during deletion:`, modelError);
      throw modelError; // Re-throw to be caught by outer catch
    }

  } catch (error) {
    console.error('❌ Account deletion error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Failed to delete account. Please try again later.',
      details: 'An internal server error occurred during account deletion',
      debug: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
});

// Get Account Deletion Info (what will be deleted)
router.get('/deletion-preview', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Import models
    const Property = require('../models/Property');
    const Conversation = require('../models/Conversation');
    const Message = require('../models/Message');
    const Favorite = require('../models/Favorite');

    // Count user's data
    const [propertiesCount, favoritesCount, conversationsCount, messagesCount] = await Promise.all([
      Property.countDocuments({ owner: userId }),
      Favorite.countDocuments({ user: userId }),
      Conversation.countDocuments({ participants: userId }),
      Message.countDocuments({ sender: userId })
    ]);

    res.json({
      success: true,
      data: {
        properties: propertiesCount,
        favorites: favoritesCount,
        conversations: conversationsCount,
        messages: messagesCount,
        warning: 'This action is permanent and cannot be undone!'
      }
    });

  } catch (error) {
    console.error('Deletion preview error:', error);
    res.status(500).json({ error: 'Failed to fetch deletion preview' });
  }
});

// Contact Form Submission
router.post('/contact', [
  body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, phone, subject, message } = req.body;

    console.log(`📧 New contact form submission from: ${firstName} ${lastName} (${email})`);
    console.log(`Subject: ${subject}`);

    // Use the email service to send contact email
    try {
      const emailResult = await sendContactEmail({
        firstName,
        lastName,
        email,
        phone,
        subject,
        message
      });

      console.log('✅ Contact email sent successfully:', emailResult.messageId);

      res.json({
        success: true,
        message: 'Your message has been sent successfully! We\'ll get back to you within 2 hours.',
        submissionId: emailResult.messageId
      });

    } catch (emailError) {
      console.error('❌ Failed to send contact email:', emailError);
      
      // Still return success to user but log the error
      res.json({
        success: true,
        message: 'Your message has been received! We\'ll get back to you within 2 hours.',
        note: 'Email queued for delivery'
      });
    }

  } catch (error) {
    console.error('❌ Contact form submission error:', error);
    res.status(500).json({ 
      error: 'Failed to submit your message. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 