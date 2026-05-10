# JWT Authentication System - Setup & Usage Guide

Welcome! This guide explains how the new JWT-based authentication system works in your AgentFlow application.

## Overview

The authentication system includes:
- **MongoDB** database for user storage
- **JWT (JSON Web Tokens)** for secure session management
- **Bcrypt** for password hashing
- **Login/Register** pages with modern UI matching your home page design
- **Protected Routes** - only authenticated users can access the main app

## Prerequisites

Before running the application, ensure you have:
1. **MongoDB** running locally or a connection string to a MongoDB instance
2. **Node.js** and npm installed
3. Access to the server and client directories

## Setup Instructions

### 1. Server Configuration

#### Step 1: Environment Variables
The server `.env` file has been created at: `/server/.env`

**Current settings:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agentflow
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
AI_ENGINE_URL=http://localhost:8000
```

**For Production:**
- Change `JWT_SECRET` to a strong, random string
- Update `MONGODB_URI` to your production MongoDB instance
- Set appropriate `JWT_EXPIRE` time

#### Step 2: Start MongoDB
```bash
# If using local MongoDB
mongod

# Or if using Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

#### Step 3: Install & Start Server
```bash
cd server
npm install  # Already done, but run if needed
npm start    # or npm run dev
```

The server will start on `http://localhost:5000`

### 2. Client Configuration

#### Step 1: Environment Variables
The client `.env.local` has been updated to:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

#### Step 2: Start Client
```bash
cd client
npm run dev
```

The client will start on `http://localhost:3000`

## How It Works

### User Registration Flow
1. User navigates to `/auth/register`
2. Fills in username, email, and password
3. System validates:
   - Email is unique
   - Password is at least 6 characters
   - All fields are provided
4. Password is hashed using bcrypt
5. User is created in MongoDB
6. JWT token is generated and stored (localStorage + cookies)
7. User is redirected to `/home`

### User Login Flow
1. User navigates to `/auth/login`
2. Fills in email and password
3. System validates:
   - User exists in database
   - Password matches stored hash
4. JWT token is generated and stored
5. User is redirected to `/home`

### Protected Routes
All pages except auth pages are protected:
- ✅ Public: `/auth/login`, `/auth/register`
- 🔒 Protected: `/home`, `/tasks`, `/opsRoom`, `/agents`, `/analytics`, `/memory`, `/orchestrator`

If a non-authenticated user tries to access protected routes, they're redirected to login.

## Authentication Files

### Server-Side Files
```
server/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   └── User.js              # User schema & password hashing
├── middleware/
│   └── auth.js              # JWT verification middleware
├── routes/
│   └── authRoutes.js        # Login/Register endpoints
├── .env                     # Environment variables
└── server.js               # Updated with auth routes
```

### Client-Side Files
```
client/
├── src/
│   ├── contexts/
│   │   └── AuthContext.js        # Auth state management
│   ├── services/
│   │   └── authService.js        # API calls for auth
│   ├── components/
│   │   ├── ProtectedRoute.jsx    # Route protection wrapper
│   │   └── Navbar.jsx            # Updated with auth controls
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/page.jsx    # Login page
│   │   │   └── register/page.jsx # Registration page
│   │   ├── home/page.jsx         # Updated with protection
│   │   ├── tasks/page.jsx        # Protected route
│   │   └── ... (other protected pages)
│   └── layout.js            # Includes AuthProvider
├── middleware.js            # Next.js middleware for route protection
└── .env.local              # API configuration
```

## API Endpoints

All endpoints use JSON content type: `application/json`

### POST `/api/auth/register`
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "username": "john_doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "john_doe"
  }
}
```

### POST `/api/auth/login`
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "john_doe"
  }
}
```

### GET `/api/auth/me`
Get current logged-in user (requires Authorization header).

**Request:**
```
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "john_doe"
  }
}
```

## Using Protected Routes in Other Pages

To protect any page with authentication:

1. Import the ProtectedRoute component:
```jsx
import { ProtectedRoute } from "@/components/ProtectedRoute";
```

2. Wrap your page content:
```jsx
export default function MyPage() {
  return (
    <ProtectedRoute>
      <YourPageContent />
    </ProtectedRoute>
  );
}
```

## Using Auth Context in Components

To access user info or logout from any component:

```jsx
'use client';
import { useAuth } from "@/contexts/AuthContext";

export function MyComponent() {
  const { user, isAuthenticated, logout, login, register } = useAuth();

  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }

  return (
    <div>
      <p>Welcome, {user.username}!</p>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
```

## Troubleshooting

### MongoDB Connection Error
**Error:** `MongoDB connection failed`
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- If using local MongoDB: `mongod` should be running
- If using cloud MongoDB: connection string should be correct

### JWT Token Invalid
**Error:** `Not authorized to access this route`
- Token may be expired (default: 30 days)
- Try logging in again
- Check browser localStorage for token

### CORS Errors
**Error:** `Cross-Origin Request Blocked`
- Ensure `NEXT_PUBLIC_API_URL` is set correctly
- Server CORS headers are configured for `localhost:3000`
- For other origins, update server.js CORS settings

### Page Redirects to Login Unexpectedly
- Token may have expired
- Check localStorage for token and user data
- Ensure AuthProvider wraps the app in layout.js

## Security Best Practices

1. **Change JWT_SECRET** before deploying to production
2. **Use HTTPS** in production
3. **Set secure cookie flags** for production
4. **Add rate limiting** to auth endpoints
5. **Implement 2FA** for additional security
6. **Use environment-specific configs**
7. **Regularly rotate JWT_SECRET**
8. **Monitor failed login attempts**

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  username: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Next Steps

1. Start MongoDB
2. Run `npm install` in server directory
3. Start the server: `npm start`
4. Start the client: `npm run dev`
5. Navigate to `http://localhost:3000`
6. You'll be redirected to `/auth/login`
7. Create an account or login
8. Access the main app!

## Support

For issues or questions about the authentication system, check:
- Server logs: Look for database/JWT errors
- Browser console: Client-side errors
- Network tab: API call failures
- MongoDB connection string: Ensure it's accessible

---

Happy coding! Your AgentFlow app is now secure! 🔐
