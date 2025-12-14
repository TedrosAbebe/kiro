// Test admin approval through the API
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

async function testAdminApproval() {
  console.log('🧪 TESTING ADMIN APPROVAL API...\n');
  
  try {
    // 1. Login as admin
    console.log('1️⃣ Logging in as admin...');
    const loginResponse = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('Login status:', loginResponse.status);
    console.log('Login data:', loginResponse.data);
    
    if (loginResponse.status !== 200 || !loginResponse.data.success) {
      throw new Error('Login failed');
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Admin logged in successfully\n');
    
    // 2. Get properties
    console.log('2️⃣ Fetching properties...');
    const propertiesResponse = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/admin-working/properties',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('Properties status:', propertiesResponse.status);
    console.log('Properties count:', propertiesResponse.data.properties?.length || 0);
    
    if (propertiesResponse.status !== 200 || !propertiesResponse.data.success) {
      throw new Error('Failed to fetch properties');
    }
    
    // 3. Find a pending property
    const properties = propertiesResponse.data.properties;
    const pendingProperty = properties.find(p => p.status === 'pending_payment' || p.status === 'pending');
    
    if (pendingProperty) {
      console.log('3️⃣ Found pending property:', pendingProperty.id, '-', pendingProperty.title);
      
      // 4. Approve the property
      console.log('4️⃣ Approving property...');
      const approvalResponse = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/admin-working/properties',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }, {
        propertyId: pendingProperty.id,
        status: 'approved',
        adminNotes: 'Approved by API test'
      });
      
      console.log('Approval status:', approvalResponse.status);
      console.log('Approval data:', approvalResponse.data);
      
      if (approvalResponse.status === 200 && approvalResponse.data.success) {
        console.log('✅ Property approved successfully!');
      } else {
        console.log('❌ Failed to approve property:', approvalResponse.data.error);
      }
    } else {
      console.log('3️⃣ No pending properties found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminApproval();