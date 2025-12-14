// Debug script to test broker listing functionality
const fs = require('fs');
const path = require('path');

console.log('🔍 DEBUGGING BROKER LISTING ISSUES...\n');

// Test 1: Check if broker users exist
console.log('1️⃣ Checking broker users...');
try {
  const checkUsersScript = path.join(__dirname, 'check-users.js');
  if (fs.existsSync(checkUsersScript)) {
    console.log('✅ check-users.js exists - running it...');
    require('./check-users.js');
  } else {
    console.log('❌ check-users.js not found');
  }
} catch (error) {
  console.log('❌ Error checking users:', error.message);
}

console.log('\n2️⃣ Checking database initialization...');
try {
  const Database = require('better-sqlite3');
  const dbPath = path.join(__dirname, 'data', 'broker.db');
  
  if (fs.existsSync(dbPath)) {
    console.log('✅ Database file exists at:', dbPath);
    
    const db = new Database(dbPath);
    
    // Check if users table exists and has broker users
    try {
      const users = db.prepare('SELECT username, role FROM users WHERE role = ?').all('broker');
      console.log('✅ Broker users found:', users.length);
      users.forEach(user => {
        console.log(`   - ${user.username} (${user.role})`);
      });
    } catch (error) {
      console.log('❌ Error querying users:', error.message);
    }
    
    // Check if properties table exists
    try {
      const tableInfo = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='properties'").get();
      if (tableInfo) {
        console.log('✅ Properties table exists');
        
        // Check existing properties
        const properties = db.prepare('SELECT id, title, status, owner_id FROM properties LIMIT 5').all();
        console.log('✅ Properties in database:', properties.length);
        properties.forEach(prop => {
          console.log(`   - ${prop.title} (${prop.status}) - Owner: ${prop.owner_id}`);
        });
      } else {
        console.log('❌ Properties table does not exist');
      }
    } catch (error) {
      console.log('❌ Error checking properties table:', error.message);
    }
    
    db.close();
  } else {
    console.log('❌ Database file does not exist at:', dbPath);
  }
} catch (error) {
  console.log('❌ Error accessing database:', error.message);
}

console.log('\n3️⃣ Checking API endpoints...');

// Check if broker add-listing page exists
const brokerAddListingPath = path.join(__dirname, 'app/broker/add-listing/page.tsx');
if (fs.existsSync(brokerAddListingPath)) {
  console.log('✅ Broker add-listing page exists');
} else {
  console.log('❌ Broker add-listing page missing');
}

// Check if properties API exists
const propertiesApiPath = path.join(__dirname, 'app/api/properties/route.ts');
if (fs.existsSync(propertiesApiPath)) {
  console.log('✅ Properties API exists');
} else {
  console.log('❌ Properties API missing');
}

// Check if broker properties API exists
const brokerPropertiesApiPath = path.join(__dirname, 'app/api/broker/properties/route.ts');
if (fs.existsSync(brokerPropertiesApiPath)) {
  console.log('✅ Broker properties API exists');
} else {
  console.log('❌ Broker properties API missing');
}

console.log('\n4️⃣ Checking types and constants...');
const typesPath = path.join(__dirname, 'app/types/index.ts');
if (fs.existsSync(typesPath)) {
  const typesContent = fs.readFileSync(typesPath, 'utf8');
  const hasEthiopianCities = typesContent.includes('ETHIOPIAN_CITIES');
  const hasPropertyTypes = typesContent.includes('PROPERTY_TYPES');
  
  console.log('✅ Types file exists');
  console.log(`✅ ETHIOPIAN_CITIES defined: ${hasEthiopianCities}`);
  console.log(`✅ PROPERTY_TYPES defined: ${hasPropertyTypes}`);
} else {
  console.log('❌ Types file missing');
}

console.log('\n🎯 COMMON ISSUES TO CHECK:');
console.log('================================');
console.log('1. Are you logged in as a broker user?');
console.log('   - Username: broker1, Password: broker123');
console.log('   - Username: broker2, Password: broker123');
console.log('');
console.log('2. Is the database properly initialized?');
console.log('   - Run: node scripts/init-database.js');
console.log('   - Run: node create-broker-users.js');
console.log('');
console.log('3. Are there any console errors in the browser?');
console.log('   - Check browser developer tools');
console.log('   - Check network tab for API failures');
console.log('');
console.log('4. Is the development server running?');
console.log('   - Run: npm run dev');
console.log('   - Check http://localhost:3000');

console.log('\n🚀 NEXT STEPS:');
console.log('1. Login as broker1/broker123');
console.log('2. Go to /broker page');
console.log('3. Click "Add New Property" button');
console.log('4. Fill out the form');
console.log('5. Check browser console for errors');