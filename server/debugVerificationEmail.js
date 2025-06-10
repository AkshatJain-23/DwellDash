// Comprehensive debug script for verification email issues
console.log('🔧 DwellDash Verification Email Debug');
console.log('====================================\n');

async function debugVerificationEmail() {
  try {
    // Test 1: Check email service import
    console.log('1️⃣ Testing Email Service Import...');
    const emailService = require('./services/emailService');
    console.log(`   ✅ Email service imported successfully`);
    console.log(`   📧 sendVerificationEmail: ${typeof emailService.sendVerificationEmail}`);
    
    // Test 2: Test email sending functionality
    console.log('\n2️⃣ Testing Email Functionality...');
    try {
      const result = await emailService.sendVerificationEmail(
        'test@example.com',
        'Test User',
        'test-token-12345'
      );
      console.log('   ✅ Email service working!');
      console.log(`   📧 Message ID: ${result.messageId}`);
      if (result.previewUrl) {
        console.log(`   🔗 Preview URL: ${result.previewUrl}`);
      }
    } catch (emailError) {
      console.log('   ❌ Email service error:', emailError.message);
    }

    // Test 3: Check auth route import
    console.log('\n3️⃣ Testing Auth Route Configuration...');
    const crypto = require('crypto');
    console.log(`   ✅ Crypto module: ${typeof crypto.randomBytes}`);
    
    // Test 4: Check MongoDB connection
    console.log('\n4️⃣ Testing Database Connection...');
    const mongoose = require('mongoose');
    
    try {
      await mongoose.connect('mongodb+srv://deepak06:AkshatJain2003@cluster0.9prhv.mongodb.net/dwelldash?retryWrites=true&w=majority&appName=Cluster0');
      console.log('   ✅ MongoDB connected successfully');
      
      const User = require('./models/User');
      const userCount = await User.countDocuments();
      console.log(`   📊 Users in database: ${userCount}`);
      
      // Find a test user
      const testUser = await User.findOne({}).select('email verified');
      if (testUser) {
        console.log(`   👤 Sample user: ${testUser.email} (verified: ${testUser.verified})`);
      }
      
    } catch (dbError) {
      console.log('   ❌ Database connection error:', dbError.message);
    }

    console.log('\n✅ Debug tests completed!');

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
}

// Troubleshooting guide
function printTroubleshootingSteps() {
  console.log('\n🔧 VERIFICATION EMAIL TROUBLESHOOTING GUIDE');
  console.log('===========================================\n');
  
  console.log('📋 COMMON ISSUES AND SOLUTIONS:\n');
  
  console.log('1️⃣ "Failed to send verification email" Error:');
  console.log('   🔍 Possible causes:');
  console.log('   • Email service configuration issues');
  console.log('   • Missing environment variables');
  console.log('   • Network connectivity problems');
  console.log('   • Invalid JWT token');
  console.log('   • User already verified');
  console.log('');
  
  console.log('2️⃣ Authentication Issues:');
  console.log('   🔍 Check these:');
  console.log('   • User is logged in with valid JWT token');
  console.log('   • Authorization header format: "Bearer <token>"');
  console.log('   • Token is not expired');
  console.log('   • User exists in database');
  console.log('');
  
  console.log('3️⃣ Email Service Issues:');
  console.log('   🔍 Environment variables needed:');
  console.log('   • EMAIL_SERVICE (optional, defaults to Ethereal)');
  console.log('   • EMAIL_USER (for Gmail SMTP)');
  console.log('   • EMAIL_PASS (for Gmail App Password)');
  console.log('   • EMAIL_FROM (sender email address)');
  console.log('');
  
  console.log('4️⃣ Frontend Integration:');
  console.log('   🔍 Frontend should send:');
  console.log('   • POST request to /auth/send-verification');
  console.log('   • Authorization header with Bearer token');
  console.log('   • Content-Type: application/json');
  console.log('');
  
  console.log('✅ TESTING STEPS:');
  console.log('   1. Check server console for detailed error logs');
  console.log('   2. Verify user is logged in and has valid token');
  console.log('   3. Ensure user account is not already verified');
  console.log('   4. Test email service independently');
  console.log('   5. Check network connectivity');
  console.log('');
  
  console.log('🛠️  QUICK FIXES:');
  console.log('   • Use Ethereal Email for testing (no config needed)');
  console.log('   • Check browser developer tools for API errors');
  console.log('   • Verify JWT token in localStorage/sessionStorage');
  console.log('   • Test with manual verification endpoint for development');
  console.log('');
  
  console.log('🔗 MANUAL VERIFICATION FOR TESTING:');
  console.log('   PATCH /auth/verify-user/:userId');
  console.log('   (Requires authentication, manually verifies user)');
}

// Run debug and show troubleshooting
async function runFullDebug() {
  await debugVerificationEmail();
  printTroubleshootingSteps();
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('   1. Check the server console when testing verification email');
  console.log('   2. Look for detailed error logs with the enhanced logging');
  console.log('   3. Ensure proper authentication from frontend');
  console.log('   4. Test email service configuration');
  console.log('\n✨ System should now provide detailed error information!');
}

runFullDebug(); 