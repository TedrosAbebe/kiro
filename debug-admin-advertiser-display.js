const debugAdminAdvertiserDisplay = async () => {
  console.log('🔍 Debugging Admin Advertiser Applications Display...')
  
  try {
    // Test 1: Check if API endpoint is working
    console.log('📡 Testing API endpoint...')
    const response = await fetch('http://localhost:3000/api/admin/advertiser-applications')
    console.log('Response status:', response.status)
    
    const data = await response.json()
    console.log('API Response:', data)
    
    if (data.success) {
      console.log(`✅ API working - Found ${data.applications.length} applications`)
      
      // Test 2: Check application details
      data.applications.forEach((app, index) => {
        console.log(`\n📋 Application ${index + 1}:`)
        console.log(`  ID: ${app.id}`)
        console.log(`  Business: ${app.business_name}`)
        console.log(`  Owner: ${app.full_name}`)
        console.log(`  Status: ${app.status}`)
        console.log(`  Email: ${app.email}`)
        console.log(`  Created: ${app.created_at}`)
      })
      
      // Test 3: Check pending count
      const pendingCount = data.applications.filter(app => app.status === 'pending').length
      console.log(`\n⏳ Pending applications: ${pendingCount}`)
      
      // Test 4: Check if admin dashboard should show the tab
      if (pendingCount > 0) {
        console.log('✅ Admin dashboard should show advertiser applications tab with pending count')
      } else {
        console.log('ℹ️ No pending applications - tab should still be visible but with 0 pending')
      }
      
    } else {
      console.log('❌ API failed:', data.message)
    }
    
    // Test 5: Check if admin is logged in (simulate)
    console.log('\n🔐 Admin Authentication Check:')
    console.log('- Make sure you are logged in as admin (tedayeerasu)')
    console.log('- Check if you can see the Admin Dashboard')
    console.log('- Look for the "📢 Advertiser Applications" tab')
    
    // Test 6: Frontend debugging tips
    console.log('\n🐛 Frontend Debugging Tips:')
    console.log('1. Open browser developer tools (F12)')
    console.log('2. Check Console tab for JavaScript errors')
    console.log('3. Check Network tab to see if API calls are being made')
    console.log('4. Look for any React/Next.js errors')
    console.log('5. Verify the admin dashboard is loading correctly')
    
  } catch (error) {
    console.error('🚨 Debug error:', error)
  }
}

// Run the debug
debugAdminAdvertiserDisplay()