const http = require('http');

async function testAdminApproval() {
  console.log('🧪 Testing Admin Guest Submission Approval - Debug Mode');
  
  // Step 1: Login as admin
  console.log('\n1️⃣ Logging in as admin...');
  const adminToken = await loginAsAdmin();
  
  if (!adminToken) {
    console.log('❌ Admin login failed, stopping test');
    return;
  }
  
  // Step 2: Get guest submissions
  console.log('\n2️⃣ Getting guest submissions...');
  const submissions = await getGuestSubmissions(adminToken);
  
  if (!submissions || submissions.length === 0) {
    console.log('❌ No guest submissions found');
    console.log('💡 Create a guest submission first at: http://localhost:3002/submit-property');
    return;
  }
  
  // Step 3: Test approval
  console.log('\n3️⃣ Testing approval...');
  const firstSubmission = submissions[0];
  console.log('Attempting to approve:', firstSubmission.title);
  console.log('Submission ID:', firstSubmission.id);
  console.log('Property ID:', firstSubmission.property_id);
  
  await testApproval(adminToken, firstSubmission.id, firstSubmission.property_id);
}

function loginAsAdmin() {
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
            console.log('✅ Admin login successful');
            console.log('User:', result.user.username, 'Role:', result.user.role);
            resolve(result.token);
          } else {
            console.log('❌ Admin login failed:', result.error);
            resolve(null);
          }
        } catch (error) {
          console.error('❌ Admin login parse error:', error.message);
          console.log('Raw response:', data);
          resolve(null);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Admin login request error:', error.message);
      resolve(null);
    });

    req.write(loginData);
    req.end();
  });
}

function getGuestSubmissions(token) {
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
        console.log('Guest submissions response status:', res.statusCode);
        
        try {
          const result = JSON.parse(data);
          if (result.success) {
            console.log('✅ Guest submissions retrieved');
            console.log('Total submissions:', result.stats.total);
            console.log('Pending:', result.stats.pending);
            
            if (result.submissions.length > 0) {
              console.log('Latest submission:', result.submissions[0].title);
            }
            
            resolve(result.submissions);
          } else {
            console.log('❌ Guest submissions failed:', result.error);
            resolve(null);
          }
        } catch (error) {
          console.error('❌ Guest submissions parse error:', error.message);
          console.log('Raw response:', data);
          resolve(null);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Guest submissions request error:', error.message);
      resolve(null);
    });

    req.end();
  });
}

function testApproval(token, submissionId, propertyId) {
  return new Promise((resolve) => {
    const approvalData = JSON.stringify({
      submissionId: submissionId,
      propertyId: propertyId,
      action: 'approve',
      adminNotes: 'Approved during debugging test'
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
        console.log('Approval response status:', res.statusCode);
        console.log('Approval response headers:', res.headers);
        
        try {
          const result = JSON.parse(data);
          if (result.success) {
            console.log('✅ Guest submission approved successfully!');
            console.log('Message:', result.message);
            console.log('\n🎉 ADMIN APPROVAL IS WORKING!');
            console.log('\n📋 Next steps:');
            console.log('1. Login as admin at: http://localhost:3002/login');
            console.log('2. Go to admin dashboard: http://localhost:3002/admin-working');
            console.log('3. Click "Guest Submissions" tab');
            console.log('4. Click "Approve" or "Reject" buttons');
          } else {
            console.log('❌ Guest submission approval failed:', result.error);
            console.log('Full response:', result);
          }
        } catch (error) {
          console.error('❌ Approval parse error:', error.message);
          console.log('Raw response:', data);
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.error('❌ Approval request error:', error.message);
      resolve();
    });

    req.write(approvalData);
    req.end();
  });
}

testAdminApproval();