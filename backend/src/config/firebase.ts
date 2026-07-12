import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

export const initializeFirebase = (): void => {
  try {
    if (admin.apps.length > 0) {
      console.log('✓ Firebase Admin SDK already initialized');
      return;
    }

    let serviceAccount;

    // Try to load from environment variable file path
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const keyPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      if (fs.existsSync(keyPath)) {
        const keyFile = fs.readFileSync(keyPath, 'utf8');
        serviceAccount = JSON.parse(keyFile);
      }
    }

    // Fallback to environment variables
    if (!serviceAccount) {
      serviceAccount = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || 'key-id',
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID || 'client-id',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL || '',
      };
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });

    console.log('✓ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('✗ Firebase initialization error:', error);
    console.warn('Firebase Auth will not be available. Set up Firebase credentials in .env');
  }
};

export default admin;
