import type { Request, Response } from 'express';
import type { CreateContactoInput, PaginationInput } from '../schemas/contacto.schema';
import * as service from '../services/contactos.service';
import { sendOk } from '../utils/apiResponse';

export function create(req: Request, res: Response): void {
  const { body } = req.validated as { body: CreateContactoInput };
  sendOk(res, 201, service.create(body), 'Mensaje enviado');
}

export function list(req: Request, res: Response): void {
  const { query } = req.validated as { query: PaginationInput };
  sendOk(res, 200, service.list(query), 'Mensajes obtenidos');
}
