const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')
const { join } = require('path')

console.log('🧪 Testing Login API Directly...\n')

// Test the database directly first
const dbPath = join(process.cwd(), 'data', 'broker.db')
const db = new Database(dbPath)

console.log('1️⃣ Testing database connection...')
try {
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get('tedayeerasu')
  if (user) {
    console.log('✅ Found user in database:', user.username)
    console.log('   Role:', user.role)
    console.log('   Created:', user.created_at)
    
    // Test password
    const passwordMatch = bcrypt.compareSync('494841Abc', user.password_hash)
    console.log('   Password match:', passwordMatch ? '✅ YES' : '❌ NO')
  } else {
    console.log('❌ User not found in database!')
  }
} catch (error) {
  console.error('❌ Database error:', error.message)
}

db.close()

// Test the API endpoint if server is running
console.log('\n2️⃣ Testing API endpoint...')

const testLoginAPI = async () => {
  try {
    const fetch = require('node-fetch')
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'tedayeerasu',
        password: '494841Abc'
      })
    })
    
    const data = await response.json()
    
    console.log('API Response Status:', response.status)
    console.log('API Response:', JSON.stringify(data, null, 2))
    
    if (data.success) {
      console.log('✅ API login successful!')
      console.log('   Token received:', !!data.token)
      console.log('   User role:', data.user?.role)
    } else {
      console.log('❌ API login failed:', data.message || data.error)
    }
    
  } catch (error) {
    console.log('❌ API test failed:', error.message)
    console.log('💡 Make sure the Next.js server is running with: npm run dev')
  }
}

testLoginAPI()