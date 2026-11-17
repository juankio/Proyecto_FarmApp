# FarmApp

Aplicativo farmacéutico con frontend en **Vue 3 + Vite + TypeScript + Pinia** y backend en **Node + Express + SQLite**. El frontend vive en `frontend/` y consume la API de `backend/` mediante proxy en desarrollo.

## Requisitos

- [Bun](https://bun.sh) 1.1 o superior. No se usa npm.

## Arranque rápido

Dos terminales:

```bash
# 1) API + base de datos
cd backend
cp .env.example .env
# edita JWT_SECRET y ADMIN_SEED_PASSWORD en .env
bun install
bun run migrate
bun run seed
bun run dev            # http://localhost:3000
```

```bash
# 2) Frontend
cd frontend
bun install
bun run dev            # http://localhost:5173
```

Vite hace proxy de `/api` hacia `http://localhost:3000`, así que no hay que configurar CORS.

Credenciales del administrador sembrado: `admin@farmapp.local` / `Admin1234`. La regla de contraseña es mínimo 8 caracteres, una mayúscula y un número.

## Rutas del frontend

| Ruta | Contenido |
| --- | --- |
| `/` | Portada, bienvenida, accesos, servicios, productos y preguntas frecuentes |
| `/servicios` | Los cinco servicios y los cuatro accesos directos |
| `/feria` | Las siete empresas de la feria y el catálogo de productos |
| `/proyectos/:slug` | Ficha de cada producto: precios, objetivo, ingredientes, misión, visión y galería |
| `/blog` | Últimos avances y novedades |
| `/informacion` | Origen del proyecto y valores |
| `/info-cenacap` | Información de la feria empresarial Cenacap |
| `/lenguajes` | Lenguajes de programación de bajo y alto nivel |
| `/calculadora` | Calculadora funcional con teclado e historial |
| `/banner-yt` | Banner de servicios |
| `/encuesta` | Encuesta de satisfacción conectada al API |
| `/contactos` | Formulario de contacto y canales directos |
| `/registro` | Registro de usuarios |
| `/login` | Ingreso de usuarios |
| `/admin` | Panel de administración (solo rol admin) |

Las fichas disponibles son `codigox`, `exfolpiel`, `fenix`, `gummy-vit`, `nails-grow`, `tentaciones-de-afrodita` y `selene`.

## Panel de administración

Entra en `/admin` con la cuenta administradora. El guard del router exige sesión y rol `admin`; un usuario normal es devuelto a la portada con un aviso. La sesión se guarda en `sessionStorage` (`farmapp_token` y `farmapp_user`) y se restaura al recargar.

El panel tiene cuatro pestañas:

- **Resumen** — totales de medicamentos, encuestas y contactos, promedio de calificación y porcentaje de recomendación.
- **Medicamentos** — búsqueda, paginación y CRUD completo contra `/api/medicamentos`.
- **Encuestas** — respuestas con calificación, comentario, recomendación y fecha.
- **Contactos** — mensajes recibidos con enlace directo para responder por correo.

Si el token expira, cualquier respuesta `401` cierra la sesión y devuelve al login.

## Diseño

El sistema visual está en `frontend/src/styles/`:

- `tokens.css` — colores, glass, sombras, radios y tipografía.
- `global.css` — fondo con patrones SVG, secciones, rejillas, formularios, acordeón y utilidades.

Componentes reutilizables en `frontend/src/components/`: `AppButton`, `AppCard`, `AppInput`, `AppModal`, `AppAccordion`, `ServiceCard`, `ImageTile`, `SectionHeader`, `PageHero`, `AppHeader` y `AppFooter`. Las animaciones de entrada usan `IntersectionObserver` mediante `composables/useReveal.ts`.

Todo el contenido real (empresas, productos, logos, galerías, FAQ, blog y textos) está centralizado en `frontend/src/data/`.

## Comandos

### Backend

| Comando | Qué hace |
| --- | --- |
| `bun run dev` | Servidor con recarga automática |
| `bun run build` | Compila el servidor a `dist/` |
| `bun run migrate` | Aplica migraciones pendientes |
| `bun run seed` | Carga el administrador y el catálogo inicial |
| `bun run test` | Pruebas de la API |
| `bun run typecheck` | Comprobación de tipos |

### Frontend

| Comando | Qué hace |
| --- | --- |
| `bun run dev` | Vite en `http://localhost:5173` |
| `bun run build` | Typecheck y build de producción en `dist/` |
| `bun run typecheck` | `vue-tsc --noEmit` |
| `bun run preview` | Sirve el build de producción |

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

El token de sesión se guarda en `sessionStorage` y se envía como `Authorization: Bearer`.

## Estructura

- `backend/src/` — servidor Express, capas de rutas, controladores, servicios, repositorios y esquemas Zod.
- `backend/src/db/migrations/` — esquema SQLite versionado.
- `data/farmapp.db` — base de datos local, ignorada por Git.
- `frontend/src/` — frontend Vue 3: vistas, componentes, datos, estilos, stores y router.
- `src/` — sitio HTML original (CódigoX 2024), conservado como referencia.

## Ramas

`main` es producción, `dev` es desarrollo y `test` es QA. Nunca se hace push directo a `main`.
