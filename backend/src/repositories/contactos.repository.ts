import { db } from '../config/database';
import type { CreateContactoInput } from '../schemas/contacto.schema';

export type Contacto = {
  id: number;
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  leido: number;
  creado_en: string;
};

export function create(data: CreateContactoInput): { id: number; creadoEn: string } {
  const result = db.prepare(
    'INSERT INTO contactos (nombre, email, asunto, mensaje) VALUES (?, ?, ?, ?)',
  ).run(data.nombre, data.email, data.asunto, data.mensaje);

  const fila = db.query<{ creado_en: string }, [number]>('SELECT creado_en FROM contactos WHERE id = ?').get(Number(result.lastInsertRowid));
  if (!fila) throw new Error('No se pudo crear el contacto');
  return { id: Number(result.lastInsertRowid), creadoEn: fila.creado_en };
}

export function list(page: number, limit: number): { items: Contacto[]; total: number } {
  const total = db.query<{ n: number }, []>('SELECT count(*) AS n FROM contactos').get()?.n ?? 0;
  const items = db.query<Contacto, [number, number]>(
    'SELECT * FROM contactos ORDER BY creado_en DESC, id DESC LIMIT ? OFFSET ?',
  ).all(limit, (page - 1) * limit);
  return { items, total };
}
