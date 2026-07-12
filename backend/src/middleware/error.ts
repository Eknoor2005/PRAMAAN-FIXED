import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';

/**
 * Global error handler middleware
 */
export const errorHandler = (
  error: any,
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  const response: ApiResponse<null> = {
    success: false,
    error: error.message || 'Internal server error',
    statusCode: error.statusCode || 500,
  };

  res.status(response.statusCode).json(response);
};

/**
 * Middleware to handle async route handlers
 */
export const asyncHandler =
  (fn: Function) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
