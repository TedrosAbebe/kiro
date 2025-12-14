const http = require('http');

async function testEnhancedSystem() {
    console.log('🧪 Testing Enhanced Professional System\n');
    
    console.log('📋 Testing Use Cases:');
    console.log('   UC-02: Admin Login with Email + OTP');
    console.log('   UC-03: Create Property (Broker)');
    console.log('   UC-04: Approve/Reject Property (Admin)');
    console.log('   UC-05: Search Property (User)\n');
    
    // UC-02: Test Enhanced Admin Login
    console.log('🔐 UC-02: Testing Enhanced Admin Login');
    await testEnhancedAdminLogin();
    
    // UC-03: Test Property Creation
    console.log('\n🏠 UC-03: Testing Property Creation');
    const brokerToken = await loginUser('broker1', 'broker123');
    if (brokerToken) {
        await testPropertyCreation(brokerToken);
    }
    
    // UC-04: Test Property Approval
    console.log('\n👑 UC-04: Testing Property Approval');
    const adminToken = await loginUser('teda', 'admin123');
    if (adminToken) {
        await testPropertyApproval(adminToken);
    }
    
    // UC-05: Test Property Search
    console.log('\n🔍 UC-05: Testing Property Search');
    await testPropertySearch();
    
    console.log('\n✅ Enhanced System Test Complete!');
}

async function testEnhancedAdminLogin() {
    console.log('   Testing admin login with email format...');
    
    // Test with email-like username
    const result = await makeRequest('POST', '/api/enhanced/auth/login', {
        identifier: 'tedayeerasu@gmail.com',
        password: 'admin123',
        step: 'initial'
    });
    
    if (result && result.success) {
        if (result.requiresOTP) {
            console.log('   ✅ OTP required for admin (as expected)');
            console.log('   📧 OTP would be sent to email');
            
            // In real system, admin would enter OTP from email
            // For demo, we'll simulate OTP verification
            console.log('   🔢 Simulating OTP verification...');
        } else {
            console.log('   ✅ Admin login successful (OTP disabled)');
        }
    } else {
        console.log('   ❌ Admin login failed');
    }
}

async function testPropertyCreation(token) {
    console.log('   Creating new property as broker...');
    
    const propertyData = {
        title: 'Test Property - Modern Apartment',
        description: 'Beautiful modern apartment for rent',
        price: 180000,
        currency: 'ETB',
        city: 'Addis Ababa',
        area: 'Megenagna',
        address: 'Near Megenagna Mall',
        type: 'apartment',
        bedrooms: 3,
        bathrooms: 2,
        size: 150,
        features: ['Parking', 'Security', 'Elevator'],
        brokerPhone: '+251911234567',
        brokerWhatsApp: '+251911234567'
    };
    
    const result = await makeRequest('POST', '/api/enhanced/properties', propertyData, token);
    
    if (result && result.success) {
        console.log('   ✅ Property created successfully');
        console.log(`   🏠 Property: ${result.property.title}`);
        console.log(`   📊 Status: ${result.property.status} (pending admin approval)`);
        return result.property.id;
    } else {
        console.log('   ❌ Property creation failed');
        return null;
    }
}

async function testPropertyApproval(token) {
    console.log('   Getting all properties for admin review...');
    
    const result = await makeRequest('GET', '/api/enhanced/admin/properties', null, token);
    
    if (result && result.success) {
        console.log(`   ✅ Found ${result.properties.length} properties`);
        
        // Find a pending property to approve
        const pendingProperty = result.properties.find(p => p.status === 'pending');
        
        if (pendingProperty) {
            console.log(`   👑 Approving property: ${pendingProperty.title}`);
            
            const approvalResult = await makeRequest('PATCH', '/api/enhanced/admin/properties', {
                propertyId: pendingProperty.id,
                status: 'approved'
            }, token);
            
            if (approvalResult && approvalResult.success) {
                console.log('   ✅ Property approved successfully');
                console.log('   🔔 Broker would receive notification');
            } else {
                console.log('   ❌ Property approval failed');
            }
        } else {
            console.log('   ℹ️  No pending properties to approve');
        }
    } else {
        console.log('   ❌ Failed to get properties');
    }
}

async function testPropertySearch() {
    console.log('   Searching for approved properties...');
    
    const result = await makeRequest('GET', '/api/enhanced/properties?city=Addis Ababa&type=apartment');
    
    if (result && result.success) {
        console.log(`   ✅ Found ${result.count} properties matching search`);
        
        result.properties.forEach((property, index) => {
            console.log(`   ${index + 1}. ${property.title} - ${property.price} ${property.currency}`);
            console.log(`      📍 ${property.location.area}, ${property.location.city}`);
            console.log(`      📞 Contact: ${property.brokerPhone}`);
        });
    } else {
        console.log('   ❌ Property search failed');
    }
}

async function loginUser(username, password) {
    const result = await makeRequest('POST', '/api/auth/login', { username, password });
    
    if (result && result.success) {
        console.log(`   ✅ ${username} login successful`);
        return result.token;
    } else {
        console.log(`   ❌ ${username} login failed`);
        return null;
    }
}

async function makeRequest(method, path, data = null, token = null) {
    return new Promise((resolve) => {
        const postData = data ? JSON.stringify(data) : null;
        
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (postData) {
            options.headers['Content-Length'] = Buffer.byteLength(postData);
        }
        
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }
        
        const req = http.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(responseData);
                    resolve(result);
                } catch (error) {
                    console.log(`   ❌ Invalid JSON response for ${path}`);
                    resolve(null);
                }
            });
        });
        
        req.on('error', (error) => {
            console.log(`   ❌ Network error for ${path}:`, error.message);
            resolve(null);
        });
        
        if (postData) {
            req.write(postData);
        }
        
        req.end();
    });
}

testEnhancedSystem();