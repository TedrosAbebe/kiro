// Simple test for admin approval using the clean database directly
const Database = require('better-sqlite3');
const path = require('path');

console.log('🧪 TESTING ADMIN APPROVAL DIRECTLY...\n');

const dbPath = path.join(__dirname, 'data', 'broker-clean.db');
const db = new Database(dbPath);

try {
  // 1. Check current properties
  console.log('1️⃣ Current properties:');
  const properties = db.prepare(`
    SELECT id, title, status, owner_id, created_at
    FROM properties 
    ORDER BY created_at DESC
  `).all();
  
  properties.forEach(prop => {
    console.log(`   ${prop.id}: ${prop.title} - ${prop.status}`);
  });
  
  // 2. Find a pending property to approve
  const pendingProperty = properties.find(p => p.status === 'pending_payment' || p.status === 'pending');
  
  if (pendingProperty) {
    console.log('\n2️⃣ Approving property:', pendingProperty.id);
    
    // Try to update the status
    const updateResult = db.prepare(`
      UPDATE properties 
      SET status = ?
      WHERE id = ?
    `).run('approved', pendingProperty.id);
    
    console.log('Update result:', updateResult);
    
    if (updateResult.changes > 0) {
      console.log('✅ Property approved successfully!');
      
      // Verify the update
      const updatedProperty = db.prepare(`
        SELECT id, title, status 
        FROM properties 
        WHERE id = ?
      `).get(pendingProperty.id);
      
      console.log('Updated property:', updatedProperty);
    } else {
      console.log('❌ No rows were updated');
    }
  } else {
    console.log('\n2️⃣ No pending properties found to approve');
    
    // Let's create a test property to approve
    console.log('\n3️⃣ Creating a test property...');
    const testPropertyId = 'test-approval-' + Date.now();
    
    db.prepare(`
      INSERT INTO properties (
        id, title, price, city, area, type, size, 
        owner_id, whatsapp_number, phone_number, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      testPropertyId,
      'Test Property for Approval',
      150000,
      'Addis Ababa',
      'Bole',
      'apartment',
      120,
      'admin', // owner_id
      '+251911234567',
      '+251911234567',
      'pending_payment',
      new Date().toISOString()
    );
    
    console.log('✅ Test property created:', testPropertyId);
    
    // Now approve it
    console.log('\n4️⃣ Approving test property...');
    const approveResult = db.prepare(`
      UPDATE properties 
      SET status = ?
      WHERE id = ?
    `).run('approved', testPropertyId);
    
    console.log('Approval result:', approveResult);
    
    if (approveResult.changes > 0) {
      console.log('✅ Test property approved successfully!');
    }
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  db.close();
}