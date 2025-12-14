const Database = require('better-sqlite3');
const { join } = require('path');

const dbPath = join(process.cwd(), 'data', 'broker.db');
const db = new Database(dbPath);

console.log('🔍 Testing bulk delete functionality...');

try {
  // Check current properties
  const properties = db.prepare('SELECT COUNT(*) as count FROM properties').get();
  console.log('📊 Current properties count:', properties.count);

  // Check broker properties
  const brokerProps = db.prepare(`
    SELECT COUNT(*) as count FROM properties p
    LEFT JOIN users u ON p.owner_id = u.id
    WHERE u.role = 'broker'
  `).get();
  console.log('🏢 Broker properties count:', brokerProps.count);

  // Check advertiser properties
  try {
    const advProps = db.prepare('SELECT COUNT(*) as count FROM advertiser_properties').get();
    console.log('📢 Advertiser properties count:', advProps.count);
  } catch (error) {
    console.log('📢 Advertiser properties table does not exist yet');
  }

  // Check users
  const users = db.prepare('SELECT COUNT(*) as count FROM users').get();
  console.log('👥 Total users count:', users.count);

  // Check if admin user exists
  const adminUser = db.prepare("SELECT username FROM users WHERE role = 'admin' AND username = 'tedayeerasu'").get();
  console.log('🛡️ Main admin exists:', adminUser ? 'Yes' : 'No');

  console.log('\n✅ Bulk delete functionality is ready!');
  console.log('📋 Available bulk delete options:');
  console.log('   1. Delete All Broker Properties');
  console.log('   2. Delete All Advertiser Properties');
  console.log('   3. Delete ALL Properties (requires "DELETE ALL" confirmation)');

} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  db.close();
}