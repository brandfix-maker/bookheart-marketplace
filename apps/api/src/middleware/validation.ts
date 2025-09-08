import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { ApiResponse } from '@bookheart/shared';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        
        error.errors.forEach((err) => {
          const field = err.path.join('.');
          if (!errors[field]) {
            errors[field] = [];
          }
          errors[field].push(err.message);
        });

        res.status(400).json({
          success: false,
          error: 'Validation failed',
          errors,
        });
        return;
      }
      
      next(error);
    }
  };
};

// Validate query parameters
export const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        
        error.errors.forEach((err) => {
          const field = err.path.join('.');
          if (!errors[field]) {
            errors[field] = [];
          }
          errors[field].push(err.message);
        });

        res.status(400).json({
          success: false,
          error: 'Invalid query parameters',
          errors,
        });
        return;
      }
      
      next(error);
    }
  };
};

// Validate params
export const validateParams = (schema: ZodSchema) => {
  return async (req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        
        error.errors.forEach((err) => {
          const field = err.path.join('.');
          if (!errors[field]) {
            errors[field] = [];
          }
          errors[field].push(err.message);
        });

        res.status(400).json({
          success: false,
          error: 'Invalid parameters',
          errors,
        });
        return;
      }
      
      next(error);
    }
  };
};
