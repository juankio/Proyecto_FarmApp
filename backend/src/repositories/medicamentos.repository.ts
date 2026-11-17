import { db } from '../config/database';
import type { CreateMedicamentoInput, UpdateMedicamentoInput } from '../schemas/medicamento.schema';

export type Medicamento = {
  id: number;
  nombre: string;
  laboratorio: string;
  presentacion: string;
  concentracion: string | null;
  descripcion: string | null;
  imagen_url: string | null;
  creado_en: string;
  actualizado_en: string;
};

type Params = (string | number)[];

export function list(q: string | undefined, page: number, limit: number): { items: Medicamento[]; total: number } {
  const where = q ? 'WHERE nombre LIKE ? OR laboratorio LIKE ?' : '';
  const filtros: string[] = q ? [`%${q}%`, `%${q}%`] : [];
  const total = db.query<{ n: number }, string[]>(`SELECT count(*) AS n FROM medicamentos ${where}`).get(...filtros)?.n ?? 0;
  const items = db.query<Medicamento, Params>(
    `SELECT * FROM medicamentos ${where} ORDER BY nombre LIMIT ? OFFSET ?`,
  ).all(...filtros, limit, (page - 1) * limit);
  return { items, total };
}

export function findById(id: number): Medicamento | null {
  return db.query<Medicamento, [number]>('SELECT * FROM medicamentos WHERE id = ?').get(id);
}

export function findByNombre(nombre: string): Medicamento | null {
  return db.query<Medicamento, [string]>('SELECT * FROM medicamentos WHERE nombre = ?').get(nombre);
}

export function create(data: CreateMedicamentoInput): Medicamento {
  const result = db.prepare(
    `INSERT INTO medicamentos (nombre, laboratorio, presentacion, concentracion, descripcion, imagen_url)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(data.nombre, data.laboratorio, data.presentacion, data.concentracion ?? null, data.descripcion ?? null, data.imagenUrl ?? null);

  const medicamento = findById(Number(result.lastInsertRowid));
  if (!medicamento) throw new Error('No se pudo crear el medicamento');
  return medicamento;
}

const CAMPOS = ['nombre', 'laboratorio', 'presentacion', 'concentracion', 'descripcion', 'imagenUrl'] as const;

export function update(id: number, data: UpdateMedicamentoInput): Medicamento | null {
  const columnas: Record<string, string> = {
    nombre: 'nombre', laboratorio: 'laboratorio', presentacion: 'presentacion',
    concentracion: 'concentracion', descripcion: 'descripcion', imagenUrl: 'imagen_url',
  };
  const entradas = Object.entries(data).filter(([clave]) => (CAMPOS as readonly string[]).includes(clave));
  if (entradas.length === 0) return findById(id);

  const set = entradas.map(([clave]) => `${columnas[clave]} = ?`).join(', ');
  const valores = entradas.map(([, valor]) => valor ?? null);
  db.prepare(`UPDATE medicamentos SET ${set}, actualizado_en = datetime('now') WHERE id = ?`).run(...valores, id);
  return findById(id);
}

export function remove(id: number): boolean {
  return db.prepare('DELETE FROM medicamentos WHERE id = ?').run(id).changes > 0;
}
