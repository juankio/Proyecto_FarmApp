import type { NextFunction, Request, Response } from 'express';
import { ZodError, type ZodTypeAny } from 'zod';
import { AppError } from '../utils/AppError';

type Schemas = { body?: ZodTypeAny; query?: ZodTypeAny; params?: ZodTypeAny };

export function validate(schemas: Schemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.validated = {
        body: schemas.body ? schemas.body.parse(req.body) : req.body,
        query: schemas.query ? schemas.query.parse(req.query) : req.query,
        params: schemas.params ? schemas.params.parse(req.params) : req.params,
      };
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const detalle = error.issues
          .map((issue) => `${issue.path.join('.') || 'valor'}: ${issue.message}`)
          .join('; ');
        next(new AppError(400, 'VALIDATION_ERROR', detalle));
        return;
      }
      next(error);
    }
  };
}
