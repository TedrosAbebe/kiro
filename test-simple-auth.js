// Simple test for the new authentication system
const https = require('https');
const http = require('http');

async function testAuth() {
    console.log('🧪 Testing Simple Username/Password Authentication...\n');
    
    const baseUrl = 'http://localhost:3001';
    
    // Test admin login
    console.log('🔐 Testing admin login...');
    await testLogin('admin', 'admin123', 'Admin');
    
    console.log('\n🔐 Testing user login...');
    await testLogin('testuser', 'user123', 'User');
    
    console.log('\n🔐 Testing invalid credentials...');
    await testLogin('invalid', 'wrong', 'Invalid');
}

async function testLogin(username, password, label) {
    return new Promise((resolve) => {
        const postData = JSON.stringify({
            username: username,
            password: password
        });
        
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    console.log(`📡 ${label} Login Response (${res.statusCode}):`);
                    console.log(`   Success: ${result.success}`);
                    if (result.success) {
                        console.log(`   Username: ${result.user.username}`);
                        console.log(`   Role: ${result.user.role}`);
                        console.log(`   Token: ${result.token ? 'Generated ✅' : 'Missing ❌'}`);
                    } else {
                        console.log(`   Error: ${result.message}`);
                    }
                } catch (error) {
                    console.log(`❌ ${label} Login Failed - Invalid JSON response`);
                    console.log(`   Raw response: ${data}`);
                }
                resolve();
            });
        });
        
        req.on('error', (error) => {
            console.log(`❌ ${label} Login Failed - Network error: ${error.message}`);
            console.log('💡 Make sure the server is running on http://localhost:3001');
            resolve();
        });
        
        req.write(postData);
        req.end();
    });
}

// Wait a moment for server to start, then test
setTimeout(testAuth, 3000);