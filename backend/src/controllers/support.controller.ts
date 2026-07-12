import { Response } from 'express';
import { AuthenticatedRequest, ApiResponse, SupportResource } from '../types/index.js';
import { SupportResourceModel } from '../models/SupportResource.js';

export class SupportController {
  /**
   * Get support resources by country and category
   */
  static async getResources(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { country, category } = req.query;

      const query: any = { isVerified: true };

      if (country) query.country = country;
      if (category) query.category = category;

      const resources = await SupportResourceModel.find(query);

      res.json({
        success: true,
        data: resources,
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
   * Get resource by ID
   */
  static async getResource(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const resource = await SupportResourceModel.findById(id);

      if (!resource) {
        res.status(404).json({
          success: false,
          error: 'Resource not found',
          statusCode: 404,
        });
        return;
      }

      res.json({
        success: true,
        data: resource,
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
   * Get all countries with resources
   */
  static async getCountries(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const countries = await SupportResourceModel.distinct('country', {
        isVerified: true,
      });

      res.json({
        success: true,
        data: countries,
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
