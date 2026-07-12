# PRAMAAN Backend - Architecture & Implementation

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Frontend (Next.js)                      │
│                  React UI with Tailwind CSS                      │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS/TLS
                             ▼
        ┌────────────────────────────────────────────────┐
        │           Express.js API Server                │
        │  (Port 5000, Rate Limited, CORS Protected)     │
        ├────────────────────────────────────────────────┤
        │  Middleware Layer                              │
        │  ├── Authentication (authMiddleware)           │
        │  ├── Validation (validateRequest)              │
        │  ├── Error Handling (errorHandler)             │
        │  └── Rate Limiting                             │
        ├────────────────────────────────────────────────┤
        │  Route Layer                                   │
        │  ├── /api/auth          (AuthController)      │
        │  ├── /api/testimonies   (TestimonyController) │
        │  ├── /api/evidence      (EvidenceController)   │
        │  ├── /api/cases         (CaseController)       │
        │  ├── /api/messages      (MessagingController)  │
        │  └── /api/support       (SupportController)    │
        ├────────────────────────────────────────────────┤
        │  Service Layer                                 │
        │  ├── AuthService (JWT, password hashing)      │
        │  ├── EncryptionService (RSA, AES-256)         │
        │  └── Business Logic                            │
        ├────────────────────────────────────────────────┤
        │  Model Layer (Mongoose)                        │
        │  ├── User                                      │
        │  ├── Testimony                                 │
        │  ├── Evidence                                  │
        │  ├── CaseFile                                  │
        │  ├── Message                                   │
        │  ├── Conversation                              │
        │  └── SupportResource                           │
        └────────────────────────────────┬───────────────┘
                                         │
                                         ▼
        ┌────────────────────────────────────────────────┐
        │          MongoDB Database                      │
        │  (Encrypted sensitive data at rest)            │
        │  Collections: users, testimonies, evidence,    │
        │  cases, messages, conversations, resources     │
        └────────────────────────────────────────────────┘
```

## Encryption Flow

### User Registration & Key Generation

```
1. User signs up
   ├─ Password: bcryptjs hash (10 salt rounds)
   ├─ RSA Key Pair: 2048-bit (client-side capable too)
   └─ Private Key: encrypted with AES-256 + JWT_SECRET

2. Public Key shared with client
   └─ Used for encrypting data that only user can decrypt

3. Private Key stored encrypted
   └─ Client can decrypt using JWT_SECRET when needed
```

### Testimony Encryption

```
1. User creates testimony
   ├─ Generate random AES-256 key
   ├─ Encrypt testimony content with key
   ├─ Store encrypted content in database
   └─ Store encryption key securely

2. User retrieves testimony
   ├─ Authentication check (JWT)
   ├─ Ownership verification
   ├─ Fetch encrypted content from DB
   ├─ Decrypt with stored key
   └─ Return decrypted content
```

### Message Encryption

```
1. User sends message
   ├─ Encrypt content with AES-256
   ├─ Store encrypted message
   └─ Notify recipient

2. User receives message
   ├─ Fetch encrypted message (only if receiver)
   ├─ Decrypt with shared key
   └─ Mark as read
```

### Evidence File Integrity

```
1. File upload
   ├─ Generate SHA-256 hash
   ├─ Create tamper-proof chain
   ├─ Encrypt file URL
   └─ Store metadata

2. File verification
   ├─ Recalculate SHA-256 hash
   ├─ Compare with stored hash
   ├─ Verify chain integrity
   └─ Confirm not tampered
```

## Authentication & Authorization

### Token Flow

```
┌──────────────────────────────────────────┐
│ 1. User Login                            │
│    POST /api/auth/login                  │
│    ├─ Email + Password                   │
│    └─ Verify credentials                 │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ 2. Token Generation                      │
│    ├─ Access Token (15 min)              │
│    │  {userId, email, role, publicKey}   │
│    └─ Refresh Token (7 days)             │
│       {userId}                           │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ 3. Client Uses Access Token              │
│    Authorization: Bearer <access_token>  │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ 4. Token Expired? Use Refresh             │
│    POST /api/auth/refresh                │
│    └─ Get new Access Token               │
└──────────────────────────────────────────┘
```

### Role-Based Access Control

```
Roles:
├── survivor
│   ├─ Create testimonies (own only)
│   ├─ Upload evidence (own only)
│   ├─ Create cases (own only)
│   ├─ Message advocates
│   └─ Access support resources
│
├── advocate
│   ├─ View assigned cases
│   ├─ Message survivors
│   ├─ Verify testimonies
│   └─ Upload evidence to cases
│
└── admin
    ├─ Full access to all data
    ├─ Manage support resources
    ├─ View all cases
    └─ System administration
```

## Data Flow Examples

### Creating a Testimony

```
1. Frontend
   ├─ User writes testimony
   └─ Send to backend (encrypted or not)

2. Backend receives POST /api/testimonies
   ├─ Validate JWT token
   ├─ Check user authentication
   ├─ Validate request body with Joi
   ├─ Generate encryption key
   ├─ Encrypt testimony content (AES-256)
   ├─ Create Testimony document in MongoDB
   └─ Return testimony ID

3. Database stores
   ├─ userId
   ├─ title
   ├─ description
   ├─ content (encrypted)
   ├─ encryptionKey (stored securely)
   ├─ status: 'draft'
   ├─ timestamps
   └─ isEncrypted: true
```

### Retrieving a Testimony

```
1. Frontend
   └─ GET /api/testimonies/:id

2. Backend processes
   ├─ Validate JWT token
   ├─ Fetch testimony from DB
   ├─ Verify user ownership or admin
   ├─ Decrypt content with stored key
   ├─ Return decrypted testimony
   └─ Client receives full data

3. Frontend displays
   └─ Render decrypted testimony
```

### Sending a Message

```
1. Frontend
   ├─ User composes message
   └─ POST /api/messages/send

2. Backend processes
   ├─ Validate JWT token
   ├─ Find or create conversation
   ├─ Encrypt message (AES-256)
   ├─ Save to Message collection
   ├─ Update Conversation.lastMessage
   └─ Return confirmation

3. Database stores encrypted message
   ├─ conversationId
   ├─ senderId
   ├─ receiverId
   ├─ content (encrypted)
   ├─ isRead: false
   └─ timestamps

4. Receiver retrieves
   ├─ GET /api/messages/conversations/:id/messages
   ├─ Fetch encrypted messages
   ├─ Decrypt messages
   ├─ Mark as read
   └─ Frontend displays
```

## Error Handling

```
┌─────────────────────────────────────────┐
│ Error Occurs in Route Handler           │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ asyncHandler Wrapper Catches Error      │
│ (All routes wrapped)                    │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Error Handler Middleware                │
│ ├─ Logs error                           │
│ ├─ Formats response                     │
│ ├─ Sets HTTP status                     │
│ └─ Sends JSON to client                 │
└─────────────────────────────────────────┘
```

## Validation Pipeline

```
Client Request
     │
     ▼
Route Handler
     │
     ▼
Validation Middleware (validateRequest)
     ├─ Run Joi schema validation
     ├─ Check for errors
     │  ├─ If error: Return 400 with details
     │  └─ If valid: Continue
     │
     ▼
Sanitize & Clean Data
     ├─ Strip unknown fields
     ├─ Convert types
     └─ Trim strings
     │
     ▼
Attach to req.body
     │
     ▼
Controller Handler
```

## Deployment Architecture

### Development
```
Local Machine
├─ Node.js dev server (npm run dev)
├─ MongoDB (local or remote)
└─ Hot reload enabled
```

### Production - Docker
```
Docker Container
├─ Node.js app
├─ Environment variables
└─ Mounted to orchestration platform
```

### Production - Traditional
```
Server (AWS, Heroku, Vercel)
├─ Node.js runtime
├─ Environment variables from platform
├─ MongoDB Atlas connection
└─ SSL/HTTPS enabled
```

## Security Checklist

✅ **Authentication**
- JWT tokens with expiration
- Refresh token rotation capability
- Password hashing with bcryptjs

✅ **Encryption**
- End-to-end encryption for testimonies
- AES-256 for symmetric encryption
- RSA-2048 for key pair encryption
- SHA-256 for file integrity

✅ **Data Protection**
- HTTPS/TLS in production
- Encrypted at rest (AES-256)
- Encrypted in transit (TLS)
- No plain text sensitive data in logs

✅ **API Security**
- Rate limiting (100 req/15min)
- CORS protection
- Helmet.js security headers
- Input validation and sanitization
- SQL injection prevention (MongoDB queries)

✅ **Access Control**
- Role-based authorization
- Ownership verification
- Admin-only endpoints
- Resource-level permissions

## Performance Optimizations

1. **Database Indexes**
   - Index on userId for fast lookups
   - Index on email for unique constraints
   - Index on timestamps for sorting

2. **Caching Opportunities**
   - Cache support resources (not frequently updated)
   - Cache countries list
   - Session-based caching for tokens

3. **Query Optimization**
   - Select only needed fields
   - Pagination for large results
   - Aggregate queries for analytics

4. **Connection Pooling**
   - MongoDB connection pooling
   - Reuse connections
   - Graceful shutdown

## Monitoring & Logging

```
Server Logs
├─ Startup messages
├─ Database connection status
├─ Request logs (optional middleware)
├─ Error logs with stack traces
└─ Performance metrics

Client Errors (Firebase, Sentry optional)
├─ Unhandled errors
├─ API failures
├─ Performance metrics
└─ User session tracking
```

## Scaling Considerations

For large-scale deployment:

1. **Horizontal Scaling**
   - Load balancer in front of servers
   - Multiple backend instances
   - Session management (JWT stateless)

2. **Database Scaling**
   - MongoDB replication
   - Sharding for large datasets
   - Read replicas for queries

3. **Caching Layer**
   - Redis for session/token caching
   - CDN for static resources
   - Message queue for async processing

4. **Microservices (Future)**
   - Separate auth service
   - Separate testimony service
   - Separate messaging service
   - Event-driven architecture
