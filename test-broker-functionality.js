const http = require('http');

async function testBrokerFunctionality() {
    console.log('🧪 Testing Broker/Properties Functionality...\n');
    
    // Test 1: Login as admin and access broker properties
    console.log('🔐 Test 1: Admin accessing broker properties...');
    const adminToken = await loginUser('teda', 'admin123');
    if (adminToken) {
        await testBrokerAPI(adminToken, 'Admin');
    }
    
    // Test 2: Login as regular user and access broker properties
    console.log('\n🔐 Test 2: Regular user accessing broker properties...');
    const userToken = await loginUser('testuser', 'user123');
    if (userToken) {
        await testBrokerAPI(userToken, 'User');
    }
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
                        console.log(`   ✅ ${username} login successful`);
                        resolve(result.token);
                    } else {
                        console.log(`   ❌ ${username} login failed:`, result.message);
                        resolve(null);
                    }
                } catch (error) {
                    console.log(`   ❌ ${username} login failed - Invalid JSON response`);
                    resolve(null);
                }
            });
        });
        
        req.on('error', (error) => {
            console.log(`   ❌ ${username} login failed - Network error:`, error.message);
            resolve(null);
        });
        
        req.write(postData);
        req.end();
    });
}

async function testBrokerAPI(token, userType) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: '/api/broker/properties',
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
                    console.log(`   📡 ${userType} Broker API Response (${res.statusCode}):`);
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
                    console.log(`   ❌ ${userType} Broker API failed - Invalid JSON response`);
                }
                resolve();
            });
        });
        
        req.on('error', (error) => {
            console.log(`   ❌ ${userType} Broker API failed - Network error:`, error.message);
            resolve();
        });
        
        req.end();
    });
}

testBrokerFunctionality();