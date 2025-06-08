// Load environment variables first
require('dotenv').config();

console.log('=== Environment Check ===');
console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***SET***' : 'NOT SET');
console.log('CLIENT_URL:', process.env.CLIENT_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Test the forgot password logic directly
const { sendPasswordResetEmail } = require('./services/emailService');

async function testDirectEmail() {
  console.log('\n=== Direct Email Test ===');
  try {
    const result = await sendPasswordResetEmail(
      'dwelldash3@gmail.com',
      'test-token-12345',
      'DwellDash Admin'
    );
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);
    if (result.previewUrl) {
      console.log('Preview URL:', result.previewUrl);
    }
  } catch (error) {
    console.error('❌ Email failed:', error.message);
  }
}

testDirectEmail(); 