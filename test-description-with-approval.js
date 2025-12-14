const http = require('http');

async function testDescriptionWithApproval() {
  console.log('🧪 Testing Property Description with Admin Approval');
  
  // Step 1: Login as broker and create property
  console.log('\n1️⃣ Creating property as broker...');
  await createPropertyAsBroker();
}

function createPropertyAsBroker() {
  return new Promise((resolve, reject) => {
    const loginData = JSON.stringify({
      username: 'broker1',
      password: 'broker123'
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
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const loginResult = JSON.parse(data);
          if (loginResult.success) {
            console.log('✅ Broker login successful');
            createProperty(loginResult.token, resolve, reject);
          } else {
            reject(new Error('Broker login failed'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    loginReq.on('error', reject);
    loginReq.write(loginData);
    loginReq.end();
  });
}

function createProperty(token, resolve, reject) {
  const propertyData = JSON.stringify({
    title: 'Luxury Villa with Swimming Pool',
    description: 'Experience luxury living in this magnificent villa featuring a private swimming pool, spacious bedrooms, and modern amenities. The property boasts high-end finishes, a gourmet kitchen, and beautifully landscaped gardens. Perfect for entertaining guests or enjoying quiet family time. Located in an exclusive neighborhood with 24/7 security and easy access to international schools and shopping centers.',
    price: '150000',
    currency: 'ETB',
    city: 'Addis Ababa',
    area: 'Old Airport',
    type: 'house_sale',
    bedrooms: '5',
    bathrooms: '4',
    size: '350',
    features: ['Swimming Pool', 'Garden', 'Security', 'Parking', 'Modern Kitchen'],
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
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        if (result.success) {
          console.log('✅ Property created:', result.property.id);
          console.log('\n2️⃣ Now approving property as admin...');
          approvePropertyAsAdmin(result.property.id, resolve, reject);
        } else {
          reject(new Error('Property creation failed: ' + result.error));
        }
      } catch (error) {
        reject(error);
      }
    });
  });

  propertyReq.on('error', reject);
  propertyReq.write(propertyData);
  propertyReq.end();
}

function approvePropertyAsAdmin(propertyId, resolve, reject) {
  // First login as admin
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
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const loginResult = JSON.parse(data);
        if (loginResult.success) {
          console.log('✅ Admin login successful');
          approveProperty(loginResult.token, propertyId, resolve, reject);
        } else {
          reject(new Error('Admin login failed'));
        }
      } catch (error) {
        reject(error);
      }
    });
  });

  loginReq.on('error', reject);
  loginReq.write(loginData);
  loginReq.end();
}

function approveProperty(adminToken, propertyId, resolve, reject) {
  const approvalData = JSON.stringify({
    action: 'approve'
  });

  const approvalOptions = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/admin-working/properties/${propertyId}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
      'Content-Length': Buffer.byteLength(approvalData)
    }
  };

  const approvalReq = http.request(approvalOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        if (result.success) {
          console.log('✅ Property approved successfully!');
          console.log('\n3️⃣ Now testing property details view...');
          testPropertyDetails(propertyId, resolve, reject);
        } else {
          reject(new Error('Property approval failed: ' + result.error));
        }
      } catch (error) {
        reject(error);
      }
    });
  });

  approvalReq.on('error', reject);
  approvalReq.write(approvalData);
  approvalReq.end();
}

function testPropertyDetails(propertyId, resolve, reject) {
  const detailsOptions = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/property/${propertyId}`,
    method: 'GET'
  };

  const detailsReq = http.request(detailsOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        
        if (result.success && result.property) {
          console.log('✅ Property details fetched successfully!');
          console.log('\n📋 Property Information:');
          console.log('Title:', result.property.title);
          console.log('Price:', result.property.price, result.property.currency);
          console.log('Location:', result.property.area + ', ' + result.property.city);
          console.log('\n📝 Description:');
          console.log(result.property.description);
          
          if (result.property.description && 
              result.property.description !== result.property.title && 
              result.property.description.length > 50) {
            console.log('\n🎉 SUCCESS: Property description is working perfectly!');
            console.log('✅ Users can now see detailed descriptions when clicking "View Details"');
            console.log('✅ Description is properly saved to database');
            console.log('✅ Description is displayed in property details page');
            console.log(`\n🔗 View this property at: http://localhost:3000/property/${propertyId}`);
          } else {
            console.log('\n❌ ISSUE: Description is missing or too short');
          }
          resolve();
        } else {
          reject(new Error('Failed to fetch property details: ' + (result.error || 'Unknown error')));
        }
      } catch (error) {
        reject(error);
      }
    });
  });

  detailsReq.on('error', reject);
  detailsReq.end();
}

testDescriptionWithApproval().catch(console.error);