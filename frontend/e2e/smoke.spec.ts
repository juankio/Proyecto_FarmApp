import { expect, test } from '@playwright/test';

const rutas = [
  '/',
  '/servicios',
  '/ubicaciones',
  '/medicamentos',
  '/blog',
  '/informacion',
  '/lenguajes',
  '/encuesta',
  '/contactos',
  '/registro',
  '/login',
];

test.describe('smoke rutas públicas', () => {
  for (const ruta of rutas) {
    test(`carga ${ruta} sin errores de consola`, async ({ page }) => {
      const errores: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error' && !/401\s*\(Unauthorized\)/.test(msg.text())) {
          errores.push(msg.text());
        }
      });
      page.on('pageerror', (err) => errores.push(err.message));

      const response = await page.goto(ruta, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBeLessThan(400);
      await page.waitForTimeout(500);
      expect(errores, errores.join('\n')).toEqual([]);
    });
  }
});

test('login admin y acceso a /admin', async ({ page }) => {
  const errores: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !/401\s*\(Unauthorized\)/.test(msg.text())) {
      errores.push(msg.text());
    }
  });
  page.on('pageerror', (err) => errores.push(err.message));

  await page.goto('/admin', { waitUntil: 'domcontentloaded' });
  await page.getByLabel('Email').fill('admin@farmapp.local');
  await page.getByLabel('Contraseña').fill('Admin1234');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForURL('**/admin', { timeout: 10000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  expect(errores, errores.join('\n')).toEqual([]);
});