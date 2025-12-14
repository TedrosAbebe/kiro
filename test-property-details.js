// Test individual property details API
const http = require('http');

function makeRequest(options) {
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
    req.end();
  });
}

async function testPropertyDetails() {
  console.log('🧪 TESTING PROPERTY DETAILS API...\n');
  
  try {
    // First get list of properties to find an ID
    console.log('1️⃣ Getting list of properties...');
    const listResponse = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/properties-public',
      method: 'GET'
    });
    
    if (listResponse.data.properties && listResponse.data.properties.length > 0) {
      const firstProperty = listResponse.data.properties[0];
      console.log('Found property ID:', firstProperty.id);
      
      // Now test individual property details
      console.log('\n2️⃣ Testing property details for ID:', firstProperty.id);
      const detailResponse = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: `/api/property/${firstProperty.id}`,
        method: 'GET'
      });
      
      console.log('Status:', detailResponse.status);
      console.log('Success:', detailResponse.data.success);
      
      if (detailResponse.data.property) {
        const prop = detailResponse.data.property;
        console.log('\n📋 Property Details:');
        console.log('Title:', prop.title);
        console.log('Price:', prop.price, prop.currency);
        console.log('Location:', prop.area + ', ' + prop.city);
        console.log('Type:', prop.type);
        console.log('Size:', prop.size, 'm²');
        console.log('Phone:', prop.phone_number);
        console.log('WhatsApp:', prop.whatsapp_number);
        console.log('Status:', prop.status);
        console.log('Owner:', prop.owner_name, '(' + prop.owner_role + ')');
      } else {
        console.log('❌ No property details found');
      }
    } else {
      console.log('❌ No properties found to test');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPropertyDetails();