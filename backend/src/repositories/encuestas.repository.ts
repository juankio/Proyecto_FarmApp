import { db } from '../config/database';
import type { CreateEncuestaInput } from '../schemas/encuesta.schema';

export type Encuesta = {
  id: number;
  usuario_id: number | null;
  nombre: string | null;
  email: string | null;
  calificacion: number;
  comentario: string;
  recomendaria: number;
  creado_en: string;
};

export function create(data: CreateEncuestaInput, usuarioId?: number): { id: number; creadoEn: string } {
  const result = db.prepare(
    `INSERT INTO encuestas (usuario_id, nombre, email, calificacion, comentario, recomendaria)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(usuarioId ?? null, data.nombre ?? null, data.email ?? null, data.calificacion, data.comentario, data.recomendaria ? 1 : 0);

  const fila = db.query<{ creado_en: string }, [number]>('SELECT creado_en FROM encuestas WHERE id = ?').get(Number(result.lastInsertRowid));
  if (!fila) throw new Error('No se pudo crear la encuesta');
  return { id: Number(result.lastInsertRowid), creadoEn: fila.creado_en };
}

export function list(page: number, limit: number): { items: Encuesta[]; total: number } {
  const total = db.query<{ n: number }, []>('SELECT count(*) AS n FROM encuestas').get()?.n ?? 0;
  const items = db.query<Encuesta, [number, number]>(
    'SELECT * FROM encuestas ORDER BY creado_en DESC, id DESC LIMIT ? OFFSET ?',
  ).all(limit, (page - 1) * limit);
  return { items, total };
}
