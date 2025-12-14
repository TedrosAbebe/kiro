const http = require('http');

async function testCompleteFunctionality() {
    console.log('🧪 Testing Complete Broker/Admin Functionality...\n');
    
    // Test 1: Admin login and broker access
    console.log('🔐 Test 1: Admin accessing broker properties...');
    const adminToken = await loginUser('teda', 'admin123');
    if (adminToken) {
        await testBrokerAPI(adminToken, 'Admin');
        await testAdminPropertiesAPI(adminToken);
        await testAdminDashboardAPI(adminToken);
    }
    
    // Test 2: Regular user login and broker access
    console.log('\n🔐 Test 2: Regular user accessing broker properties...');
    const userToken = await loginUser('testuser', 'user123');
    if (userToken) {
        await testBrokerAPI(userToken, 'User');
    }
    
    console.log('\n✅ All tests completed!');
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
                        console.log('      ✅ Success: Broker properties data received');
                        console.log(`      🏠 Properties count: ${result.properties?.length || 0}`);
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
                        console.log('      ✅ Success: Admin properties data received');
                        console.log(`      🏠 Properties count: ${result.properties?.length || 0}`);
                    } else {
                        console.log(`      ❌ Error: ${result.error || 'Unknown error'}`);
                    }
                } catch (error) {
                    console.log('   ❌ Admin Properties API failed - Invalid JSON response');
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

async function testAdminDashboardAPI(token) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: '/api/admin/dashboard',
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
                    console.log(`   📡 Admin Dashboard API Response (${res.statusCode}):`);
                    if (res.statusCode === 200) {
                        console.log('      ✅ Success: Dashboard data received');
                        console.log(`      📊 Total Users: ${result.overview?.totalUsers || 0}`);
                        console.log(`      🏠 Total Properties: ${result.overview?.totalProperties || 0}`);
                    } else {
                        console.log(`      ❌ Error: ${result.error || 'Unknown error'}`);
                    }
                } catch (error) {
                    console.log('   ❌ Admin Dashboard API failed - Invalid JSON response');
                }
                resolve();
            });
        });
        
        req.on('error', (error) => {
            console.log('   ❌ Admin Dashboard API failed - Network error:', error.message);
            resolve();
        });
        
        req.end();
    });
}

testCompleteFunctionality();