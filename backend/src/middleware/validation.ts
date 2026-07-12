import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';

/**
 * Validation middleware factory
 */
export const validateRequest =
  (schema: any) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      res.status(400).json({
        success: false,
        error: 'Validation failed',
        statusCode: 400,
        details: errors,
      });
      return;
    }

    req.body = value;
    next();
  };
