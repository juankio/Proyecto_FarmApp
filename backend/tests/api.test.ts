import { describe, expect, test } from 'bun:test';
import { env } from '../src/config/env';

const BASE = `http://localhost:${env.PORT}`;
const correo = `prueba-${Date.now()}@farmapp.local`;
const clave = 'Clave123';

type Envelope = { success: boolean; data: any; message: string; error: string | null };

async function api(ruta: string, opciones: RequestInit = {}): Promise<{ status: number; body: Envelope }> {
  const respuesta = await fetch(`${BASE}${ruta}`, {
    ...opciones,
    headers: { 'Content-Type': 'application/json', ...(opciones.headers ?? {}) },
  });
  return { status: respuesta.status, body: (await respuesta.json()) as Envelope };
}

function post(ruta: string, datos: unknown, token?: string): RequestInit {
  return {
    method: 'POST',
    body: JSON.stringify(datos),
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };
}

let tokenUsuario = '';
let tokenAdmin = '';

describe('FarmApp API', () => {
  test('health y frontend estático responden', async () => {
    const health = await api('/api/health');
    expect(health.status).toBe(200);
    expect(health.body.data.status).toBe('ok');

    const inicio = await fetch(`${BASE}/`);
    expect(inicio.status).toBe(200);
  });

  test('registro y duplicado', async () => {
    const datos = { nombres: 'Ana', apellidos: 'Prueba', email: correo, contrasena: clave };
    const creado = await api('/api/auth/register', post('/api/auth/register', datos));
    expect(creado.status).toBe(201);
    expect(creado.body.data.email).toBe(correo);

    const duplicado = await api('/api/auth/register', post('/api/auth/register', datos));
    expect(duplicado.status).toBe(409);
    expect(duplicado.body.error).toBe('EMAIL_DUPLICADO');
  });

  test('login, /me y control de acceso', async () => {
    const sesion = await api('/api/auth/login', post('/api/auth/login', { email: correo, contrasena: clave }));
    expect(sesion.status).toBe(200);
    tokenUsuario = sesion.body.data.token;
    expect(tokenUsuario.length).toBeGreaterThan(20);

    const perfil = await api('/api/auth/me', { headers: { Authorization: `Bearer ${tokenUsuario}` } });
    expect(perfil.status).toBe(200);
    expect(perfil.body.data.rol).toBe('usuario');

    const sinToken = await api('/api/auth/me');
    expect(sinToken.status).toBe(401);
    expect(sinToken.body.error).toBe('NO_AUTORIZADO');

    const admin = await api('/api/auth/login', post('/api/auth/login', {
      email: env.ADMIN_SEED_EMAIL,
      contrasena: env.ADMIN_SEED_PASSWORD,
    }));
    expect(admin.status).toBe(200);
    tokenAdmin = admin.body.data.token;
  });

  test('catálogo de medicamentos', async () => {
    const lista = await api('/api/medicamentos?limit=5');
    expect(lista.status).toBe(200);
    expect(lista.body.data.items.length).toBeGreaterThan(0);
    expect(lista.body.data.total).toBeGreaterThanOrEqual(12);

    const id = lista.body.data.items[0].id as number;
    const detalle = await api(`/api/medicamentos/${id}`);
    expect(detalle.status).toBe(200);
    expect(detalle.body.data.id).toBe(id);

    const inexistente = await api('/api/medicamentos/999999');
    expect(inexistente.status).toBe(404);

    const sinToken = await api('/api/medicamentos', post('/api/medicamentos', {
      nombre: 'Prueba temporal', laboratorio: 'Lab', presentacion: 'Tableta',
    }));
    expect(sinToken.status).toBe(401);

    const sinRol = await api('/api/medicamentos', post('/api/medicamentos', {
      nombre: 'Prueba temporal', laboratorio: 'Lab', presentacion: 'Tableta',
    }, tokenUsuario));
    expect(sinRol.status).toBe(403);

    const nombre = `Temporal ${Date.now()}`;
    const creado = await api('/api/medicamentos', post('/api/medicamentos', {
      nombre, laboratorio: 'Lab Prueba', presentacion: 'Tableta', concentracion: '10 mg',
    }, tokenAdmin));
    expect(creado.status).toBe(201);

    const borrado = await api(`/api/medicamentos/${creado.body.data.id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${tokenAdmin}` },
    });
    expect(borrado.status).toBe(200);
  });

  test('encuestas y contactos', async () => {
    const encuesta = await api('/api/encuestas', post('/api/encuestas', {
      calificacion: 5, comentario: 'La información es clara y útil para los pacientes.', recomendaria: true,
    }));
    expect(encuesta.status).toBe(201);

    const verEncuestas = await api('/api/encuestas', { headers: { Authorization: `Bearer ${tokenAdmin}` } });
    expect(verEncuestas.status).toBe(200);
    expect(verEncuestas.body.data.total).toBeGreaterThan(0);

    const contacto = await api('/api/contactos', post('/api/contactos', {
      nombre: 'Ana Prueba', email: correo, asunto: 'Consulta', mensaje: 'Quisiera saber más sobre el catálogo.',
    }));
    expect(contacto.status).toBe(201);

    const verContactos = await api('/api/contactos', { headers: { Authorization: `Bearer ${tokenAdmin}` } });
    expect(verContactos.status).toBe(200);
    expect(verContactos.body.data.total).toBeGreaterThan(0);
  });

  test('validación Zod', async () => {
    const invalido = await api('/api/auth/register', post('/api/auth/register', {
      nombres: 'A', apellidos: 'B', email: 'no-es-email', contrasena: 'corta',
    }));
    expect(invalido.status).toBe(400);
    expect(invalido.body.error).toBe('VALIDATION_ERROR');
    expect(invalido.body.data).toBeNull();
  });
});
