const axios = require('axios');

async function testMessagesEndpoint() {
  try {
    console.log('🧪 Testing Messages Endpoint');
    console.log('============================\n');

    // Test data similar to what the frontend sends
    const testMessage = {
      propertyId: '68487684fe1319abf7486782', // From the URL in the screenshot
      ownerId: 'test-owner-id',
      senderName: 'Test User',
      senderEmail: 'test@example.com',
      senderPhone: '+91 9876543210',
      message: 'Hello, I am interested in this property.',
      propertyTitle: 'Comfortable PG for Bachelors'
    };

    console.log('📤 Sending test message data:');
    console.log(JSON.stringify(testMessage, null, 2));
    console.log('');

    const response = await axios.post('http://localhost:5000/api/messages', testMessage, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Success! Message sent successfully');
    console.log('Response:', response.data);

  } catch (error) {
    console.error('❌ Message sending failed:');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.data.errors) {
        console.log('\n📋 Validation Errors:');
        error.response.data.errors.forEach((err, index) => {
          console.log(`   ${index + 1}. Field: ${err.param || 'unknown'}`);
          console.log(`      Message: ${err.msg}`);
          console.log(`      Value: ${err.value || 'undefined'}`);
        });
      }
    } else if (error.request) {
      console.log('No response received from server');
      console.log('Request error:', error.message);
    } else {
      console.log('Request setup error:', error.message);
    }
  }
}

// Also test with missing fields to see validation
async function testWithMissingFields() {
  try {
    console.log('\n🧪 Testing with Missing Fields');
    console.log('==============================\n');

    const incompleteMessage = {
      message: 'Hello'
      // Missing required fields
    };

    console.log('📤 Sending incomplete data:');
    console.log(JSON.stringify(incompleteMessage, null, 2));

    const response = await axios.post('http://localhost:5000/api/messages', incompleteMessage);
    console.log('Response:', response.data);

  } catch (error) {
    console.log('Expected validation errors:');
    if (error.response?.data?.errors) {
      error.response.data.errors.forEach((err, index) => {
        console.log(`   ${index + 1}. ${err.msg} (field: ${err.param})`);
      });
    }
  }
}

async function runTests() {
  await testMessagesEndpoint();
  await testWithMissingFields();
  console.log('\n🏁 Testing completed');
}

runTests(); 