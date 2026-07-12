# PRAMAAN Backend

A secure Node.js Express backend for PRAMAAN - Digital Testimony Passport, a justice-tech platform for survivors of sexual violence, domestic abuse, and trafficking.

## Features

- **End-to-End Encryption**: All sensitive data (testimonies, evidence) encrypted with AES-256 and RSA
- **JWT Authentication**: Secure token-based authentication with access/refresh tokens
- **Role-Based Access Control**: Survivor, Advocate, and Admin roles
- **Encrypted Messaging**: Secure communication between survivors and advocates
- **Evidence Management**: Upload, verify, and track evidence with file hashing
- **Case Management**: Organize testimonies and evidence into case files
- **Support Resources**: Directory of verified support resources by country and category
- **Database Integrity**: File hash verification and tamper-proof chains

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (jsonwebtoken)
- **Encryption**: Node.js crypto module (AES-256-CBC, RSA-2048)
- **Password Hashing**: bcryptjs
- **Validation**: Joi
- **Language**: TypeScript

## Prerequisites

- Node.js 18 or higher
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository
   ```bash
   git clone <repo-url>
   cd backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/pramaan
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_ACCESS_EXPIRY=15m
   JWT_REFRESH_EXPIRY=7d
   CORS_ORIGIN=http://localhost:3000
   ```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Register new user
- `POST /login` - Login user
- `POST /refresh` - Refresh access token
- `GET /me` - Get current user (requires auth)

### Testimonies (`/api/testimonies`)
- `POST /` - Create new testimony (requires auth)
- `GET /` - Get all user testimonies (requires auth)
- `GET /:id` - Get testimony by ID (requires auth)
- `PUT /:id` - Update testimony (requires auth)
- `DELETE /:id` - Delete testimony (requires auth)

### Evidence (`/api/evidence`)
- `POST /` - Upload evidence (requires auth)
- `GET /` - Get all user evidence (requires auth)
- `GET /:id` - Get evidence by ID (requires auth)
- `DELETE /:id` - Delete evidence (requires auth)

### Cases (`/api/cases`)
- `POST /` - Create new case (requires auth)
- `GET /` - Get all user cases (requires auth)
- `GET /:id` - Get case by ID (requires auth)
- `PUT /:id` - Update case (requires auth)
- `DELETE /:id` - Delete case (requires auth)

### Messaging (`/api/messages`)
- `POST /send` - Send message (requires auth)
- `GET /conversations` - Get user conversations (requires auth)
- `GET /conversations/:conversationId/messages` - Get conversation messages (requires auth)
- `GET /unread-count` - Get unread message count (requires auth)

### Support Resources (`/api/support`)
- `GET /` - Get support resources (by country/category)
- `GET /countries` - Get all countries with resources
- `GET /:id` - Get resource by ID

## Authentication

All protected endpoints require an `Authorization` header with a Bearer token:

```
Authorization: Bearer <access_token>
```

### Token Structure

**Access Token** (15 minutes):
```json
{
  "userId": "user_id",
  "email": "user@example.com",
  "role": "survivor|advocate|admin",
  "publicKey": "rsa_public_key"
}
```

**Refresh Token** (7 days):
```json
{
  "userId": "user_id"
}
```

## Encryption

### User Keys
- RSA-2048 key pairs generated on signup
- Private key encrypted with AES-256 and stored in database
- Public key shared with client for encryption

### Testimony Encryption
- Each testimony encrypted with AES-256
- Encryption key stored securely
- Content decrypted on retrieval for authorized users

### Message Encryption
- Messages encrypted with AES-256 before storage
- Decryption happens on retrieval

### Evidence Integrity
- SHA-256 hash generated for each file
- Hash verification on retrieval
- Tamper-proof chains maintained

## Data Models

### User
```typescript
{
  email: string;
  password: string (hashed);
  firstName: string;
  lastName: string;
  role: 'survivor' | 'advocate' | 'admin';
  publicKey: string (RSA-2048);
  privateKeyEncrypted: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  emergencyContact?: object;
  lastLogin?: Date;
}
```

### Testimony
```typescript
{
  userId: string;
  title: string;
  description: string;
  content: string (encrypted);
  status: 'draft' | 'completed' | 'submitted' | 'verified';
  timeline?: TimelineEntry[];
  caseId?: string;
  isEncrypted: boolean;
  encryptionKey: string;
}
```

### Evidence
```typescript
{
  userId: string;
  fileUrl: string;
  fileType: 'document' | 'photo' | 'video' | 'audio';
  fileName: string;
  fileSize: number;
  fileHash: string (SHA-256);
  isEncrypted: boolean;
  chain: string;
}
```

### Case
```typescript
{
  userId: string;
  caseNumber: string;
  title: string;
  caseType: 'sexual-violence' | 'domestic-abuse' | 'trafficking' | 'harassment' | 'other';
  status: 'open' | 'in-progress' | 'closed' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  testimoniesId: string[];
  evidenceId: string[];
  assignedAdvocate?: string;
}
```

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400,
  "details": [] // optional validation errors
}
```

## Security Features

1. **HTTPS/TLS** - All communications encrypted
2. **Rate Limiting** - 100 requests per 15 minutes per IP
3. **CORS** - Configurable CORS policy
4. **Password Hashing** - bcryptjs with salt rounds
5. **JWT Expiration** - Short-lived access tokens
6. **Input Validation** - Joi schema validation
7. **Helmet** - HTTP header security
8. **Encrypted Storage** - Sensitive data encrypted at rest

## Database Setup

### Local MongoDB
```bash
# Start MongoDB
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### MongoDB Atlas (Cloud)
1. Create account at mongodb.com/atlas
2. Create cluster
3. Get connection string
4. Update MONGODB_URI in .env

## Development

### Project Structure
```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middleware/       # Custom middleware
│   ├── types/            # TypeScript types
│   └── server.ts         # Express app setup
├── dist/                 # Compiled JavaScript
├── package.json
├── tsconfig.json
└── .env.example
```

### Adding New Endpoints

1. Create model in `src/models/`
2. Create controller in `src/controllers/`
3. Create validation schemas in controller
4. Create routes in `src/routes/`
5. Import and register routes in `src/server.ts`

## Testing

```bash
# With Postman or curl
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

## Deployment

### Vercel
```bash
vercel deploy
```

### Heroku
```bash
heroku create pramaan-backend
git push heroku main
```

### Docker
```bash
docker build -t pramaan-backend .
docker run -p 5000:5000 -e MONGODB_URI=<uri> pramaan-backend
```

## Environment Variables Checklist

- [ ] `PORT` set (default: 5000)
- [ ] `MONGODB_URI` configured
- [ ] `JWT_SECRET` set to strong value
- [ ] `CORS_ORIGIN` set to frontend URL
- [ ] `NODE_ENV` set appropriately

## Support & Documentation

For API documentation, see [API_DOCS.md](./API_DOCS.md)

## License

MIT

## Contact

For issues or questions about PRAMAAN, please open an issue on the repository.
