import * as repo from '../repositories/contactos.repository';
import type { CreateContactoInput, PaginationInput } from '../schemas/contacto.schema';

export function create(data: CreateContactoInput) {
  return repo.create(data);
}

export function list(input: PaginationInput) {
  return repo.list(input.page, input.limit);
}
