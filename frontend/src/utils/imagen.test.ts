import { describe, expect, it } from 'vitest';
import { optimizarCloudinary } from './imagen';

const BASE = 'https://res.cloudinary.com/demo/image/upload/v1234/sample.jpg';

describe('optimizarCloudinary', () => {
  it('devuelve url vacía sin cambios', () => {
    expect(optimizarCloudinary('')).toBe('');
  });

  it('no toca urls que no son cloudinary', () => {
    const url = 'https://example.com/img.jpg';
    expect(optimizarCloudinary(url)).toBe(url);
  });

  it('no toca si no hay marker', () => {
    const url = 'https://res.cloudinary.com/demo/image/fetch/x.jpg';
    expect(optimizarCloudinary(url)).toBe(url);
  });

  it('inserta transformaciones', () => {
    const out = optimizarCloudinary(BASE, 320);
    expect(out).toContain('/image/upload/w_320,dpr_auto,q_auto:good,f_auto/');
    expect(out).toContain('sample.jpg');
  });

  it('omite transformaciones para gif', () => {
    const gif = 'https://res.cloudinary.com/demo/image/upload/v1234/anim.gif';
    const out = optimizarCloudinary(gif, 100);
    expect(out).toBe(gif);
  });

  it('idempotente: segunda llamada no duplica', () => {
    const once = optimizarCloudinary(BASE, 320);
    const twice = optimizarCloudinary(once, 320);
    expect(twice).toBe(once);
  });

  it('detecta transformación previa con coma', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/w_100,q_auto/v1234/sample.jpg';
    expect(optimizarCloudinary(url, 320)).toBe(url);
  });

  it('detecta transformación previa con prefijo w_', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/w_100/v1234/sample.jpg';
    expect(optimizarCloudinary(url)).toBe(url);
  });
});