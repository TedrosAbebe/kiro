// Test the public properties API
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

async function testPublicProperties() {
  console.log('🧪 TESTING PUBLIC PROPERTIES API...\n');
  
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/properties-public',
      method: 'GET'
    });
    
    console.log('Status:', response.status);
    console.log('Success:', response.data.success);
    console.log('Properties count:', response.data.properties?.length || 0);
    
    if (response.data.properties && response.data.properties.length > 0) {
      console.log('\n📋 Sample properties:');
      response.data.properties.slice(0, 3).forEach((prop, index) => {
        console.log(`${index + 1}. ${prop.title} - ${prop.status} - ${prop.price} ETB`);
        console.log(`   Location: ${prop.area}, ${prop.city}`);
        console.log(`   Owner: ${prop.owner_name}`);
      });
    } else {
      console.log('\n❌ No properties found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPublicProperties();