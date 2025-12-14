// Test database import and operations
console.log('🧪 TESTING DATABASE IMPORT...\n');

try {
  console.log('1️⃣ Importing database operations...');
  const { propertyOperations, imageOperations, paymentOperations } = require('./lib/database');
  console.log('✅ Database operations imported successfully');
  
  console.log('2️⃣ Testing property operations...');
  console.log('   propertyOperations.create:', typeof propertyOperations.create);
  console.log('   propertyOperations.getAll:', typeof propertyOperations.getAll);
  
  console.log('3️⃣ Testing image operations...');
  console.log('   imageOperations.add:', typeof imageOperations.add);
  console.log('   imageOperations.getByProperty:', typeof imageOperations.getByProperty);
  
  console.log('4️⃣ Testing payment operations...');
  console.log('   paymentOperations.create:', typeof paymentOperations.create);
  
  console.log('5️⃣ Testing actual database query...');
  const users = propertyOperations.getAll.all();
  console.log('✅ Database query successful, found', users.length, 'properties');
  
} catch (error) {
  console.error('❌ Database import/operation failed:', error.message);
  console.error('❌ Error stack:', error.stack);
}

console.log('\n6️⃣ Testing payment import...');
try {
  const { createPaymentRecord } = require('./lib/payment');
  console.log('✅ Payment operations imported successfully');
  console.log('   createPaymentRecord:', typeof createPaymentRecord);
} catch (error) {
  console.error('❌ Payment import failed:', error.message);
}

console.log('\n7️⃣ Testing auth import...');
try {
  const { getUserFromToken } = require('./lib/auth');
  console.log('✅ Auth operations imported successfully');
  console.log('   getUserFromToken:', typeof getUserFromToken);
} catch (error) {
  console.error('❌ Auth import failed:', error.message);
}