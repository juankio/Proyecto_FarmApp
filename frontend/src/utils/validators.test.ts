import { describe, expect, it } from 'vitest';
import { email, hasMinLength, isEmail, isRequired, isUrl, minLength, required, url } from './validators';

describe('validators', () => {
  it('isEmail válido/inválido', () => {
    expect(isEmail('a@b.com')).toBe(true);
    expect(isEmail('  a@b.com  ')).toBe(true);
    expect(isEmail('sin-arroba')).toBe(false);
    expect(isEmail('a@b')).toBe(false);
    expect(email('x@y.co')).toBe(true);
  });

  it('required string y no-string', () => {
    expect(required('  ')).toBe(false);
    expect(required('ok')).toBe(true);
    expect(required(null)).toBe(false);
    expect(required(undefined)).toBe(false);
    expect(required('')).toBe(false);
    expect(required(0)).toBe(true);
    expect(isRequired('x')).toBe(true);
  });

  it('minLength', () => {
    expect(minLength('abc', 3)).toBe(true);
    expect(minLength('ab', 3)).toBe(false);
    expect(minLength('  ab  ', 2)).toBe(true);
    expect(hasMinLength('abcd', 5)).toBe(false);
  });

  it('url', () => {
    expect(url('https://example.com')).toBe(true);
    expect(url('http://a.b/c?q=1')).toBe(true);
    expect(url('ftp://x.com')).toBe(false);
    expect(url('')).toBe(false);
    expect(url('not url')).toBe(false);
    expect(isUrl('https://x.com')).toBe(true);
  });
});