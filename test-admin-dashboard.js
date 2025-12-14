const http = require('http');

async function testAdminDashboard() {
    console.log('🧪 Testing Admin Dashboard Access...\n');
    
    // First, login as admin to get a token
    console.log('🔐 Step 1: Login as admin...');
    const loginToken = await loginAsAdmin();
    
    if (!loginToken) {
        console.log('❌ Failed to get admin token');
        return;
    }
    
    console.log('✅ Got admin token');
    
    // Test dashboard API
    console.log('\n📊 Step 2: Testing dashboard API...');
    await testDashboardAPI(loginToken);
    
    // Test users API
    console.log('\n👥 Step 3: Testing users API...');
    await testUsersAPI(loginToken);
}

async function loginAsAdmin() {
    return new Promise((resolve) => {
        const postData = JSON.stringify({
            username: 'teda',
            password: 'admin123'
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
                        resolve(result.token);
                    } else {
                        console.log('❌ Login failed:', result.message);
                        resolve(null);
                    }
                } catch (error) {
                    console.log('❌ Login failed - Invalid JSON response');
                    resolve(null);
                }
            });
        });
        
        req.on('error', (error) => {
            console.log('❌ Login failed - Network error:', error.message);
            resolve(null);
        });
        
        req.write(postData);
        req.end();
    });
}

async function testDashboardAPI(token) {
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
                    console.log(`📡 Dashboard API Response (${res.statusCode}):`);
                    if (res.statusCode === 200) {
                        console.log('   ✅ Success: Dashboard data received');
                        console.log(`   📊 Total Users: ${result.overview?.totalUsers || 0}`);
                        console.log(`   🏠 Total Properties: ${result.overview?.totalProperties || 0}`);
                    } else {
                        console.log(`   ❌ Error: ${result.error || 'Unknown error'}`);
                    }
                } catch (error) {
                    console.log('❌ Dashboard API failed - Invalid JSON response');
                }
                resolve();
            });
        });
        
        req.on('error', (error) => {
            console.log('❌ Dashboard API failed - Network error:', error.message);
            resolve();
        });
        
        req.end();
    });
}

async function testUsersAPI(token) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: '/api/admin/users',
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
                    console.log(`📡 Users API Response (${res.statusCode}):`);
                    if (res.statusCode === 200) {
                        console.log('   ✅ Success: Users data received');
                        console.log(`   👥 Total Users: ${result.users?.length || 0}`);
                        if (result.users && result.users.length > 0) {
                            console.log('   📋 Users:');
                            result.users.forEach((user, i) => {
                                console.log(`      ${i + 1}. ${user.name} (${user.role})`);
                            });
                        }
                    } else {
                        console.log(`   ❌ Error: ${result.error || 'Unknown error'}`);
                    }
                } catch (error) {
                    console.log('❌ Users API failed - Invalid JSON response');
                }
                resolve();
            });
        });
        
        req.on('error', (error) => {
            console.log('❌ Users API failed - Network error:', error.message);
            resolve();
        });
        
        req.end();
    });
}

testAdminDashboard();