const fetch = require('node-fetch')

async function testAdminLogin() {
  console.log('🧪 TESTING ADMIN LOGIN...')
  
  try {
    const response = await fetch('http://localhost:3002/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: 'admin', 
        password: 'admin123' 
      })
    })
    
    const data = await response.json()
    
    if (data.success) {
      console.log('✅ Admin login successful!')
      console.log('   User:', data.user.username)
      console.log('   Role:', data.user.role)
      console.log('   Token:', data.token ? 'Generated' : 'Missing')
      
      // Test admin users API
      console.log('\n🧪 Testing admin users API...')
      const usersResponse = await fetch('http://localhost:3002/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      })
      
      const usersData = await usersResponse.json()
      
      if (usersData.success) {
        console.log('✅ Admin users API working!')
        console.log('   Users found:', usersData.users.length)
        usersData.users.forEach(user => {
          console.log(`   - ${user.username} (${user.role})`)
        })
      } else {
        console.log('❌ Admin users API failed:', usersData.error)
      }
      
    } else {
      console.log('❌ Admin login failed:', data.error)
    }
    
  } catch (error) {
    console.log('❌ Test error:', error.message)
  }
}

testAdminLogin()