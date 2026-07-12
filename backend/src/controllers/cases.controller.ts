import { Response } from 'express';
import { AuthenticatedRequest, ApiResponse, CaseFile } from '../types/index.js';
import { CaseFileModel } from '../models/CaseFile.js';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';

const createCaseSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  caseType: Joi.string()
    .valid('sexual-violence', 'domestic-abuse', 'trafficking', 'harassment', 'other')
    .required(),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium'),
  notes: Joi.string().optional(),
});

const updateCaseSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  status: Joi.string().valid('open', 'in-progress', 'closed', 'resolved').optional(),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical').optional(),
  notes: Joi.string().optional(),
  testimoniesId: Joi.array().items(Joi.string()).optional(),
  evidenceId: Joi.array().items(Joi.string()).optional(),
});

export class CaseController {
  /**
   * Create new case
   */
  static async createCase(
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

      const { title, description, caseType, priority, notes } = req.body;

      // Generate case number
      const caseNumber = `CASE-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

      const caseFile = new CaseFileModel({
        userId: req.user.userId,
        caseNumber,
        title,
        description,
        caseType,
        priority,
        notes,
        testimoniesId: [],
        evidenceId: [],
      });

      await caseFile.save();

      const response: ApiResponse<CaseFile> = {
        success: true,
        data: caseFile,
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
   * Get all cases for user
   */
  static async getUserCases(
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

      const cases = await CaseFileModel.find({
        $or: [
          { userId: req.user.userId },
          { assignedAdvocate: req.user.userId },
        ],
      });

      res.json({
        success: true,
        data: cases,
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
   * Get case by ID
   */
  static async getCase(
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
      const caseFile = await CaseFileModel.findById(id);

      if (!caseFile) {
        res.status(404).json({
          success: false,
          error: 'Case not found',
          statusCode: 404,
        });
        return;
      }

      // Check access
      if (
        caseFile.userId !== req.user.userId &&
        caseFile.assignedAdvocate !== req.user.userId &&
        req.user.role !== 'admin'
      ) {
        res.status(403).json({
          success: false,
          error: 'Unauthorized',
          statusCode: 403,
        });
        return;
      }

      res.json({
        success: true,
        data: caseFile,
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
   * Update case
   */
  static async updateCase(
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
      const { title, description, status, priority, notes, testimoniesId, evidenceId } =
        req.body;

      const caseFile = await CaseFileModel.findById(id);

      if (!caseFile) {
        res.status(404).json({
          success: false,
          error: 'Case not found',
          statusCode: 404,
        });
        return;
      }

      // Check ownership or advocate access
      if (caseFile.userId !== req.user.userId && caseFile.assignedAdvocate !== req.user.userId) {
        res.status(403).json({
          success: false,
          error: 'Unauthorized',
          statusCode: 403,
        });
        return;
      }

      // Update fields
      if (title) caseFile.title = title;
      if (description) caseFile.description = description;
      if (status) caseFile.status = status;
      if (priority) caseFile.priority = priority;
      if (notes) caseFile.notes = notes;
      if (testimoniesId) caseFile.testimoniesId = testimoniesId;
      if (evidenceId) caseFile.evidenceId = evidenceId;

      await caseFile.save();

      res.json({
        success: true,
        data: caseFile,
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
   * Delete case
   */
  static async deleteCase(
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
      const caseFile = await CaseFileModel.findById(id);

      if (!caseFile) {
        res.status(404).json({
          success: false,
          error: 'Case not found',
          statusCode: 404,
        });
        return;
      }

      // Check ownership
      if (caseFile.userId !== req.user.userId) {
        res.status(403).json({
          success: false,
          error: 'Unauthorized',
          statusCode: 403,
        });
        return;
      }

      await CaseFileModel.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Case deleted successfully',
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

export { createCaseSchema, updateCaseSchema };
