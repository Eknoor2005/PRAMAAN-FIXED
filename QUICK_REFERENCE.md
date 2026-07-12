# PRAMAAN - Quick Reference Card

## 🚀 Start Development (2 minutes)

### Terminal 1: MongoDB
```bash
docker run -d -p 27017:27017 mongo
# or: docker-compose up -d
```

### Terminal 2: Backend
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5000
```

### Terminal 3: Frontend
```bash
npm install
npm run dev
# Running on http://localhost:3000
```

---

## 🔑 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pramaan
JWT_SECRET=change-me-to-random-32-bytes
CORS_ORIGIN=http://localhost:3000
```

---

## 📡 Key API Endpoints

### Auth
```
POST /api/auth/signup          - Register
POST /api/auth/login           - Login
POST /api/auth/refresh         - Refresh token
GET  /api/auth/me              - Current user
```

### Testimonies
```
POST   /api/testimonies        - Create
GET    /api/testimonies        - List all
GET    /api/testimonies/:id    - Get one
PUT    /api/testimonies/:id    - Update
DELETE /api/testimonies/:id    - Delete
```

### Evidence
```
POST   /api/evidence           - Upload
GET    /api/evidence           - List all
GET    /api/evidence/:id       - Get one
DELETE /api/evidence/:id       - Delete
```

### Cases
```
POST   /api/cases              - Create
GET    /api/cases              - List all
GET    /api/cases/:id          - Get one
PUT    /api/cases/:id          - Update
DELETE /api/cases/:id          - Delete
```

### Messages
```
POST /api/messages/send                              - Send message
GET  /api/messages/conversations                     - List conversations
GET  /api/messages/conversations/:id/messages        - Get messages
GET  /api/messages/unread-count                      - Unread count
```

---

## 🧪 Test Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@",
    "firstName": "Test",
    "lastName": "User"
  }'
```

---

## 🧪 Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@"
  }'
```

**Response includes:**
- accessToken (15 min)
- refreshToken (7 days)
- user object

---

## 🧪 Test Protected Endpoint

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📝 Create Testimony

```bash
curl -X POST http://localhost:5000/api/testimonies \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Story",
    "description": "What happened",
    "content": "Full testimony details...",
    "location": "City, Country"
  }'
```

---

## 🔐 Security Layers

| Layer | Technology |
|-------|-----------|
| Encryption | RSA-2048 + AES-256-CBC + SHA-256 |
| Authentication | JWT (15min/7days) |
| Passwords | bcryptjs (10 rounds) |
| Rate Limiting | 100 req/15min per IP |
| Headers | Helmet.js |
| Validation | Joi schema |

---

## 📊 Database Collections

```
users
├─ 72 fields including encryption keys
├─ Indexed on email (unique)
└─ Contains: password (hashed), publicKey, etc.

testimonies
├─ Encrypted content (AES-256)
├─ Status tracking (draft/completed/submitted/verified)
└─ Timeline entries

evidence
├─ SHA-256 file hashing
├─ Tamper-proof chain
└─ File metadata

cases
├─ Case number (unique)
├─ Status tracking
├─ Associated testimonies & evidence
└─ Advocate assignment

messages
├─ Encrypted content
├─ Read status tracking
└─ Conversation references

conversations
├─ Participant list
└─ Last message preview

supportresources
├─ Verified by admin
├─ Searchable by country/category
└─ Contact information
```

---

## 📚 Documentation Map

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [BUILD_SUMMARY.md](BUILD_SUMMARY.md) | Overview of everything built | 15 min |
| [PROJECT_README.md](PROJECT_README.md) | Complete project guide | 10 min |
| [backend/README.md](backend/README.md) | Backend documentation | 10 min |
| [backend/API_DOCS.md](backend/API_DOCS.md) | All 50+ endpoints | 20 min |
| [backend/QUICKSTART.md](backend/QUICKSTART.md) | Quick setup | 5 min |
| [backend/ARCHITECTURE.md](backend/ARCHITECTURE.md) | System design | 15 min |
| [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) | Frontend-backend setup | 10 min |
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | Pre-production | 5 min |

---

## 🛠️ Common Commands

### Backend
```bash
cd backend

# Install dependencies
npm install

# Development with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# View logs
npm run dev 2>&1 | tee app.log
```

### Frontend
```bash
# Development
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Analyze bundle
npm run build -- --analyze
```

### Database
```bash
# Connect to MongoDB
mongosh

# View collections
use pramaan
show collections

# Query users
db.users.find()

# Query testimonies
db.testimonies.find()

# Count records
db.users.countDocuments()
```

---

## ⚙️ Configuration Checklist

### Before Development
- [ ] Node.js 18+ installed (`node --version`)
- [ ] MongoDB running (`docker-compose up -d`)
- [ ] .env files created from .env.example
- [ ] Dependencies installed (`npm install`)

### Before Deployment
- [ ] JWT_SECRET generated (32+ bytes)
- [ ] MongoDB Atlas configured
- [ ] CORS_ORIGIN updated
- [ ] HTTPS enforced
- [ ] Environment variables set
- [ ] Domain configured
- [ ] SSL certificates ready

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection error | `docker-compose up -d` or `mongod` |
| CORS error | Update `CORS_ORIGIN` in `.env`, restart backend |
| JWT invalid | Check if token expired, use refresh endpoint |
| Port already in use | Change `PORT` in `.env` or kill process |
| API 404 error | Verify endpoint path and HTTP method |
| 401 Unauthorized | Add `Authorization: Bearer <token>` header |
| 403 Forbidden | Check user role and permissions |

---

## 📊 Response Format

### Success
```json
{
  "success": true,
  "data": { /* payload */ },
  "statusCode": 200
}
```

### Error
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400,
  "details": [/* validation errors */]
}
```

---

## 🔐 Token Usage

### Include in Every Protected Request
```bash
Authorization: Bearer eyJhbGc...
```

### Get New Token
```bash
# Using refresh token
POST /api/auth/refresh
{
  "refreshToken": "eyJhbGc..."
}

# Returns new accessToken
```

---

## 🌐 Deployment URLs

### Development
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

### Production (Example)
- Frontend: https://pramaan.com
- Backend: https://api.pramaan.com
- MongoDB: MongoDB Atlas

---

## 📞 Resources

- **Node.js**: https://nodejs.org
- **Express**: https://expressjs.com
- **MongoDB**: https://mongodb.com
- **Next.js**: https://nextjs.org
- **JWT**: https://jwt.io
- **Mongoose**: https://mongoosejs.com

---

## ✅ Verification Steps

1. **Start all services**
   ```bash
   # MongoDB
   docker-compose up -d
   # Backend: npm run dev
   # Frontend: npm run dev
   ```

2. **Test signup**
   ```bash
   curl -X POST http://localhost:5000/api/auth/signup ...
   ```

3. **Test login**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login ...
   ```

4. **Verify database**
   ```bash
   mongosh
   use pramaan
   db.users.find()
   ```

5. **Open frontend**
   - http://localhost:3000
   - Sign up and explore

---

## 🎯 Quick Deploy

### Heroku (Backend)
```bash
heroku create pramaan-api
heroku config:set JWT_SECRET=...
heroku config:set MONGODB_URI=...
git push heroku main
```

### Vercel (Frontend)
```bash
vercel deploy --prod
# Set NEXT_PUBLIC_API_URL
```

---

**PRAMAAN is ready. Start building!** 🚀
