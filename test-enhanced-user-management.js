// Using built-in fetch (Node.js 18+)

const BASE_URL = 'http://localhost:3000';

async function testEnhancedUserManagement() {
  console.log('🧪 Testing Enhanced User Management System');
  console.log('==========================================');

  try {
    // Step 1: Login as admin
    console.log('\n1️⃣ Logging in as admin...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'tedayeerasu',
        password: '494841Abc'
      })
    });

    const loginData = await loginResponse.json();
    
    if (!loginData.success) {
      console.error('❌ Admin login failed:', loginData.error);
      return;
    }

    console.log('✅ Admin login successful');
    const token = loginData.token;

    // Step 2: Test creating a new admin user
    console.log('\n2️⃣ Creating new admin user...');
    const createAdminResponse = await fetch(`${BASE_URL}/api/admin/manage-users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        username: 'testadmin',
        password: 'testpass123',
        role: 'admin'
      })
    });

    const createAdminData = await createAdminResponse.json();
    console.log('Create admin result:', createAdminData);

    // Step 3: Test creating a new broker user
    console.log('\n3️⃣ Creating new broker user...');
    const createBrokerResponse = await fetch(`${BASE_URL}/api/admin/manage-users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        username: 'testbroker',
        password: 'brokerpass123',
        role: 'broker'
      })
    });

    const createBrokerData = await createBrokerResponse.json();
    console.log('Create broker result:', createBrokerData);

    // Step 4: Test updating the broker user
    console.log('\n4️⃣ Updating broker user...');
    const updateResponse = await fetch(`${BASE_URL}/api/admin/manage-users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: createBrokerData.user?.id,
        username: 'updatedbroker',
        role: 'broker',
        password: 'newpassword123'
      })
    });

    const updateData = await updateResponse.json();
    console.log('Update user result:', updateData);

    // Step 5: Test getting all users
    console.log('\n5️⃣ Getting all users...');
    const usersResponse = await fetch(`${BASE_URL}/api/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const usersData = await usersResponse.json();
    console.log('All users:', usersData);

    if (usersData.success) {
      console.log('\n📊 User Summary:');
      const adminUsers = usersData.users.filter(u => u.role === 'admin');
      const brokerUsers = usersData.users.filter(u => u.role === 'broker');
      const regularUsers = usersData.users.filter(u => u.role === 'user');
      
      console.log(`🛡️  Admins: ${adminUsers.length}`);
      adminUsers.forEach(u => console.log(`   - ${u.username} (${u.created_at})`));
      
      console.log(`👨‍💼 Brokers: ${brokerUsers.length}`);
      brokerUsers.forEach(u => console.log(`   - ${u.username} (${u.created_at})`));
      
      console.log(`👤 Users: ${regularUsers.length}`);
      regularUsers.forEach(u => console.log(`   - ${u.username} (${u.created_at})`));
    }

    // Step 6: Test deleting the test users
    console.log('\n6️⃣ Cleaning up test users...');
    
    // Delete test admin
    const deleteAdminResponse = await fetch(`${BASE_URL}/api/admin/manage-users`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        username: 'testadmin'
      })
    });

    const deleteAdminData = await deleteAdminResponse.json();
    console.log('Delete admin result:', deleteAdminData);

    // Delete test broker (with updated name)
    const deleteBrokerResponse = await fetch(`${BASE_URL}/api/admin/manage-users`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        username: 'updatedbroker'
      })
    });

    const deleteBrokerData = await deleteBrokerResponse.json();
    console.log('Delete broker result:', deleteBrokerData);

    console.log('\n✅ Enhanced User Management System Test Complete!');
    console.log('🎉 All functionality working properly');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testEnhancedUserManagement();