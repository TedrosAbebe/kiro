// Test authentication persistence
const http = require('http');

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testAuthPersistence() {
  console.log('🧪 TESTING AUTHENTICATION PERSISTENCE...\n');
  
  try {
    // Test different user types
    const users = [
      { username: 'admin', password: 'admin123', expectedRole: 'admin' },
      { username: 'broker1', password: 'broker123', expectedRole: 'broker' },
      { username: 'testuser', password: 'user123', expectedRole: 'user' }
    ];
    
    for (const user of users) {
      console.log(`🔐 Testing login for ${user.username} (${user.expectedRole})...`);
      
      const loginResponse = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        username: user.username,
        password: user.password
      });
      
      console.log(`Status: ${loginResponse.status}`);
      console.log(`Success: ${loginResponse.data.success}`);
      
      if (loginResponse.data.success) {
        console.log(`✅ ${user.username} logged in successfully`);
        console.log(`   Role: ${loginResponse.data.user.role}`);
        console.log(`   Token: ${loginResponse.data.token ? 'Present' : 'Missing'}`);
        console.log(`   User ID: ${loginResponse.data.user.id}`);
        
        // Verify role matches expected
        if (loginResponse.data.user.role === user.expectedRole) {
          console.log(`✅ Role verification passed`);
        } else {
          console.log(`❌ Role mismatch: expected ${user.expectedRole}, got ${loginResponse.data.user.role}`);
        }
      } else {
        console.log(`❌ Login failed: ${loginResponse.data.message}`);
      }
      
      console.log(''); // Empty line for readability
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAuthPersistence();