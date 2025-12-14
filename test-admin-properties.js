const http = require('http');

async function testAdminProperties() {
    console.log('🧪 Testing Admin Properties API...\n');
    
    // Login as admin
    console.log('🔐 Logging in as admin...');
    const adminToken = await loginUser('teda', 'admin123');
    
    if (!adminToken) {
        console.log('❌ Failed to get admin token');
        return;
    }
    
    // Test admin properties API
    console.log('📊 Testing admin properties API...');
    await testAdminPropertiesAPI(adminToken);
}

async function loginUser(username, password) {
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
                    if (result.success && result.token) {
                        console.log('   ✅ Admin login successful');
                        resolve(result.token);
                    } else {
                        console.log('   ❌ Admin login failed:', result.message);
                        resolve(null);
                    }
                } catch (error) {
                    console.log('   ❌ Admin login failed - Invalid JSON response');
                    resolve(null);
                }
            });
        });
        
        req.on('error', (error) => {
            console.log('   ❌ Admin login failed - Network error:', error.message);
            resolve(null);
        });
        
        req.write(postData);
        req.end();
    });
}

async function testAdminPropertiesAPI(token) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: '/api/admin/properties',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
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
                    console.log(`   📡 Admin Properties API Response (${res.statusCode}):`);
                    if (res.statusCode === 200) {
                        console.log('      ✅ Success: Properties data received');
                        console.log(`      🏠 Properties count: ${result.properties?.length || 0}`);
                        if (result.properties && result.properties.length > 0) {
                            console.log('      📋 Properties:');
                            result.properties.forEach((prop, i) => {
                                console.log(`         ${i + 1}. ${prop.title} (${prop.status}) - ${prop.price} ${prop.currency}`);
                            });
                        }
                    } else {
                        console.log(`      ❌ Error: ${result.error || 'Unknown error'}`);
                    }
                } catch (error) {
                    console.log('   ❌ Admin Properties API failed - Invalid JSON response');
                    console.log('   Raw response:', data);
                }
                resolve();
            });
        });
        
        req.on('error', (error) => {
            console.log('   ❌ Admin Properties API failed - Network error:', error.message);
            resolve();
        });
        
        req.end();
    });
}

testAdminProperties();