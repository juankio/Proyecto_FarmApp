import type { Request, Response } from 'express';
import type { PaginationInput } from '../schemas/contacto.schema';
import type { CreateEncuestaInput } from '../schemas/encuesta.schema';
import * as service from '../services/encuestas.service';
import { sendOk } from '../utils/apiResponse';

export function create(req: Request, res: Response): void {
  const { body } = req.validated as { body: CreateEncuestaInput };
  sendOk(res, 201, service.create(body, req.usuario?.id), 'Encuesta registrada');
}

export function list(req: Request, res: Response): void {
  const { query } = req.validated as { query: PaginationInput };
  sendOk(res, 200, service.list(query), 'Encuestas obtenidas');
}
