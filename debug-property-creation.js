// Debug property creation issue
const Database = require('better-sqlite3');
const path = require('path');

console.log('🔍 DEBUGGING PROPERTY CREATION ISSUE...\n');

const dbPath = path.join(__dirname, 'data', 'broker.db');
const db = new Database(dbPath);

try {
  console.log('1️⃣ Checking database structure...');
  
  // Check if properties table exists and has correct structure
  const tableInfo = db.prepare("PRAGMA table_info(properties)").all();
  console.log('Properties table columns:');
  tableInfo.forEach(col => {
    console.log(`   ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
  });
  
  console.log('\n2️⃣ Testing property insertion with exact API parameters...');
  
  // Get a broker user for testing
  const brokerUser = db.prepare('SELECT * FROM users WHERE role = ? LIMIT 1').get('broker');
  if (!brokerUser) {
    console.log('❌ No broker user found');
    return;
  }
  
  console.log('✅ Using broker user:', brokerUser.username, '(ID:', brokerUser.id + ')');
  
  // Test the exact same parameters as the API
  const testPropertyId = 'property-' + Date.now() + '-test';
  const testData = {
    id: testPropertyId,
    title: 'Test Property',
    description: 'Test description',
    price: 200000,
    currency: 'ETB',
    city: 'Addis Ababa',
    area: 'Bole',
    latitude: null,
    longitude: null,
    type: 'house_sale',
    bedrooms: 3,
    bathrooms: 2,
    size: 150,
    features: '[]',
    owner_id: brokerUser.id,
    whatsapp_number: '+251991856292',
    phone_number: '+251991856292'
  };
  
  console.log('Test data:', testData);
  
  try {
    // Try the exact same INSERT as the API
    const insertResult = db.prepare(`
      INSERT INTO properties (
        id, title, description, price, currency, city, area, latitude, longitude,
        type, bedrooms, bathrooms, size, features, owner_id, whatsapp_number, phone_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      testData.id,
      testData.title,
      testData.description,
      testData.price,
      testData.currency,
      testData.city,
      testData.area,
      testData.latitude,
      testData.longitude,
      testData.type,
      testData.bedrooms,
      testData.bathrooms,
      testData.size,
      testData.features,
      testData.owner_id,
      testData.whatsapp_number,
      testData.phone_number
    );
    
    console.log('✅ Property insertion successful!');
    console.log('   Changes:', insertResult.changes);
    console.log('   Last insert rowid:', insertResult.lastInsertRowid);
    
    // Verify the property was inserted
    const insertedProperty = db.prepare('SELECT * FROM properties WHERE id = ?').get(testData.id);
    if (insertedProperty) {
      console.log('✅ Property verified in database');
      console.log('   Title:', insertedProperty.title);
      console.log('   Price:', insertedProperty.price, insertedProperty.currency);
      console.log('   Status:', insertedProperty.status);
      console.log('   Owner ID:', insertedProperty.owner_id);
    }
    
    // Clean up
    db.prepare('DELETE FROM properties WHERE id = ?').run(testData.id);
    console.log('✅ Test property cleaned up');
    
  } catch (insertError) {
    console.log('❌ Property insertion failed:', insertError.message);
    console.log('   Error code:', insertError.code);
    console.log('   Error details:', insertError);
  }
  
  console.log('\n3️⃣ Checking foreign key constraints...');
  
  // Check if the user ID exists
  const userExists = db.prepare('SELECT id FROM users WHERE id = ?').get(brokerUser.id);
  if (userExists) {
    console.log('✅ User ID exists in users table');
  } else {
    console.log('❌ User ID does not exist in users table');
  }
  
  console.log('\n4️⃣ Testing with minimal data...');
  
  const minimalPropertyId = 'minimal-' + Date.now();
  try {
    db.prepare(`
      INSERT INTO properties (id, title, price, city, area, type, size, owner_id, whatsapp_number, phone_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      minimalPropertyId,
      'Minimal Test',
      100000,
      'Addis Ababa',
      'Test Area',
      'house_sale',
      100,
      brokerUser.id,
      '+251911111111',
      '+251911111111'
    );
    
    console.log('✅ Minimal property insertion successful');
    
    // Clean up
    db.prepare('DELETE FROM properties WHERE id = ?').run(minimalPropertyId);
    console.log('✅ Minimal test property cleaned up');
    
  } catch (minimalError) {
    console.log('❌ Minimal property insertion failed:', minimalError.message);
  }
  
} catch (error) {
  console.error('❌ Debug failed:', error.message);
} finally {
  db.close();
}