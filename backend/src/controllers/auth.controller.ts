import type { Request, Response } from 'express';
import type { LoginInput, RegisterInput } from '../schemas/auth.schema';
import * as service from '../services/auth.service';
import { sendOk } from '../utils/apiResponse';
import { signToken } from '../utils/token';

const NOMBRE_COOKIE = 'token';
const esProduccion = process.env.NODE_ENV === 'production';

function opcionesCookie() {
  return {
    httpOnly: true,
    secure: esProduccion,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 7200 * 1000,
  };
}

export async function register(req: Request, res: Response): Promise<void> {
  const { body } = req.validated as { body: RegisterInput };
  const usuario = await service.register(body);
  const token = signToken(usuario.id, usuario.rol);
  res.cookie(NOMBRE_COOKIE, token, opcionesCookie());
  sendOk(res, 201, usuario, 'Usuario registrado');
}

export async function login(req: Request, res: Response): Promise<void> {
  const { body } = req.validated as { body: LoginInput };
  const resultado = await service.login(body);
  res.cookie(NOMBRE_COOKIE, resultado.token, opcionesCookie());
  sendOk(res, 200, resultado, 'Inicio de sesión exitoso');
}

export function me(req: Request, res: Response): void {
  sendOk(res, 200, service.me(req.usuario!.id), 'Usuario autenticado');
}

export function logout(_req: Request, res: Response): void {
  res.clearCookie(NOMBRE_COOKIE, {
    httpOnly: true,
    secure: esProduccion,
    sameSite: 'lax',
    path: '/',
  });
  sendOk(res, 200, null, 'Sesión cerrada');
}
