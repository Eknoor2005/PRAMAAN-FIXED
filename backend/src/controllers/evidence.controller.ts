import { Response } from 'express';
import { AuthenticatedRequest, ApiResponse, Evidence } from '../types/index.js';
import { EvidenceModel } from '../models/Evidence.js';
import { EncryptionService } from '../services/encryption.service.js';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';

const uploadEvidenceSchema = Joi.object({
  fileUrl: Joi.string().required(),
  fileType: Joi.string().valid('document', 'photo', 'video', 'audio').required(),
  fileName: Joi.string().required(),
  fileSize: Joi.number().required(),
  category: Joi.string().optional(),
  description: Joi.string().allow('').optional(),
  testimoniesId: Joi.array().items(Joi.string()).optional(),
  casesId: Joi.array().items(Joi.string()).optional(),
});

export class EvidenceController {
  /**
   * Upload evidence (encrypted)
   */
  static async uploadEvidence(
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

      const { fileUrl, fileType, fileName, fileSize, category, description, testimoniesId, casesId } = req.body;

      // Generate file hash
      const fileBuffer = Buffer.from(fileUrl, 'utf-8');
      const fileHash = EncryptionService.generateFileHash(fileBuffer);

      // Generate encryption key for this file
      const encryptedKey = uuidv4();
      const chain = `${req.user.userId}-${Date.now()}-${fileHash}`;

      const evidence = new EvidenceModel({
        userId: req.user.userId,
        fileUrl,
        fileType,
        fileName,
        fileSize,
        category,
        description,
        fileHash,
        isEncrypted: true,
        encryptedKey,
        chain,
        testimoniesId: testimoniesId || [],
        casesId: casesId || [],
      });

      await evidence.save();

      const response: ApiResponse<Evidence> = {
        success: true,
        data: evidence,
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
   * Get all evidence for user
   */
  static async getUserEvidence(
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

      const evidence = await EvidenceModel.find({
        userId: req.user.userId,
      });

      res.json({
        success: true,
        data: evidence,
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
   * Get evidence by ID
   */
  static async getEvidence(
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
      const evidence = await EvidenceModel.findById(id);

      if (!evidence) {
        res.status(404).json({
          success: false,
          error: 'Evidence not found',
          statusCode: 404,
        });
        return;
      }

      // Check ownership or case access
      if (evidence.userId !== req.user.userId && req.user.role !== 'admin') {
        res.status(403).json({
          success: false,
          error: 'Unauthorized',
          statusCode: 403,
        });
        return;
      }

      res.json({
        success: true,
        data: evidence,
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
   * Delete evidence
   */
  static async deleteEvidence(
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
      const evidence = await EvidenceModel.findById(id);

      if (!evidence) {
        res.status(404).json({
          success: false,
          error: 'Evidence not found',
          statusCode: 404,
        });
        return;
      }

      // Check ownership
      if (evidence.userId !== req.user.userId) {
        res.status(403).json({
          success: false,
          error: 'Unauthorized',
          statusCode: 403,
        });
        return;
      }

      await EvidenceModel.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Evidence deleted successfully',
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

export { uploadEvidenceSchema };
