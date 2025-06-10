const axios = require('axios');

async function testWelcomeEmail() {
  console.log('🧪 Testing Welcome Email on User Registration\n');
  
  try {
    // Test user registration
    const registrationData = {
      name: 'Test User Welcome',
      email: 'testuser1@gmail.com',
      password: 'password123',
      role: 'tenant',
      phone: '9876543210'
    };
    
    console.log('📝 Registering new user...');
    console.log('Name:', registrationData.name);
    console.log('Email:', registrationData.email);
    console.log('Role:', registrationData.role);
    
    const response = await axios.post('http://localhost:5000/api/auth/register', registrationData);
    
    if (response.status === 201) {
      console.log('\n✅ Registration Response:');
      console.log('Status:', response.status);
      console.log('Message:', response.data.message);
      
      if (response.data.welcomeEmailSent) {
        console.log('📧 Welcome Email Status: ✅ SENT');
        if (response.data.emailId) {
          console.log('📧 Email ID:', response.data.emailId);
        }
      } else {
        console.log('📧 Welcome Email Status: ❌ FAILED');
        if (response.data.emailError) {
          console.log('❌ Email Error:', response.data.emailError);
        }
      }
      
      console.log('\n👤 User Created:');
      console.log('ID:', response.data.user.id);
      console.log('Name:', response.data.user.name);
      console.log('Email:', response.data.user.email);
      console.log('Role:', response.data.user.role);
      
    } else {
      console.log('❌ Unexpected response status:', response.status);
    }
    
  } catch (error) {
    if (error.response) {
      console.log('\n❌ Registration Failed:');
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data.error || error.response.data);
      
      if (error.response.status === 400 && error.response.data.error === 'User already exists') {
        console.log('\n💡 Try using a different email address for testing.');
      }
    } else {
      console.log('❌ Network Error:', error.message);
      console.log('💡 Make sure the server is running on http://localhost:5000');
    }
  }
}

// Run the test
testWelcomeEmail(); 