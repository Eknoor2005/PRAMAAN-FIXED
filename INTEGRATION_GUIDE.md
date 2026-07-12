# PRAMAAN - Frontend & Backend Integration Guide

## 📋 Project Overview

PRAMAAN is a complete justice-tech platform split into two independent projects:

- **Frontend**: Next.js 16 React application (Dashboard, Landing Page, Auth flows)
- **Backend**: Express.js Node.js API (MongoDB, Encryption, Authentication)

## 🏗️ Project Structure

```
pramaan/
├── /                          # Frontend (Next.js)
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   ├── layout.tsx        # Root layout
│   │   ├── (auth)/           # Auth routes
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── forgot-password/
│   │   └── dashboard/        # Protected routes
│   │       ├── page.tsx      # Main dashboard
│   │       ├── record/       # Testimony recording
│   │       ├── timeline/     # AI timeline
│   │       └── layout.tsx    # Dashboard layout
│   ├── components/
│   │   ├── landing/          # Landing page components
│   │   ├── dashboard/        # Dashboard components
│   │   └── ui/               # shadcn components
│   ├── types/
│   ├── lib/
│   ├── globals.css           # Theme tokens
│   └── package.json
│
└── backend/                   # Express API
    ├── src/
    │   ├── config/          # Database config
    │   ├── controllers/     # Route handlers
    │   ├── models/          # MongoDB schemas
    │   ├── routes/          # API endpoints
    │   ├── services/        # Business logic
    │   ├── middleware/      # Auth, validation
    │   ├── types/           # TypeScript types
    │   └── server.ts        # Express app
    ├── .env.example
    ├── README.md            # Backend docs
    ├── API_DOCS.md          # Full API reference
    ├── QUICKSTART.md        # Setup guide
    ├── ARCHITECTURE.md      # System design
    ├── Dockerfile
    ├── docker-compose.yml
    └── package.json
```

## 🔗 Frontend-Backend Connection

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pramaan
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=http://localhost:3000
```

## 🚀 Running Both Projects

### Terminal 1: Start MongoDB
```bash
# Using Docker (recommended)
docker run -d -p 27017:27017 --name pramaan-mongo mongo

# Or use Docker Compose from backend folder
cd backend
docker-compose up -d mongodb
```

### Terminal 2: Start Backend
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

### Terminal 3: Start Frontend
```bash
# From project root
npm install
npm run dev
# App runs on http://localhost:3000
```

## 📡 API Integration Points

### 1. Authentication Flow

**Frontend** (`app/(auth)/login/page.tsx`):
```typescript
const handleLogin = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  // Store tokens
  localStorage.setItem('accessToken', data.data.accessToken);
  localStorage.setItem('refreshToken', data.data.refreshToken);
};
```

**Backend** (`backend/src/routes/auth.routes.ts`):
- `POST /api/auth/signup` - Create account with RSA key pair
- `POST /api/auth/login` - Authenticate and return tokens
- `POST /api/auth/refresh` - Refresh expired tokens
- `GET /api/auth/me` - Get current user (protected)

### 2. Testimony Management

**Frontend** (`app/dashboard/record/page.tsx`):
```typescript
const saveTestimony = async (testimony: TestimonyData) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/testimonies`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testimony)
    }
  );
};
```

**Backend** (`backend/src/controllers/testimony.controller.ts`):
- Creates encrypted testimony
- Stores with user's encryption key
- Returns testimony ID on creation

### 3. Evidence Upload

**Frontend** (`app/dashboard/record/page.tsx`):
```typescript
const uploadEvidence = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  // Upload to backend or cloud storage
};
```

**Backend** (`backend/src/controllers/evidence.controller.ts`):
- Validates file upload
- Generates SHA-256 hash
- Creates tamper-proof chain
- Stores metadata encrypted

### 4. Real-time Features

**Messages** (encrypted):
```typescript
// Frontend: Send message
POST /api/messages/send
{
  conversationId: "...",
  receiverId: "...",
  content: "..." // encrypted on backend
}

// Backend: Retrieve messages
GET /api/messages/conversations/:id/messages
// Returns encrypted messages (decrypt on client)
```

## 🔒 Security Implementation

### Frontend Security
1. **Token Storage**: Secure HTTP-only cookies (if using next-auth)
   - Alternative: localStorage with XSS protection
2. **CORS**: Handled by backend CORS middleware
3. **Input Validation**: Joi schemas on client side (preview)
4. **HTTPS**: Required in production

### Backend Security
1. **JWT Tokens**: 
   - Access: 15 minutes
   - Refresh: 7 days
2. **Encryption**:
   - RSA-2048: User key pairs
   - AES-256-CBC: Data at rest
   - SHA-256: File integrity
3. **Rate Limiting**: 100 requests/15 minutes per IP
4. **CORS**: Restricted to frontend origin

## 🗄️ Database Schema Relationships

```
User
├─ _id
├─ email (unique)
├─ password (hashed)
├─ publicKey (RSA)
├─ privateKeyEncrypted (AES)
└─ role (survivor/advocate/admin)

Testimony
├─ _id
├─ userId → User
├─ content (encrypted)
├─ encryptionKey
└─ status (draft/completed/submitted/verified)

Evidence
├─ _id
├─ userId → User
├─ testimoniesId → [Testimony]
├─ casesId → [CaseFile]
├─ fileHash (SHA-256)
└─ isEncrypted

CaseFile
├─ _id
├─ userId → User
├─ caseNumber (unique)
├─ testimoniesId → [Testimony]
├─ evidenceId → [Evidence]
└─ status (open/in-progress/closed/resolved)

Message
├─ _id
├─ conversationId → Conversation
├─ senderId → User
├─ receiverId → User
├─ content (encrypted)
└─ isRead

Conversation
├─ _id
├─ participants → [User]
└─ lastMessage
```

## 🧪 Testing the Integration

### 1. Test Complete Auth Flow
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@"
  }'

# Use returned accessToken for authenticated requests
TOKEN="eyJhbGc..."

# Create Testimony
curl -X POST http://localhost:5000/api/testimonies \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Testimony",
    "description": "Test description",
    "content": "Test content"
  }'
```

### 2. Test Frontend API Calls
1. Open http://localhost:3000
2. Click "Get Started" or "Sign In"
3. Submit signup form
4. Check browser console for API call results
5. Verify tokens stored in localStorage/cookies

### 3. Verify Database
```bash
# Connect to MongoDB
mongosh

# View collections
use pramaan
db.users.find()
db.testimonies.find()
db.evidence.find()
```

## 📊 Monitoring

### Backend Logs
```bash
# Watch backend logs
cd backend
npm run dev

# You should see:
# ✓ MongoDB connected successfully
# ✓ PRAMAAN Backend running on port 5000
```

### Frontend Logs
```bash
# Check browser console (F12)
# Look for:
# - API call success/error messages
# - Authentication token logs
# - Data encryption/decryption status
```

## 🚢 Deployment

### Frontend Deployment (Vercel)
```bash
cd /
vercel deploy
# Set NEXT_PUBLIC_API_URL to production backend URL
```

### Backend Deployment (Multiple Options)

#### Option 1: Vercel (Edge Functions)
```bash
cd backend
vercel deploy
```

#### Option 2: Heroku
```bash
heroku create pramaan-api
git push heroku main
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_atlas_uri
```

#### Option 3: Docker + Any Platform
```bash
cd backend
docker build -t pramaan-backend .
docker push your-registry/pramaan-backend
# Deploy container to AWS ECS, K8s, etc.
```

#### Option 4: Traditional Server
```bash
# SSH into server
ssh user@server.com

# Clone, install, build
git clone <repo>
cd backend
npm install
npm run build

# Run with PM2
npm install -g pm2
pm2 start dist/server.js --name "pramaan-api"
pm2 save
```

## 🔄 API Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { /* payload */ },
  "statusCode": 200
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400,
  "details": [
    {
      "field": "email",
      "message": "Email validation failed"
    }
  ]
}
```

## 🎯 Common Development Tasks

### Add New API Endpoint
1. Create controller method in `backend/src/controllers/`
2. Create validation schema (Joi)
3. Add route in `backend/src/routes/`
4. Import route in `backend/src/server.ts`
5. Test with curl or Postman
6. Add frontend integration in Next.js

### Modify Testimony Schema
1. Update `backend/src/types/index.ts`
2. Update `backend/src/models/Testimony.ts`
3. Run MongoDB migration if needed
4. Update frontend types in `types/index.ts`
5. Update form in `components/`

### Add Authentication
1. Frontend: Implement login form
2. Backend: AuthController handles it
3. Store token in frontend
4. Add Authorization header to API calls
5. Test protected endpoints

## 📚 Documentation Files

- **Frontend**:
  - Landing page components
  - Dashboard structure
  - Auth flow
  - Type definitions

- **Backend**:
  - `README.md` - Setup & overview
  - `API_DOCS.md` - Complete API reference
  - `QUICKSTART.md` - Quick setup guide
  - `ARCHITECTURE.md` - System design

## ⚠️ Important Notes

1. **Encryption Keys**: Never hardcode JWT_SECRET, generate securely
2. **CORS**: Update CORS_ORIGIN when deploying to production
3. **Database**: Use MongoDB Atlas for production, local for development
4. **Tokens**: Access tokens should be short-lived (15min)
5. **Environment Variables**: Never commit .env file, use .env.example
6. **SSL/TLS**: Always use HTTPS in production
7. **Rate Limiting**: Adjust based on expected traffic

## 🆘 Troubleshooting

### "API call fails with 401 Unauthorized"
- Check if JWT token is in Authorization header
- Verify token hasn't expired
- Ensure JWT_SECRET matches between frontend and backend

### "MongoDB connection refused"
- Ensure MongoDB is running: `mongod` or `docker-compose up`
- Check MONGODB_URI in .env
- Verify MongoDB port 27017 is open

### "CORS error"
- Check CORS_ORIGIN in backend .env matches frontend URL
- Ensure Authorization header is included in requests
- Restart backend after changing CORS settings

### "Encryption/Decryption errors"
- Verify encryption key hasn't been modified
- Check AES-256 implementation
- Ensure RSA key pair was properly generated during signup

## 📞 Support

For issues:
1. Check documentation files (README.md, API_DOCS.md)
2. Review error logs (browser console, terminal)
3. Test with curl to isolate frontend vs backend issues
4. Check database state with mongosh
5. Open GitHub issue with details

---

**You now have a complete justice-tech platform ready for development! 🎉**

Next steps:
1. Install dependencies
2. Set up MongoDB
3. Start backend and frontend
4. Test authentication flow
5. Deploy to production when ready
