import * as repo from '../repositories/usuarios.repository';
import type { LoginInput, RegisterInput } from '../schemas/auth.schema';
import { AppError } from '../utils/AppError';
import { hashPassword, verifyPassword } from '../utils/password';
import { signToken } from '../utils/token';

export async function register(data: RegisterInput) {
  if (repo.findByEmail(data.email)) {
    throw new AppError(409, 'EMAIL_DUPLICADO', 'El email ya está registrado');
  }
  return repo.create({
    nombres: data.nombres,
    apellidos: data.apellidos,
    email: data.email,
    passwordHash: await hashPassword(data.contrasena),
  });
}

export async function login(data: LoginInput) {
  const fila = repo.findByEmail(data.email);
  if (!fila || !(await verifyPassword(data.contrasena, fila.password_hash))) {
    throw new AppError(401, 'CREDENCIALES_INVALIDAS', 'Email o contraseña incorrectos');
  }
  return {
    token: signToken(fila.id, fila.rol),
    usuario: {
      id: fila.id,
      nombres: fila.nombres,
      apellidos: fila.apellidos,
      email: fila.email,
      rol: fila.rol,
    },
  };
}

export function me(id: number) {
  const usuario = repo.findById(id);
  if (!usuario) throw new AppError(401, 'TOKEN_INVALIDO', 'El usuario ya no existe');
  return usuario;
}
