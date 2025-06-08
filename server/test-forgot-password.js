const axios = require('axios');

async function testForgotPassword() {
  try {
    console.log('🧪 Testing forgot password endpoint...');
    
    const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
      email: 'dwelldash3@gmail.com'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Response received:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log('✅ Forgot password request successful!');
      if (response.data.resetToken) {
        console.log('🔑 Reset Token:', response.data.resetToken);
      }
      if (response.data.resetUrl) {
        console.log('🔗 Reset URL:', response.data.resetUrl);
      }
      if (response.data.previewUrl) {
        console.log('👀 Email Preview URL:', response.data.previewUrl);
      }
    } else {
      console.log('❌ Forgot password request failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing forgot password:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testForgotPassword(); 