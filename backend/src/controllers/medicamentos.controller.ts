import type { Request, Response } from 'express';
import type {
  CreateMedicamentoInput,
  ListMedicamentosInput,
  UpdateMedicamentoInput,
} from '../schemas/medicamento.schema';
import * as service from '../services/medicamentos.service';
import { sendOk } from '../utils/apiResponse';

export function list(req: Request, res: Response): void {
  const { query } = req.validated as { query: ListMedicamentosInput };
  sendOk(res, 200, service.list(query), 'Medicamentos obtenidos');
}

export function getById(req: Request, res: Response): void {
  const { params } = req.validated as { params: { id: number } };
  sendOk(res, 200, service.getById(params.id), 'Medicamento obtenido');
}

export function create(req: Request, res: Response): void {
  const { body } = req.validated as { body: CreateMedicamentoInput };
  sendOk(res, 201, service.create(body), 'Medicamento creado');
}

export function update(req: Request, res: Response): void {
  const { body, params } = req.validated as { body: UpdateMedicamentoInput; params: { id: number } };
  sendOk(res, 200, service.update(params.id, body), 'Medicamento actualizado');
}

export function remove(req: Request, res: Response): void {
  const { params } = req.validated as { params: { id: number } };
  sendOk(res, 200, service.remove(params.id), 'Medicamento eliminado');
}
