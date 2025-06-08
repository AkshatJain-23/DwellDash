require('dotenv').config({ path: './.env' });
const { sendPasswordResetEmail } = require('./services/emailService');

async function testEmail() {
  console.log('🧪 Testing email configuration...');
  console.log(`📧 EMAIL_SERVICE: ${process.env.EMAIL_SERVICE}`);
  console.log(`📧 EMAIL_USER: ${process.env.EMAIL_USER}`);
  console.log(`📧 EMAIL_FROM: ${process.env.EMAIL_FROM}`);
  console.log(`📧 EMAIL_PASS: ${process.env.EMAIL_PASS ? '***SET***' : 'NOT SET'}`);
  
  try {
    const result = await sendPasswordResetEmail(
      'dwelldash3@gmail.com', 
      'test-token-12345', 
      'Test User'
    );
    
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    if (result.previewUrl) {
      console.log('🔗 Preview URL:', result.previewUrl);
    }
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.error('Error details:', error);
  }
}

testEmail(); 