const Database = require('better-sqlite3')
const { join } = require('path')

const dbPath = join(process.cwd(), 'data', 'broker.db')
const db = new Database(dbPath)

console.log('🧪 Testing Payment System...')

try {
  // Test data
  const testProperty = {
    id: 'test-prop-' + Date.now(),
    title: 'Test Property for Payment',
    description: 'Test description',
    price: 500000,
    currency: 'ETB',
    city: 'Addis Ababa',
    area: 'Bole',
    type: 'house_rent',
    bedrooms: 3,
    bathrooms: 2,
    size: 150,
    features: JSON.stringify(['Parking', 'Garden']),
    owner_id: 'test-user-123',
    whatsapp_number: '0911123456',
    phone_number: '0911123456',
    status: 'pending_payment',
    is_premium: 0,
    payment_amount: 25,
    payment_method: 'cbe',
    payment_status: 'pending_confirmation'
  }

  // Test property insertion
  console.log('📋 Testing property insertion...')
  
  const insertProperty = db.prepare(`
    INSERT INTO properties (
      id, title, description, price, currency, city, area, type, 
      bedrooms, bathrooms, size, features, owner_id, whatsapp_number, 
      phone_number, status, is_premium, payment_amount, payment_method, payment_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  
  insertProperty.run(
    testProperty.id,
    testProperty.title,
    testProperty.description,
    testProperty.price,
    testProperty.currency,
    testProperty.city,
    testProperty.area,
    testProperty.type,
    testProperty.bedrooms,
    testProperty.bathrooms,
    testProperty.size,
    testProperty.features,
    testProperty.owner_id,
    testProperty.whatsapp_number,
    testProperty.phone_number,
    testProperty.status,
    testProperty.is_premium,
    testProperty.payment_amount,
    testProperty.payment_method,
    testProperty.payment_status
  )
  
  console.log('✅ Property inserted successfully')

  // Test payment insertion
  console.log('💳 Testing payment insertion...')
  
  const testPayment = {
    id: 'test-pay-' + Date.now(),
    property_id: testProperty.id,
    user_id: testProperty.owner_id,
    amount: 25,
    payment_type: 'basic_listing',
    payment_method: 'cbe',
    status: 'pending_confirmation'
  }

  const insertPayment = db.prepare(`
    INSERT INTO payments (id, property_id, user_id, amount, payment_type, payment_method, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  
  insertPayment.run(
    testPayment.id,
    testPayment.property_id,
    testPayment.user_id,
    testPayment.amount,
    testPayment.payment_type,
    testPayment.payment_method,
    testPayment.status
  )
  
  console.log('✅ Payment inserted successfully')

  // Verify data
  const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(testProperty.id)
  const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(testPayment.id)
  
  console.log('\n📊 Test Results:')
  console.log('Property:', {
    id: property.id,
    title: property.title,
    price: property.price,
    type: property.type,
    payment_amount: property.payment_amount,
    payment_method: property.payment_method,
    is_premium: property.is_premium
  })
  
  console.log('Payment:', {
    id: payment.id,
    amount: payment.amount,
    payment_type: payment.payment_type,
    payment_method: payment.payment_method,
    status: payment.status
  })

  console.log('\n🎉 Payment system test PASSED!')

} catch (error) {
  console.error('❌ Payment system test FAILED:', error)
} finally {
  db.close()
}