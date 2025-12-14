# 🔍 Authentication Debugging Guide

## Step 1: Check if you have registered users

**The most common issue is trying to login without registering first.**

### Quick Test:
1. Open: `http://localhost:3000/register`
2. Fill the form:
   - Name: `Test User`
   - Phone: `+251911111111` 
   - Password: `123456`
   - Role: `broker`
3. Click "Create Account"
4. Check if registration succeeds

### If registration fails:
- Check browser console (F12) for errors
- Check server console for detailed logs

## Step 2: Test Login with registered user

1. Open: `http://localhost:3000/login`
2. Use the EXACT same phone number you registered with
3. Use the EXACT same password

### Phone Format Tips:
- Use: `+251911111111` (with +251 prefix)
- Or: `0911111111` (will be auto-converted)
- Or: `251911111111` (will be auto-converted)

## Step 3: Check Console Logs

### Browser Console (F12):
- Look for registration/login logs with emojis
- Check for any JavaScript errors

### Server Console:
- Look for detailed authentication logs:
  - 📝 Registration logs
  - 🔐 Login logs  
  - ❌ Error logs
  - 👤 User found/not found logs

## Step 4: Use Debug Tool

1. Open the debug tool: `debug-auth.html` in your browser
2. Test registration first
3. Then test login with the same credentials

## Step 5: Common Issues & Solutions

### "User not found"
- **Cause**: Phone number format mismatch
- **Solution**: Use exact format from registration

### "Invalid password"
- **Cause**: Wrong password or password not hashed properly
- **Solution**: Use exact password from registration

### "Login failed. Please try again."
- **Cause**: Generic error, check server console for details
- **Solution**: Look at server logs for specific error

### Database not initialized
- **Cause**: Database tables not created
- **Solution**: Restart the server (npm run dev)

## Step 6: Manual Test Sequence

```bash
# 1. Start server
npm run dev

# 2. Register a test user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","phone":"+251911111111","password":"123456","role":"broker"}'

# 3. Login with the same user
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"+251911111111","password":"123456"}'
```

## Step 7: Check Database File

The database should be created at: `data/broker.db`

If this file doesn't exist, the database isn't being initialized properly.

## Next Steps

1. **Try registration first** - This is the most likely issue
2. **Check console logs** - Both browser and server
3. **Use exact phone format** - Phone number mismatches are common
4. **Use debug tool** - The HTML file will help isolate the issue

Let me know what you see in the console logs and I can help you fix the specific issue!