const fetch = require('node-fetch');

async function testBrokerAddListing() {
  console.log('🧪 Testing Broker Add Listing Functionality');
  
  try {
    // Step 1: Login as broker
    console.log('\n1️⃣ Logging in as broker...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'broker1',
        password: 'broker123'
      })
    });
    
    const loginResult = await loginResponse.json();
    console.log('Login result:', loginResult);
    
    if (!loginResult.success) {
      console.log('❌ Login failed');
      return;
    }
    
    const token = loginResult.token;
    console.log('✅ Login successful, token received');
    
    // Step 2: Test property creation
    console.log('\n2️⃣ Creating test property...');
    const propertyData = {
      title: 'Test Property from Broker',
      description: 'A beautiful test property',
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
    };
    
    const propertyResponse = await fetch('http://localhost:3000/api/properties-working', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(propertyData)
    });
    
    const propertyResult = await propertyResponse.json();
    console.log('Property creation result:', propertyResult);
    
    if (propertyResult.success) {
      console.log('✅ Property created successfully!');
      console.log('Property ID:', propertyResult.property.id);
      console.log('Payment required:', propertyResult.payment.amount, 'ETB');
    } else {
      console.log('❌ Property creation failed:', propertyResult.error);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testBrokerAddListing();