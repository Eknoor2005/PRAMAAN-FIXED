# PRAMAAN Backend - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication Header
All protected endpoints require:
```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/signup`

Register a new user account.

**Request Body:**
```json
{
  "email": "survivor@example.com",
  "password": "securePassword123!",
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "survivor",
  "phone": "+1234567890",
  "country": "India"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "survivor@example.com",
      "firstName": "Jane",
      "lastName": "Doe",
      "role": "survivor",
      "publicKey": "-----BEGIN PUBLIC KEY-----\n..."
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  },
  "statusCode": 201
}
```

**Validation Rules:**
- Email must be valid and unique
- Password minimum 8 characters
- Role must be 'survivor' or 'advocate'
- FirstName and LastName required

---

### 2. Login User
**POST** `/auth/login`

Authenticate and receive tokens.

**Request Body:**
```json
{
  "email": "survivor@example.com",
  "password": "securePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "survivor@example.com",
      "firstName": "Jane",
      "lastName": "Doe",
      "role": "survivor",
      "publicKey": "-----BEGIN PUBLIC KEY-----\n..."
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  },
  "statusCode": 200
}
```

**Error (401):**
```json
{
  "success": false,
  "error": "Invalid credentials",
  "statusCode": 401
}
```

---

### 3. Refresh Access Token
**POST** `/auth/refresh`

Get a new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc..."
  },
  "statusCode": 200
}
```

---

### 4. Get Current User
**GET** `/auth/me`

Get authenticated user details.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "survivor@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "role": "survivor",
    "phone": "+1234567890",
    "country": "India",
    "publicKey": "-----BEGIN PUBLIC KEY-----\n...",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "lastLogin": "2024-01-15T10:30:00.000Z"
  },
  "statusCode": 200
}
```

---

## Testimony Endpoints

### 1. Create Testimony
**POST** `/testimonies`

Create a new testimony (encrypted).

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "My Experience",
  "description": "A detailed description of what happened",
  "content": "Full testimony text with all details...",
  "location": "New Delhi, India",
  "dateOfIncident": "2023-06-15T00:00:00Z"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "title": "My Experience",
    "description": "A detailed description...",
    "status": "draft",
    "isEncrypted": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "statusCode": 201
}
```

---

### 2. Get All Testimonies
**GET** `/testimonies`

Get all testimonies for authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "title": "My Experience",
      "description": "A detailed description...",
      "status": "draft",
      "isEncrypted": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "statusCode": 200
}
```

---

### 3. Get Testimony by ID
**GET** `/testimonies/:id`

Get specific testimony with decrypted content.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "title": "My Experience",
    "description": "A detailed description...",
    "content": "Full testimony text (DECRYPTED)...",
    "status": "draft",
    "isEncrypted": true,
    "location": "New Delhi, India",
    "dateOfIncident": "2023-06-15T00:00:00Z",
    "timeline": [],
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "statusCode": 200
}
```

---

### 4. Update Testimony
**PUT** `/testimonies/:id`

Update testimony (only creator).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "status": "completed",
  "content": "Updated testimony text..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated testimony */ },
  "statusCode": 200
}
```

---

### 5. Delete Testimony
**DELETE** `/testimonies/:id`

Delete testimony (only creator).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Testimony deleted successfully",
  "statusCode": 200
}
```

---

## Evidence Endpoints

### 1. Upload Evidence
**POST** `/evidence`

Upload and encrypt evidence file.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "fileUrl": "https://...",
  "fileType": "document",
  "fileName": "police_report.pdf",
  "fileSize": 245678,
  "testimoniesId": ["507f1f77bcf86cd799439012"],
  "casesId": []
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "fileUrl": "https://...",
    "fileType": "document",
    "fileName": "police_report.pdf",
    "fileSize": 245678,
    "fileHash": "sha256hash...",
    "isEncrypted": true,
    "uploadedAt": "2024-01-15T10:30:00.000Z"
  },
  "statusCode": 201
}
```

---

### 2. Get All Evidence
**GET** `/evidence`

Get all evidence for user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "userId": "507f1f77bcf86cd799439011",
      "fileName": "police_report.pdf",
      "fileType": "document"
      /* ... */
    }
  ],
  "statusCode": 200
}
```

---

### 3. Get Evidence by ID
**GET** `/evidence/:id`

Get specific evidence details.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* evidence object */ },
  "statusCode": 200
}
```

---

### 4. Delete Evidence
**DELETE** `/evidence/:id`

Delete evidence file.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Evidence deleted successfully",
  "statusCode": 200
}
```

---

## Case Endpoints

### 1. Create Case
**POST** `/cases`

Create a new case file.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "Case Title",
  "description": "Case description...",
  "caseType": "sexual-violence",
  "priority": "high",
  "notes": "Additional notes..."
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439011",
    "caseNumber": "CASE-1705315800000-ABC123",
    "title": "Case Title",
    "status": "open",
    "caseType": "sexual-violence",
    "priority": "high"
  },
  "statusCode": 201
}
```

---

### 2. Get All Cases
**GET** `/cases`

Get all cases for user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [ /* case objects */ ],
  "statusCode": 200
}
```

---

### 3. Get Case by ID
**GET** `/cases/:id`

Get specific case details.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* case object */ },
  "statusCode": 200
}
```

---

### 4. Update Case
**PUT** `/cases/:id`

Update case information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "status": "in-progress",
  "priority": "critical",
  "notes": "Updated notes...",
  "testimoniesId": ["507f1f77bcf86cd799439012"],
  "evidenceId": ["507f1f77bcf86cd799439013"]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated case */ },
  "statusCode": 200
}
```

---

### 5. Delete Case
**DELETE** `/cases/:id`

Delete case file.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Case deleted successfully",
  "statusCode": 200
}
```

---

## Messaging Endpoints

### 1. Send Message
**POST** `/messages/send`

Send encrypted message to another user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "conversationId": "507f1f77bcf86cd799439015",
  "receiverId": "507f1f77bcf86cd799439016",
  "content": "Message content here..."
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "messageId": "507f1f77bcf86cd799439017",
    "conversationId": "507f1f77bcf86cd799439015",
    "sentAt": "2024-01-15T10:30:00.000Z"
  },
  "statusCode": 201
}
```

---

### 2. Get Conversations
**GET** `/messages/conversations`

Get all conversations for user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "participants": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439016"],
      "lastMessage": {
        "content": "Last message preview...",
        "senderId": "507f1f77bcf86cd799439011",
        "timestamp": "2024-01-15T10:30:00.000Z"
      }
    }
  ],
  "statusCode": 200
}
```

---

### 3. Get Conversation Messages
**GET** `/messages/conversations/:conversationId/messages`

Get messages in a conversation.

**Query Parameters:**
- `limit` (optional, default: 50)
- `skip` (optional, default: 0)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439017",
      "conversationId": "507f1f77bcf86cd799439015",
      "senderId": "507f1f77bcf86cd799439011",
      "receiverId": "507f1f77bcf86cd799439016",
      "content": "Message content (encrypted)...",
      "isRead": true,
      "readAt": "2024-01-15T10:31:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "statusCode": 200
}
```

---

### 4. Get Unread Count
**GET** `/messages/unread-count`

Get count of unread messages.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "unreadCount": 5
  },
  "statusCode": 200
}
```

---

## Support Resources Endpoints

### 1. Get Resources
**GET** `/support`

Get support resources (filtered by country/category).

**Query Parameters:**
- `country` (optional): Filter by country
- `category` (optional): 'hotline', 'counseling', 'legal', 'housing', 'health', 'safety'

**Example:**
```
GET /support?country=India&category=hotline
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439018",
      "title": "National Helpline",
      "description": "24/7 helpline for survivors...",
      "category": "hotline",
      "country": "India",
      "phoneNumber": "+91-11-4141-4141",
      "website": "https://example.com",
      "isVerified": true
    }
  ],
  "statusCode": 200
}
```

---

### 2. Get Countries
**GET** `/support/countries`

Get list of countries with resources.

**Response (200):**
```json
{
  "success": true,
  "data": ["India", "Nigeria", "Kenya", "USA", "Canada"],
  "statusCode": 200
}
```

---

### 3. Get Resource by ID
**GET** `/support/:id`

Get specific support resource.

**Response (200):**
```json
{
  "success": true,
  "data": { /* resource object */ },
  "statusCode": 200
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation failed",
  "statusCode": 400,
  "details": [
    {
      "field": "email",
      "message": "\"email\" must be a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Invalid token",
  "statusCode": 401
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Insufficient permissions",
  "statusCode": 403
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found",
  "statusCode": 404
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "statusCode": 500
}
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create Testimony
```bash
curl -X POST http://localhost:5000/api/testimonies \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Testimony",
    "description": "Description",
    "content": "Full testimony content"
  }'
```

---

## Rate Limiting

All `/api/*` endpoints are rate limited to **100 requests per 15 minutes** per IP address.

Response when limit exceeded:
```
429 Too Many Requests
"Too many requests from this IP, please try again later."
```

---

## Support

For issues or questions, contact the PRAMAAN team.
