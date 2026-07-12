import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { FirebaseService } from '../services/firebase.service.js';
import jwt from 'jsonwebtoken';

export class FirebaseController {
  static async firebaseSignup(req: AuthenticatedRequest, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'Missing Firebase ID token',
          statusCode: 401,
        });
      }

      const { firstName, lastName, authMethod } = req.body;

      if (!authMethod) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          statusCode: 400,
        });
      }

      // Verify the token server-side instead of trusting client-supplied uid/email —
      // otherwise anyone could POST an arbitrary firebaseUid/email pair and create an account.
      const decodedToken = await FirebaseService.verifyIdToken(authHeader.substring(7));
      const firebaseUid = decodedToken.uid;
      const email = decodedToken.email;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Firebase account has no email on file',
          statusCode: 400,
        });
      }

      const user = await FirebaseService.createOrUpdateUser(
        firebaseUid,
        email,
        firstName,
        lastName,
        authMethod
      );

      // Generate JWT token for PRAMAAN
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          role: user.role,
          firebaseUid: user.firebaseUid,
        },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

      // Set HTTP-only cookies
      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(201).json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            authMethod: user.authMethod,
          },
          accessToken: token,
        },
        message: 'Account created successfully',
        statusCode: 201,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      return res.status(400).json({
        success: false,
        error: message,
        statusCode: 400,
      });
    }
  }

  static async firebaseLogin(req: AuthenticatedRequest, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'Missing Firebase ID token',
          statusCode: 401,
        });
      }

      const decodedToken = await FirebaseService.verifyIdToken(authHeader.substring(7));
      const firebaseUid = decodedToken.uid;

      const user = await FirebaseService.getUserByFirebaseUid(firebaseUid);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found. Please sign up first.',
          statusCode: 404,
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token for PRAMAAN
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          role: user.role,
          firebaseUid: user.firebaseUid,
        },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

      // Set HTTP-only cookies
      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            authMethod: user.authMethod,
          },
          accessToken: token,
        },
        message: 'Logged in successfully',
        statusCode: 200,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return res.status(400).json({
        success: false,
        error: message,
        statusCode: 400,
      });
    }
  }

  static async firebaseSocialAuth(req: AuthenticatedRequest, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'Missing Firebase ID token',
          statusCode: 401,
        });
      }

      const { firstName, lastName, authMethod, photoURL } = req.body;

      if (!authMethod) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          statusCode: 400,
        });
      }

      const decodedToken = await FirebaseService.verifyIdToken(authHeader.substring(7));
      const firebaseUid = decodedToken.uid;
      const email = decodedToken.email;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Firebase account has no email on file',
          statusCode: 400,
        });
      }

      const user = await FirebaseService.createOrUpdateUser(
        firebaseUid,
        email,
        firstName,
        lastName,
        authMethod as 'google' | 'github',
        photoURL
      );

      // Generate JWT token for PRAMAAN
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          role: user.role,
          firebaseUid: user.firebaseUid,
        },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

      // Set HTTP-only cookies
      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            authMethod: user.authMethod,
          },
          accessToken: token,
        },
        message: 'Authenticated successfully',
        statusCode: 200,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Social authentication failed';
      return res.status(400).json({
        success: false,
        error: message,
        statusCode: 400,
      });
    }
  }

  static async verifyToken(req: AuthenticatedRequest, res: Response) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'Missing or invalid authorization header',
          statusCode: 401,
        });
      }

      const idToken = authHeader.substring(7);
      const decodedToken = await FirebaseService.verifyIdToken(idToken);

      return res.status(200).json({
        success: true,
        data: { decodedToken },
        message: 'Token verified',
        statusCode: 200,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Token verification failed';
      return res.status(401).json({
        success: false,
        error: message,
        statusCode: 401,
      });
    }
  }
}
