const http = require('http');

// First login to get token
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

console.log('🧪 Step 1: Login as broker...');

const loginReq = http.request(loginOptions, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const loginResult = JSON.parse(data);
      
      if (loginResult.success) {
        console.log('✅ Login successful');
        
        // Now test property creation
        testPropertyCreation(loginResult.token);
      } else {
        console.log('❌ Login failed:', loginResult.error);
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

function testPropertyCreation(token) {
  console.log('\n🧪 Step 2: Creating property...');
  
  const propertyData = JSON.stringify({
    title: 'Test Broker Property',
    description: 'A test property from broker',
    price: '50000',
    currency: 'ETB',
    city: 'Addis Ababa',
    area: 'Bole',
    type: 'house_sale',
    bedrooms: '3',
    bathrooms: '2',
    size: '150',
    features: ['Parking', 'Garden'],
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
        console.log('Property creation response:', result);
        
        if (result.success) {
          console.log('✅ Property created successfully!');
          console.log('Property ID:', result.property.id);
          console.log('Payment required:', result.payment.amount, 'ETB');
        } else {
          console.log('❌ Property creation failed:', result.error);
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