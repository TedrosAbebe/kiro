const http = require('http');

async function testAllPages() {
  console.log('🔍 Testing All Pages and APIs');
  
  const testUrls = [
    { name: 'Home Page', url: '/', method: 'GET' },
    { name: 'Submit Property Page', url: '/submit-property', method: 'GET' },
    { name: 'Login Page', url: '/login', method: 'GET' },
    { name: 'Admin Dashboard', url: '/admin-working', method: 'GET' },
    { name: 'Broker Dashboard', url: '/broker', method: 'GET' },
    { name: 'Guest Submissions API', url: '/api/guest-submissions', method: 'GET' },
    { name: 'Properties Public API', url: '/api/properties-public', method: 'GET' }
  ];
  
  for (const test of testUrls) {
    await testUrl(test.name, test.url, test.method);
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
  }
  
  console.log('\n🧪 Testing Authentication Flow...');
  await testAuthFlow();
}

function testUrl(name, path, method) {
  return new Promise((resolve) => {
    console.log(`\n📋 Testing ${name}: ${method} ${path}`);
    
    const options = {
      hostname: 'localhost',
      port: 3002, // Updated port
      path: path,
      method: method,
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      console.log(`✅ ${name}: ${res.statusCode} ${res.statusMessage}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          if (data.includes('<!DOCTYPE html>')) {
            console.log(`   📄 HTML page loaded successfully`);
          } else if (data.includes('"success"')) {
            console.log(`   📊 API response looks good`);
          }
        } else if (res.statusCode === 404) {
          console.log(`   ❌ Page not found - routing issue`);
        } else if (res.statusCode >= 500) {
          console.log(`   ❌ Server error - check logs`);
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${name}: ${error.message}`);
      resolve();
    });

    req.on('timeout', () => {
      console.log(`⏰ ${name}: Request timeout`);
      req.destroy();
      resolve();
    });

    req.end();
  });
}

async function testAuthFlow() {
  return new Promise((resolve) => {
    console.log('🔐 Testing login API...');
    
    const loginData = JSON.stringify({
      username: 'admin',
      password: 'admin123'
    });

    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.success) {
            console.log('✅ Login API working');
            console.log(`   User: ${result.user.username} (${result.user.role})`);
          } else {
            console.log('❌ Login API failed:', result.error);
          }
        } catch (error) {
          console.log('❌ Login API parse error:', error.message);
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log('❌ Login API error:', error.message);
      resolve();
    });

    req.write(loginData);
    req.end();
  });
}

testAllPages().catch(console.error);