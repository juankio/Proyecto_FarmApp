import * as repo from '../repositories/medicamentos.repository';
import type {
  CreateMedicamentoInput,
  ListMedicamentosInput,
  UpdateMedicamentoInput,
} from '../schemas/medicamento.schema';
import { AppError } from '../utils/AppError';

export function list(input: ListMedicamentosInput) {
  return repo.list(input.q, input.page, input.limit);
}

export function getById(id: number) {
  const medicamento = repo.findById(id);
  if (!medicamento) throw new AppError(404, 'NO_ENCONTRADO', 'Medicamento no encontrado');
  return medicamento;
}

export function create(data: CreateMedicamentoInput) {
  if (repo.findByNombre(data.nombre)) {
    throw new AppError(409, 'MEDICAMENTO_DUPLICADO', 'Ya existe un medicamento con ese nombre');
  }
  return repo.create(data);
}

export function update(id: number, data: UpdateMedicamentoInput) {
  getById(id);
  if (data.nombre && repo.findByNombre(data.nombre)?.id !== id) {
    throw new AppError(409, 'MEDICAMENTO_DUPLICADO', 'Ya existe un medicamento con ese nombre');
  }
  const medicamento = repo.update(id, data);
  if (!medicamento) throw new AppError(404, 'NO_ENCONTRADO', 'Medicamento no encontrado');
  return medicamento;
}

export function remove(id: number) {
  if (!repo.remove(id)) throw new AppError(404, 'NO_ENCONTRADO', 'Medicamento no encontrado');
  return { id };
}
