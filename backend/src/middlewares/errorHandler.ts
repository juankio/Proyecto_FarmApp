import type { ErrorRequestHandler } from 'express';
import { sendFail } from '../utils/apiResponse';
import { AppError } from '../utils/AppError';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    sendFail(res, error.status, error.code, error.message);
    return;
  }
  console.error('[error]', error);
  sendFail(res, 500, 'INTERNAL_ERROR', 'Error interno');
};
