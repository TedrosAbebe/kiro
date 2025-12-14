const fetch = require('node-fetch')

async function testAPI() {
  console.log('🧪 TESTING API IMAGES RESPONSE')
  
  try {
    console.log('📡 Calling /api/properties-working...')
    
    const response = await fetch('http://localhost:3000/api/properties-working')
    const data = await response.json()
    
    console.log(`✅ API Response: ${response.status}`)
    console.log(`📊 Properties found: ${data.properties?.length || 0}`)
    
    if (data.properties && data.properties.length > 0) {
      console.log('\n🏠 PROPERTIES WITH IMAGES:')
      console.log('=' .repeat(60))
      
      data.properties.forEach((prop, index) => {
        console.log(`\n${index + 1}. ${prop.title}`)
        console.log(`   ID: ${prop.id}`)
        console.log(`   Images: ${prop.images?.length || 0} photos`)
        
        if (prop.images && prop.images.length > 0) {
          console.log(`   📸 First image: ${prop.images[0].substring(0, 80)}...`)
          console.log(`   📸 Image type: ${prop.images[0].startsWith('data:') ? 'Base64' : 'URL'}`)
        } else {
          console.log(`   📸 No images`)
        }
      })
      
      // Check if any property has images
      const propertiesWithImages = data.properties.filter(p => p.images && p.images.length > 0)
      console.log(`\n📸 Properties with images: ${propertiesWithImages.length}`)
      
      if (propertiesWithImages.length > 0) {
        console.log('✅ SUCCESS: Images are being returned by the API!')
      } else {
        console.log('❌ ISSUE: No properties have images in the API response')
      }
    } else {
      console.log('❌ No properties found in API response')
    }
    
  } catch (error) {
    console.error('❌ API Test Error:', error.message)
  }
}

testAPI()