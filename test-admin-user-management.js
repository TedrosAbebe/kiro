const fetch = require('node-fetch')

async function testAdminUserManagement() {
  console.log('🧪 Testing Admin User Management System...\n')
  
  const baseUrl = 'http://localhost:3000'
  
  try {
    // Step 1: Login as admin
    console.log('1️⃣ Logging in as admin...')
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'tedayeerasu',
        password: '494841Abc'
      })
    })
    
    const loginData = await loginResponse.json()
    if (!loginData.success) {
      console.log('❌ Admin login failed:', loginData.error)
      return
    }
    
    console.log('✅ Admin login successful')
    const token = loginData.token
    
    // Step 2: Test creating a new admin user
    console.log('\n2️⃣ Testing user creation...')
    const createResponse = await fetch(`${baseUrl}/api/admin/manage-users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        action: 'create',
        username: 'testadmin2',
        password: 'TestPass123',
        role: 'admin'
      })
    })
    
    const createData = await createResponse.json()
    if (createData.success) {
      console.log('✅ User creation successful:', createData.message)
    } else {
      console.log('❌ User creation failed:', createData.error)
    }
    
    // Step 3: Test fetching users
    console.log('\n3️⃣ Testing user list fetch...')
    const usersResponse = await fetch(`${baseUrl}/api/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    const usersData = await usersResponse.json()
    if (usersData.success) {
      console.log('✅ Users fetched successfully')
      console.log('   Total users:', usersData.users.length)
      usersData.users.forEach(user => {
        console.log(`   - ${user.username} (${user.role})`)
      })
    } else {
      console.log('❌ Failed to fetch users:', usersData.error)
    }
    
    // Step 4: Test deleting the test user
    if (createData.success) {
      console.log('\n4️⃣ Testing user deletion...')
      const deleteResponse = await fetch(`${baseUrl}/api/admin/manage-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'delete',
          username: 'testadmin2'
        })
      })
      
      const deleteData = await deleteResponse.json()
      if (deleteData.success) {
        console.log('✅ User deletion successful:', deleteData.message)
      } else {
        console.log('❌ User deletion failed:', deleteData.error)
      }
    }
    
    // Step 5: Test protection of main admin account
    console.log('\n5️⃣ Testing main admin account protection...')
    const protectResponse = await fetch(`${baseUrl}/api/admin/manage-users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        action: 'delete',
        username: 'tedayeerasu'
      })
    })
    
    const protectData = await protectResponse.json()
    if (!protectData.success && protectData.error.includes('main admin')) {
      console.log('✅ Main admin account is protected from deletion')
    } else {
      console.log('❌ Main admin account protection failed')
    }
    
    console.log('\n🎉 Admin user management test complete!')
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message)
    console.log('\n💡 Make sure the Next.js server is running with: npm run dev')
  }
}

testAdminUserManagement()