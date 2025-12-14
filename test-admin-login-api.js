const fetch = require('node-fetch');

async function testAdminLogin() {
    console.log('🧪 Testing Admin Login API...\n');
    
    const baseUrl = 'http://localhost:3001';
    const email = 'tedayeerasu@gmail.com';
    const password = 'admin123';
    
    try {
        // Step 1: Test credentials
        console.log('🔐 Step 1: Testing admin credentials...');
        console.log(`📧 Email: ${email}`);
        console.log(`🔐 Password: ${password}`);
        
        const credentialsResponse = await fetch(`${baseUrl}/api/auth/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                step: 'credentials'
            })
        });
        
        console.log(`📡 Response Status: ${credentialsResponse.status}`);
        
        const credentialsResult = await credentialsResponse.json();
        console.log('📡 Response Data:', JSON.stringify(credentialsResult, null, 2));
        
        if (credentialsResult.success && credentialsResult.requiresOTP) {
            console.log('✅ Credentials verified! OTP should be sent.');
            console.log('💡 Check your server console for the OTP code.');
            console.log('💡 In a real scenario, the OTP would be sent to the email.');
        } else {
            console.log('❌ Credentials verification failed!');
            console.log('Error:', credentialsResult.message);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('💡 Make sure the server is running on http://localhost:3001');
    }
}

testAdminLogin();