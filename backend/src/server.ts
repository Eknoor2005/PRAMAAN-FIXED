import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database.js';
import { initializeFirebase } from './config/firebase.js';
import { errorHandler } from './middleware/error.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import testimonyRoutes from './routes/testimony.routes.js';
import evidenceRoutes from './routes/evidence.routes.js';
import casesRoutes from './routes/cases.routes.js';
import messagingRoutes from './routes/messaging.routes.js';
import supportRoutes from './routes/support.routes.js';
import translationRoutes from './routes/translation.routes.js';
import firebaseRoutes from './routes/firebase.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Login rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts from this IP, please try again later.',
});

app.use('/api/', generalLimiter);
app.use('/api/auth/', loginLimiter);
app.use('/api/auth/firebase/', loginLimiter);

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth/firebase', firebaseRoutes);
app.use('/api/testimonies', testimonyRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/messages', messagingRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/translation', translationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    statusCode: 404,
  });
});

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    initializeFirebase();
    app.listen(PORT, () => {
      console.log(`✓ PRAMAAN Backend running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
