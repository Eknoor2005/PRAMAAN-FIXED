import { Response } from 'express';
import { AuthenticatedRequest, ApiResponse, Testimony } from '../types/index.js';
import { TestimonyModel } from '../models/Testimony.js';
import { EncryptionService } from '../services/encryption.service.js';
import Joi from 'joi';

const createTestimonySchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  content: Joi.string().required(),
  location: Joi.string().optional(),
  dateOfIncident: Joi.date().optional(),
});

const updateTestimonySchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  content: Joi.string().optional(),
  status: Joi.string().valid('draft', 'completed', 'submitted', 'verified').optional(),
  location: Joi.string().optional(),
  dateOfIncident: Joi.date().optional(),
});

export class TestimonyController {
  /**
   * Create new testimony (encrypted)
   */
  static async createTestimony(
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

      const { title, description, content, location, dateOfIncident } = req.body;

      // Generate encryption key
      const encryptionKey = Math.random().toString(36).substring(2);

      // Encrypt content
      const encryptedContent = EncryptionService.encryptData(content, encryptionKey);

      const testimony = new TestimonyModel({
        userId: req.user.userId,
        title,
        description,
        content: encryptedContent,
        location,
        dateOfIncident,
        encryptionKey,
        isEncrypted: true,
        status: 'draft',
      });

      await testimony.save();

      const response: ApiResponse<Partial<Testimony>> = {
        success: true,
        data: {
          _id: testimony._id as string,
          userId: testimony.userId,
          title: testimony.title,
          description: testimony.description,
          status: testimony.status,
          isEncrypted: testimony.isEncrypted,
          createdAt: testimony.createdAt,
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
   * Get all testimonies for user
   */
  static async getUserTestimonies(
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

      const testimonies = await TestimonyModel.find({
        userId: req.user.userId,
      }).select('-content -encryptionKey');

      res.json({
        success: true,
        data: testimonies,
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

  /**
   * Get testimony by ID (with decryption)
   */
  static async getTestimony(
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

      const { id } = req.params;
      const testimony = await TestimonyModel.findById(id);

      if (!testimony) {
        res.status(404).json({
          success: false,
          error: 'Testimony not found',
          statusCode: 404,
        });
        return;
      }

      // Check ownership
      if (testimony.userId !== req.user.userId && req.user.role !== 'admin') {
        res.status(403).json({
          success: false,
          error: 'Unauthorized',
          statusCode: 403,
        });
        return;
      }

      // Decrypt content
      const decryptedContent = EncryptionService.decryptData(
        testimony.content,
        testimony.encryptionKey
      );

      const response: ApiResponse<any> = {
        success: true,
        data: {
          ...testimony.toObject(),
          content: decryptedContent,
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
   * Update testimony
   */
  static async updateTestimony(
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

      const { id } = req.params;
      const { title, description, content, status, location, dateOfIncident } = req.body;

      const testimony = await TestimonyModel.findById(id);

      if (!testimony) {
        res.status(404).json({
          success: false,
          error: 'Testimony not found',
          statusCode: 404,
        });
        return;
      }

      // Check ownership
      if (testimony.userId !== req.user.userId) {
        res.status(403).json({
          success: false,
          error: 'Unauthorized',
          statusCode: 403,
        });
        return;
      }

      // Update fields
      if (title) testimony.title = title;
      if (description) testimony.description = description;
      if (content) {
        testimony.content = EncryptionService.encryptData(content, testimony.encryptionKey);
      }
      if (status) testimony.status = status;
      if (location) testimony.location = location;
      if (dateOfIncident) testimony.dateOfIncident = dateOfIncident;

      await testimony.save();

      res.json({
        success: true,
        data: testimony,
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

  /**
   * Delete testimony
   */
  static async deleteTestimony(
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

      const { id } = req.params;
      const testimony = await TestimonyModel.findById(id);

      if (!testimony) {
        res.status(404).json({
          success: false,
          error: 'Testimony not found',
          statusCode: 404,
        });
        return;
      }

      // Check ownership
      if (testimony.userId !== req.user.userId) {
        res.status(403).json({
          success: false,
          error: 'Unauthorized',
          statusCode: 403,
        });
        return;
      }

      await TestimonyModel.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Testimony deleted successfully',
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

export { createTestimonySchema, updateTestimonySchema };
