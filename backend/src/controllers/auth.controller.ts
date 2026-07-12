import { Response } from 'express';
import { AuthenticatedRequest, ApiResponse, User } from '../types/index.js';
import { UserModel } from '../models/User.js';
import { AuthService } from '../services/auth.service.js';
import { EncryptionService } from '../services/encryption.service.js';
import Joi from 'joi';

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  role: Joi.string().valid('survivor', 'advocate').default('survivor'),
  phone: Joi.string().optional(),
  country: Joi.string().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export class AuthController {
  /**
   * Register a new user
   */
  static async signup(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { email, password, firstName, lastName, role, phone, country } = req.body;

      // Check if user exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          error: 'User already exists',
          statusCode: 400,
        });
        return;
      }

      // Hash password
      const hashedPassword = await AuthService.hashPassword(password);

      // Generate RSA key pair
      const { publicKey, privateKey } = EncryptionService.generateKeyPair();

      // Create user
      const user = new UserModel({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        phone,
        country,
        publicKey,
        privateKeyEncrypted: privateKey,
        encryptionAlgorithm: 'rsa-2048',
        isEmailVerified: false,
        isPhoneVerified: false,
      });

      await user.save();

      // Generate tokens
      const accessToken = AuthService.generateAccessToken(
        user._id.toString(),
        user.email,
        user.role,
        user.publicKey
      );
      const refreshToken = AuthService.generateRefreshToken(user._id.toString());

      const response: ApiResponse<{
        user: Partial<User>;
        accessToken: string;
        refreshToken: string;
      }> = {
        success: true,
        data: {
          user: {
            _id: user._id as string,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            publicKey: user.publicKey,
          },
          accessToken,
          refreshToken,
        },
        statusCode: 201,
      };

      res.status(201).json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        statusCode: 500,
      });
    }
  }

  /**
   * Login user
   */
  static async login(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await UserModel.findOne({ email });
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials',
          statusCode: 401,
        });
        return;
      }

      // Compare password
      const isPasswordValid = await AuthService.comparePassword(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials',
          statusCode: 401,
        });
        return;
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate tokens
      const accessToken = AuthService.generateAccessToken(
        user._id.toString(),
        user.email,
        user.role,
        user.publicKey
      );
      const refreshToken = AuthService.generateRefreshToken(user._id.toString());

      const response: ApiResponse<{
        user: Partial<User>;
        accessToken: string;
        refreshToken: string;
      }> = {
        success: true,
        data: {
          user: {
            _id: user._id as string,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            publicKey: user.publicKey,
          },
          accessToken,
          refreshToken,
        },
        statusCode: 200,
      };

      res.json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        statusCode: 500,
      });
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          error: 'Refresh token required',
          statusCode: 400,
        });
        return;
      }

      const decoded = AuthService.verifyToken(refreshToken);
      const user = await UserModel.findById(decoded.userId);

      if (!user) {
        res.status(401).json({
          success: false,
          error: 'User not found',
          statusCode: 401,
        });
        return;
      }

      const accessToken = AuthService.generateAccessToken(
        user._id.toString(),
        user.email,
        user.role,
        user.publicKey
      );

      res.json({
        success: true,
        data: { accessToken },
        statusCode: 200,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: 'Invalid refresh token',
        statusCode: 401,
      });
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
          statusCode: 401,
        });
        return;
      }

      const user = await UserModel.findById(req.user.userId);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
          statusCode: 404,
        });
        return;
      }

      res.json({
        success: true,
        data: {
          _id: user._id as string,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone,
          country: user.country,
          publicKey: user.publicKey,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          lastLogin: user.lastLogin,
        },
        statusCode: 200,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        statusCode: 500,
      });
    }
  }
}

export { signupSchema, loginSchema };
