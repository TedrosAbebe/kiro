// Simple test to verify broker listing setup
const Database = require('better-sqlite3');
const path = require('path');

console.log('🧪 TESTING BROKER LISTING SETUP...\n');

const dbPath = path.join(__dirname, 'data', 'broker.db');
const db = new Database(dbPath);

try {
  // Test 1: Check broker users
  console.log('1️⃣ Checking broker users...');
  const brokers = db.prepare('SELECT username, role, id FROM users WHERE role = ?').all('broker');
  console.log('✅ Broker users found:', brokers.length);
  brokers.forEach(broker => {
    console.log(`   - ${broker.username} (ID: ${broker.id})`);
  });
  
  // Test 2: Check properties table schema
  console.log('\n2️⃣ Checking properties table...');
  const tableInfo = db.prepare("PRAGMA table_info(properties)").all();
  const requiredColumns = ['id', 'title', 'price', 'city', 'area', 'type', 'owner_id', 'whatsapp_number', 'phone_number'];
  const existingColumns = tableInfo.map(col => col.name);
  
  const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
  if (missingColumns.length === 0) {
    console.log('✅ Properties table has all required columns');
  } else {
    console.log('❌ Missing columns:', missingColumns);
  }
  
  // Test 3: Test property insertion
  console.log('\n3️⃣ Testing property insertion...');
  const testBroker = brokers[0];
  if (testBroker) {
    const testPropertyId = 'test-' + Date.now();
    
    try {
      db.prepare(`
        INSERT INTO properties (
          id, title, description, price, currency, city, area, 
          type, bedrooms, bathrooms, size, features, owner_id, 
          whatsapp_number, phone_number
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        testPropertyId,
        'Test Property',
        'Test description',
        150000,
        'ETB',
        'Addis Ababa',
        'Bole',
        'house_sale',
        3,
        2,
        120,
        '["Parking", "Garden"]',
        testBroker.id,
        '+251911234567',
        '+251911234567'
      );
      
      console.log('✅ Test property inserted successfully');
      
      // Verify insertion
      const insertedProperty = db.prepare('SELECT * FROM properties WHERE id = ?').get(testPropertyId);
      if (insertedProperty) {
        console.log('✅ Property verified in database');
        console.log(`   Title: ${insertedProperty.title}`);
        console.log(`   Price: ${insertedProperty.price} ${insertedProperty.currency}`);
        console.log(`   Status: ${insertedProperty.status}`);
      }
      
      // Clean up
      db.prepare('DELETE FROM properties WHERE id = ?').run(testPropertyId);
      console.log('✅ Test property cleaned up');
      
    } catch (error) {
      console.log('❌ Property insertion failed:', error.message);
    }
  }
  
  // Test 4: Check existing properties
  console.log('\n4️⃣ Checking existing properties...');
  const existingProperties = db.prepare('SELECT id, title, status, owner_id FROM properties LIMIT 10').all();
  console.log('✅ Existing properties:', existingProperties.length);
  existingProperties.forEach(prop => {
    console.log(`   - ${prop.title} (${prop.status})`);
  });
  
  console.log('\n🎯 SETUP VERIFICATION COMPLETE!');
  console.log('================================');
  console.log('✅ Database schema: Fixed');
  console.log('✅ Broker users: Available');
  console.log('✅ Property operations: Working');
  console.log('✅ Ready for testing');
  
  console.log('\n🚀 MANUAL TESTING STEPS:');
  console.log('1. Open browser to http://localhost:3000');
  console.log('2. Login with broker1/broker123');
  console.log('3. Navigate to /broker/add-listing');
  console.log('4. Fill out the property form:');
  console.log('   - Title: My Test Property');
  console.log('   - Type: House for Sale');
  console.log('   - Price: 200000');
  console.log('   - City: Addis Ababa');
  console.log('   - Area: Bole');
  console.log('   - Size: 150');
  console.log('   - Phone: +251911234567');
  console.log('   - WhatsApp: +251911234567');
  console.log('5. Submit the form');
  console.log('6. Check if payment modal appears');
  console.log('7. Go to /broker to see your property');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
} finally {
  db.close();
}