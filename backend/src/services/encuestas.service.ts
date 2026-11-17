import * as repo from '../repositories/encuestas.repository';
import type { CreateEncuestaInput } from '../schemas/encuesta.schema';
import type { PaginationInput } from '../schemas/contacto.schema';

export function create(data: CreateEncuestaInput, usuarioId?: number) {
  return repo.create(data, usuarioId);
}

export function list(input: PaginationInput) {
  return repo.list(input.page, input.limit);
}
