import type { NextFunction, Request, Response } from 'express';
import { sendFail } from './apiResponse';

const VENTANA_MS = 60_000;
const MAXIMO = 10;
const buckets = new Map<string, number[]>();

export function rateLimit(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip ?? 'unknown';
  const ahora = Date.now();
  const marcas = (buckets.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);

  if (marcas.length >= MAXIMO) {
    sendFail(res, 429, 'RATE_LIMITED', 'Demasiadas solicitudes, intenta de nuevo en un minuto');
    return;
  }

  marcas.push(ahora);
  buckets.set(ip, marcas);
  next();
}
