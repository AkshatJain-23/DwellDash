const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
// Temporarily make email service optional to avoid blocking auth
let sendPasswordResetEmail, sendWelcomeEmail;
try {
  const emailService = require('../services/emailService');
  sendPasswordResetEmail = emailService.sendPasswordResetEmail;
  sendWelcomeEmail = emailService.sendWelcomeEmail;
} catch (error) {
  console.log('⚠️  Email service not available, auth will work without email features');
  sendPasswordResetEmail = async () => ({ success: false, error: 'Email service unavailable' });
  sendWelcomeEmail = async () => ({ success: false, error: 'Email service unavailable' });
}

const router = express.Router();

// In-memory storage (replace with database in production)
const usersFile = path.join(__dirname, '../data/users.json');
const resetTokensFile = path.join(__dirname, '../data/resetTokens.json');
let users = [];
let resetTokens = [];

// Load users from file
const loadUsers = () => {
try {
  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
      console.log('Auth: Users loaded:', users.length, 'users found');
    } else {
      users = [];
  }
} catch (error) {
    console.log('Auth: Error loading users file:', error);
    users = [];
}
};

// Initial load
loadUsers();

// Load reset tokens from file
try {
  if (fs.existsSync(resetTokensFile)) {
    resetTokens = JSON.parse(fs.readFileSync(resetTokensFile, 'utf8'));
  }
} catch (error) {
  console.log('No existing reset tokens file found, starting fresh');
}

// Save users to file
const saveUsers = () => {
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

// Save reset tokens to file
const saveResetTokens = () => {
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(resetTokensFile, JSON.stringify(resetTokens, null, 2));
};

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

    // Reload users to ensure we have the latest data
    loadUsers();

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      console.log('Auth: User already exists:', email);
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role,
      phone: phone || '',
      createdAt: new Date().toISOString()
    };

    users.push(user);
    saveUsers();

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.name).catch(error => {
      console.log('Welcome email failed (non-critical):', error.message);
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
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

    // Reload users to ensure we have the latest data
    loadUsers();

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
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
router.get('/me', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Reload users to ensure we have the latest data
    loadUsers();
    
    const user = users.find(user => user.id === decoded.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
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
    const user = users.find(user => user.email === email);
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
    resetTokens = resetTokens.filter(token => token.userId !== user.id);

    // Add new reset token
    resetTokens.push({
      userId: user.id,
      token: resetToken,
      expiresAt: resetTokenExpiry.toISOString(),
      createdAt: new Date().toISOString()
    });

    saveResetTokens();

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
    const resetTokenData = resetTokens.find(t => t.token === token);
    if (!resetTokenData) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Check if token is expired
    if (new Date() > new Date(resetTokenData.expiresAt)) {
      // Remove expired token
      resetTokens = resetTokens.filter(t => t.token !== token);
      saveResetTokens();
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Find user
    const user = users.find(u => u.id === resetTokenData.userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    const userIndex = users.findIndex(u => u.id === user.id);
    users[userIndex].password = hashedPassword;
    users[userIndex].passwordResetAt = new Date().toISOString();
    
    // Remove used reset token
    resetTokens = resetTokens.filter(t => t.token !== token);
    
    saveUsers();
    saveResetTokens();

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
router.get('/verify-reset-token/:token', (req, res) => {
  try {
    const { token } = req.params;

    // Find reset token
    const resetTokenData = resetTokens.find(t => t.token === token);
    if (!resetTokenData) {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    // Check if token is expired
    if (new Date() > new Date(resetTokenData.expiresAt)) {
      // Remove expired token
      resetTokens = resetTokens.filter(t => t.token !== token);
      saveResetTokens();
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Find user
    const user = users.find(u => u.id === resetTokenData.userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
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

module.exports = router; 