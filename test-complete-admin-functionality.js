const Database = require('better-sqlite3')
const { join } = require('path')

console.log('🧪 TESTING COMPLETE ADMIN FUNCTIONALITY...\n')

const dbPath = join(process.cwd(), 'data', 'broker-clean.db')
const db = new Database(dbPath)

try {
  // 1. Test Properties for Admin Review
  console.log('1️⃣ PROPERTIES PENDING ADMIN REVIEW:')
  const pendingProperties = db.prepare(`
    SELECT 
      p.id, p.title, p.status, p.price, p.city, p.area,
      u.username as owner_name, u.role as owner_role
    FROM properties p
    LEFT JOIN users u ON p.owner_id = u.id
    WHERE p.status IN ('pending', 'pending_payment')
    ORDER BY p.created_at DESC
  `).all()

  if (pendingProperties.length === 0) {
    console.log('   ❌ No properties pending approval')
  } else {
    pendingProperties.forEach(prop => {
      console.log(`   📋 ${prop.id}: ${prop.title}`)
      console.log(`      Status: ${prop.status} | Owner: ${prop.owner_name} (${prop.owner_role})`)
      console.log(`      Price: ${prop.price} ETB | Location: ${prop.area}, ${prop.city}`)
      console.log('')
    })
  }

  // 2. Test Guest Submissions
  console.log('2️⃣ GUEST SUBMISSIONS PENDING REVIEW:')
  const pendingGuests = db.prepare(`
    SELECT 
      id, title, price, city, area, status,
      guest_name, guest_phone, guest_whatsapp, submitted_by
    FROM properties
    WHERE submitted_by = 'guest' AND status IN ('pending', 'pending_payment')
    ORDER BY created_at DESC
  `).all()

  if (pendingGuests.length === 0) {
    console.log('   ❌ No guest submissions pending')
  } else {
    pendingGuests.forEach(guest => {
      console.log(`   👤 ${guest.id}: ${guest.title}`)
      console.log(`      Guest: ${guest.guest_name || 'Unknown'} | Price: ${guest.price} ETB`)
      console.log(`      Location: ${guest.area}, ${guest.city} | Status: ${guest.status}`)
      console.log('')
    })
  }

  // 3. Test All Users (including brokers)
  console.log('3️⃣ ALL SYSTEM USERS:')
  const allUsers = db.prepare(`
    SELECT id, username, role
    FROM users
    ORDER BY role, username
  `).all()

  const userStats = allUsers.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1
    return acc
  }, {})

  console.log(`   📊 User Statistics:`)
  Object.entries(userStats).forEach(([role, count]) => {
    const emoji = role === 'admin' ? '🛡️' : role === 'broker' ? '👨‍💼' : '👤'
    console.log(`      ${emoji} ${role}: ${count} users`)
  })
  console.log('')

  allUsers.forEach(user => {
    const emoji = user.role === 'admin' ? '🛡️' : user.role === 'broker' ? '👨‍💼' : '👤'
    console.log(`   ${emoji} ${user.username} (${user.role})`)
  })

  // 4. Test Approve Functionality
  console.log('\n4️⃣ TESTING APPROVE FUNCTIONALITY:')
  if (pendingProperties.length > 0) {
    const testProperty = pendingProperties[0]
    console.log(`   🧪 Testing approval of: ${testProperty.title}`)
    
    const approveResult = db.prepare(`
      UPDATE properties 
      SET status = 'approved'
      WHERE id = ?
    `).run(testProperty.id)
    
    if (approveResult.changes > 0) {
      console.log(`   ✅ Property approved successfully!`)
      
      // Revert for testing
      db.prepare(`
        UPDATE properties 
        SET status = ?
        WHERE id = ?
      `).run(testProperty.status, testProperty.id)
      console.log(`   🔄 Reverted status for continued testing`)
    } else {
      console.log(`   ❌ Failed to approve property`)
    }
  }

  // 5. Summary
  console.log('\n📋 ADMIN DASHBOARD SUMMARY:')
  console.log(`   🏠 Total Properties: ${db.prepare('SELECT COUNT(*) as count FROM properties').get().count}`)
  console.log(`   ⏳ Pending Approval: ${pendingProperties.length}`)
  console.log(`   👥 Guest Submissions: ${pendingGuests.length}`)
  console.log(`   👤 Total Users: ${allUsers.length}`)
  console.log(`   👨‍💼 Brokers: ${userStats.broker || 0}`)
  console.log(`   🛡️ Admins: ${userStats.admin || 0}`)

  console.log('\n🎉 ADMIN FUNCTIONALITY TEST COMPLETE!')
  console.log('\n📝 TESTING INSTRUCTIONS:')
  console.log('1. Login as admin/admin123')
  console.log('2. Go to Admin Dashboard (/admin-working)')
  console.log('3. You should see:')
  console.log(`   - ${pendingProperties.length} properties pending approval`)
  console.log(`   - ${pendingGuests.length} guest submissions`)
  console.log(`   - ${allUsers.length} total users in system`)
  console.log('4. Test approve/reject buttons')
  console.log('5. Switch between tabs to see all data')

} finally {
  db.close()
}