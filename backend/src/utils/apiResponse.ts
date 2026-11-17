import type { Response } from 'express';
import type { ApiResponse } from '../types/api';

export function sendOk<T>(res: Response, status: number, data: T, message: string): void {
  const body: ApiResponse<T> = { success: true, data, message, error: null };
  res.status(status).json(body);
}

export function sendFail(res: Response, status: number, error: string, message: string): void {
  const body: ApiResponse<null> = { success: false, data: null, message, error };
  res.status(status).json(body);
}
