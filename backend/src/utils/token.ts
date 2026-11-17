import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '../config/env';
import type { Rol } from '../types/api';

type TokenPayload = { sub: number; rol: Rol; exp: number };

const invalid = () => new Error('TOKEN_INVALIDO');

export function signToken(sub: number, rol: Rol): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload: TokenPayload = { sub, rol, exp: Math.floor(Date.now() / 1000) + 7200 };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', env.JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): TokenPayload {
  const [header, body, signature] = token.split('.');
  if (!header || !body || !signature) throw invalid();

  const esperada = createHmac('sha256', env.JWT_SECRET).update(`${header}.${body}`).digest();
  const recibida = Buffer.from(signature, 'base64url');
  if (esperada.length !== recibida.length || !timingSafeEqual(esperada, recibida)) throw invalid();

  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as TokenPayload;
  if (typeof payload.sub !== 'number' || typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) {
    throw invalid();
  }
  return payload;
}
