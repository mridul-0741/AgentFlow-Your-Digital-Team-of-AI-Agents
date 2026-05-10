# System Verification Checklist

After implementing the JWT authentication system, use this checklist to verify everything is working correctly.

---

## Pre-Launch Checklist

### ✅ Server Prerequisites
- [ ] MongoDB is installed and running (`mongod` command works)
- [ ] Node.js 18+ is installed (`node --version`)
- [ ] npm is available (`npm --version`)
- [ ] Port 5000 is available (not in use)

### ✅ Client Prerequisites
- [ ] Port 3000 is available (not in use)
- [ ] Next.js version 13+ (check package.json)
- [ ] React version 18+ (check package.json)

---

## Installation Verification

### ✅ Server Dependencies
```bash
cd server
npm list jsonwebtoken mongoose bcryptjs dotenv
```
Should show all packages installed

### ✅ Client Dependencies
```bash
cd client
npm list next react react-dom
```
Should show all packages installed

---

## Server Startup Verification

### Step 1: Start MongoDB
```bash
# Terminal 1
mongod
```
Expected output:
```
[initandlisten] Listening on 27017
```

### Step 2: Start Server
```bash
# Terminal 2
cd server
npm start
```
Expected output:
```
MongoDB connected successfully
Server is running on port 5000
```

### Step 3: Verify Server Health
```bash
# Terminal 3
curl http://localhost:5000/health
```
Expected response:
```json
{"status":"ok","service":"api-gateway"}
```

---

## Client Startup Verification

### Step 1: Start Client
```bash
# Terminal 4
cd client
npm run dev
```
Expected output:
```
Ready in Xs
Local: http://localhost:3000
```

### Step 2: Open Browser
Navigate to: `http://localhost:3000`

Expected behavior:
- Page redirects to `/auth/login`
- Login page displays with gradient background
- "Create Account" button is clickable

---

## API Endpoint Testing

### Test 1: User Registration

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "username": "testuser"
  }'
```

**Expected response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "test@example.com",
    "username": "testuser"
  }
}
```

### Test 2: User Login

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

**Expected response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "test@example.com",
    "username": "testuser"
  }
}
```

### Test 3: Get Current User (Protected)

**Using curl:** (replace TOKEN with actual token)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Expected response (200):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "test@example.com",
    "username": "testuser"
  }
}
```

### Test 4: Invalid Token (Protected Route)

**Using curl:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer invalid.token.here"
```

**Expected response (401):**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

---

## UI/UX Testing

### Test 1: Registration Flow
1. Click "Create Account" on login page
2. Fill in all fields:
   - Username: `testuser1`
   - Email: `test1@example.com`
   - Password: `testpass123`
   - Confirm: `testpass123`
3. Click "Create Account"
4. Should redirect to `/home`
5. Navbar should show user info

**Expected:**
- ✅ Form validation works
- ✅ Password confirmation matches
- ✅ User created in MongoDB
- ✅ Redirect to home works
- ✅ User info appears in navbar

### Test 2: Login Flow
1. Go to `/auth/login`
2. Enter credentials:
   - Email: `test1@example.com`
   - Password: `testpass123`
3. Click "Sign In"
4. Should redirect to `/home`

**Expected:**
- ✅ Login succeeds
- ✅ Redirect to home works
- ✅ Navbar shows user info

### Test 3: Logout Flow
1. Click user profile in navbar
2. Click "Sign Out"
3. Should redirect to `/auth/login`

**Expected:**
- ✅ User logged out
- ✅ Redirected to login page
- ✅ Accessing `/home` redirects to login

### Test 4: Protected Route Access
1. Log out (should be at `/auth/login`)
2. Try to access `/tasks` directly
3. Should redirect to `/auth/login`

**Expected:**
- ✅ Protected routes require auth
- ✅ Redirects to login when not authenticated

### Test 5: Error Handling
1. Try registering with duplicate email
2. Should show error message

**Expected:**
- ✅ Email already registered error shown
- ✅ User stays on registration page

---

## Database Verification

### Check MongoDB Collections
```bash
mongo agentflow
db.users.find()
```

Should show created users:
```json
[
  {
    "_id": ObjectId("..."),
    "email": "test1@example.com",
    "password": "$2a$10$...",  // bcrypt hash
    "username": "testuser1",
    "createdAt": ISODate("..."),
    "updatedAt": ISODate("...")
  }
]
```

---

## Security Verification

### Check 1: Password Hashing
Passwords in database should be bcrypt hashes (start with `$2a$` or `$2b$`)
```bash
mongo agentflow
db.users.findOne().password
# Should return something like: $2a$10$xxxxxxxxxxxxxxxxxxxxxx...
```

### Check 2: JWT Token Format
Access tokens should be valid JWT format: `xxxxx.yyyyy.zzzzz`
```bash
# Decode at jwt.io to verify
```

### Check 3: CORS Configuration
Server should accept requests from localhost:3000
```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS http://localhost:5000/api/auth/login -v
```

Should see `Access-Control-Allow-Origin: http://localhost:3000`

---

## Browser DevTools Verification

### Check 1: LocalStorage
In browser console:
```javascript
localStorage.getItem('token')    // Should return JWT
localStorage.getItem('user')     // Should return user JSON
```

### Check 2: Cookies
In browser DevTools → Application → Cookies:
- Should see `token` cookie with JWT value

### Check 3: Network Requests
1. Open DevTools → Network tab
2. Perform login
3. Check POST request to `/api/auth/login`
4. Response should include token

---

## Troubleshooting Tests

### If MongoDB connection fails:
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Try starting MongoDB
mongod

# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

### If API returns 500 error:
```bash
# Check server console for errors
# Verify .env file exists in server directory
ls -la server/.env

# Check .env values
cat server/.env
```

### If client won't connect to server:
```bash
# Check API URL in .env.local
cat client/.env.local

# Verify server is running on port 5000
lsof -i :5000

# Test connectivity
curl http://localhost:5000/health
```

### If login redirects unexpectedly:
```javascript
// In browser console:
localStorage.getItem('token')    // Check if token exists
localStorage.getItem('user')     // Check if user exists
// If empty, token may have expired or not been saved
```

---

## Performance Tests (Optional)

### Test 1: Registration Response Time
```bash
time curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"perf@test.com","password":"test","username":"perftest"}'
```
Should complete in < 500ms

### Test 2: Login Response Time
```bash
time curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"perf@test.com","password":"test"}'
```
Should complete in < 300ms

---

## Final Verification Checklist

- [ ] MongoDB is running and connected
- [ ] Server starts without errors
- [ ] Client starts without errors
- [ ] Can navigate to http://localhost:3000
- [ ] Redirected to /auth/login automatically
- [ ] Can register a new account
- [ ] Can login with created account
- [ ] User info shows in navbar
- [ ] Can logout
- [ ] Cannot access protected pages without login
- [ ] All API endpoints return correct responses
- [ ] Passwords are hashed in database
- [ ] JWT tokens are valid format
- [ ] CORS headers are correct
- [ ] LocalStorage stores token and user
- [ ] Cookies store token for middleware

---

## Sign-Off

Once all tests pass, the authentication system is ready for:
- [ ] Development
- [ ] Testing
- [ ] Staging
- [ ] Production

---

## Next Steps

If all tests pass:
1. ✅ System is working correctly
2. ✅ Ready for feature development
3. ✅ Consider implementing password reset
4. ✅ Add email verification (optional)
5. ✅ Set up monitoring/logging
6. ✅ Plan for production deployment

---

Document created: 2026-05-10
Last updated: 2026-05-10
