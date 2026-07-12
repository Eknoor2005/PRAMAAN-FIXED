# PRAMAAN Backend - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation Steps

#### 1. Navigate to backend folder
```bash
cd backend
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pramaan
JWT_SECRET=your-super-secret-key-here
CORS_ORIGIN=http://localhost:3000
```

#### 4. Start MongoDB (if local)
```bash
# On macOS with Homebrew
brew services start mongodb-community

# Or with Docker
docker run -d -p 27017:27017 --name pramaan-mongo mongo

# Or use Docker Compose (see below)
```

#### 5. Run development server
```bash
npm run dev
```

Server will start on `http://localhost:5000`

---

## 🐳 Docker Setup (Recommended)

### One-command setup with Docker Compose:
```bash
cd backend
docker-compose up -d
```

This starts:
- MongoDB on port 27017
- Backend on port 5000

View logs:
```bash
docker-compose logs -f backend
```

Stop services:
```bash
docker-compose down
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/              # Database & app configuration
│   ├── controllers/         # Request handlers
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── services/            # Business logic & encryption
│   ├── middleware/          # Auth, validation, error handling
│   ├── types/               # TypeScript interfaces
│   └── server.ts            # Express app entry point
├── dist/                    # Compiled JavaScript
├── API_DOCS.md              # Complete API documentation
├── README.md                # Full backend documentation
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── Dockerfile               # Docker image definition
├── docker-compose.yml       # Docker Compose setup
└── .env.example             # Environment variables template
```

---

## 🔐 Security Features

✅ **End-to-End Encryption**
- RSA-2048 key pairs for users
- AES-256-CBC for data encryption
- SHA-256 file hashing

✅ **Authentication**
- JWT tokens (15min access, 7day refresh)
- bcryptjs password hashing
- Token verification middleware

✅ **Rate Limiting**
- 100 requests per 15 minutes per IP
- Automatic blocking of excessive requests

✅ **HTTP Security**
- Helmet.js for secure headers
- CORS protection
- Input validation with Joi

---

## 🧪 Testing API Endpoints

### Test signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@",
    "firstName": "Test",
    "lastName": "User",
    "role": "survivor"
  }'
```

### Test login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@"
  }'
```

### Test protected endpoint (use token from login)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create testimony
```bash
curl -X POST http://localhost:5000/api/testimonies \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Testimony",
    "description": "What happened to me",
    "content": "Full testimony details...",
    "location": "New Delhi, India"
  }'
```

---

## 🗄️ MongoDB Setup

### Local MongoDB
```bash
# Start MongoDB
mongod

# Connect with Mongo Shell
mongosh
```

### MongoDB Atlas (Cloud)
1. Create account: https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update MONGODB_URI in .env:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pramaan?retryWrites=true&w=majority
   ```

### View data in MongoDB
```bash
mongosh
> use pramaan
> db.users.find()
> db.testimonies.find()
```

---

## 🔧 Development Commands

```bash
# Development server with auto-reload
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Seed test data (optional)
npm run seed
```

---

## 📊 Database Collections

The following collections are automatically created:

- **users** - User accounts with encryption keys
- **testimonies** - Encrypted survivor testimonies
- **evidence** - Uploaded files with hashes
- **casefiles** - Case organization
- **messages** - Encrypted conversations
- **conversations** - Message threads
- **supportresources** - Help directory

---

## 🔗 API Endpoints Overview

### Authentication
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Current user

### Testimonies
- `POST /api/testimonies` - Create
- `GET /api/testimonies` - List all
- `GET /api/testimonies/:id` - Get one
- `PUT /api/testimonies/:id` - Update
- `DELETE /api/testimonies/:id` - Delete

### Evidence
- `POST /api/evidence` - Upload
- `GET /api/evidence` - List all
- `GET /api/evidence/:id` - Get one
- `DELETE /api/evidence/:id` - Delete

### Cases
- `POST /api/cases` - Create
- `GET /api/cases` - List all
- `GET /api/cases/:id` - Get one
- `PUT /api/cases/:id` - Update
- `DELETE /api/cases/:id` - Delete

### Messages
- `POST /api/messages/send` - Send message
- `GET /api/messages/conversations` - List conversations
- `GET /api/messages/conversations/:id/messages` - Get messages
- `GET /api/messages/unread-count` - Unread count

### Support
- `GET /api/support` - Get resources
- `GET /api/support/countries` - List countries
- `GET /api/support/:id` - Get resource

See [API_DOCS.md](./API_DOCS.md) for complete documentation.

---

## ⚠️ Common Issues

### MongoDB connection failed
```
Error: connect ECONNREFUSED
```
**Solution:**
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env
- Verify MongoDB is accessible

### JWT errors
```
Error: Invalid token
```
**Solution:**
- Check JWT_SECRET matches in .env
- Ensure token isn't expired
- Verify Authorization header format: `Bearer <token>`

### CORS errors
```
Cross-Origin Request Blocked
```
**Solution:**
- Update CORS_ORIGIN in .env to match frontend URL
- Restart server after changing .env

### Port already in use
```
Error: listen EADDRINUSE
```
**Solution:**
- Change PORT in .env
- Or kill process: `lsof -ti:5000 | xargs kill -9`

---

## 📝 Environment Checklist

Before deploying, ensure all variables are set:

- [ ] `PORT` - Server port (default: 5000)
- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Strong random string (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- [ ] `CORS_ORIGIN` - Frontend URL
- [ ] `NODE_ENV` - Set to `production` for deployment

---

## 🚢 Deployment

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy
```

### Heroku
```bash
# Create app
heroku create pramaan-backend

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_uri

# Push code
git push heroku main
```

### Docker Hub
```bash
docker build -t your-username/pramaan-backend .
docker push your-username/pramaan-backend
```

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Introduction](https://jwt.io/introduction)
- [Node.js Crypto](https://nodejs.org/api/crypto.html)

---

## 💬 Support

For issues or questions:
1. Check [README.md](./README.md) for detailed documentation
2. Review [API_DOCS.md](./API_DOCS.md) for API details
3. Open an issue on GitHub

---

**PRAMAAN Backend is now ready to use! 🎉**
