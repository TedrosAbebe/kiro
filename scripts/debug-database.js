const { initializeDatabase, userOperations, adminOperations } = require('../lib/database')

console.log('🔍 DEBUGGING DATABASE STATE...\n')

try {
  // Initialize database first
  console.log('📊 Initializing database...')
  initializeDatabase()
  console.log('✅ Database initialized\n')

  // Check users table
  console.log('👥 USERS TABLE:')
  console.log('===============')
  try {
    const users = userOperations.getAll.all()
    if (users.length === 0) {
      console.log('❌ No users found in database')
    } else {
      console.log(`✅ Found ${users.length} users:`)
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.phone}) - Role: ${user.role}`)
      })
    }
  } catch (error) {
    console.error('❌ Error reading users table:', error.message)
  }

  console.log('\n👤 ADMINS TABLE:')
  console.log('================')
  try {
    const admins = adminOperations.getAll.all()
    if (admins.length === 0) {
      console.log('❌ No admins found in database')
    } else {
      console.log(`✅ Found ${admins.length} admins:`)
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.name} (${admin.email}) - Phone: ${admin.phone}`)
      })
    }
  } catch (error) {
    console.error('❌ Error reading admins table:', error.message)
  }

  console.log('\n🧪 TESTING PHONE NORMALIZATION:')
  console.log('===============================')
  const { normalizePhone } = require('../lib/auth')
  const testPhones = ['0911234567', '251911234567', '+251911234567', '911234567']
  testPhones.forEach(phone => {
    console.log(`${phone} → ${normalizePhone(phone)}`)
  })

  console.log('\n🔐 TESTING PASSWORD HASHING:')
  console.log('============================')
  const { hashPassword, verifyPassword } = require('../lib/auth')
  const testPassword = '123456'
  const hashedPassword = hashPassword(testPassword)
  const isValid = verifyPassword(testPassword, hashedPassword)
  console.log(`Password: ${testPassword}`)
  console.log(`Hashed: ${hashedPassword}`)
  console.log(`Verification: ${isValid ? '✅ Valid' : '❌ Invalid'}`)

} catch (error) {
  console.error('❌ Database debug error:', error)
}

console.log('\n💡 TROUBLESHOOTING TIPS:')
console.log('========================')
console.log('1. If no users found, try registering a new user first')
console.log('2. Check if database file exists: data/broker.db')
console.log('3. Make sure you\'re using the correct phone format')
console.log('4. Check browser and server console for detailed logs')
console.log('5. Try registering before logging in')