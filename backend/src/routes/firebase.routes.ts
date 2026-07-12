import express from 'express';
import { FirebaseController } from '../controllers/firebase.controller.js';

const router = express.Router();

// Firebase authentication routes
router.post('/signup', FirebaseController.firebaseSignup);
router.post('/login', FirebaseController.firebaseLogin);
router.post('/social', FirebaseController.firebaseSocialAuth);
router.post('/verify', FirebaseController.verifyToken);

export default router;
