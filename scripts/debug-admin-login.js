const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')
const path = require('path')

console.log('🔍 DEBUGGING ADMIN LOGIN ISSUE...\n')

const dbPath = path.join(process.cwd(), 'data', 'broker.db')
console.log('🗄️ Database path:', dbPath)

try {
    const db = new Database(dbPath)
    console.log('✅ Database connection established')
    
    // Check if admins table exists
    console.log('\n📊 Checking admins table...')
    const tableInfo = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='admins'").get()
    
    if (!tableInfo) {
        console.log('❌ Admins table does not exist!')
        console.log('💡 Creating admins table...')
        
        db.exec(`
            CREATE TABLE IF NOT EXISTS admins (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                phone TEXT,
                whatsapp_number TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `)
        console.log('✅ Admins table created')
    } else {
        console.log('✅ Admins table exists')
    }
    
    // Check existing admins
    console.log('\n👤 Checking existing admins...')
    const admins = db.prepare('SELECT * FROM admins').all()
    
    if (admins.length === 0) {
        console.log('❌ No admin accounts found!')
        console.log('💡 Creating admin account...')
        
        const adminId = 'admin-' + Date.now()
        const adminEmail = 'tedayeerasu@gmail.com'
        const adminPassword = 'admin123'
        const hashedPassword = bcrypt.hashSync(adminPassword, 10)
        
        const createAdmin = db.prepare(`
            INSERT INTO admins (id, name, email, password_hash, phone, whatsapp_number)
            VALUES (?, ?, ?, ?, ?, ?)
        `)
        
        createAdmin.run(
            adminId,
            'Admin User',
            adminEmail,
            hashedPassword,
            '+251991856292',
            '+251991856292'
        )
        
        console.log('✅ Admin account created successfully!')
        console.log('📧 Email:', adminEmail)
        console.log('🔐 Password:', adminPassword)
        
    } else {
        console.log(`✅ Found ${admins.length} admin account(s):`)
        admins.forEach((admin, i) => {
            console.log(`   ${i + 1}. ${admin.name} (${admin.email})`)
            console.log(`      ID: ${admin.id}`)
            console.log(`      Phone: ${admin.phone}`)
            console.log(`      Created: ${admin.created_at}`)
            
            // Test password verification
            console.log('🔐 Testing password verification...')
            const testPasswords = ['admin123', 'MySecurePassword2024!', 'password', '123456']
            
            for (const testPassword of testPasswords) {
                const isValid = bcrypt.compareSync(testPassword, admin.password_hash)
                if (isValid) {
                    console.log(`   ✅ Password "${testPassword}" is CORRECT`)
                } else {
                    console.log(`   ❌ Password "${testPassword}" is incorrect`)
                }
            }
        })
    }
    
    // Check admin_otp_codes table
    console.log('\n📊 Checking admin_otp_codes table...')
    const otpTableInfo = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='admin_otp_codes'").get()
    
    if (!otpTableInfo) {
        console.log('❌ admin_otp_codes table does not exist!')
        console.log('💡 Creating admin_otp_codes table...')
        
        db.exec(`
            CREATE TABLE IF NOT EXISTS admin_otp_codes (
                id TEXT PRIMARY KEY,
                admin_id TEXT NOT NULL,
                email TEXT NOT NULL,
                otp_code TEXT NOT NULL,
                expires_at DATETIME NOT NULL,
                verified BOOLEAN DEFAULT FALSE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (admin_id) REFERENCES admins (id)
            )
        `)
        console.log('✅ admin_otp_codes table created')
    } else {
        console.log('✅ admin_otp_codes table exists')
    }
    
    db.close()
    
    console.log('\n🧪 TESTING INSTRUCTIONS:')
    console.log('========================')
    console.log('1. Go to: http://localhost:3000/admin/login')
    console.log('2. Use these credentials:')
    console.log('   📧 Email: tedayeerasu@gmail.com')
    console.log('   🔐 Password: admin123')
    console.log('3. Check server console for OTP code')
    console.log('4. Enter the OTP to complete login')
    console.log('')
    console.log('💡 If login still fails, check:')
    console.log('   - Server console for detailed error logs')
    console.log('   - Browser console (F12) for frontend errors')
    console.log('   - Make sure server is running (npm run dev)')
    
} catch (error) {
    console.error('❌ Database debug error:', error)
    console.error('Error details:', error.message)
}