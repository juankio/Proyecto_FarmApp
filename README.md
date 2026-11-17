# FarmApp

Sitio informativo farmacéutico con backend propio en Node + Express y base de datos SQLite. El frontend sigue siendo HTML y CSS estático; Express lo sirve en el mismo origen que la API.

## Requisitos

- [Bun](https://bun.sh) 1.1 o superior. No se usa npm.

## Arranque

```bash
cd backend
cp .env.example .env
# edita JWT_SECRET y ADMIN_SEED_PASSWORD en .env
bun install
bun run migrate
bun run seed
bun run dev
```

Abre `http://localhost:3000`. La API responde en `http://localhost:3000/api`.

El seed crea un administrador con los valores de `ADMIN_SEED_EMAIL` y `ADMIN_SEED_PASSWORD` de `.env`, y doce medicamentos de ejemplo. Puedes repetir `bun run seed` sin duplicar datos.

## Comandos

| Comando | Qué hace |
| --- | --- |
| `bun run dev` | Servidor con recarga automática |
| `bun run build` | Compila el servidor a `dist/` |
| `bun run migrate` | Aplica migraciones pendientes |
| `bun run seed` | Carga el administrador y el catálogo inicial |
| `bun run test` | Pruebas de la API |
| `bun run typecheck` | Comprobación de tipos |

## API

Todas las respuestas usan `{ success, data, message, error }`. `error` es un código maquinable y vale `null` cuando todo sale bien.

| Método | Ruta | Acceso |
| --- | --- | --- |
| GET | `/api/health` | público |
| POST | `/api/auth/register` | público |
| POST | `/api/auth/login` | público |
| GET | `/api/auth/me` | token |
| GET | `/api/medicamentos` | público |
| GET | `/api/medicamentos/:id` | público |
| POST | `/api/medicamentos` | admin |
| PUT | `/api/medicamentos/:id` | admin |
| DELETE | `/api/medicamentos/:id` | admin |
| POST | `/api/encuestas` | público |
| GET | `/api/encuestas` | admin |
| POST | `/api/contactos` | público |
| GET | `/api/contactos` | admin |

Los formularios de registro, ingreso, encuesta y contacto envían `fetch` al API a través de `src/js/api-client.js`. El token de sesión se guarda en `sessionStorage` y se envía como `Authorization: Bearer`.

## Estructura

- `backend/src/` — servidor Express, capas de rutas, controladores, servicios, repositorios y esquemas Zod.
- `backend/src/db/migrations/` — esquema SQLite versionado.
- `data/farmapp.db` — base de datos local, ignorada por Git.
- `src/` — frontend estático.
- `src/legacy/` — artefactos del proyecto original (CódigoX 2024), conservados como referencia.

## Ramas

`main` es producción, `dev` es desarrollo y `test` es QA. Nunca se hace push directo a `main`.

## Frontend Vue 3

 La carpeta `frontend/` contiene el frontend nuevo en Vue 3 + Vite + Pinia. El backend sigue en `backend/`.

```bash
cd frontend
bun install
bun run dev      # http://localhost:5173, proxy /api -> localhost:3000
bun run build    # typecheck + dist/
```

El servidor Express debe estar corriendo en el puerto 3000 para que la API responda. La carpeta `src/` se conserva como referencia del sitio original; la fuente activa es `frontend/src/`.
