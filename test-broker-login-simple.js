const http = require('http');

const postData = JSON.stringify({
  username: 'broker1',
  password: 'broker123'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🧪 Testing broker login...');

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('Login response:', result);
      
      if (result.success) {
        console.log('✅ Broker login successful!');
        console.log('User:', result.user.username, 'Role:', result.user.role);
        console.log('Token received:', result.token ? 'Yes' : 'No');
      } else {
        console.log('❌ Login failed:', result.error);
      }
    } catch (error) {
      console.error('❌ Parse error:', error.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
});

req.write(postData);
req.end();