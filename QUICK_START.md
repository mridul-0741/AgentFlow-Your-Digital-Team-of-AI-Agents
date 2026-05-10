# Quick Start - JWT Authentication

## TL;DR - Get Running in 3 Steps

### 1. Start MongoDB
```bash
mongod
# or with Docker:
docker run -d -p 27017:27017 mongo
```

### 2. Start Server
```bash
cd server
npm start
```

### 3. Start Client & Login
```bash
cd client
npm run dev
# Navigate to http://localhost:3000
```

---

## Test Credentials (After Registration)

Create an account:
- **Email:** test@example.com
- **Password:** testpass123
- **Username:** testuser

---

## Key Features

✅ **Secure Authentication**
- Passwords hashed with bcrypt
- JWT tokens (30-day expiration)
- Protected routes with automatic redirects

✅ **Beautiful UI**
- Matches your home page design
- Modern gradient backgrounds
- Responsive on all devices

✅ **MongoDB Integration**
- User data persistence
- Scalable architecture
- Production-ready

✅ **Easy to Extend**
- Add more protected pages
- Customize JWT expiration
- Implement 2FA/SSO

---

## Architecture

```
┌─────────────────────────────────────────┐
│         Client (Next.js)                │
├─────────────────────────────────────────┤
│ AuthContext → ProtectedRoute Component  │
│ Login/Register Pages                    │
│ Auth Service (API calls)                │
└─────────────────┬───────────────────────┘
                  │
                  │ JWT Tokens
                  │ (localStorage + cookies)
                  │
                  ↓
┌─────────────────────────────────────────┐
│      Server (Express.js)                │
├─────────────────────────────────────────┤
│ Auth Routes                             │
│ JWT Middleware                          │
│ Password Hashing (bcryptjs)             │
└─────────────────┬───────────────────────┘
                  │
                  │
                  ↓
┌─────────────────────────────────────────┐
│      MongoDB                            │
├─────────────────────────────────────────┤
│ User Collection                         │
│ (email, password_hash, username, ...)   │
└─────────────────────────────────────────┘
```

---

## API Reference

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/register` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Sign in |
| GET | `/api/auth/me` | ✅ | Get user info |

---

## Environment Variables

### Server (`.env`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agentflow
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
```

### Client (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## File Structure

```
📦 Authentication System
├── 🔐 Server
│   ├── config/database.js (MongoDB connection)
│   ├── models/User.js (User schema)
│   ├── middleware/auth.js (JWT verification)
│   ├── routes/authRoutes.js (API endpoints)
│   ├── .env (configuration)
│   └── server.js (updated)
│
├── 🎨 Client
│   ├── src/contexts/AuthContext.js (state management)
│   ├── src/services/authService.js (API integration)
│   ├── src/components/ProtectedRoute.jsx (route protection)
│   ├── src/app/auth/login/page.jsx (login page)
│   ├── src/app/auth/register/page.jsx (signup page)
│   ├── src/app/layout.js (with AuthProvider)
│   ├── middleware.js (Next.js middleware)
│   └── .env.local (updated)
│
└── 📄 Documentation
    ├── AUTH_SETUP_GUIDE.md (detailed setup)
    └── QUICK_START.md (this file)
```

---

## Common Tasks

### Adding Authentication to a New Page

```jsx
'use client';
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function NewPage() {
  return (
    <ProtectedRoute>
      <div>Your protected content here</div>
    </ProtectedRoute>
  );
}
```

### Getting User Info in a Component

```jsx
import { useAuth } from "@/contexts/AuthContext";

export function UserProfile() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <p>Hello, {user?.username}</p>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
```

### Calling Protected Endpoints

```jsx
const token = authService.getToken();
const response = await fetch('http://localhost:5000/api/protected-route', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Start `mongod` or check connection string |
| Login page not showing | Check if AuthProvider is in layout.js |
| Token not persisting | Clear cookies/localStorage and try again |
| CORS errors | Verify API_URL matches server port |

---

## What's Next?

- [ ] Connect OAuth providers (Google, GitHub)
- [ ] Add password reset functionality
- [ ] Implement 2FA
- [ ] Add social login options
- [ ] Set up email verification
- [ ] Add session management UI

---

Enjoy your secure AgentFlow! 🚀
