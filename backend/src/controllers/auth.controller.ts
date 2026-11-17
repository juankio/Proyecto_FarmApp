import type { Request, Response } from 'express';
import type { LoginInput, RegisterInput } from '../schemas/auth.schema';
import * as service from '../services/auth.service';
import { sendOk } from '../utils/apiResponse';

export async function register(req: Request, res: Response): Promise<void> {
  const { body } = req.validated as { body: RegisterInput };
  sendOk(res, 201, await service.register(body), 'Usuario registrado');
}

export async function login(req: Request, res: Response): Promise<void> {
  const { body } = req.validated as { body: LoginInput };
  sendOk(res, 200, await service.login(body), 'Inicio de sesión exitoso');
}

export function me(req: Request, res: Response): void {
  sendOk(res, 200, service.me(req.usuario!.id), 'Usuario autenticado');
}
