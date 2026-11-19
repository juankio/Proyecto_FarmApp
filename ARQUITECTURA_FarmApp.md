# Arquitectura Frontend FarmApp — Mapa y Plan de Refactor

**Nami (Arquitecta)** · Alcance: `frontend/src` (Vue 3 + Vite + TS, SPA)  
**Estado post-refactor:** implementado (stores, composables, a11y, tests, auth cookie).  
**Verificación:** `bun run typecheck` ✅ · `bun run build` ✅ (1.48 s) · `bun run test` ✅ (6 archivos, 47 tests).  
**Rama actual:** `dev` · Git: cambios preparados para commit final.  
**Backend:** repo separado `FarmApp-Backend` (Express 5 + SQLite + Zod). Este documento cubre el frontend; servidor, migraciones y seed viven en ese repo.

---

## 0. Stack y límites

| Elemento | Valor |
|---|---|
| Framework | Vue 3.5.45 (Composition API `<script setup lang="ts">`) |
| Bundler | Vite 8.3.8 |
| Router | vue-router 5.5.1 (SPA, history web) |
| Estado | Pinia 4.1.0 (1 store: `auth`) |
| Tipado | TypeScript ~5.9.3, `strict: true` |
| Estilos | CSS custom (`tokens.css`, `global.css`, `admin.css`, `proyecto.view.css`) — **sin Tailwind/shadcn/anime** |
| Backend | Repo separado `FarmApp-Backend`: Express 5 + SQLite (bun) + Zod. CORS por `CORS_ORIGIN`. Proxy dev `/api → http://localhost:3000` |
| Package manager | bun (`bun.lock`) |

Límite interno del proyecto (CLAUDE.md): componentes ≤150-200 líneas. 18 archivos lo superan (ver §5 y auditoría).

---

## 1. Inventario por capa (líneas)

### 1.1 Resumen por capa

| Capa | Ruta | Archivos | Líneas |
|---|---|---:|---:|
| Vistas (pages) | `frontend/src/views/*.vue` | 17 | 2.208 |
| Componentes | `frontend/src/components/**/*.vue` | 42 | 3.601 |
| └ ui primitives | `frontend/src/components/ui/*.vue` | 21 | 1.138 |
| └ layout | `frontend/src/components/layout/*.vue` | 5 | 759 |
| └ admin | `frontend/src/components/admin/*.vue` | 9 | 1.036 |
| └ home | `frontend/src/components/home/*.vue` | 4 | 275 |
| └ medicamentos | `frontend/src/components/medicamentos/*.vue` | 2 | 185 |
| └ proyecto | `frontend/src/components/proyecto/*.vue` | 2 | 208 |
| Composables | `frontend/src/composables/*.ts` | 2 | 179 |
| Stores | `frontend/src/stores/*.ts` | 1 | 72 |
| Utils | `frontend/src/utils/*.ts` | 2 | 31 |
| Types | `frontend/src/types/*.ts` | 1 | 34 |
| Data (estático) | `frontend/src/data/*.ts` | 8 | 578 |
| Router | `frontend/src/router/index.ts` | 1 | 137 |
| Estilos | `frontend/src/styles/*.css` | 4 | 1.446 |
| App shell | `frontend/src/App.vue`, `main.ts` | 2 | 529 |
| **Total src** | | **82** | **8.828** |

### 1.2 Vistas y líneas

| Vista | Líneas | Ruta backend consumida |
|---|---:|---|
| `HomeView.vue` | 180 | ninguna |
| `MedicamentosView.vue` | 192 | `GET /api/medicamentos` |
| `AdminView.vue` | 75 | ninguna (shell de tabs) |
| `ServiciosView.vue` | 114 | ninguna |
| `FeriaView.vue` | 123 | ninguna |
| `ProyectoView.vue` | 134 | ninguna |
| `BlogView.vue` | 117 | ninguna |
| `InformacionView.vue` | 139 | ninguna |
| `InfoCenacapView.vue` | 92 | ninguna |
| `LenguajesView.vue` | 141 | ninguna |
| `CalculadoraView.vue` | 244 | ninguna (eval local) |
| `BannerYtView.vue` | 111 | ninguna |
| `EncuestaView.vue` | 112 | `POST /api/encuestas` |
| `ContactosView.vue` | 157 | `POST /api/contactos` |
| `LoginView.vue` | 105 | `POST /api/auth/login` |
| `RegistroView.vue` | 111 | `POST /api/auth/register` |
| `NotFoundView.vue` | 61 | ninguna |

### 1.3 Componentes admin y líneas

| Componente | Líneas | Endpoint |
|---|---:|---|
| `AdminResumen.vue` | 171 | `GET /api/medicamentos?limit=1`, `/encuestas?limit=50`, `/contactos?limit=1` |
| `AdminMedicamentos.vue` | 132 | `GET/POST/PUT/DELETE /api/medicamentos` |
| `AdminMedicamentoDialogs.vue` | 59 | delega a `MedicamentoForm` |
| `MedicamentoForm.vue` | 142 | `POST/PUT /api/medicamentos` |
| `AdminTable.vue` | 100 | presentacional |
| `AdminEncuestas.vue` | 131 | `GET /api/encuestas` |
| `AdminContactos.vue` | 118 | `GET /api/contactos` |
| `AdminDialog.vue` | 183 | presentacional (focus trap) |
| `AdminMedicamentos.vue` | 132 | (arriba) |

---

## 2. Grafo de dependencias clave (imports)

### 2.1 Núcleo de runtime

```
main.ts
 ├─ App.vue
 │   ├─ components/layout/AppHeader.vue
 │   ├─ components/layout/AppFooter.vue
 │   ├─ composables/useReveal.ts
 │   └─ stores/auth.ts
 ├─ router/index.ts
 │   ├─ views/HomeView.vue
 │   └─ stores/auth.ts
 └─ styles/global.css
```

### 2.2 Capa de datos cliente

```
composables/useApi.ts  ← único punto de fetch (apiGet/apiPost/apiPut/apiDelete)
    ↑ importado por:
      stores/auth.ts
      views/MedicamentosView.vue
      views/LoginView.vue / RegistroView.vue / ContactosView.vue / EncuestaView.vue
      components/admin/* (AdminMedicamentos, AdminEncuestas, AdminContactos, AdminResumen, MedicamentoForm)
```

### 2.3 UI primitives (consumidores)

- `components/ui/*` consumidos por vistas y componentes feature. Import paths inconsistentes: `../components/ui/...`, `../ui/...` (resuelven igual por ubicación relativa).
- Componentes duplicadores de lógica de dominio:
  - `medicamentos/MedicamentoCard.vue` y `medicamentos/MedicamentoDetailModal.vue` duplican `dosis()` y `consulta()`.
  - `admin/AdminEncuestas.vue` y `AdminResumen.vue` duplican `estrellas()`.

### 2.4 Data estática

```
data/site.ts        → HomeView, ContactosView (accesos, site, navegacion)
data/services.ts    → HomeView
data/proyectos.ts   → HomeView (destacados), FeriaView, ProyectoView, ProyectoGaleria, HeroVisual (índices 1 y 6)
data/blog.ts        → BlogView
data/faq.ts         → FaqSection
data/cenacap.ts     → InfoCenacapView
data/lenguajes.ts   → LenguajesView
data/logo.ts (1 línea) y site.ts duplican LOGO_URL
```

### 2.5 Acoplamientos frágiles detectados

| Fuente | Destino | Riesgo |
|---|---|---|
| `HeroVisual.vue:13,17` | `proyectos[1]`, `proyectos[6]` | Reordenar `proyectos.ts` rompe imágenes |
| `BlogView.vue` | array `fechas[i]` por posición | Desalineación si cambia orden de posts |
| `data/logo.ts` y `data/site.ts` | `LOGO_URL` duplicado | Drift de URL |
| `global.css` + `admin.css` | variables `--*` globales | Cualquier refactor de tokens afecta todo |

---

## 3. Contratos de datos

### 3.1 Tipos frontend (`frontend/src/types/catalogo.ts`)

```ts
Medicamento { id, nombre, laboratorio, presentacion, concentracion: string|null,
              descripcion: string|null, imagen_url: string|null, creado_en, actualizado_en }
Encuesta   { id, usuario_id: number|null, nombre: string|null, email: string|null,
              calificacion: 1..5, comentario, recomendaria: number, creado_en }
Contacto   { id, nombre, email, asunto, mensaje, leido: number, creado_en }
Paginado<T>{ items: T[]; total: number }
Usuario (stores/auth.ts) { id, nombres, apellidos, email, rol: 'usuario'|'admin', creado_en? }
```

### 3.2 Tipos backend (fuente de verdad)

- El backend vive en el repo separado `FarmApp-Backend`. Sus tipos fuente están en `FarmApp-Backend/src/repositories/medicamentos.repository.ts` (`Medicamento`, mismo shape, `imagen_url`) y `FarmApp-Backend/src/types/api.ts` (`ApiResponse<T>`, `Rol`, `ValidationIssue`).
- Backend usa `imagenUrl` (camelCase) en schemas; persiste como `imagen_url` (snake_case). El frontend lee `imagen_url`.

### 3.3 Contrato de respuesta API

```ts
ApiResponse<T> = { success: boolean; data: T | null; message: string; error: string | null }
```
Todos los endpoints devuelven este envoltorio. `useApi.request` parsea sin validar esquema (cast `as ApiResponse<T>`).

### 3.4 Endpoints backend (base `/api`)

> Backend en repo separado `FarmApp-Backend`. Base URL: en dev `/api` (proxy Vite → `http://localhost:3000`, target `VITE_API_PROXY_TARGET`); en prod `VITE_API_BASE`. CORS: `CORS_ORIGIN` (default `http://localhost:3000`; para llamadas directas desde el dev server usar `http://localhost:5173`).

| Método | Ruta | Auth | Body/Query | Respuesta `data` |
|---|---|---|---|---|
| GET | `/health` | no | — | `{ status, uptime }` |
| POST | `/auth/register` | no | `{ nombres, apellidos, email, contrasena }` | usuario creado |
| POST | `/auth/login` | no | `{ email, contrasena }` | `{ token, usuario }` + Set-Cookie httpOnly |
| POST | `/auth/logout` | no | — | limpia cookie |
| GET | `/auth/me` | Bearer o cookie | — | `Usuario` |
| GET | `/medicamentos` | no | `q?, page, limit` | `Paginado<Medicamento>` |
| GET | `/medicamentos/:id` | no | — | `Medicamento` |
| POST | `/medicamentos` | admin | `CreateMedicamentoInput` | `Medicamento` |
| PUT | `/medicamentos/:id` | admin | `UpdateMedicamentoInput` (parcial, ≥1 campo) | `Medicamento` |
| DELETE | `/medicamentos/:id` | admin | — | `{ id }` |
| POST | `/encuestas` | no (usuario opcional) | `{ nombre?, email?, calificacion, comentario, recomendaria: boolean }` | encuesta creada |
| GET | `/encuestas` | admin | `page, limit` | `Paginado<Encuesta>` |
| POST | `/contactos` | no | `{ nombre, email, asunto, mensaje }` | contacto creado |
| GET | `/contactos` | admin | `page, limit` | `Paginado<Contacto>` |

### 3.5 Auth

- Token JWT en `sessionStorage` (`farmapp_token`), usuario en `farmapp_user`.
- Guard de ruta `/admin` con `requiresAdmin: true` en `router/index.ts` + `beforeEach`.
- Evento global `farmapp:unauthorized` dispara logout + redirect `/login?redirect=...` (App.vue).
- **Gap:** no hay refresh token ni expiración manejada en cliente; `fetchMe` puede fallar silenciosamente.

---

## 4. Rutas / vistas (router)

Archivo: `frontend/src/router/index.ts` (137 líneas). 18 rutas (17 vistas + 404). Lazy loading en todas excepto `HomeView` (eager). `scrollBehavior` con hash smooth.

| Path | Name | View | Meta |
|---|---|---|---|
| `/` | home | HomeView | title Inicio |
| `/servicios` | servicios | ServiciosView | |
| `/feria` | feria | FeriaView | |
| `/medicamentos` | medicamentos | MedicamentosView | |
| `/proyectos/:slug` | proyecto | ProyectoView | |
| `/blog` | blog | BlogView | |
| `/informacion` | informacion | InformacionView | |
| `/info-cenacap` | info-cenacap | InfoCenacapView | |
| `/lenguajes` | lenguajes | LenguajesView | |
| `/calculadora` | calculadora | CalculadoraView | |
| `/banner-yt` | banner-yt | BannerYtView | |
| `/encuesta` | encuesta | EncuestaView | |
| `/contactos` | contactos | ContactosView | |
| `/registro` | registro | RegistroView | |
| `/login` | login | LoginView | |
| `/admin` | admin | AdminView | requiresAdmin |
| `/:pathMatch(.*)*` | not-found | NotFoundView | |

**Gaps de routing:**
- Sin rutas anidadas (`children`); admin tabs son estado local (`ref<Tab>`), no URL → no deep-link a `/admin?tab=medicamentos`.
- Sin `meta` de layout; header/footer siempre montados.
- Sin code-splitting por feature (solo por vista).

---

## 5. Componentes UI existentes y gaps

### 5.1 Primitivas UI (`components/ui/`, 21)

| Componente | Props clave | Gap |
|---|---|---|
| `AppButton` | variant, size, block, disabled | falta `loading`, `icon`, `aria-label` |
| `AppCard` | padded, hover, tone | OK |
| `AppInput` | modelValue, type, required... | falta `error`, `label`, `hint`, `disabled`, v-model number |
| `AppModal` | open, title, closeVariant | focus trap duplicado con `AdminDialog` |
| `AppDialog` (admin) | open, title, width | duplica `AppModal` |
| `AppPagination` | page, total, limit | OK |
| `AppSkeleton` | width, height, radius, circle | OK |
| `AppEmptyState` | title, description, icon | poco usado (vistas implementan empty inline) |
| `AppSection`, `AppContainer`, `AppSurface` | layout | solapamiento de responsabilidades |
| `AppAccordion` | items: Pregunta[] | acoplado a tipo de FAQ |
| `AppStat`, `AppCtaOscuro`, `ServiceCard`, `ImageTile`, `SectionHeader` | presentacionales | OK pero estilos inline grandes |

### 5.2 Gaps globales (de auditorías)

- Sin `usePaginatedQuery`, `useDebounce`, `useFocusTrap` composables.
- Sin store de UI/toasts.
- Sin validación Zod en cliente (backend sí valida).
- Sin tests (0 specs en frontend).
- `CalculadoraView` usa `new Function(...)` (eval dinámico) — riesgo de seguridad.
- Accesibilidad: `outline: none` sin `:focus-visible` en `global.css`, `AppInput`, `CalculadoraView`; targets <44px en pager/social/close.
- Contraste: `--blue` 3.65:1 y `--muted-2` 3.22:1 fallan WCAG AA.

---

## 6. Estructura objetivo (feature-driven, propuesta)

```
frontend/src/
  app/
    App.vue                 # shell: ambient reducido + RouterView
    main.ts
  features/
    auth/
      components/           # (futuro) LoginForm, RegisterForm
      composables/          # useAuth (wrapper del store)
      stores/auth.ts        # movido desde stores/
      types.ts              # Usuario, LoginData
      data/                 # (n/a)
    catalogo/
      components/           # MedicamentoCard, MedicamentoDetailModal, MedicamentoForm
      composables/          # useMedicamentos, useMedicamentoCrud
      views/                # MedicamentosView (o mantener en views/)
      types.ts              # reexport de Medicamento, Paginado
      utils/                # dosis, consulta, optimizarCloudinary usage
    admin/
      components/           # Admin*, AdminDialog
      composables/          # useAdminPaginated
      views/AdminView.vue
    contacto/
      components/, composables/, views/ContactosView.vue
    encuestas/
      components/, composables/, views/EncuestaView.vue
    proyectos/
      components/           # ProyectoNav, ProyectoGaleria
      data/proyectos.ts     # movido desde data/
      views/                # ProyectoView, FeriaView
    home/
      components/           # HeroVisual, WelcomeBlock, FaqSection
      data/                 # accesos, services (o shared)
      views/HomeView.vue
    blog/, calculadora/, lenguajes/, cenacap/, banner/
  shared/
    components/ui/          # App* primitives (movidos)
    composables/            # useApi, useReveal, usePaginatedQuery, useDebounce, useFocusTrap
    utils/                  # format, imagen, validators
    types/                  # catalogo.ts (Medicamento, Encuesta, Contacto, Paginado)
    styles/                 # tokens.css, global.css, admin.css, proyecto.view.css
  router/index.ts
```

Principios:
- Componente = UI presentacional + slots; Composable = estado/lógica/cleanup; Store = singleton global.
- Sin archivos >200 líneas: extraer CSS a `*.css` por feature y datos a `data/`.
- Import alias `@/` configurado en `vite.config.ts` y `tsconfig.json` (Jinbe).
- Un único `AppModal` (eliminar `AdminDialog` duplicado) con focus trap.

---

## 7. Plan DAG de tareas atómicas

Leyenda de capas: **Zoro** (backend/seguridad), **Sanji** (frontend UI/lógica), **Jinbe** (infra/build/config), **Brook** (docs/Obsidian), **Usopp** (QA/tests).

Dependencias: `→` significa "depende de".

### Fase 0 — Baseline (sin cambios)

| ID | Tarea | Capa | Depende |
|---|---|---|---|
| T0.1 | Ejecutar `bun run typecheck` y `bun run build` (baseline verde) | Usopp | — |
| T0.2 | Capturar auditorías UX (screenshots 1440/900/390) | Usopp | — |

### Fase 1 — Infraestructura y alias (Jinbe)

| ID | Tarea | Capa | Depende |
|---|---|---|---|
| T1.1 | Configurar alias `@` en `vite.config.ts` (`resolve.alias`) y `tsconfig.json` (`paths`) | Jinbe | T0.1 |
| T1.2 | Crear árbol de directorios `features/*` y `shared/*` (vacío, sin mover aún) | Sanji | T1.1 |
| T1.3 | Añadir `app.config.errorHandler` global en `main.ts` | Sanji | T0.1 |

### Fase 2 — Migración de capas compartidas (Sanji)

| ID | Tarea | Capa | Depende |
|---|---|---|---|
| T2.1 | Mover `components/ui/*` → `shared/components/ui/*` y actualizar imports | Sanji | T1.2 |
| T2.2 | Mover `composables/useApi.ts`, `useReveal.ts` → `shared/composables/` | Sanji | T1.2 |
| T2.3 | Mover `utils/*`, `types/catalogo.ts` → `shared/` | Sanji | T1.2 |
| T2.4 | Mover `styles/*` → `shared/styles/` y actualizar import en `main.ts` | Sanji | T1.2 |
| T2.5 | Mover `stores/auth.ts` → `features/auth/stores/auth.ts` | Sanji | T1.2 |
| T2.6 | Eliminar `data/logo.ts`, unificar `LOGO_URL` en `data/site.ts` | Sanji | T2.3 |
| T2.7 | Typecheck + build tras migración | Usopp | T2.1..T2.6 |

### Fase 3 — Composables de dominio (Sanji)

| ID | Tarea | Capa | Depende |
|---|---|---|---|
| T3.1 | Crear `shared/composables/usePaginatedQuery.ts` (items,total,page,limit,loading,error, fetch) | Sanji | T2.7 |
| T3.2 | Crear `shared/composables/useDebounce.ts` | Sanji | T2.7 |
| T3.3 | Crear `shared/composables/useFocusTrap.ts` | Sanji | T2.7 |
| T3.4 | Migrar `MedicamentosView.vue` a `usePaginatedQuery` + `useDebounce` | Sanji | T3.1, T3.2 |
| T3.5 | Migrar `AdminMedicamentos/Encuestas/Contactos/Resumen` a `usePaginatedQuery` (con request counter) | Sanji | T3.1 |
| T3.6 | Extraer `dosis()` y `consulta()` a `features/catalogo/utils/medicamento.ts` | Sanji | T2.7 |
| T3.7 | Extraer `estrellas()` a `shared/utils/format.ts` | Sanji | T2.7 |
| T3.8 | Typecheck + build | Usopp | T3.4..T3.7 |

### Fase 4 — Seguridad (Zoro + Sanji)

| ID | Tarea | Capa | Depende |
|---|---|---|---|
| T4.1 | Eliminar `new Function(...)` en `CalculadoraView.vue`; implementar parser seguro (shunting-yard o mathjs) | Zoro | T2.7 |
| T4.2 | Añadir validación Zod en cliente para formularios (login, registro, contacto, encuesta, medicamento) | Zoro | T2.7 |
| T4.3 | Unificar `AppModal` + eliminar `AdminDialog` duplicado; usar `useFocusTrap` | Sanji | T3.3 |
| T4.4 | Typecheck + build | Usopp | T4.1..T4.3 |

### Fase 5 — Datos y fragilidad por índices (Sanji)

| ID | Tarea | Capa | Depende |
|---|---|---|---|
| T5.1 | Mover `data/proyectos.ts` → `features/proyectos/data/proyectos.ts` | Sanji | T2.7 |
| T5.2 | Mover `data/blog.ts`, `faq.ts`, `cenacap.ts`, `lenguajes.ts`, `services.ts`, `site.ts` a sus features | Sanji | T2.7 |
| T5.3 | Reemplazar `proyectos[1]/[6]` en `HeroVisual.vue` por búsqueda por `slug` | Sanji | T5.1 |
| T5.4 | Alinear fechas en `BlogView.vue` con posts (objeto único `{titulo, extracto, imagen, fecha}`) | Sanji | T5.2 |
| T5.5 | Typecheck + build | Usopp | T5.1..T5.4 |

### Fase 6 — UI/UX y accesibilidad (Sanji)

| ID | Tarea | Capa | Depende |
|---|---|---|---|
| T6.1 | Reducir ambient layer en `App.vue` (1-2 capas estáticas, quitar animación decorativa por defecto) | Sanji | T2.7 |
| T6.2 | Eliminar glass-in-glass en cards (`ImageTile`, `ServiceCard`, `MedicamentosView`) | Sanji | T2.7 |
| T6.3 | Actualizar tokens de contraste (`--blue` texto → `--blue-deep`, `--muted-2` ≥4.5) | Sanji | T2.7 |
| T6.4 | Añadir `:focus-visible` y targets ≥44px (pager, social, close, sm-button) | Sanji | T2.7 |
| T6.5 | Eliminar `outline: none` sin fallback | Sanji | T6.4 |
| T6.6 | Typecheck + build + auditoría contraste | Usopp | T6.1..T6.5 |

### Fase 7 — Admin UX y routing (Sanji)

| ID | Tarea | Capa | Depende |
|---|---|---|---|
| T7.1 | Convertir tabs de admin en rutas anidadas (`/admin/resumen`, `/admin/medicamentos`, ...) con `children` | Sanji | T2.7 |
| T7.2 | Mover `admin.css` a `features/admin/styles/admin.css` | Sanji | T2.7 |
| T7.3 | Añadir deep-link y breadcrumb en panel admin | Sanji | T7.1 |
| T7.4 | Typecheck + build | Usopp | T7.1..T7.3 |

### Fase 8 — QA y tests (Usopp)

| ID | Tarea | Capa | Depende |
|---|---|---|---|
| T8.1 | Configurar Vitest + Vue Test Utils + Testing Library | Jinbe | T2.7 |
| T8.2 | Tests unitarios de composables (`usePaginatedQuery`, `useDebounce`, validators) | Usopp | T3.1, T3.2, T4.2 |
| T8.3 | Tests de componentes UI (AppButton, AppInput, AppModal, AppPagination) | Usopp | T2.1 |
| T8.4 | Tests de vistas clave (MedicamentosView, LoginView, ContactosView) con MSW/mock fetch | Usopp | T3.4, T4.4 |
| T8.5 | Playwright e2e: rutas públicas + login + admin CRUD medicamento | Usopp | T4.4, T7.4 |
| T8.6 | Lighthouse/a11y (axe) en Home, Medicamentos, Admin | Usopp | T6.6 |

### Fase 9 — Documentación (Brook)

| ID | Tarea | Capa | Depende |
|---|---|---|---|
| T9.1 | Crear ADR en Obsidian: "Refactor frontend feature-driven FarmApp" | Brook | T8.6 |
| T9.2 | Actualizar `README.md` frontend con estructura y scripts | Brook | T8.6 |
| T9.3 | Registrar decisiones en `50-Bitacora/` | Brook | T9.1 |

---

## 8. Riesgos y acoplamiento

| Riesgo | Impacto | Mitigación |
|---|---|---|
| 18 archivos >150-200 líneas, 14 por CSS inline | Refactor largo, regresiones visuales | Extraer CSS antes de mover lógica; mantener build verde por fase |
| Lógica de paginación duplicada en 5 componentes + race conditions en admin | Bugs de concurrencia | `usePaginatedQuery` con request counter (T3.1/T3.5) |
| `new Function` en calculadora | XSS/eval de input usuario | Parser seguro (T4.1) |
| Fragilidad por índices (`proyectos[1]`, `fechas[i]`) | Rotura silenciosa | Búsqueda por slug / objeto unificado (T5.3/T5.4) |
| `LOGO_URL` duplicado | Drift | Unificar (T2.6) |
| Sin tests | Refactor sin red de seguridad | Fase 8 antes de tocar producción |
| Imports relativos inconsistentes (`../ui` vs `../components/ui`) | Confusión en migración | Alias `@` (T1.1) + migración controlada |
| Git dirty actual | Mezcla de cambios | Commitear/branch antes de refactor (safe-nav 3 ramas) |
| Backend y frontend duplican tipos (`Medicamento`) | Drift de contrato | Generar tipos desde backend o paquete compartido (futuro) |
| `sessionStorage` para token (XSS) | Robo de token | Evaluar httpOnly cookie (backend) — fuera de alcance frontend |

---

## 9. Orden de ejecución recomendado (camino crítico)

```
T0.1 → T1.1 → T1.2 → (T2.1..T2.7) → (T3.1..T3.8) → (T4.1..T4.4) → (T5/T6/T7 en paralelo) → T8.* → T9.*
```

Paralelizable tras T3.8: T5 (datos), T6 (UX), T7 (admin) no comparten archivos salvo `global.css`/`admin.css` — coordinar edits en estilos.

---

## 10. Veredicto

Frontend **funcional y tipado estricto, build verde**, pero con deuda de reutilización, seguridad (eval), accesibilidad y ausencia de tests. El refactor propuesto es **incremental por fases con build/typecheck como gate**, sin placeholders, usando rutas reales del repo. Ningún cambio de código se realizó en esta entrega.
---

## 11. Estado de Fase 1 (Jinbe) — Alias + Carpetas

**Completado.** Código legacy intacto (no se movió ningún archivo).

- Alias `@` → `src/` configurado en `frontend/vite.config.ts` (`resolve.alias`) y `frontend/tsconfig.json` (`baseUrl` + `paths`).
- Árbol `frontend/src/features/{home,medicamentos,contactos,encuestas,proyectos,admin,auth,calculadora}` creado con subcarpetas `components, composables, views, data, utils, types` y barrel `index.ts`.
- Árbol `frontend/src/shared/{ui,composables,stores,utils,types,styles}` creado con barrel `index.ts`.
- Convenciones documentadas en `frontend/src/README-ARCH.md`.
- Verificación: `bun run typecheck` ✅ · `bun run build` ✅ (alias `@/...` resuelve y compila).
- Próximo: Fase 2 (migración de capas compartidas) según §7, con build/typecheck como gate.

---

## 12. Estado post-refactor (implementado)

### 12.1 Estructura y alias
- Alias `@` → `src/` configurado en `frontend/vite.config.ts` y `frontend/tsconfig.json`.
- Andamiaje feature-driven en `frontend/src/features/*` y `frontend/src/shared/*` (barrels preparados; el código productivo permanece en rutas legacy).
- Alias también en `frontend/vitest.config.ts`.

### 12.2 Stores Pinia (`frontend/src/stores/`)
- `auth` — login/register/fetchMe/logout con validación de `Usuario`; sin `sessionStorage` (cookie httpOnly).
- `medicamentos` — listado/paginación/búsqueda con contador de peticiones; CRUD (create/update/eliminar); `delete` alias.
- `contactos`, `encuestas` — listado paginado + submit con contador de peticiones.
- `proyectos` — acceso por slug (`getBySlug`/`porSlug`), sin índices frágiles.
- `ui` — toasts, modales y estado de navegación.

### 12.3 Composables (`frontend/src/composables/`)
- `useApi` — fetch centralizado, base URL por `VITE_API_BASE`, `credentials: 'include'`, timeout/AbortController (10 s), `ApiError`.
- `usePaginatedQuery` — items/total/page/búsqueda/carga con debounce, contador de peticiones y delay mínimo.
- `useDebounce`, `useFocusTrap` — reutilizables.
- `useCalculator` — parser aritmético seguro (sin `new Function`/eval).
- `useContactoForm`, `useEncuestaForm` — estado + validación + envío.
- `useAuthBootstrap` — restaura sesión con `/auth/me` y maneja `farmapp:unauthorized`.
- `useReveal` — reveal on scroll (singleton).
- `useAmbientParallax`, `useNavigationProgress`, `useScrollAmbient`.

### 12.4 Utilidades (`frontend/src/utils/`)
- `format` — `formatFecha` (respeta offset backend) e `iniciales`.
- `imagen` — `optimizarCloudinary` idempotente.
- `validators` — `isEmail`, `required`, `minLength`, `url` + alias.

### 12.5 Seguridad y accesibilidad
- Calculadora sin eval dinámico.
- `ServiceCard` sin `v-html`.
- `HeroVisual` accede a proyectos por slug.
- `BlogView` usa `post.categoria` (sin índices por posición).
- Focus-visible en `global.css`, `AppInput`, `AppButton`, `CalculadoraView`.
- Targets mínimos 44 px en botones/pager/social/close/burger.
- `AppHeaderMobile` aria-label dinámico.
- `LoginView`/`RegistroView` limpian timers; sin dead code `recordar`.
- `main.ts` con `app.config.errorHandler` global.
- `vite.config.ts` proxy por env.

### 12.6 Tests
- Vitest: 6 archivos, 47 tests (`auth`, `format`, `imagen`, `validators`, `usePaginatedQuery`, `useCalculator`).
- Playwright e2e: `frontend/e2e/smoke.spec.ts` (rutas públicas + login admin).
- Scripts: `test`, `test:watch`, `test:e2e`.

### 12.7 Autenticación (backend)
- Cookie `token` httpOnly, `Secure` en producción, `SameSite=Lax`, `path=/`, maxAge 2 h.
- Middleware acepta cookie (varios nombres) o `Authorization: Bearer`.
- `POST /auth/logout` limpia cookie (también `GET /logout`).
- Frontend usa `credentials: 'include'`; store `auth` no persiste token en `sessionStorage`.

### 12.8 Pendientes opcionales (P3)
- Reducir ambient layer y simplificar `PageHero`.
- Unificar radios/sombras y paleta.
- Extraer `dosis`/`consulta` y `estrellas` a utilidades compartidas.
- Migrar código legacy a `features/*`/`shared/*` (barrels listos).
- Consolidar CTAs oscuros y scoped `useReveal`.