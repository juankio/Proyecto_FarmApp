import { config } from 'dotenv';
import path from 'node:path';
import { z } from 'zod';

config({ path: path.resolve(import.meta.dir, '../../.env') });

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET debe tener al menos 16 caracteres'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  DB_PATH: z.string().default('data/farmapp.db'),
  ADMIN_SEED_EMAIL: z.string().email().default('admin@farmapp.local'),
  ADMIN_SEED_PASSWORD: z.string().min(8, 'ADMIN_SEED_PASSWORD debe tener al menos 8 caracteres'),
});

export const env = envSchema.parse(process.env);
