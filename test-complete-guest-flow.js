const http = require('http');

async function testCompleteGuestFlow() {
  console.log('🎯 Testing Complete Guest Submission Flow');
  console.log('Server running on: http://localhost:3002\n');
  
  // Step 1: Test guest submission
  console.log('1️⃣ Testing Guest Property Submission...');
  const submissionResult = await testGuestSubmission();
  
  if (!submissionResult.success) {
    console.log('❌ Guest submission failed, stopping test');
    return;
  }
  
  // Step 2: Test admin login
  console.log('\n2️⃣ Testing Admin Login...');
  const adminToken = await testAdminLogin();
  
  if (!adminToken) {
    console.log('❌ Admin login failed, stopping test');
    return;
  }
  
  // Step 3: Test admin viewing guest submissions
  console.log('\n3️⃣ Testing Admin Guest Submissions View...');
  await testAdminGuestSubmissions(adminToken);
  
  // Step 4: Test approval flow
  console.log('\n4️⃣ Testing Approval Flow...');
  await testApprovalFlow(adminToken, submissionResult.submissionId, submissionResult.propertyId);
  
  console.log('\n🎉 Complete Guest Submission Flow Test Complete!');
  console.log('\n📋 Manual Testing URLs:');
  console.log('🏠 Guest Submit: http://localhost:3002/submit-property');
  console.log('🔐 Admin Login: http://localhost:3002/login');
  console.log('👨‍💼 Admin Dashboard: http://localhost:3002/admin-working');
  console.log('🏡 Home Page: http://localhost:3002');
}

function testGuestSubmission() {
  return new Promise((resolve) => {
    const guestData = JSON.stringify({
      guestName: 'Test Guest User',
      guestPhone: '+251911111111',
      guestWhatsapp: '+251911111111',
      title: 'Test Guest Property - Beautiful Villa',
      description: 'This is a test property submitted by a guest user. It features modern amenities, spacious rooms, and a beautiful garden. Located in a prime area with excellent access to transportation and amenities.',
      price: '95000',
      currency: 'ETB',
      city: 'Addis Ababa',
      area: 'Bole Medhanialem',
      type: 'house_sale',
      bedrooms: '4',
      bathrooms: '3',
      size: '200',
      features: ['Parking', 'Garden', 'Modern Kitchen', 'Security']
    });

    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/api/guest-submissions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(guestData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.success) {
            console.log('✅ Guest submission successful!');
            console.log(`   Submission ID: ${result.submissionId}`);
            console.log(`   Property ID: ${result.propertyId}`);
            console.log(`   Status: ${result.status}`);
            resolve({ success: true, submissionId: result.submissionId, propertyId: result.propertyId });
          } else {
            console.log('❌ Guest submission failed:', result.error);
            resolve({ success: false });
          }
        } catch (error) {
          console.log('❌ Guest submission parse error:', error.message);
          resolve({ success: false });
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Guest submission request error:', error.message);
      resolve({ success: false });
    });

    req.write(guestData);
    req.end();
  });
}

function testAdminLogin() {
  return new Promise((resolve) => {
    const loginData = JSON.stringify({
      username: 'admin',
      password: 'admin123'
    });

    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.success) {
            console.log('✅ Admin login successful!');
            console.log(`   User: ${result.user.username} (${result.user.role})`);
            resolve(result.token);
          } else {
            console.log('❌ Admin login failed:', result.error);
            resolve(null);
          }
        } catch (error) {
          console.log('❌ Admin login parse error:', error.message);
          resolve(null);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Admin login request error:', error.message);
      resolve(null);
    });

    req.write(loginData);
    req.end();
  });
}

function testAdminGuestSubmissions(token) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/api/admin/guest-submissions',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.success) {
            console.log('✅ Admin can view guest submissions!');
            console.log(`   Total submissions: ${result.stats.total}`);
            console.log(`   Pending: ${result.stats.pending}`);
            console.log(`   Approved: ${result.stats.approved}`);
            console.log(`   Rejected: ${result.stats.rejected}`);
            
            if (result.submissions.length > 0) {
              const latest = result.submissions[0];
              console.log(`   Latest submission: "${latest.title}" by ${latest.guest_name}`);
            }
          } else {
            console.log('❌ Admin guest submissions failed:', result.error);
          }
        } catch (error) {
          console.log('❌ Admin guest submissions parse error:', error.message);
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log('❌ Admin guest submissions request error:', error.message);
      resolve();
    });

    req.end();
  });
}

function testApprovalFlow(token, submissionId, propertyId) {
  return new Promise((resolve) => {
    console.log(`   Attempting to approve submission: ${submissionId}`);
    
    const approvalData = JSON.stringify({
      submissionId: submissionId,
      propertyId: propertyId,
      action: 'approve',
      adminNotes: 'Approved during automated testing'
    });

    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/api/admin/guest-submissions',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': Buffer.byteLength(approvalData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.success) {
            console.log('✅ Guest submission approved successfully!');
            console.log('   Property should now be visible on home page');
            
            // Test if property is now visible on home page
            setTimeout(() => {
              testPropertyVisibility(propertyId);
            }, 1000);
          } else {
            console.log('❌ Approval failed:', result.error);
          }
        } catch (error) {
          console.log('❌ Approval parse error:', error.message);
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log('❌ Approval request error:', error.message);
      resolve();
    });

    req.write(approvalData);
    req.end();
  });
}

function testPropertyVisibility(propertyId) {
  console.log('\n5️⃣ Testing Property Visibility on Home Page...');
  
  const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/api/properties-public',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        if (result.success) {
          const approvedProperty = result.properties.find(p => p.id === propertyId);
          if (approvedProperty) {
            console.log('✅ Approved guest property is now visible on home page!');
            console.log(`   Property: "${approvedProperty.title}"`);
            console.log(`   Status: ${approvedProperty.status}`);
          } else {
            console.log('⏳ Property not yet visible (may need a moment to update)');
          }
        }
      } catch (error) {
        console.log('❌ Property visibility check error:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Property visibility request error:', error.message);
  });

  req.end();
}

testCompleteGuestFlow().catch(console.error);