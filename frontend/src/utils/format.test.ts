import { describe, expect, it } from 'vitest';
import { formatFecha, iniciales } from './format';

describe('formatFecha', () => {
  it('devuelve el mismo valor si está vacío', () => {
    expect(formatFecha('')).toBe('');
  });

  it('devuelve el mismo valor si es inválido', () => {
    expect(formatFecha('no-es-fecha')).toBe('no-es-fecha');
  });

  it('formatea una fecha ISO válida', () => {
    const out = formatFecha('2024-05-10T14:30:00');
    expect(out).toMatch(/2024/);
    expect(out).toMatch(/may/i);
  });

  it('normaliza separador espacio por T', () => {
    const out = formatFecha('2024-05-10 14:30:00');
    expect(out).toMatch(/2024/);
  });
});

describe('iniciales', () => {
  it('combina primera letra de nombres y apellidos', () => {
    expect(iniciales('Juan', 'Pérez')).toBe('JP');
  });

  it('recorta espacios', () => {
    expect(iniciales('  ana  ', '  lópez')).toBe('AL');
  });

  it('mayúsculas', () => {
    expect(iniciales('maria', 'gomez')).toBe('MG');
  });

  it('fallback FA si ambos vacíos', () => {
    expect(iniciales('', '')).toBe('FA');
  });

  it('maneja un solo valor', () => {
    expect(iniciales('solo', '')).toBe('S');
  });
});