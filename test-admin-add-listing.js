const http = require('http');

async function testAdminAddListing() {
  console.log('🧪 Testing Admin Add Listing Functionality');
  
  // Step 1: Login as admin
  console.log('\n1️⃣ Logging in as admin...');
  
  const loginData = JSON.stringify({
    username: 'admin',
    password: 'admin123'
  });

  const loginOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };

  const loginReq = http.request(loginOptions, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const loginResult = JSON.parse(data);
        
        if (loginResult.success) {
          console.log('✅ Admin login successful');
          console.log('User:', loginResult.user.username, 'Role:', loginResult.user.role);
          
          // Step 2: Test property creation as admin
          testAdminPropertyCreation(loginResult.token);
        } else {
          console.log('❌ Admin login failed:', loginResult.error);
        }
      } catch (error) {
        console.error('❌ Login parse error:', error.message);
      }
    });
  });

  loginReq.on('error', (error) => {
    console.error('❌ Login request error:', error.message);
  });

  loginReq.write(loginData);
  loginReq.end();
}

function testAdminPropertyCreation(token) {
  console.log('\n2️⃣ Creating property as admin...');
  
  const propertyData = JSON.stringify({
    title: 'Admin Test Property',
    description: 'A test property created by admin',
    price: '80000',
    currency: 'ETB',
    city: 'Addis Ababa',
    area: 'Kazanchis',
    type: 'house_sale',
    bedrooms: '4',
    bathrooms: '3',
    size: '200',
    features: ['Parking', 'Garden', 'Security'],
    whatsappNumber: '+251911234567',
    phoneNumber: '+251911234567'
  });

  const propertyOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/properties-working',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Length': Buffer.byteLength(propertyData)
    }
  };

  const propertyReq = http.request(propertyOptions, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log('Admin property creation response:', result);
        
        if (result.success) {
          console.log('✅ Admin can create properties successfully!');
          console.log('Property ID:', result.property.id);
          console.log('Payment required:', result.payment.amount, 'ETB');
          console.log('\n🎉 ADMIN ADD LISTING FUNCTIONALITY WORKING!');
        } else {
          console.log('❌ Admin property creation failed:', result.error);
        }
      } catch (error) {
        console.error('❌ Property parse error:', error.message);
        console.log('Raw response:', data);
      }
    });
  });

  propertyReq.on('error', (error) => {
    console.error('❌ Property request error:', error.message);
  });

  propertyReq.write(propertyData);
  propertyReq.end();
}

testAdminAddListing();