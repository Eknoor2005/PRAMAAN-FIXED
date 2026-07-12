import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { AuthenticatedRequest } from '../types/index.js';
import { Response, NextFunction } from 'express';

export class AuthService {
  /**
   * Hash password with bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(password, salt);
  }

  /**
   * Compare password with hashed password
   */
  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcryptjs.compare(password, hashedPassword);
  }

  /**
   * Generate JWT token
   */
  static generateAccessToken(
    userId: string,
    email: string,
    role: string,
    publicKey?: string
  ): string {
    return jwt.sign(
      {
        userId,
        email,
        role,
        publicKey,
      },
      process.env.JWT_SECRET || 'secret',
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
      }
    );
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(userId: string): string {
    return jwt.sign(
      {
        userId,
      },
      process.env.JWT_SECRET || 'secret',
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
      }
    );
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

/**
 * Middleware to authenticate requests
 */
export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'No token provided',
        statusCode: 401,
      });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = AuthService.verifyToken(token);

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      publicKey: decoded.publicKey,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token',
      statusCode: 401,
    });
  }
};

/**
 * Middleware to check user role
 */
export const roleMiddleware =
  (allowedRoles: string[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        statusCode: 403,
      });
      return;
    }
    next();
  };
