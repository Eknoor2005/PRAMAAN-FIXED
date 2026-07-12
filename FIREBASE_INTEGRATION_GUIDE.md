# Firebase Authentication Integration Guide for PRAMAAN

## Overview
This guide explains the Firebase Authentication integration with PRAMAAN, allowing survivors to choose between traditional email/password login and social authentication (Google, GitHub).

---

## Setup Instructions

### 1. Firebase Console Setup

#### Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and name it "PRAMAAN"
3. Enable Google Analytics (optional)
4. Create the project

#### Enable Authentication Methods
1. In Firebase Console, go to Authentication > Sign-in method
2. Enable these providers:
   - **Email/Password**: Click "Email/Password" and enable both "Email/password" and "Email link" options
   - **Google**: Click "Google", enter your support email and project public name
   - **GitHub**: Click "GitHub", enter your GitHub OAuth credentials from GitHub Developer Settings

#### Get Firebase Credentials
1. Go to Project Settings (gear icon)
2. Click "Service Accounts"
3. Click "Generate New Private Key" to download `serviceAccountKey.json`
4. Also copy the project configuration from "Web" tab for frontend variables

---

### 2. Frontend Setup

#### Environment Variables (.env.local)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_from_firebase
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### Install Dependencies
```bash
npm install firebase react-firebase-hooks
```

#### Integration Points
- **Firebase Config**: `/lib/firebase.ts` - Initializes Firebase with credentials
- **Auth Context**: `/context/firebase-auth-context.tsx` - Manages user state
- **Auth Options**: `/app/(auth)/auth-options/page.tsx` - Choose login method
- **Firebase Auth Forms**: `/app/(auth)/firebase/page.tsx` - Social & email login

---

### 3. Backend Setup

#### Environment Variables (.env)
```bash
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_SERVICE_ACCOUNT_JSON=/path/to/serviceAccountKey.json

# JWT Tokens
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-jwt-refresh-secret
```

#### Install Dependencies
```bash
npm install firebase-admin
```

#### Integration Points
- **Firebase Config**: `src/config/firebase.ts` - Initializes Firebase Admin SDK
- **Firebase Service**: `src/services/firebase.service.ts` - Token verification and user creation
- **Firebase Controller**: `src/controllers/firebase.controller.ts` - Auth endpoints
- **Firebase Routes**: `src/routes/firebase.routes.ts` - API endpoints

---

## Authentication Flow

### Email/Password Sign Up Flow
```
1. User visits /auth-options
2. Selects "Email & Password" → redirects to /firebase/signup
3. Enters email, password, name → submits form
4. Frontend creates Firebase account via createUserWithEmailAndPassword()
5. Gets Firebase ID token
6. Calls POST /api/auth/firebase/signup with ID token
7. Backend verifies token and creates PRAMAAN user account
8. Backend generates JWT tokens and sets HTTP-only cookies
9. User redirected to /dashboard
```

### Google Sign-In Flow
```
1. User visits /auth-options
2. Selects "Google Sign-In" → redirects to /firebase/login
3. Clicks "Continue with Google" button
4. Google login popup opens
5. After Google auth, frontend gets Firebase ID token
6. Calls POST /api/auth/firebase/social with ID token
7. Backend verifies token and creates/links PRAMAAN user
8. Backend generates JWT tokens and sets HTTP-only cookies
9. User redirected to /dashboard
```

### GitHub Sign-In Flow
```
Same as Google flow, but using GitHub provider and /api/auth/firebase/social endpoint
```

---

## API Endpoints

### POST /api/auth/firebase/signup
**Email/Password Sign Up**
- Body:
```json
{
  "firebaseUid": "firebase-uid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "authMethod": "firebase"
}
```
- Headers: `Authorization: Bearer <Firebase ID Token>`
- Response: User object + JWT access token

### POST /api/auth/firebase/login
**Email/Password Login**
- Body:
```json
{
  "firebaseUid": "firebase-uid",
  "email": "user@example.com"
}
```
- Headers: `Authorization: Bearer <Firebase ID Token>`
- Response: User object + JWT access token

### POST /api/auth/firebase/social
**Social Auth (Google/GitHub)**
- Body:
```json
{
  "firebaseUid": "firebase-uid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "authMethod": "google|github",
  "photoURL": "https://..."
}
```
- Headers: `Authorization: Bearer <Firebase ID Token>`
- Response: User object + JWT access token

### POST /api/auth/firebase/verify
**Verify Firebase Token**
- Headers: `Authorization: Bearer <Firebase ID Token>`
- Response: Decoded Firebase token data

---

## User Model Updates

Firebase fields added to User model:
```typescript
firebaseUid?: string;              // Firebase UID
authMethod: 'jwt' | 'firebase' | 'google' | 'github';  // Auth method used
linkedAuthMethods: string[];       // Methods linked to account
```

**Account Linking Flow:**
- User with email A signs up via Firebase
- Same user later signs in via Google (same email)
- System links both methods to the same account
- User can now use either method to log in

---

## Security Features

### Token Security
- Firebase ID tokens verified on backend before account creation
- JWT tokens with 15-minute expiry for short-lived access
- Refresh tokens with 7-day expiry for longer sessions
- HTTP-only cookies for token storage

### End-to-End Encryption
- All new Firebase users get RSA-2048 key pair generated
- User data encrypted with AES-256-CBC
- Encryption keys stored securely in database

### Password Requirements (Email/Password)
- Minimum 6 characters (Firebase default)
- No special requirements (can be customized in Firebase console)

### Social Auth Scopes
- **Google**: Profile, email
- **GitHub**: User email

---

## Testing

### Test Email/Password Sign Up
```bash
1. Visit http://localhost:3000
2. Click "Get Started"
3. Choose "Email & Password"
4. Fill form and click "Create Account"
5. Check MongoDB for new user with authMethod: "firebase"
```

### Test Google Sign-In
```bash
1. Visit http://localhost:3000
2. Click "Get Started"
3. Choose "Google Sign-In"
4. Click "Continue with Google"
5. Sign in with Google account
6. Check MongoDB for new user with authMethod: "google"
```

### Test GitHub Sign-In
```bash
1. Visit http://localhost:3000
2. Click "Get Started"
3. Choose "GitHub Sign-In"
4. Click "Continue with GitHub"
5. Authorize the app
6. Check MongoDB for new user with authMethod: "github"
```

### Test Account Linking
```bash
1. Sign up via Google with email: test@example.com
2. Sign out
3. Try signing in via Email/Password with same email
4. Should show that user already exists
5. After fixing, same user should have linkedAuthMethods: ["google", "firebase"]
```

---

## Troubleshooting

### Issue: "Firebase configuration not found"
- Check `.env.local` has all Firebase variables
- Reload dev server after adding variables
- Ensure variables are prefixed with `NEXT_PUBLIC_`

### Issue: "Failed to verify Firebase token"
- Check Firebase Admin SDK initialized in backend
- Verify `serviceAccountKey.json` has correct permissions
- Ensure FIREBASE_PROJECT_ID matches Firebase console

### Issue: "User not found" after Firebase auth
- Check backend received the ID token
- Verify `/api/auth/firebase/signup` endpoint exists
- Check MongoDB has user with firebaseUid

### Issue: Google/GitHub login popup blocked
- Check browser pop-up settings
- Ensure domain is authorized in Firebase console
- Check CORS settings allow social auth requests

### Issue: JWT tokens not set in cookies
- Verify `NODE_ENV=production` in backend for secure cookies
- Check backend cookie settings match frontend expectations
- Ensure CORS credentials enabled on both sides

---

## Production Deployment

### Before Going Live
1. Set `NODE_ENV=production` in backend .env
2. Update Firebase settings to production URLs
3. Enable custom domain in Firebase console
4. Set up HTTPS/SSL certificates
5. Configure CORS to only allow your domain
6. Rotate JWT secrets
7. Set up database backups
8. Enable Firebase security rules

### Firebase Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Environment Variables
- Keep private keys in secure vaults (Vercel, AWS Secrets Manager)
- Never commit `.env` files to git
- Use different projects for dev/staging/production
- Rotate secrets regularly

---

## References

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [OAuth 2.0 Guide](https://oauth.net/2/)
- [JWT.io](https://jwt.io/)

---

## Support

For issues or questions:
1. Check Firebase Console logs
2. Review backend API logs
3. Check browser DevTools Network tab
4. Verify all environment variables are set
5. Test API endpoints with Postman/Insomnia
