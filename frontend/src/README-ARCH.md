# Arquitectura Frontend FarmApp — Convenciones y Rutas

**Nami (Arquitecta)** · Alcance: `frontend/src` (Vue 3 + Vite + TS, SPA)  
**Estado post-refactor:** stores, composables, utilidades, tests y a11y implementados.

## 1. Alias de importación

Configurado en `vite.config.ts` (`resolve.alias`), `tsconfig.json` (`paths`) y `vitest.config.ts`:

- `@` → `src/`
- Uso: `import { ... } from '@/shared/utils/...'`, `import X from '@/features/home/components/X.vue'`.

Prohibido crear nuevos imports relativos profundos (`../../..`) en código nuevo; usar `@/`.

## 2. Estructura actual

```
frontend/src/
  features/          # andamiaje feature-driven (barrels preparados)
    home/ medicamentos/ contactos/ encuestas/ proyectos/ admin/ auth/ calculadora/
  shared/            # andamiaje compartido (barrels preparados)
    ui/ composables/ stores/ utils/ types/ styles/
  components/        # componentes productivos actuales (ui, layout, admin, home, medicamentos, proyecto)
  views/             # vistas productivas actuales
  composables/       # lógica reactiva productiva (useApi, usePaginatedQuery, ...)
  stores/            # stores Pinia productivos (auth, medicamentos, contactos, encuestas, proyectos, ui)
  utils/             # helpers puros (format, imagen, validators)
  data/              # datos estáticos
  styles/            # CSS global y por feature
  test/              # setup de Vitest
  router/            # vue-router
  App.vue / main.ts
```

La migración completa de código legacy a `features/*` y `shared/*` queda pendiente; los barrels están listos para hacerla por fases con build/typecheck como gate.

## 3. Stores Pinia

- `auth` — login/register/fetchMe/logout; validación de `Usuario`; sin `sessionStorage` (cookie httpOnly).
- `medicamentos` — listado/paginación/búsqueda con contador de peticiones; CRUD.
- `contactos`, `encuestas` — listado paginado + submit.
- `proyectos` — acceso por slug.
- `ui` — toasts, modales y navegación.

## 4. Composables clave

- `useApi` — fetch centralizado, base URL por `VITE_API_BASE`, `credentials: 'include'`, timeout/AbortController, `ApiError`.
- `usePaginatedQuery` — items/total/page/búsqueda/carga con debounce y contador de peticiones.
- `useDebounce`, `useFocusTrap`.
- `useCalculator` — parser aritmético seguro (sin eval).
- `useContactoForm`, `useEncuestaForm`.
- `useAuthBootstrap` — restaura sesión con `/auth/me`.
- `useReveal` — reveal on scroll.

## 5. Convenciones

- Componente = UI presentacional + slots. Composable = estado/lógica/cleanup. Store (Pinia) = singleton global.
- Componentes ≤ 150-200 líneas. Extraer CSS a `*.css` por feature cuando supere el límite.
- Primitivas globales reutilizables en `components/ui/` (AppButton, AppModal, AppCard, AppInput, ...). No inventar botones/modales ad-hoc.
- Sin `as any` ni `// @ts-ignore`. Tipado estricto.
- Package manager: bun (`bun run build`, `bun run typecheck`, `bun run test`, `bun run test:e2e`).
- Ramas: `main` (prod), `dev` (desarrollo), `test` (QA). Sin ramas efímeras salvo petición explícita.

## 6. Autenticación

- Backend emite cookie `token` httpOnly (`Secure` solo en producción, `SameSite=Lax`), maxAge 2 h.
- Middleware acepta cookie o `Authorization: Bearer`.
- Frontend usa `credentials: 'include'`; no persiste token en `sessionStorage`.

## 7. Verificación

- `bun run typecheck` (vue-tsc --noEmit)
- `bun run build` (vue-tsc --noEmit && vite build)
- `bun run test` (Vitest)
- `bun run test:e2e` (Playwright)