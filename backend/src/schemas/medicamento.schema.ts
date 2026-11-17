import { z } from 'zod';

export const idParamSchema = z.object({ id: z.coerce.number().int().positive() });

export const listMedicamentosSchema = z.object({
  q: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const createMedicamentoSchema = z.object({
  nombre: z.string().trim().min(2).max(120),
  laboratorio: z.string().trim().min(2).max(120),
  presentacion: z.string().trim().min(2).max(80),
  concentracion: z.string().trim().max(80).optional(),
  descripcion: z.string().trim().max(1000).optional(),
  imagenUrl: z.string().url().max(500).optional(),
});

export const updateMedicamentoSchema = createMedicamentoSchema.partial()
  .refine((v) => Object.keys(v).length > 0, 'debe enviar al menos un campo');

export type CreateMedicamentoInput = z.infer<typeof createMedicamentoSchema>;
export type UpdateMedicamentoInput = z.infer<typeof updateMedicamentoSchema>;
export type ListMedicamentosInput = z.infer<typeof listMedicamentosSchema>;
