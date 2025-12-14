const http = require('http');

async function testBrokerAddListing() {
  console.log('🧪 Testing Broker Add Listing - Debug Mode');
  
  // Step 1: Login as broker
  console.log('\n1️⃣ Logging in as broker...');
  const loginData = JSON.stringify({
    username: 'broker1',
    password: 'broker123'
  });

  const loginOptions = {
    hostname: 'localhost',
    port: 3002, // Updated port
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
          console.log('User:', loginResult.user.username, 'Role:', loginResult.user.role);
          
          // Step 2: Test property creation
          testPropertyCreation(loginResult.token);
        } else {
          console.log('❌ Broker login failed:', loginResult.error);
        }
      } catch (error) {
        console.error('❌ Login parse error:', error.message);
        console.log('Raw response:', data);
      }
    });
  });

  loginReq.on('error', (error) => {
    console.error('❌ Login request error:', error.message);
  });

  loginReq.write(loginData);
  loginReq.end();
}

function testPropertyCreation(token) {
  console.log('\n2️⃣ Testing property creation...');
  
  const propertyData = JSON.stringify({
    title: 'Debug Test Property - Broker',
    description: 'This is a test property created by broker during debugging. It should work properly.',
    price: '65000',
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
    port: 3002, // Updated port
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
      console.log('Response status:', res.statusCode);
      console.log('Response headers:', res.headers);
      
      try {
        const result = JSON.parse(data);
        
        if (result.success) {
          console.log('✅ Broker property creation successful!');
          console.log('Property ID:', result.property.id);
          console.log('Payment required:', result.payment.amount, 'ETB');
          console.log('\n🎉 BROKER ADD LISTING IS WORKING!');
          console.log('\n📋 Next steps:');
          console.log('1. Login as broker at: http://localhost:3002/login');
          console.log('2. Go to broker dashboard: http://localhost:3002/broker');
          console.log('3. Click "Add New Property" button');
          console.log('4. Fill the form and submit');
        } else {
          console.log('❌ Broker property creation failed:', result.error);
          console.log('Full response:', result);
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

testBrokerAddListing();