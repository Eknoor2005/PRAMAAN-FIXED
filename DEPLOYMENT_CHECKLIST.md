# PRAMAAN - Deployment Checklist

## Pre-Deployment Security Audit

### Backend Security Checklist

- [ ] **JWT Secret**
  - [ ] Generated strong random value (32+ bytes)
  - [ ] Different for staging and production
  - [ ] Not committed to Git
  - [ ] Command: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

- [ ] **Database**
  - [ ] MongoDB Atlas cluster created
  - [ ] Admin user configured
  - [ ] Connection string secured
  - [ ] Network access restricted (IP whitelist)
  - [ ] Automated backups enabled
  - [ ] Database encryption enabled

- [ ] **Environment Variables**
  - [ ] PORT set correctly
  - [ ] MONGODB_URI uses strong credentials
  - [ ] JWT_SECRET is production value
  - [ ] CORS_ORIGIN updated to production frontend URL
  - [ ] NODE_ENV set to "production"
  - [ ] All secrets removed from code

- [ ] **CORS & Headers**
  - [ ] CORS_ORIGIN matches frontend domain only
  - [ ] No wildcard (*) in production
  - [ ] Helmet.js headers enabled
  - [ ] HTTPS enforced

- [ ] **Rate Limiting**
  - [ ] Configured appropriately for expected traffic
  - [ ] Tested under load
  - [ ] Monitoring enabled

- [ ] **API Security**
  - [ ] All endpoints require authentication (except public)
  - [ ] Role-based access verified
  - [ ] Input validation active
  - [ ] Output sanitization enabled
  - [ ] Error messages don't expose internals

### Frontend Security Checklist

- [ ] **Environment Variables**
  - [ ] NEXT_PUBLIC_API_URL points to production backend
  - [ ] No sensitive data in public variables
  - [ ] .env.local not committed

- [ ] **Authentication**
  - [ ] Tokens stored securely (HTTP-only cookies preferred)
  - [ ] Token refresh implemented
  - [ ] Logout clears tokens
  - [ ] Session timeout implemented

- [ ] **API Calls**
  - [ ] All requests include Authorization header
  - [ ] HTTPS enforced in production
  - [ ] Error handling displays user-friendly messages
  - [ ] No sensitive data logged

- [ ] **Content Security**
  - [ ] No XSS vulnerabilities
  - [ ] CSRF tokens implemented (if needed)
  - [ ] Sanitized user input
  - [ ] Secure headers configured

## Deployment Steps

### Step 1: Backend Deployment

#### Option A: Heroku
```bash
cd backend

# Create Heroku app
heroku create pramaan-backend

# Add MongoDB Atlas URI
heroku config:set MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/pramaan"

# Set JWT Secret
heroku config:set JWT_SECRET="your_generated_secret"

# Set CORS Origin
heroku config:set CORS_ORIGIN="https://your-frontend.com"

# Set environment
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

#### Option B: Vercel
```bash
cd backend

# Deploy
vercel deploy --prod

# Configure environment variables in Vercel dashboard
# Set: MONGODB_URI, JWT_SECRET, CORS_ORIGIN, NODE_ENV
```

#### Option C: Docker + Cloud Platform (AWS, GCP, Azure)
```bash
# Build image
docker build -t pramaan-backend:latest .

# Tag for registry
docker tag pramaan-backend:latest registry/pramaan-backend:latest

# Push to registry
docker push registry/pramaan-backend:latest

# Deploy container to platform
# (AWS ECS, Google Cloud Run, Azure Container Instances, etc.)
```

#### Option D: Traditional VPS (AWS EC2, DigitalOcean)
```bash
# SSH into server
ssh user@server.com

# Clone repository
git clone https://github.com/your-repo/pramaan.git
cd pramaan/backend

# Install dependencies
npm install

# Build TypeScript
npm run build

# Install PM2 globally
npm install -g pm2

# Create .env file with production values
nano .env

# Start application with PM2
pm2 start dist/server.js --name "pramaan-api"

# Save PM2 config to restart on reboot
pm2 save
pm2 startup

# View logs
pm2 logs pramaan-api
```

### Step 2: Frontend Deployment

#### Vercel (Recommended)
```bash
# From project root (not backend folder)
vercel deploy --prod

# Configure environment variable
# Set NEXT_PUBLIC_API_URL to production backend URL
```

#### Other Platforms
```bash
# Build
npm run build

# Deploy the .next folder to your hosting provider
```

### Step 3: Post-Deployment Verification

#### Backend Tests
```bash
# Test health check
curl https://your-backend-url/health

# Test signup
curl -X POST https://your-backend-url/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# Test login
curl -X POST https://your-backend-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

#### Frontend Tests
1. Open https://your-frontend-url
2. Test signup flow
3. Test login flow
4. Test authenticated endpoints
5. Check browser console for errors
6. Verify API calls use production URL

#### Database Tests
```bash
# Connect to MongoDB Atlas
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/pramaan"

# Verify collections
show collections

# Check records
db.users.findOne()
db.testimonies.findOne()
```

## Production Configuration

### Backend Environment Variables (Production)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:secure_password@cluster.mongodb.net/pramaan?retryWrites=true&w=majority
JWT_SECRET=your_very_long_random_secret_key_32_bytes_minimum
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CORS_ORIGIN=https://your-frontend-domain.com
ENCRYPTION_ALGORITHM=aes-256-cbc
MAX_FILE_SIZE=52428800
```

### Frontend Environment Variables (Production)
```env
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com/api
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
```

## Monitoring & Maintenance

### Set Up Monitoring
- [ ] Backend uptime monitoring (Uptime Robot, Pingdom)
- [ ] Error tracking (Sentry, LogRocket)
- [ ] Performance monitoring (New Relic, DataDog)
- [ ] Database monitoring (MongoDB alerts)
- [ ] Server logs (CloudWatch, ELK Stack)

### Regular Maintenance
- [ ] Daily: Check error logs
- [ ] Weekly: Review database size
- [ ] Monthly: Check for security updates
- [ ] Quarterly: Penetration testing
- [ ] Yearly: Security audit

### Backup Strategy
- [ ] Enable MongoDB automated backups
- [ ] Set retention to 30+ days
- [ ] Test restore procedures
- [ ] Document backup location
- [ ] Encrypt backups at rest

## DNS & Domain Setup

### Domain Configuration
- [ ] Purchase domain name
- [ ] Configure DNS records:
  ```
  Frontend: points to Vercel/hosting provider
  Backend: points to Heroku/server IP
  API subdomain: api.yourdomain.com → backend
  ```
- [ ] Enable SSL/TLS certificates
- [ ] Configure email (for future notifications)

### SSL/TLS Setup
- [ ] Enable auto-renewing SSL certificates
- [ ] Test SSL configuration (https://www.ssllabs.com/)
- [ ] Redirect HTTP to HTTPS
- [ ] Configure HSTS headers

## Performance Optimization

### Backend Optimization
- [ ] Enable gzip compression
- [ ] Set appropriate cache headers
- [ ] Optimize MongoDB queries
- [ ] Add database indexes
- [ ] Monitor response times

### Frontend Optimization
- [ ] Enable code splitting
- [ ] Optimize images
- [ ] Implement caching strategy
- [ ] Minify CSS/JS
- [ ] Use CDN for assets

## Security Hardening

### Additional Security Measures
- [ ] Enable two-factor authentication for admin access
- [ ] Implement API key rotation schedule
- [ ] Set up database access logs
- [ ] Enable WAF (Web Application Firewall)
- [ ] Configure DDoS protection
- [ ] Regular security patches
- [ ] Penetration testing

### Data Protection
- [ ] Enable database encryption
- [ ] Encrypt backups
- [ ] Implement data retention policies
- [ ] Document data handling procedures
- [ ] Set up GDPR compliance (if needed)

## Rollback Plan

In case of issues:

```bash
# Rollback Backend
git revert <commit-hash>
npm run build
# Redeploy

# Rollback Frontend
git revert <commit-hash>
npm run build
# Redeploy

# Database Rollback
# Restore from backup in MongoDB Atlas
```

## Documentation Updates

- [ ] Update API documentation with production URLs
- [ ] Document deployment procedures
- [ ] Create runbook for common issues
- [ ] Update team on new procedures
- [ ] Archive old documentation

## Communication

- [ ] Notify stakeholders of deployment
- [ ] Announce downtime if required
- [ ] Send post-deployment status update
- [ ] Document any issues encountered
- [ ] Schedule post-mortem if needed

## Success Criteria

- [ ] All endpoints respond with 200/correct status codes
- [ ] Authentication flow works end-to-end
- [ ] Database operations succeed
- [ ] Encryption/decryption works correctly
- [ ] Rate limiting active
- [ ] CORS properly configured
- [ ] SSL/TLS working
- [ ] No errors in logs
- [ ] Performance acceptable
- [ ] Uptime > 99%

---

## Quick Deployment Reference

### Fastest Way (Vercel + Heroku)
```bash
# Backend on Heroku (5 mins)
cd backend
heroku create pramaan-api
heroku config:set MONGODB_URI="..." JWT_SECRET="..." CORS_ORIGIN="..."
git push heroku main

# Frontend on Vercel (3 mins)
vercel deploy --prod
# Set NEXT_PUBLIC_API_URL to Heroku URL

# Total: ~10 minutes
```

---

## Support Contacts

- MongoDB Support: https://support.mongodb.com
- Heroku Support: https://help.heroku.com
- Vercel Support: https://vercel.com/support
- Your Team: [email/slack]

---

**Mark each item as complete before launching to production! ✅**
