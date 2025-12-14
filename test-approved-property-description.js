const http = require('http');

function testApprovedPropertyDescription() {
  console.log('🧪 Testing Approved Property Description');
  
  const propertyId = 'prop-1765620128715'; // The property we just approved
  
  console.log(`\n📋 Fetching details for property: ${propertyId}`);
  
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
          console.log('✅ Property details API working!');
          console.log('\n📋 Property Information:');
          console.log('ID:', result.property.id);
          console.log('Title:', result.property.title);
          console.log('Price:', result.property.price, result.property.currency);
          console.log('Location:', result.property.area + ', ' + result.property.city);
          console.log('Size:', result.property.size, 'm²');
          console.log('Status:', result.property.status);
          
          console.log('\n📝 Description:');
          console.log('---');
          console.log(result.property.description);
          console.log('---');
          
          // Check if description is working properly
          if (result.property.description && 
              result.property.description !== result.property.title && 
              result.property.description.length > 50) {
            console.log('\n🎉 SUCCESS: Property description functionality is working perfectly!');
            console.log('\n✅ What users will see when clicking "View Details":');
            console.log('  - Property title');
            console.log('  - Detailed description from broker');
            console.log('  - Price and location');
            console.log('  - Property features');
            console.log('  - Contact information');
            console.log('\n🔗 Test it yourself:');
            console.log(`  1. Go to: http://localhost:3000`);
            console.log(`  2. Find the property: "${result.property.title}"`);
            console.log(`  3. Click "View Details"`);
            console.log(`  4. You should see the full description!`);
          } else {
            console.log('\n❌ ISSUE: Description is missing or not working properly');
            console.log('Description length:', result.property.description?.length || 0);
          }
        } else {
          console.log('❌ Failed to fetch property details');
          console.log('Error:', result.error || 'Unknown error');
          console.log('Raw response:', data);
        }
      } catch (error) {
        console.error('❌ Parse error:', error.message);
        console.log('Raw response:', data);
      }
    });
  });

  detailsReq.on('error', (error) => {
    console.error('❌ Request error:', error.message);
  });

  detailsReq.end();
}

testApprovedPropertyDescription();