const Database = require('better-sqlite3')
const { join } = require('path')

console.log('🔍 DEBUGGING PROPERTY IMAGES')

const dbPath = join(process.cwd(), 'data', 'broker.db')
const db = new Database(dbPath)

try {
  // Check all properties and their images
  const properties = db.prepare(`
    SELECT id, title, images, status, created_at 
    FROM properties 
    ORDER BY created_at DESC
  `).all()

  console.log(`\n📊 Found ${properties.length} total properties:`)
  console.log('=' .repeat(80))

  properties.forEach((prop, index) => {
    console.log(`\n${index + 1}. Property: ${prop.title}`)
    console.log(`   ID: ${prop.id}`)
    console.log(`   Status: ${prop.status}`)
    console.log(`   Created: ${prop.created_at}`)
    
    if (prop.images) {
      try {
        const images = JSON.parse(prop.images)
        console.log(`   📸 Images: ${images.length} photos`)
        if (images.length > 0) {
          images.forEach((img, imgIndex) => {
            const preview = img.substring(0, 50) + (img.length > 50 ? '...' : '')
            console.log(`      ${imgIndex + 1}. ${preview}`)
          })
        }
      } catch (e) {
        console.log(`   ❌ Invalid images JSON: ${prop.images}`)
      }
    } else {
      console.log(`   📸 Images: None`)
    }
  })

  // Check approved properties specifically
  const approvedProperties = db.prepare(`
    SELECT id, title, images, status 
    FROM properties 
    WHERE status = 'approved'
    ORDER BY created_at DESC
  `).all()

  console.log(`\n\n✅ APPROVED PROPERTIES (${approvedProperties.length}):`)
  console.log('=' .repeat(50))

  approvedProperties.forEach((prop, index) => {
    console.log(`\n${index + 1}. ${prop.title} (${prop.id})`)
    if (prop.images) {
      try {
        const images = JSON.parse(prop.images)
        console.log(`   📸 ${images.length} photos available`)
      } catch (e) {
        console.log(`   ❌ Invalid images data`)
      }
    } else {
      console.log(`   📸 No photos`)
    }
  })

  // Test the API query that homepage uses
  console.log(`\n\n🔍 TESTING HOMEPAGE API QUERY:`)
  console.log('=' .repeat(50))

  const homepageProperties = db.prepare(`
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

  console.log(`Found ${homepageProperties.length} properties for homepage`)

  homepageProperties.forEach((prop, index) => {
    console.log(`\n${index + 1}. ${prop.title}`)
    console.log(`   Owner: ${prop.owner_name} (${prop.owner_role})`)
    console.log(`   Premium: ${prop.is_premium ? 'Yes' : 'No'}`)
    
    if (prop.images) {
      try {
        const images = JSON.parse(prop.images)
        console.log(`   📸 Images: ${images.length} photos`)
        if (images.length > 0) {
          console.log(`   📸 First image preview: ${images[0].substring(0, 80)}...`)
        }
      } catch (e) {
        console.log(`   ❌ Images parsing error: ${e.message}`)
      }
    } else {
      console.log(`   📸 No images column data`)
    }
  })

} catch (error) {
  console.error('❌ Database error:', error)
} finally {
  db.close()
}

console.log('\n🏁 Debug complete!')