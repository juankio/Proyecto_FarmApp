export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  message: string;
  error: string | null;
};

export type ValidationIssue = { path: string; message: string };

export type Rol = 'usuario' | 'admin';

declare global {
  namespace Express {
    interface Request {
      validated: { body: unknown; query: unknown; params: unknown };
      usuario?: { id: number; rol: Rol };
    }
  }
}
