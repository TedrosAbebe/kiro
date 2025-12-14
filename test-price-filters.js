// Test price filtering functionality
const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: 'GET'
    }, (res) => {
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

async function testPriceFilters() {
  console.log('🧪 TESTING PRICE FILTER FUNCTIONALITY...\n');
  
  try {
    // Test different filter combinations
    const tests = [
      {
        name: 'All Properties',
        path: '/api/properties-public',
        description: 'Get all approved properties'
      },
      {
        name: 'Price Range 100K-500K',
        path: '/api/properties-public?minPrice=100000&maxPrice=500000',
        description: 'Properties between 100K and 500K ETB'
      },
      {
        name: 'Price Range 1M-2M',
        path: '/api/properties-public?minPrice=1000000&maxPrice=2000000',
        description: 'Properties between 1M and 2M ETB'
      },
      {
        name: 'High-end Properties 5M+',
        path: '/api/properties-public?minPrice=5000000',
        description: 'Properties above 5M ETB'
      },
      {
        name: 'Rent Range 5K-20K',
        path: '/api/properties-public?minPrice=5000&maxPrice=20000',
        description: 'Rental properties 5K-20K ETB'
      },
      {
        name: 'Houses Only',
        path: '/api/properties-public?type=house',
        description: 'Filter by house type'
      },
      {
        name: 'Addis Ababa Properties',
        path: '/api/properties-public?city=Addis Ababa',
        description: 'Properties in Addis Ababa'
      },
      {
        name: 'Combined Filter',
        path: '/api/properties-public?city=Addis Ababa&type=house&minPrice=1000000&maxPrice=5000000',
        description: 'Houses in Addis Ababa, 1M-5M ETB'
      }
    ];
    
    for (const test of tests) {
      console.log(`🔍 ${test.name}:`);
      console.log(`   ${test.description}`);
      console.log(`   URL: ${test.path}`);
      
      const response = await makeRequest(test.path);
      
      console.log(`   Status: ${response.status}`);
      console.log(`   Success: ${response.data.success}`);
      
      if (response.data.properties) {
        console.log(`   Properties Found: ${response.data.properties.length}`);
        
        if (response.data.properties.length > 0) {
          // Show first property as example
          const prop = response.data.properties[0];
          console.log(`   Example: ${prop.title} - ${new Intl.NumberFormat().format(prop.price)} ETB`);
          console.log(`   Location: ${prop.area}, ${prop.city}`);
          console.log(`   Type: ${prop.type}`);
        }
      } else {
        console.log(`   Error: ${response.data.error || 'Unknown error'}`);
      }
      
      console.log(''); // Empty line for readability
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPriceFilters();