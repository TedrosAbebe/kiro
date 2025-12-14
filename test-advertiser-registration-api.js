const testAdvertiserRegistration = async () => {
  console.log('🧪 Testing Advertiser Registration API...')
  
  const testData = {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+251911123456',
    whatsappNumber: '+251911123456',
    businessName: 'Doe Real Estate',
    businessType: 'real_estate_agency',
    businessLicense: 'RE123456',
    yearsInBusiness: '5',
    city: 'Addis Ababa',
    area: 'Bole',
    address: '123 Main Street, Bole, Addis Ababa',
    services: ['property_sales', 'property_rentals'],
    specialization: 'Luxury properties',
    website: 'https://www.doerealestate.com',
    socialMedia: 'Facebook: @doerealestate',
    description: 'Professional real estate agency with 5 years of experience in luxury properties.',
    agreeToTerms: true
  }

  try {
    console.log('📤 Sending registration request...')
    const response = await fetch('http://localhost:3000/api/auth/register-advertiser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    console.log('📥 Response status:', response.status)
    const result = await response.json()
    console.log('📋 Response data:', result)

    if (response.ok) {
      console.log('✅ Registration successful!')
      console.log('Application ID:', result.applicationId)
    } else {
      console.log('❌ Registration failed:', result.message)
    }

  } catch (error) {
    console.error('🚨 Network error:', error)
  }
}

// Test the API
testAdvertiserRegistration()