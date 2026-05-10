# 🔐 AgentFlow - JWT Authentication System

Welcome to your new secure AgentFlow application with JWT-based authentication!

## ⚡ Quick Start (3 Minutes)

### Prerequisites
- MongoDB running locally or a connection string
- Node.js 18+

### Start the Application

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Server
cd server && npm start

# Terminal 3: Start Client
cd client && npm run dev
```

Then open `http://localhost:3000` and create an account!

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [QUICK_START.md](./QUICK_START.md) | 3-step setup guide |
| [AUTH_SETUP_GUIDE.md](./AUTH_SETUP_GUIDE.md) | Detailed implementation guide |
| [CHANGES.md](./CHANGES.md) | Complete list of all changes made |
| [VERIFICATION_CHECKLIST.md](./VERIFICATION_CHECKLIST.md) | Test and verify the system |

---

## 🎯 What's New

### Features Added
✅ User registration with email/password  
✅ JWT-based authentication  
✅ MongoDB user database  
✅ Secure password hashing (bcryptjs)  
✅ Protected routes (automatic redirects)  
✅ Beautiful login/register UI  
✅ User profile in navbar  
✅ Session management  

### Files Added
- **Server:** 4 new files (config, models, middleware, routes)
- **Client:** 6 new files (auth UI, context, services, middleware)
- **Documentation:** 4 comprehensive guides

---

## 🔑 Authentication Flow

### Registration
```
User → /auth/register → Fill Form → Submit
    ↓
Email Validated → Password Hashed → User Created in MongoDB
    ↓
JWT Token Generated → Stored in localStorage + cookies
    ↓
Redirect to /home
```

### Login
```
User → /auth/login → Enter Credentials → Submit
    ↓
Email & Password Verified → JWT Token Generated
    ↓
Token Stored → Redirect to /home
```

### Access Control
```
Visit Protected Page → Check Authentication
    ↓
Authenticated? → Show Page
    ↓
Not Authenticated? → Redirect to /auth/login
```

---

## 🛡️ Security Highlights

1. **Password Security**
   - Bcrypt hashing with 10 salt rounds
   - Passwords never stored in plain text
   - Password comparison on login

2. **JWT Tokens**
   - 30-day expiration (configurable)
   - Secret key signing
   - Token verification on protected routes

3. **Route Protection**
   - Client-side route guards
   - Server-side middleware validation
   - Next.js middleware enforcement

4. **Data Protection**
   - CORS validation
   - Authorization header support
   - Secure cookie configuration

---

## 🚀 Deployment

### Before Deploying to Production

1. **Security**
   ```bash
   # Change JWT_SECRET to a strong random value
   # Update MONGODB_URI to production database
   # Enable HTTPS
   ```

2. **Environment**
   ```bash
   # Set NODE_ENV=production
   # Update CORS allowed origins
   # Configure production domain
   ```

3. **Monitoring**
   ```bash
   # Set up error logging
   # Monitor failed login attempts
   # Track token usage
   ```

See [AUTH_SETUP_GUIDE.md](./AUTH_SETUP_GUIDE.md#security-best-practices) for detailed checklist.

---

## 📊 Architecture

```
┌─────────────────────┐
│  Next.js Client     │
│  (React)            │
│ - Login/Register    │
│ - Protected Routes  │
│ - Auth Context      │
└──────────┬──────────┘
           │
        JWT Token
           │
┌──────────▼──────────┐
│  Express Server     │
│  - Auth Routes      │
│  - JWT Middleware   │
│  - Password Hash    │
└──────────┬──────────┘
           │
      SQL/Queries
           │
┌──────────▼──────────┐
│  MongoDB            │
│  - User Collection  │
│  - Session Data     │
└─────────────────────┘
```

---

## 🧪 Testing

### Quick Test
```bash
# 1. Register new account
# Email: test@example.com
# Password: testpass123
# Username: testuser

# 2. Login with same credentials

# 3. See user info in navbar

# 4. Click logout

# 5. Try accessing /tasks
# Should redirect to /auth/login
```

For detailed testing, see [VERIFICATION_CHECKLIST.md](./VERIFICATION_CHECKLIST.md)

---

## 🔗 API Endpoints

### Public Endpoints
```
POST   /api/auth/register    - Create account
POST   /api/auth/login       - Login user
```

### Protected Endpoints (require JWT)
```
GET    /api/auth/me          - Get current user
```

See [AUTH_SETUP_GUIDE.md](./AUTH_SETUP_GUIDE.md#api-endpoints) for full documentation.

---

## 📁 Key Files Overview

### Server
```
server/
├── config/database.js          # MongoDB connection
├── models/User.js              # User schema
├── middleware/auth.js          # JWT verification
├── routes/authRoutes.js        # Auth endpoints
└── .env                        # Configuration
```

### Client
```
client/
├── src/contexts/AuthContext.js    # State management
├── src/services/authService.js    # API calls
├── src/components/ProtectedRoute  # Route protection
├── src/app/auth/login/page.jsx    # Login page
├── src/app/auth/register/page.jsx # Register page
└── middleware.js                   # Route middleware
```

---

## ❓ FAQ

**Q: How long do sessions last?**  
A: JWT tokens expire after 30 days. Configure in `server/.env` with `JWT_EXPIRE`.

**Q: Can I add OAuth (Google, GitHub)?**  
A: Yes! See future enhancements in [CHANGES.md](./CHANGES.md#future-enhancements).

**Q: Is this production-ready?**  
A: Yes, but review security checklist before deploying to production.

**Q: How do I reset a forgotten password?**  
A: Currently not implemented. Consider adding password reset in future.

**Q: Can I customize the UI?**  
A: Absolutely! Login/register pages use Tailwind CSS and can be fully customized.

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Ensure `mongod` is running
- Check `MONGODB_URI` in `server/.env`

### Login Page Not Showing
- Clear browser cache/cookies
- Check if AuthProvider is in `layout.js`

### CORS Errors
- Verify `NEXT_PUBLIC_API_URL` in `client/.env.local`
- Check server CORS configuration

See [AUTH_SETUP_GUIDE.md](./AUTH_SETUP_GUIDE.md#troubleshooting) for more solutions.

---

## 📞 Support

- **Setup Issues?** → Check [AUTH_SETUP_GUIDE.md](./AUTH_SETUP_GUIDE.md)
- **Implementation Details?** → See [CHANGES.md](./CHANGES.md)
- **Testing?** → Use [VERIFICATION_CHECKLIST.md](./VERIFICATION_CHECKLIST.md)
- **Quick answers?** → Try [QUICK_START.md](./QUICK_START.md)

---

## ✨ What's Next

- [ ] Implement password reset functionality
- [ ] Add email verification
- [ ] Integrate OAuth providers
- [ ] Set up 2FA
- [ ] Add audit logging
- [ ] Create admin dashboard
- [ ] Implement role-based access

---

## 📝 License & Attribution

This authentication system was built specifically for AgentFlow.

---

## 🎉 You're All Set!

Your application now has:
- ✅ Secure user authentication
- ✅ MongoDB data persistence
- ✅ JWT token management
- ✅ Protected routes
- ✅ Beautiful UI
- ✅ Production-ready setup

Happy building! 🚀

---

**Version:** 1.0  
**Last Updated:** May 10, 2026  
**Status:** ✅ Production Ready
