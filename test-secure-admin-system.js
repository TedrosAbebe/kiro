const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')
const { join } = require('path')

const dbPath = join(process.cwd(), 'data', 'broker.db')
const db = new Database(dbPath)

console.log('🔐 Testing Secure Admin System...\n')

// Test 1: Verify only tedayeerasu admin exists
console.log('1️⃣ Checking admin accounts...')
const admins = db.prepare('SELECT * FROM users WHERE role = ?').all('admin')
console.log('Admin accounts found:', admins.length)
admins.forEach(admin => {
  console.log(`   - ${admin.username} (created: ${admin.created_at})`)
})

// Test 2: Verify tedayeerasu password
console.log('\n2️⃣ Testing tedayeerasu login...')
const tedaUser = db.prepare('SELECT * FROM users WHERE username = ?').get('tedayeerasu')
if (tedaUser) {
  const passwordMatch = bcrypt.compareSync('494841Abc', tedaUser.password_hash)
  console.log(`   Password verification: ${passwordMatch ? '✅ CORRECT' : '❌ INCORRECT'}`)
} else {
  console.log('   ❌ tedayeerasu account not found!')
}

// Test 3: Check for any test accounts that should be removed
console.log('\n3️⃣ Checking for test accounts...')
const testAccounts = ['testbroker123', 'tedy', 'asefu', 'testuser', 'abc']
let foundTestAccounts = 0
testAccounts.forEach(username => {
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username)
  if (user) {
    console.log(`   ❌ Found test account: ${username}`)
    foundTestAccounts++
  }
})
if (foundTestAccounts === 0) {
  console.log('   ✅ No test accounts found - system is clean!')
}

// Test 4: Check broker applications cleanup
console.log('\n4️⃣ Checking broker applications...')
const brokerApps = db.prepare('SELECT * FROM broker_info').all()
console.log(`   Total broker applications: ${brokerApps.length}`)
brokerApps.forEach(app => {
  console.log(`   - ${app.full_name} (${app.status})`)
})

// Test 5: Verify database structure
console.log('\n5️⃣ Verifying database structure...')
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
console.log('   Tables found:', tables.map(t => t.name).join(', '))

// Test 6: Check all users
console.log('\n6️⃣ All system users:')
const allUsers = db.prepare('SELECT username, role, created_at FROM users ORDER BY created_at DESC').all()
allUsers.forEach(user => {
  console.log(`   - ${user.username} (${user.role}) - ${user.created_at}`)
})

console.log('\n🎉 Admin system security check complete!')
console.log('\n📋 Summary:')
console.log(`   • Admin accounts: ${admins.length}`)
console.log(`   • Total users: ${allUsers.length}`)
console.log(`   • Broker applications: ${brokerApps.length}`)
console.log(`   • Test accounts remaining: ${foundTestAccounts}`)

db.close()