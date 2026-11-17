import { db } from '../config/database';
import type { Rol } from '../types/api';

export type Usuario = {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  rol: Rol;
  creado_en: string;
};

type UsuarioRow = Usuario & { password_hash: string };

export function findByEmail(email: string): UsuarioRow | null {
  return db.query<UsuarioRow, [string]>('SELECT * FROM usuarios WHERE email = ?').get(email);
}

export function findById(id: number): Usuario | null {
  return db.query<Usuario, [number]>(
    'SELECT id, nombres, apellidos, email, rol, creado_en FROM usuarios WHERE id = ?',
  ).get(id);
}

export function create(data: { nombres: string; apellidos: string; email: string; passwordHash: string }): Usuario {
  const result = db.prepare(
    'INSERT INTO usuarios (nombres, apellidos, email, password_hash) VALUES (?, ?, ?, ?)',
  ).run(data.nombres, data.apellidos, data.email, data.passwordHash);

  const usuario = findById(Number(result.lastInsertRowid));
  if (!usuario) throw new Error('No se pudo crear el usuario');
  return usuario;
}
