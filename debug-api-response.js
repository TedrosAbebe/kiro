const Database = require('better-sqlite3')
const { join } = require('path')

console.log('🔍 DEBUGGING API RESPONSE')

const dbPath = join(process.cwd(), 'data', 'broker.db')
const db = new Database(dbPath)

try {
  // Simulate the exact query from the API
  const properties = db.prepare(`
    SELECT 
      p.*,
      u.username as owner_name,
      u.role as owner_role
    FROM properties p
    LEFT JOIN users u ON p.owner_id = u.id
    WHERE p.status = 'approved'
    ORDER BY p.is_premium DESC, p.created_at DESC
    LIMIT 50
  `).all()

  console.log(`\n📊 Found ${properties.length} approved properties`)
  console.log('=' .repeat(80))

  // Simulate the exact formatting from the API
  const formattedProperties = properties.map((prop, index) => {
    console.log(`\n${index + 1}. Processing: ${prop.title}`)
    console.log(`   Raw images data: ${prop.images ? 'EXISTS' : 'NULL'}`)
    
    let parsedImages = []
    if (prop.images) {
      try {
        parsedImages = JSON.parse(prop.images)
        console.log(`   ✅ Parsed ${parsedImages.length} images successfully`)
        if (parsedImages.length > 0) {
          console.log(`   📸 First image type: ${parsedImages[0].startsWith('data:') ? 'Base64' : 'URL'}`)
          console.log(`   📸 First image preview: ${parsedImages[0].substring(0, 80)}...`)
        }
      } catch (e) {
        console.log(`   ❌ JSON parse error: ${e.message}`)
        parsedImages = ['/api/placeholder/400/300']
      }
    } else {
      console.log(`   📸 No images data, using placeholder`)
      parsedImages = ['/api/placeholder/400/300']
    }

    return {
      id: prop.id,
      title: prop.title,
      description: prop.description || 'No description available',
      price: prop.price,
      currency: prop.currency || 'ETB',
      location: {
        city: prop.city,
        area: prop.area
      },
      type: prop.type,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      size: prop.size,
      images: parsedImages,
      features: prop.features ? JSON.parse(prop.features) : [],
      status: prop.status,
      whatsappNumber: prop.whatsapp_number,
      phoneNumber: prop.phone_number,
      owner_name: prop.owner_name,
      owner_role: prop.owner_role,
      isPremium: Boolean(prop.is_premium),
      created_at: prop.created_at
    }
  })

  console.log(`\n\n🎯 FINAL API RESPONSE SIMULATION:`)
  console.log('=' .repeat(50))
  
  formattedProperties.forEach((prop, index) => {
    console.log(`\n${index + 1}. ${prop.title}`)
    console.log(`   Images array length: ${prop.images.length}`)
    console.log(`   First image: ${prop.images[0].substring(0, 60)}...`)
    console.log(`   Is placeholder: ${prop.images[0].includes('placeholder') ? 'YES' : 'NO'}`)
  })

} catch (error) {
  console.error('❌ Debug error:', error)
} finally {
  db.close()
}

console.log('\n🏁 Debug complete!')