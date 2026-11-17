import { z } from 'zod';

export const registerSchema = z.object({
  nombres: z.string().trim().min(2).max(80),
  apellidos: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email().max(120),
  contrasena: z.string().min(8).max(72)
    .regex(/[A-Z]/, 'debe tener mayúscula')
    .regex(/[0-9]/, 'debe tener número'),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  contrasena: z.string().min(1).max(72),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
