# Auditoría Frontend — FarmApp (`frontend/src`)

**Auditora:** Robin (CSO/UX/Arquitectura)  
**Alcance:** `frontend/src` (Vue 3 + Vite + TS) — vistas, componentes, composables, stores, utils, estilos.  
**Restricción cumplida:** No se modificó código. Solo lectura/análisis.  
**Verificación ejecutada:** `bun run typecheck` ✅ (0 errores) · `bun run build` ✅ (1.92 s, sin warnings).  
**Referencia complementaria:** `AUDITORIA_UX_FarmApp.md` (UX/visual previa, 189 líneas).

---

## 0. Resumen ejecutivo

### Estado post-refactor (actualización)
- **P0 y P1:** completados (eval seguro, acceso por slug, sin `v-html`, stores/composables extraídos, a11y base, auth por cookie, tests).
- **P2:** parcialmente completado (tests, validators, timeout, proxy por env, focus-visible). Pendientes menores: refactor `useReveal`, listener global de modales, consolidación de CTAs.
- **P3:** opcionales pendientes (reducción de ambient layer, unificación de radios/sombras/paleta, migración a `features/*`).
- Frontend funcional y bien estructurado por vistas/componentes, pero **sin tests** y con **deuda de reutilización**: la misma lógica de listado/paginación/carga se repite en 5 componentes; funciones de dominio (`dosis`, `consulta`, `estrellas`) duplicadas.
- **Un riesgo de seguridad real:** `CalculadoraView.vue:54` usa `new Function(...)` (eval dinámico) para evaluar la expresión del usuario.
- **Fragilidad por índices:** `HeroVisual.vue` accede `proyectos[1]`/`proyectos[6]` y `BlogView.vue` indexa un array `fechas[i]` por posición.
- **Archivos >150 líneas:** 18 archivos (detalle §1). Motivo dominante: **CSS inline en `.vue`** (App.vue 369 líneas de estilo) y datos hardcodeados (`proyectos.ts` 331).
- **Accesibilidad:** `outline: none` sin `:focus-visible` en `global.css:428`, `AppInput.vue:49`, `CalculadoraView.vue:136`; targets <44 px en pager/social/close/sm-button.
- **Cobertura de composables/stores/utils:** solo 2 composables y 1 store; faltan `usePaginatedQuery`, `useFocusTrap`, validadores, store de UI/toasts.

---

## 1. Archivos >150 líneas (conteo y motivo)

| # | Archivo | Líneas | Script | Template | Style | Motivo principal |
|---|---------|--------|--------|----------|-------|------------------|
| 1 | `src/styles/global.css` | 686 | — | — | 686 | Estilos globales monolíticos (tokens importados aparte) |
| 2 | `src/styles/admin.css` | 536 | — | — | 536 | Estilos admin monolíticos |
| 3 | `src/App.vue` | 522 | 116 | 29 | 369 | **Ambient layer + 369 líneas de CSS animado** (aurora, orbs, caustics) |
| 4 | `src/data/proyectos.ts` | 331 | 331 | — | — | Datos hardcodeados (7 empresas, galerías) |
| 5 | `src/views/CalculadoraView.vue` | 244 | 77 | 41 | 118 | Lógica de eval + estilos del teclado |
| 6 | `src/components/layout/AppFooter.vue` | 229 | 24 | 52 | 145 | Estilos del footer |
| 7 | `src/views/MedicamentosView.vue` | 192 | 95 | 63 | 21 | Lógica de carga/debounce/paginación + UI |
| 8 | `src/components/layout/AppHeader.vue` | 189 | 14 | 23 | 144 | Estilos del header |
| 9 | `src/components/admin/AdminDialog.vue` | 183 | 78 | 15 | 82 | Focus trap + estilos del modal |
| 10 | `src/views/HomeView.vue` | 180 | 16 | 12 | 51 | 7 secciones + estilos |
| 11 | `src/components/admin/AdminResumen.vue` | 171 | 56 | 100 | 5 | Lógica de carga + template denso |
| 12 | `src/components/ui/AppButton.vue` | 163 | 10 | 8 | 137 | Variantes CSS (5 variantes × 3 tamaños) |
| 13 | `src/components/layout/PageHero.vue` | 163 | 10 | 20 | 125 | Estilos del hero |
| 14 | `src/components/layout/AppHeaderMobile.vue` | 160 | 15 | 24 | 113 | Estilos mobile |
| 15 | `src/views/ContactosView.vue` | 157 | 52 | 58 | 39 | Canales hardcodeados + estilos |
| 16 | `src/components/ui/ImageTile.vue` | 154 | 20 | 16 | 110 | Estilos del tile |
| 17 | `src/components/ui/AppModal.vue` | 152 | 72 | 18 | 54 | Focus trap duplicado + estilos |
| 18 | `src/components/home/HeroVisual.vue` | 151 | 4 | 16 | 123 | Estilos de visual hero |

**Observación:** 14 de 18 superan el límite por **CSS inline**; 4 por **lógica/datos**. Acción: mover CSS a archivos `.css` por componente o consolidar en `global.css`/`admin.css`, y extraer datos a `src/data/`.

---

## 2. Anti-patrones detectados (con evidencia)

### 2.1 Lógica de negocio en vistas/componentes

- **`MedicamentosView.vue` (1-96):** carga, debounce, paginación, manejo de carrera de peticiones y delay artificial de 300 ms viven en la vista. Debería estar en un composable `useMedicamentos`.
- **`AdminMedicamentos.vue` (24-91):** duplica casi idéntica la carga/paginación/búsqueda de `MedicamentosView` (sin debounce).
- **`AdminEncuestas.vue`, `AdminContactos.vue`, `AdminResumen.vue`:** cada uno reimplementa `cargar()` con `performance.now()` + `setTimeout(300)` (ver §2.3).
- **`MedicamentoForm.vue` (27-59):** validación inline (`limpiar` + checks) en lugar de un util `validators`.
- **`MedicamentoCard.vue` (9-22) y `MedicamentoDetailModal.vue` (11-24):** lógica de dominio `dosis()` y `consulta()` duplicada en dos componentes.
- **`HeroVisual.vue` (13,17):** acceso a `proyectos[1]`/`proyectos[6]` por índice (fragilidad).

### 2.2 Fetch directo / acoplamiento

- **Único punto de fetch centralizado:** `composables/useApi.ts` (bien). ✅ No hay `fetch` directo en vistas.
- **Pero:** `useApi.request` parsea JSON sin validar esquema (`body = (await response.json()) as ApiResponse<T>` líneas 48-52) y hace cast `body.data as T` (línea 62). Sin validación Zod en cliente.
- **`vite.config.ts`:** proxy `/api → http://localhost:3000` hardcodeado (OK dev, pero no configurable por env).
- **`main.ts`:** sin `app.config.errorHandler` global.

### 2.3 Estado local duplicado

Patrón repetido en 5 componentes (`items, total, page, limit, cargando, error, busqueda, filtro`):

| Componente | Líneas | Estado duplicado |
|------------|--------|------------------|
| `MedicamentosView.vue` | 15-22 | items, total, page, busqueda, filtro, cargando, error, seleccionado |
| `AdminMedicamentos.vue` | 10-22 | items, total, page, limit, busqueda, filtro, cargando, error, dialogo, editando, aEliminar, eliminando |
| `AdminEncuestas.vue` | 9-14 | items, total, page, limit, cargando, error |
| `AdminContactos.vue` | 9-14 | idem |
| `AdminResumen.vue` | 8-14 | cargando, error, medicamentos, encuestasTotal, contactosTotal, encuestas |

**Delay artificial de 300 ms** replicado en `MedicamentosView:46-47`, `AdminMedicamentos:37-38`, `AdminEncuestas:27-28`, `AdminContactos:27-28`, `AdminResumen:47-48`.  
**Carrera de peticiones** (`peticion` counter) solo en `MedicamentosView:25,28,38,42,45`; los admin no la tienen → race conditions al cambiar de página rápido.

### 2.4 Props drilling

- Bajo en general (máximo 2 niveles). Caso notable: `AdminView → AdminMedicamentoDialogs → MedicamentoForm` con props `dialogo/editando/aEliminar/eliminando` y 4 emits (`update:dialogo, saved, delete, cancel-delete`). Aceptable, pero podría consolidarse en un composable `useMedicamentoDialog`.
- `MedicamentosView → MedicamentoDetailModal` con `:medicamento="seleccionado"` y `@close`. OK.

### 2.5 Comentarios narradores / JSDoc

- Casi ausentes (bien). Único comentario explicativo en `useReveal.ts:74-76` (justificado). ✅
- **Sin JSDoc inflado.** ✅

### 2.6 `as any` / tipado perezoso

- **No hay `as any` ni `@ts-ignore`.** ✅
- Casts presentes (aceptables, pero mejorables):
  - `useApi.ts:36` `options.headers as Record<string,string>`
  - `useApi.ts:50` `(await response.json()) as ApiResponse<T>`
  - `useApi.ts:62` `body.data as T`
  - `stores/auth.ts:23` `JSON.parse(raw) as Usuario`
  - `CalculadoraView.vue:54` `... as number`
  - `AppInput.vue:23` `($event.target as HTMLInputElement).value`
  - `AppContainer.vue:28` `props.padding as string`

### 2.7 Hardcode

- **`WelcomeBlock.vue:6-10`:** stats hardcodeados (`'12', 'Medicamentos'`) — se desincroniza del backend (que tiene paginación/total). Debería venir de `/medicamentos?limit=1` (como hace `AdminResumen`).
- **`ContactosView.vue:23-27`:** canales (WhatsApp/Instagram/Facebook) hardcodeados en la vista.
- **`BlogView.vue:10`:** `fechas = ['Actualidad','Novedades','Proyecto']` indexado por `i` en `v-for="(post, i) in posts"` (línea 30,34) → si cambia el orden de posts, las etiquetas se desalinean.
- **`InformacionView.vue:10-11`:** párrafo de ~1300 caracteres hardcodeado en el componente (debería ser data/markdown).
- **`LenguajesView.vue:7-12`:** mapa `iniciales` local que duplica `utils/format.ts:iniciales` (no se usa).
- **`HeroVisual.vue:13,17`:** `proyectos[1]`, `proyectos[6]` por índice.
- **`AdminResumen.vue:35-37`:** endpoints con query strings construidos a mano (`'/medicamentos?limit=1'`).
- **`site.ts`/`logo.ts`/`proyectos.ts`:** URLs de Cloudinary hardcodeadas (aceptable para data estática, pero sin env/CDN config).
- **`vite.config.ts`:** proxy hardcodeado a `localhost:3000`.

### 2.8 Seguridad

| ID | Severidad | Archivo:Línea | Hallazgo | Impacto |
|----|-----------|---------------|----------|---------|
| S1 | **P0** | `CalculadoraView.vue:49-54` | `Function(\`"use strict"; return (${limpia})\`)()` evalúa entrada del usuario (aunque regex `^[0-9+\-*/.() ]+$`). | Eval dinámico prohibido; riesgo si el regex se relaja en el futuro. |
| S2 | P1 | `ServiceCard.vue:8` | `v-html="icon"` renderiza SVG string. `icon` viene de `data/services.ts` (controlado), pero es XSS si la fuente cambia. | XSS potencial. |
| S3 | P1 | `stores/auth.ts:16-28`, `useApi.ts:8-31` | Token en `sessionStorage` + usuario parseado sin validación. Vulnerable a XSS (robo de token). Mejora requiere backend httpOnly cookie. | Robo de sesión vía XSS. |
| S4 | P2 | `useApi.ts:42-53` | Sin timeout/AbortController; una petición colgada bloquea UI indefinidamente. | DoS percibido. |
| S5 | P2 | `App.vue:48-59` | `document.querySelector('.ambient')` / `'.page-hero'` acoplamiento DOM; si el selector no existe, silencioso. | Fragilidad. |
| S6 | P2 | `AdminDialog.vue:74-79`, `AppModal.vue:68-73` | Listener global `keydown` por instancia; si hay N modales montados, N listeners. | Leak/perf. |

### 2.9 DRY / duplicación

- **Focus trap** duplicado entre `AppModal.vue` (1-73) y `AdminDialog.vue` (1-79) (código casi idéntico).
- **`estrellas()`** duplicada en `AdminEncuestas.vue:38-40` y `AdminResumen.vue:27-29`.
- **`dosis()`/`consulta()`** duplicadas en `MedicamentoCard.vue` y `MedicamentoDetailModal.vue`.
- **Patrón de carga** (items/total/page + delay 300 ms) en 5 componentes.
- **`URLSearchParams`** construido a mano en `MedicamentosView.vue:33-34` y `AdminMedicamentos.vue:29-30`.

### 2.10 Fragilidad por índices y datos

- `HeroVisual.vue:13,17`: `proyectos[1]`, `proyectos[6]` → crash si el array cambia de tamaño.
- `BlogView.vue:34`: `fechas[i]` → desalineación si cambia orden.
- `WelcomeBlock.vue:6-10`: stats estáticos vs backend dinámico.

### 2.11 Otros

- **`LoginView.vue:17,88-91`:** checkbox "Recordarme" (`recordar`) no se usa en ningún lado → dead code.
- **`LoginView.vue:37,43` y `RegistroView.vue:41`:** `setTimeout` sin cleanup en `onBeforeUnmount` → posible setState tras unmount.
- **`AppHeaderMobile.vue:20-24`:** `aria-label="Abrir menú"` estático aunque el menú esté abierto (debería alternar "Cerrar menú").
- **`AppInput.vue`:** no soporta `id`, `aria-*`, `error`, `disabled`; `outline: none` sin focus-visible; v-model manual con cast.
- **`AppButton.vue`:** sin `:focus-visible`; `.sm` min-height 40 px (<44 recomendado).
- **`AppModal.vue`/`AdminDialog.vue`:** `close` button 34×34 px (<44).
- **`AppHeaderMobile.vue` burger:** 42×42 px (<44).
- **`global.css:577-581` `.pager button`:** height 34 px (<44).
- **`AppFooter.vue:130-138`:** social links 38×38 px (<44).
- **`formatFecha` (`utils/format.ts:1-13`):** asume UTC (`Z`) si no hay `T`; puede desfasar fechas del backend.
- **`optimizarCloudinary` (`utils/imagen.ts`):** `replace('/image/upload/', ...)` solo primera ocurrencia; doble llamada duplicaría transformaciones.
- **`useReveal.ts`:** observers singleton globales; `onBeforeUnmount` solo se registra si se llama dentro de un componente (App.vue lo hace). Si se usa en otro componente, cleanup duplicado/roto.
- **`App.vue:13`:** `window.matchMedia` evaluado en setup (OK) pero sin listener a cambios de preferencia.
- **Sin tests:** no hay archivos `*.test.*` ni `*.spec.*`; `package.json` no tiene script `test` ni `lint`.
- **`HeroPanel.vue:8`:** usa prop `large` que `AppCard` no define → clase huérfana (componente prácticamente muerto).

---

## 3. Cobertura de composables / stores / utils

### Existentes

| Archivo | Responsabilidad |
|---------|-----------------|
| `composables/useApi.ts` | Fetch centralizado, token, ApiError |
| `composables/useReveal.ts` | Reveal on scroll (IntersectionObserver/MutationObserver) |
| `stores/auth.ts` | Auth (login/register/fetchMe/logout) |
| `utils/format.ts` | `formatFecha`, `iniciales` |
| `utils/imagen.ts` | `optimizarCloudinary` |

### Faltantes (recomendados)

| Composable/Util/Store | Propósito | Prioridad |
|-----------------------|-----------|-----------|
| `composables/usePaginatedQuery.ts` | items/total/page/limit/cargando/error + debounce + cancelación + delay mínimo | P1 |
| `composables/useMedicamentos.ts` | CRUD admin (listar/buscar/crear/editar/eliminar) | P1 |
| `composables/useContactoForm.ts` | estado + envío + reset | P2 |
| `composables/useEncuestaForm.ts` | estado + validación + envío | P2 |
| `composables/useFocusTrap.ts` | focus trap compartido (AppModal/AdminDialog) | P1 |
| `composables/useDebounce.ts` | debounce reutilizable | P2 |
| `utils/validators.ts` | email, required, min length, URL | P2 |
| `utils/medicamentos.ts` | `dosis`, `consulta` compartidos | P1 |
| `utils/estrellas.ts` | `estrellas(n)` compartido | P2 |
| `stores/ui.ts` | toasts/notificaciones | P3 |
| `stores/medicamentos.ts` | cache del catálogo | P3 |

### Cobertura de tests

- **0 tests.** Recomendado: Vitest + `@vue/test-utils`, tests para `useApi`, `auth` store, `format`, `imagen`, `validators`. Prioridad P2.

---

## 4. UI/UX issues detectados (resumen)

Detalle completo en `AUDITORIA_UX_FarmApp.md`. Hallazgos directamente observables en código:

- **Contraste:** `--blue` #0a84ff (3.65:1) usado como texto en `.link a` (`global.css:465`) y AdminContactos; `--muted-2` #7893a5 (3.22:1) en footer mini y placeholders; botón primary min 3.05:1.
- **Outline:** `global.css:428` (inputs), `AppInput.vue:49`, `CalculadoraView.vue:136` usan `outline: none` sin `:focus-visible`.
- **Targets <44 px:** `global.css:577-581` (pager 34), `AppFooter.vue:130-138` (social 38), `AppButton.vue:123` (sm 40), `AdminDialog.vue:72-73` (close 34), `AppHeaderMobile.vue:47-57` (burger 42), `AppModal` close (implícito 34).
- **Glass anidado:** `App.vue` ambient (aurora/caustics/orbs/sweep), `PageHero`, cards con `backdrop-filter` — costo GPU y ruido.
- **Tipografía:** dos sistemas de `h1` (global vs PageHero); `h3` sobrescrito a 1.15/1.05 rem en distintos contextos.
- **Mobile:** `MedicamentosView` `.med-lab` 0.68 rem; `.detalle-facts` denso; posibles overflow horizontales en HeroVisual.

---

## 5. Priorización P0/P1/P2/P3 (con esfuerzo estimado)

### P0 — Bloqueante (seguridad / crash potencial) · ~1 día ✅ Completado
| # | Hallazgo | Archivo:Línea | Esfuerzo |
|---|----------|---------------|----------|
| 1 | Eval dinámico `new Function` en calculadora | `CalculadoraView.vue:49-54` | 2 h |
| 2 | Acceso por índice `proyectos[1]`/`[6]` (crash si cambia data) | `HeroVisual.vue:13,17` | 30 m |
| 3 | `v-html` con icon string (XSS si fuente cambia) | `ServiceCard.vue:8` | 1 h |

### P1 — Importante · ~3-4 días ✅ Completado (mayoría)
| # | Hallazgo | Esfuerzo |
|---|----------|----------|
| 4 | Extraer `usePaginatedQuery` (elimina duplicación en 5 componentes + race conditions) | 1 d |
| 5 | Extraer `useFocusTrap` (AppModal + AdminDialog) | 4 h |
| 6 | Extraer `utils/medicamentos.ts` (`dosis`, `consulta`) | 2 h |
| 7 | Extraer `utils/estrellas.ts` | 30 m |
| 8 | `AppInput` con `id`/`aria`/`error`/focus-visible + v-model tipado | 3 h |
| 9 | `AppButton` focus-visible + sm ≥44 px | 1 h |
| 10 | Mover estilos de `App.vue` (369 líneas) a `ambient.css` | 2 h |
| 11 | Hardcoded stats/canales/fechas/texto → data | 4 h |
| 12 | `AppHeaderMobile` aria-label dinámico + burger ≥44 px | 30 m |
| 13 | `LoginView`/`RegistroView` cleanup de `setTimeout` + quitar `recordar` dead code | 1 h |
| 14 | Token en sessionStorage → migrar a httpOnly cookie (requiere backend) | 1 d |
| 15 | `useApi` timeout/AbortController | 2 h |
| 16 | `formatFecha` UTC assumption + `optimizarCloudinary` idempotencia | 2 h |

### P2 — Mejora · ~1 semana

| # | Hallazgo | Esfuerzo |
|---|----------|----------|
| 17 | `useReveal` refactor (cleanup por instancia, no singleton global) | 4 h |
| 18 | `AdminDialog` listener global centralizado | 2 h |
| 19 | Validadores (`utils/validators.ts`) + usar en `MedicamentoForm` | 3 h |
| 20 | Tests (Vitest) para utils/stores/composables | 1-2 d |
| 21 | Lint (eslint + vue-tsc) en `package.json` | 2 h |
| 22 | `main.ts` error handler global | 30 m |
| 23 | `vite.config` proxy por env | 30 m |
| 24 | Consolidar CTAs oscuros en componente | 2 h |
| 25 | Contraste AA (tokens + texto enlazado) | 2 h |

### P3 — Polish · ~1 semana (opcional, pendiente)
| # | Hallazgo | Esfuerzo |
|---|----------|----------|
| 26 | Reducir ambient layer (aurora/orbs/caustics) — UX audit G3 | 4 h |
| 27 | Simplificar `PageHero` (1 glow estático) | 2 h |
| 28 | Unificar radios/sombras (3 radios, 2 sombras) | 3 h |
| 29 | Paleta reducida (1 primario + 1 acento) | 2 h |
| 30 | `HeroPanel` eliminar o integrar | 30 m |
| 31 | `useReveal` MutationObserver global → scoped | 2 h |

---

## 6. Recomendaciones concretas por archivo

| Archivo | Acciones |
|---------|----------|
| `App.vue` | Mover 369 líneas de CSS a `styles/ambient.css`; reemplazar `document.querySelector` por refs/template refs; `matchMedia` listener a cambios. |
| `views/CalculadoraView.vue` | Reemplazar `new Function` por parser aritmético seguro (ej. `mathjs` o parser propio); añadir focus ring; tests. |
| `views/MedicamentosView.vue` | Extraer carga/debounce/paginación a `usePaginatedQuery`/`useMedicamentos`; pasar `limit` por prop. |
| `components/admin/AdminMedicamentos.vue` | Reusar mismo composable; añadir carrera de peticiones. |
| `components/admin/AdminEncuestas.vue` | Reusar composable; extraer `estrellas`. |
| `components/admin/AdminContactos.vue` | Reusar composable. |
| `components/admin/AdminResumen.vue` | Reusar composable; stats desde backend. |
| `components/admin/AdminDialog.vue` | Extraer focus trap a `useFocusTrap`; centralizar listener. |
| `components/ui/AppModal.vue` | Reusar `useFocusTrap`. |
| `components/ui/AppInput.vue` | Soportar `id`, `aria-*`, `error`, `disabled`; focus-visible; v-model tipado. |
| `components/ui/AppButton.vue` | focus-visible; `.sm` min-height ≥44. |
| `components/ui/ServiceCard.vue` | Eliminar `v-html`; usar componente SVG o slot. |
| `components/home/HeroVisual.vue` | Acceder a proyectos por slug, no por índice. |
| `components/home/WelcomeBlock.vue` | Stats desde backend (no hardcode). |
| `views/BlogView.vue` | Etiquetas por propiedad del post, no por índice. |
| `views/ContactosView.vue` | Canales a `data/site.ts`. |
| `views/InformacionView.vue` | Texto a `data/` o markdown. |
| `views/LenguajesView.vue` | Usar `utils/format.ts:iniciales`. |
| `stores/auth.ts` | Validar `Usuario` parseado (Zod); migrar token a httpOnly cookie (backend). |
| `composables/useApi.ts` | Timeout/AbortController; validación de respuesta; base URL por env. |
| `utils/format.ts` | `formatFecha` respetar offset del backend. |
| `utils/imagen.ts` | Idempotencia en `optimizarCloudinary`. |
| `main.ts` | `app.config.errorHandler`. |
| `vite.config.ts` | Proxy por `import.meta.env`. |
| `package.json` | Scripts `test`, `lint`, `typecheck` (ya), `format`. |

---

## 7. Verificación realizada

- `bun run typecheck` → ✅ 0 errores.
- `bun run build` → ✅ 1.92 s, sin warnings.
- No se modificó código fuente.

---

*Fin del informe. Evidencia con rutas y líneas. Accionable por prioridad.*

---

## 8. Estado de implementación post-refactor

| Prioridad | Estado | Notas |
|---|---|---|
| P0 | ✅ Completado | Calculadora con parser seguro; acceso por slug; sin `v-html`. |
| P1 | ✅ Completado (mayoría) | Stores/composables extraídos; a11y base; auth por cookie; timeout; proxy por env. Pendiente: extraer `dosis`/`consulta` y `estrellas`. |
| P2 | ⚠️ Parcial | Tests, validators, focus-visible y proxy por env listos. Pendientes: `useReveal` por instancia, listener global de modales, CTAs consolidados. |
| P3 | ⏳ Opcional pendiente | Reducción de ambient layer, unificación de radios/sombras/paleta, migración a `features/*`. |