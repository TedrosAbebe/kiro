// Minimal database test
const Database = require('better-sqlite3');
const path = require('path');

console.log('🧪 MINIMAL DATABASE TEST...\n');

try {
  console.log('1️⃣ Creating database connection...');
  const dbPath = path.join(__dirname, 'data', 'broker.db');
  console.log('   Database path:', dbPath);
  
  const db = new Database(dbPath);
  console.log('✅ Database connection successful');
  
  console.log('2️⃣ Testing simple query...');
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('✅ Found tables:', tables.map(t => t.name));
  
  console.log('3️⃣ Testing users table...');
  const users = db.prepare('SELECT username, role FROM users LIMIT 5').all();
  console.log('✅ Found users:', users);
  
  console.log('4️⃣ Testing properties table...');
  const properties = db.prepare('SELECT id, title FROM properties LIMIT 5').all();
  console.log('✅ Found properties:', properties.length);
  
  console.log('5️⃣ Testing prepared statement creation...');
  const testStmt = db.prepare('SELECT COUNT(*) as count FROM users');
  const result = testStmt.get();
  console.log('✅ Prepared statement works, user count:', result.count);
  
  db.close();
  console.log('✅ Database test completed successfully');
  
} catch (error) {
  console.error('❌ Database test failed:', error.message);
  console.error('❌ Error code:', error.code);
  console.error('❌ Error stack:', error.stack);
}