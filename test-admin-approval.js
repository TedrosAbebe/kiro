// Test admin approval functionality
const fetch = require('node-fetch');

async function testAdminApproval() {
  console.log('🧪 TESTING ADMIN APPROVAL FUNCTIONALITY...\n');
  
  try {
    // 1. Login as admin
    console.log('1️⃣ Logging in as admin...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (!loginData.success) {
      throw new Error('Admin login failed');
    }
    
    const token = loginData.token;
    console.log('✅ Admin logged in successfully\n');
    
    // 2. Fetch properties
    console.log('2️⃣ Fetching properties for admin review...');
    const propertiesResponse = await fetch('http://localhost:3001/api/admin-working/properties', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const propertiesData = await propertiesResponse.json();
    console.log('Properties response:', propertiesData);
    
    if (!propertiesData.success) {
      throw new Error('Failed to fetch properties');
    }
    
    console.log('✅ Found', propertiesData.properties.length, 'properties\n');
    
    // 3. Try to approve a property
    if (propertiesData.properties.length > 0) {
      const propertyToApprove = propertiesData.properties.find(p => p.status === 'pending_payment' || p.status === 'pending');
      
      if (propertyToApprove) {
        console.log('3️⃣ Approving property:', propertyToApprove.id);
        
        const approveResponse = await fetch('http://localhost:3001/api/admin-working/properties', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            propertyId: propertyToApprove.id,
            status: 'approved',
            adminNotes: 'Approved by test script'
          })
        });
        
        const approveData = await approveResponse.json();
        console.log('Approval response:', approveData);
        
        if (approveData.success) {
          console.log('✅ Property approved successfully!');
        } else {
          console.log('❌ Failed to approve property:', approveData.error);
        }
      } else {
        console.log('ℹ️ No pending properties to approve');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminApproval();