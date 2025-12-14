const http = require('http');

async function testRoleBasedAccess() {
    console.log('🔐 Testing Role-Based Access Control...\n');
    
    // Test users with different roles
    const testUsers = [
        { username: 'teda', password: 'admin123', role: 'admin', description: 'Admin User' },
        { username: 'broker1', password: 'broker123', role: 'broker', description: 'Broker User' },
        { username: 'testuser', password: 'user123', role: 'user', description: 'Regular User' }
    ];
    
    for (const testUser of testUsers) {
        console.log(`\n🧪 Testing ${testUser.description} (${testUser.username}):`);
        
        // Login
        const token = await loginUser(testUser.username, testUser.password);
        if (!token) {
            console.log('   ❌ Login failed, skipping tests');
            continue;
        }
        
        // Test Admin API access
        console.log('   🔒 Testing Admin API access...');
        await testAdminAPI(token, testUser.role);
        
        // Test Broker API access
        console.log('   🏢 Testing Broker API access...');
        await testBrokerAPI(token, testUser.role);
    }
    
    console.log('\n📋 Access Control Summary:');
    console.log('   👑 Admin: Can access both Admin and Broker APIs');
    console.log('   🏢 Broker: Can access Broker API only');
    console.log('   👤 User: Cannot access Admin or Broker APIs');
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
                        console.log('   ✅ Login successful');
                        resolve(result.token);
                    } else {
                        console.log('   ❌ Login failed:', result.message);
                        resolve(null);
                    }
                } catch (error) {
                    console.log('   ❌ Login failed - Invalid JSON response');
                    resolve(null);
                }
            });
        });
        
        req.on('error', (error) => {
            console.log('   ❌ Login failed - Network error:', error.message);
            resolve(null);
        });
        
        req.write(postData);
        req.end();
    });
}

async function testAdminAPI(token, userRole) {
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
                    if (res.statusCode === 200) {
                        console.log('      ✅ Admin API: Access granted');
                    } else if (res.statusCode === 403) {
                        console.log('      ❌ Admin API: Access denied (expected for non-admin)');
                    } else {
                        console.log(`      ❓ Admin API: Unexpected response (${res.statusCode})`);
                    }
                } catch (error) {
                    console.log('      ❌ Admin API: Invalid response');
                }
                resolve();
            });
        });
        
        req.on('error', (error) => {
            console.log('      ❌ Admin API: Network error');
            resolve();
        });
        
        req.end();
    });
}

async function testBrokerAPI(token, userRole) {
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
                    if (res.statusCode === 200) {
                        console.log('      ✅ Broker API: Access granted');
                    } else if (res.statusCode === 403) {
                        console.log('      ❌ Broker API: Access denied (expected for regular users)');
                    } else {
                        console.log(`      ❓ Broker API: Unexpected response (${res.statusCode})`);
                    }
                } catch (error) {
                    console.log('      ❌ Broker API: Invalid response');
                }
                resolve();
            });
        });
        
        req.on('error', (error) => {
            console.log('      ❌ Broker API: Network error');
            resolve();
        });
        
        req.end();
    });
}

testRoleBasedAccess();