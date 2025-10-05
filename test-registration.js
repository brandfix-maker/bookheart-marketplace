// Test registration endpoint
const testRegistration = async () => {
  try {
    console.log('🧪 Testing registration endpoint...');
    
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        role: 'buyer'
      })
    });
    
    const data = await response.json();
    console.log('📊 Response status:', response.status);
    console.log('📊 Response data:', data);
    
    if (response.ok) {
      console.log('✅ Registration test successful!');
    } else {
      console.log('❌ Registration test failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Registration test error:', error.message);
  }
};

// Test health endpoint first
const testHealth = async () => {
  try {
    console.log('🏥 Testing health endpoint...');
    const response = await fetch('http://localhost:5000/health');
    const data = await response.json();
    console.log('📊 Health status:', response.status);
    console.log('📊 Health data:', data);
  } catch (error) {
    console.error('❌ Health test error:', error.message);
  }
};

// Run tests
testHealth().then(() => testRegistration());