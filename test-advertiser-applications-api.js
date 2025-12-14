const testAdvertiserApplicationsAPI = async () => {
  console.log('🧪 Testing Advertiser Applications API...')
  
  try {
    console.log('📤 Fetching advertiser applications...')
    const response = await fetch('http://localhost:3000/api/admin/advertiser-applications', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    console.log('📥 Response status:', response.status)
    const result = await response.json()
    console.log('📋 Response data:', result)

    if (response.ok) {
      console.log('✅ API working successfully!')
      console.log(`Found ${result.applications.length} advertiser applications`)
      
      result.applications.forEach((app, index) => {
        console.log(`\n${index + 1}. ${app.business_name}`)
        console.log(`   Owner: ${app.full_name}`)
        console.log(`   Email: ${app.email}`)
        console.log(`   Status: ${app.status}`)
        console.log(`   Created: ${app.created_at}`)
      })
    } else {
      console.log('❌ API failed:', result.message)
    }

  } catch (error) {
    console.error('🚨 Network error:', error)
  }
}

// Test the API
testAdvertiserApplicationsAPI()