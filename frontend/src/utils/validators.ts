export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function required(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== null && value !== undefined && value !== '';
}

export function minLength(value: string, min: number): boolean {
  return value.trim().length >= min;
}

export function url(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  try {
    const parsed = new URL(v);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// Alias semánticos (compatibilidad con nombres descriptivos).
export const email = isEmail;
export const isRequired = required;
export const hasMinLength = minLength;
export const isUrl = url;
