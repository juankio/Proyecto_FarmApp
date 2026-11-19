import { describe, expect, it } from 'vitest';
import { useCalculator } from './useCalculator';

describe('useCalculator', () => {
  it('suma básica', () => {
    const c = useCalculator();
    c.agregar('2');
    c.agregar('+');
    c.agregar('3');
    c.agregar('=');
    expect(c.expresion.value).toBe('5');
    expect(c.error.value).toBe('');
  });

  it('precedencia * sobre +', () => {
    const c = useCalculator();
    c.expresion.value = '2+3*4';
    c.calcular();
    expect(c.expresion.value).toBe('14');
  });

  it('paréntesis', () => {
    const c = useCalculator();
    c.expresion.value = '(2+3)*4';
    c.calcular();
    expect(c.expresion.value).toBe('20');
  });

  it('división por cero produce error', () => {
    const c = useCalculator();
    c.expresion.value = '5/0';
    c.calcular();
    expect(c.error.value).toBe('Expresión no válida');
  });

  it('carácter inválido produce error', () => {
    const c = useCalculator();
    c.expresion.value = '2+a';
    c.calcular();
    expect(c.error.value).toBe('Expresión no válida');
  });

  it('expresión vacía no calcula', () => {
    const c = useCalculator();
    c.calcular();
    expect(c.expresion.value).toBe('');
    expect(c.error.value).toBe('');
  });

  it('historial limita a 5', () => {
    const c = useCalculator();
    for (let i = 0; i < 7; i++) {
      c.expresion.value = `${i}+1`;
      c.calcular();
    }
    expect(c.historial.value.length).toBe(5);
  });

  it('memoria guardar/recuperar', () => {
    const c = useCalculator();
    c.expresion.value = '42';
    c.memoriaGuardar();
    c.memoriaRecuperar();
    expect(c.expresion.value).toContain('42');
  });

  it('tecla ± cambia signo', () => {
    const c = useCalculator();
    c.expresion.value = '5';
    c.agregar('±');
    expect(c.expresion.value).toBe('-5');
    c.agregar('±');
    expect(c.expresion.value).toBe('5');
  });

  it('tecla % divide por 100', () => {
    const c = useCalculator();
    c.expresion.value = '50';
    c.agregar('%');
    expect(c.expresion.value).toBe('50/100');
  });

  it('C limpia', () => {
    const c = useCalculator();
    c.expresion.value = '999';
    c.agregar('C');
    expect(c.expresion.value).toBe('');
  });
});