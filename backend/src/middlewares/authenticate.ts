import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { verifyToken } from '../utils/token';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.header('Authorization');
  if (!header?.startsWith('Bearer ')) {
    next(new AppError(401, 'NO_AUTORIZADO', 'Se requiere un token de acceso'));
    return;
  }
  try {
    const payload = verifyToken(header.slice(7));
    req.usuario = { id: payload.sub, rol: payload.rol };
    next();
  } catch {
    next(new AppError(401, 'TOKEN_INVALIDO', 'Token inválido o vencido'));
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (req.usuario?.rol !== 'admin') {
    next(new AppError(403, 'ROL_INSUFICIENTE', 'Se requiere rol de administrador'));
    return;
  }
  next();
}
