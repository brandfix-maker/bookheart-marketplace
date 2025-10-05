const https = require('https');
const http = require('http');

// Test the complete registration flow
async function testRegistrationFlow() {
  console.log('🧪 Testing complete registration flow...\n');

  // Test data
  const testUser = {
    email: 'testuser@example.com',
    username: 'testuser123',
    password: 'TestPass123!',
    role: 'buyer'
  };

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing API health check...');
    const healthResponse = await makeRequest('http://localhost:5000/health', 'GET');
    console.log('✅ Health check passed:', healthResponse.status);

    // Test 2: Registration endpoint
    console.log('\n2️⃣ Testing registration endpoint...');
    const registrationResponse = await makeRequest('http://localhost:5000/api/auth/register', 'POST', testUser);
    console.log('📝 Registration response:', registrationResponse);

    if (registrationResponse.success) {
      console.log('✅ Registration successful!');
      console.log('👤 User created:', registrationResponse.data);
    } else {
      console.log('❌ Registration failed:', registrationResponse.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

function makeRequest(url, method, data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            data: parsedData,
            success: res.statusCode >= 200 && res.statusCode < 300
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: responseData,
            success: res.statusCode >= 200 && res.statusCode < 300
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Run the test
testRegistrationFlow();
