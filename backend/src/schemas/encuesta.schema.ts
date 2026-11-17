import { z } from 'zod';
import { paginationSchema } from './contacto.schema';

export const createEncuestaSchema = z.object({
  nombre: z.string().trim().min(2).max(80).optional(),
  email: z.string().trim().toLowerCase().email().max(120).optional(),
  calificacion: z.coerce.number().int().min(1).max(5),
  comentario: z.string().trim().min(10).max(1000),
  recomendaria: z.coerce.boolean(),
});

export type CreateEncuestaInput = z.infer<typeof createEncuestaSchema>;
export { paginationSchema };
