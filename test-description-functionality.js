const http = require('http');

async function testDescriptionFunctionality() {
  console.log('🧪 Testing Property Description Functionality');
  
  // Step 1: Login as broker
  console.log('\n1️⃣ Logging in as broker...');
  
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
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const loginResult = JSON.parse(data);
        
        if (loginResult.success) {
          console.log('✅ Login successful');
          testPropertyWithDescription(loginResult.token);
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
}

function testPropertyWithDescription(token) {
  console.log('\n2️⃣ Creating property with detailed description...');
  
  const propertyData = JSON.stringify({
    title: 'Beautiful Modern Villa with Garden',
    description: 'This stunning modern villa features spacious rooms, a beautiful garden, and premium finishes throughout. Located in a quiet residential area with easy access to schools, shopping centers, and public transportation. The property includes a modern kitchen with built-in appliances, a large living room with natural light, and a private garden perfect for relaxation. Ideal for families looking for comfort and convenience in the heart of Addis Ababa.',
    price: '120000',
    currency: 'ETB',
    city: 'Addis Ababa',
    area: 'Bole Atlas',
    type: 'house_sale',
    bedrooms: '4',
    bathrooms: '3',
    size: '250',
    features: ['Garden', 'Modern Kitchen', 'Parking', 'Security', 'Natural Light'],
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
        
        if (result.success) {
          console.log('✅ Property created with description!');
          console.log('Property ID:', result.property.id);
          
          // Step 3: Test fetching the property details
          testPropertyDetails(result.property.id);
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

function testPropertyDetails(propertyId) {
  console.log('\n3️⃣ Fetching property details to check description...');
  
  const detailsOptions = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/property/${propertyId}`,
    method: 'GET'
  };

  const detailsReq = http.request(detailsOptions, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        
        if (result.success && result.property) {
          console.log('✅ Property details fetched successfully!');
          console.log('\n📋 Property Information:');
          console.log('Title:', result.property.title);
          console.log('Description:', result.property.description);
          console.log('Price:', result.property.price, result.property.currency);
          console.log('Location:', result.property.area + ', ' + result.property.city);
          
          if (result.property.description && result.property.description !== result.property.title) {
            console.log('\n🎉 SUCCESS: Description is properly saved and displayed!');
            console.log('✅ Users can now see detailed descriptions when viewing property details.');
          } else {
            console.log('\n❌ ISSUE: Description is missing or same as title');
          }
        } else {
          console.log('❌ Failed to fetch property details:', result.error);
        }
      } catch (error) {
        console.error('❌ Details parse error:', error.message);
        console.log('Raw response:', data);
      }
    });
  });

  detailsReq.on('error', (error) => {
    console.error('❌ Details request error:', error.message);
  });

  detailsReq.end();
}

testDescriptionFunctionality();