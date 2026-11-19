import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { verifyToken } from '../utils/token';

const NOMBRES_COOKIE = ['token', 'access_token', 'jwt', 'farmapp_token', 'session'];

export function extraerToken(req: Request): string | null {
  const cookies: Record<string, string> = {};
  for (const parte of (req.headers.cookie ?? '').split(';')) {
    const [clave, ...resto] = parte.trim().split('=');
    if (!clave) continue;
    try {
      cookies[decodeURIComponent(clave)] = decodeURIComponent(resto.join('='));
    } catch {
      cookies[clave] = resto.join('=');
    }
  }
  for (const nombre of NOMBRES_COOKIE) {
    if (cookies[nombre]) return cookies[nombre];
  }

  const header = req.header('Authorization');
  if (header?.startsWith('Bearer ')) return header.slice(7);

  return null;
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const token = extraerToken(req);
  if (!token) {
    next(new AppError(401, 'NO_AUTORIZADO', 'Se requiere un token de acceso'));
    return;
  }
  try {
    const payload = verifyToken(token);
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
