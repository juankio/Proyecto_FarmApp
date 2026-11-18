# Auditoría de Diseño Visual y UX — FarmApp (Frontend Vue 3 + Vite)

**Auditora:** Robin (CSO/UX)  
**Alcance:** Código fuente de `frontend/src` (Vue 3 + Vite), estilos globales (`global.css`, `tokens.css`, `admin.css`) y todas las vistas/componentes.  
**Breakpoints evaluados:** Desktop 1440 px, Tablet 900/860/820 px, Mobile 390 px.  
**Capturas:** Referenciadas por vista y breakpoint (`[Cap: Home · 1440]`, `[Cap: Medicamentos · 390]`). Usopp debe adjuntar las capturas reales con esos nombres para trazabilidad.  
**Restricción cumplida:** No se modificó código; este informe es solo de hallazgos y recomendaciones.

---

## 1. Resumen ejecutivo

FarmApp presenta una identidad visual **"glassmorphism acuático"** muy marcada: fondos animados (aurora, caústicas, orbs, ondas), múltiples capas de `backdrop-filter`, radios grandes (24–40 px) y una paleta azul/menta/lavanda. El resultado es vistoso pero **sobrecargado**: ruido visual alto, contenedores de vidrio anidados sobre vidrio, animaciones continuas y jerarquía tipográfica inconsistente. En mobile (390 px) la legibilidad se mantiene, pero aparecen targets táctiles subdimensionados y texto muy pequeño (≤0.68 rem) en badges/etiquetas.

**Veredicto:** Diseño funcional pero con deuda de consistencia. Recomiendo una **dirección "minimalista elegante diferenciado"**: mantener la identidad acuática pero reducirla a un sistema de tokens estricto, eliminar el glass sobre glass, unificar radios/sombras y bajar la animación decorativa a un acento.

---

## 2. Metodología y alcance

Archivos auditados:

- Estilos: `src/styles/tokens.css`, `src/styles/global.css`, `src/styles/admin.css`
- Layout: `AppHeader.vue`, `AppFooter.vue`, `PageHero.vue`, `HeroPanel.vue`
- UI: `AppCard.vue`, `AppButton.vue`, `AppInput.vue`, `AppModal.vue`, `AppAccordion.vue`, `SectionHeader.vue`, `ImageTile.vue`, `ServiceCard.vue`, `AppPagination.vue`, `AppSkeleton.vue`
- Admin: `AdminDialog.vue`, `AdminMedicamentos.vue`, `AdminContactos.vue`, etc.
- Vistas: `HomeView`, `MedicamentosView`, `LoginView`, `RegistroView`, `ContactosView`, `EncuestaView`, `ServiciosView`, `FeriaView`, `ProyectoView`, `InfoCenacapView`, `BlogView`, `CalculadoraView`, `LenguajesView`, `AdminView`, `NotFoundView`, `BannerYtView`.

Contraste calculado con WCAG AA (texto normal ≥4.5:1, texto grande ≥3:1, UI ≥3:1). Targets táctiles: mínimo recomendado 44×44 px (WCAG 2.5.5 / Apple HIG).

---

## 3. Hallazgos

### 3.1 Jerarquía tipográfica

| ID | Sev | Ref | Hallazgo | Impacto | Recomendación |
|---|---|---|---|---|---|
| T1 | P1 | `global.css:76-101` vs `PageHero.vue:258-264` | `h1` global (700, lh 1.12, ls -0.028em) vs `PageHero h1` (800, lh 1.03, ls -0.045em). Dos sistemas de encabezado compiten. | Ritmo visual inconsistente entre vistas que usan PageHero y las que no. | Definir un único token `--font-size-h1` y un único peso 700/800 consistente. |
| T2 | P2 | `MedicamentosView.vue:384`, `HomeView.vue:403` | `h3` sobrescrito a 1.15 rem y 1.05 rem en distintos contextos; global h3 clamp(1.12–1.35). | Jerarquía plana; títulos de cards compiten con h2 de sección. | Unificar h3 a 1.05–1.12 rem, weight 650. |
| T3 | P2 | `global.css:103-108` | `p` global color `--muted` (#4f7189) lh 1.7, pero componentes usan `--ink-soft` y `--muted-2` sin criterio. | Texto de cuerpo con 3 tonos distintos sin regla. | Tokens semánticos: `--text-body`, `--text-secondary`, `--text-muted`. |
| T4 | P1 | `global.css:465` | `.link a` color `--blue` (#0a84ff) 3.65:1 sobre blanco → FAIL AA para texto normal. | Enlaces "registrarme / ingresar" en login/registro/contacto no cumplen contraste. | Usar `--blue-deep` (#0062cc, 5.8:1) para texto enlazado. |
| T5 | P1 | `global.css:433`, `AppFooter.vue:201`, `AppInput.vue:43` | `--muted-2` (#7893a5) 3.22:1 sobre blanco → FAIL AA. Usado en placeholders y texto "Hecho con Vue…". | Texto secundario ilegible para usuarios con baja visión. | Subir a #5a7a92 (≥4.5) o usar `--muted`. |
| T6 | P2 | `MedicamentosView.vue:377,506`, `admin.css:117,322` | Texto de 0.66–0.68 rem (≈10.5 px) en badges/etiquetas. | Legibilidad reducida, especialmente mobile. | Mínimo 0.72 rem (11.5 px) para texto informativo. |
| T7 | P2 | `global.css:185,191` | `.eyebrow` 0.74 rem uppercase + `.lede` clamp(0.98–1.1). Gap de escala grande entre eyebrow y título. | Jerarquía "saltada"; eyebrow casi invisible. | Ajustar eyebrow a 0.78 rem y aumentar tracking a 0.14em. |

### 3.2 Densidad y ritmo vertical

| ID | Sev | Ref | Hallazgo | Impacto | Recomendación |
|---|---|---|---|---|---|
| D1 | P2 | `global.css:151-153,601-608` | `.section` margin-top 64 px (46 px en ≤640). Ritmo uniforme pero sin variación entre secciones densas. | Monotonía vertical; bloques se sienten iguales. | Introducir escala de espaciado (24/40/64/96) y aplicar 96 solo entre secciones mayores. |
| D2 | P2 | `PageHero.vue:51` | PageHero padding clamp(36, 5.4vw, 76) px + radius 40 px. Hero ocupa mucho alto en mobile. | Push del contenido; scroll excesivo en 390 px. | Reducir padding mobile a 24–28 px y radius a 24 px en ≤640. |
| D3 | P3 | `HomeView.vue:28-181` | Home tiene 7 secciones consecutivas con el mismo patrón (SectionHeader + grid). | Fatiga de scroll; sensación de catálogo. | Agrupar en 3 bloques con separadores visuales y CTA intermedios. |
| D4 | P3 | `global.css:316-319` | `.divider` definido pero casi no usado. | Oportunidad de ritmo desperdiciada. | Usar divisores sutiles entre secciones mayores. |

### 3.3 Contenedores anidados (glass sobre glass) y ruido visual

| ID | Sev | Ref | Hallazgo | Impacto | Recomendación |
|---|---|---|---|---|---|
| G1 | P1 | `HomeView.vue:68,300` | `.welcome` (glass-strong) contiene `.stat` (fondo blanco translúcido) y `.glass` cards. Glass sobre glass. | Pérdida de contraste y profundidad confusa. | Un solo nivel de superficie: fondo sólido blanco para cards internas. |
| G2 | P1 | `ImageTile.vue:25`, `ServiceCard.vue:6`, `MedicamentosView.vue:182` | Tiles/cards usan `.glass` + `backdrop-filter: blur(24px)`. Anidados dentro de secciones ya translúcidas. | Costo de render y ruido. | Eliminar backdrop-filter en cards internas; usar superficie sólida `rgba(255,255,255,0.92)`. |
| G3 | P1 | `App.vue:102-110,217-273` | Ambient layer con aurora, caustics, dots, rings, 3 orbs + sweep animado continuamente. | Ruido visual alto; distrae del contenido; costo GPU. | Reducir a 1–2 capas estáticas o de baja opacidad; desactivar animación decorativa por defecto. |
| G4 | P2 | `PageHero.vue:19-27,80-135,137-191` | PageHero incluye 7 bubbles animadas + 2 glows + sheen. Repetido en cada vista. | Cada página "grita"; inconsistencia con resto. | Hero minimalista: 1 gradiente suave + 1 glow estático. |
| G5 | P2 | `global.css:48-59,61-74` | `body::after` onda SVG animada `wave-sway` 24 s. | Movimiento periférico constante; molestia. | Eliminar o convertir en estático. |
| G6 | P2 | `global.css:217-242` | `.glass::after` sheen + `.glass::before` sheen animado en hover (transform skewX 420%). | Efecto "brillo" en cada card; fatiga. | Mantener solo en CTA primario, no en todas las cards. |
| G7 | P3 | `HomeView.vue:43-58` | Hero media con `.float glass` (cards flotantes) + `.chip glass` sobre `.halo`. Glass anidado en hero. | Ruido en el primer impacto. | Reemplazar por una ilustración/imagen única. |

### 3.4 Paleta y contraste (WCAG AA)

| ID | Sev | Ref | Hallazgo | Impacto | Recomendación |
|---|---|---|---|---|---|
| C1 | P1 | `tokens.css:6`, `global.css:465` | `--blue` #0a84ff (3.65:1) usado como texto en `.link a` y AdminContactos. | FAIL AA texto normal. | Texto enlazado con `--blue-deep`. |
| C2 | P1 | `tokens.css:5` | `--muted-2` #7893a5 (3.22:1) en footer mini y placeholders. | FAIL AA. | Subir luminosidad o usar `--muted`. |
| C3 | P1 | `AppButton.vue:58` | Botón primary texto blanco sobre gradiente #2396ff→#0062cc (min 3.05:1). Cumple AA large text (3:1) pero no normal (4.5). | Texto de botón 0.94–1 rem; riesgo en auditoría estricta. | Oscurecer gradiente a #1a7fe8→#0052a3 o subir peso a 700 y tamaño ≥1 rem. |
| C4 | P2 | `MedicamentosView.vue:408` | `.med-desc` color `--ink-soft` (#123f61) sobre glass (translúcido). Ratio variable según fondo. | Contraste no determinístico. | Texto sobre superficie sólida o `--ink`. |
| C5 | P2 | `HomeView.vue:368` | `.canva` texto blanco sobre gradiente azul oscuro (12.5:1 OK) pero `.canva p` rgba(234,246,251,0.78) → ~9:1 OK. | OK, pero patrón duplicado en Servicios/InfoCenacap/Blog. | Consolidar componente CTA oscuro. |
| C6 | P3 | `tokens.css:2-10` | Paleta con 5 acentos (blue, aqua, mint, lavender, blue-deep) sin jerarquía de uso. | Identidad difusa. | Definir 1 primario + 1 acento + neutros. |

### 3.5 Consistencia de radios, sombras, bordes

| ID | Sev | Ref | Hallazgo | Impacto | Recomendación |
|---|---|---|---|---|---|
| R1 | P2 | `AppButton.vue:33,126`, `AppInput.vue:33`, `AppHeader.vue:92`, `AppFooter.vue:89` | Radios ad-hoc 14, 12, 20, 36 px fuera de tokens (12/16/24/32/40). | Inconsistencia visual entre controles. | Mapear: botón 12, input 12, card 16/24, hero 24/32. |
| R2 | P2 | `global.css:32-34`, `HomeView.vue:217,336` | Sombras ad-hoc (`0 18px 36px`, `0 20px 44px`, `0 12px 34px`) además de `--depth*`. | Elevación inconsistente. | Usar solo 3 niveles: `--depth-sm/md/lg`. |
| R3 | P3 | `tokens.css:40-44` | 5 radios (xs/sm/base/lg/xl) demasiados; xl 40 px excesivo en mobile. | Complejidad. | Reducir a 3: 8/12/20. |
| R4 | P3 | `global.css:11-12`, `tokens.css:11-12` | Bordes mezclan `--line` (blanco translúcido) y `--line-soft` (azul translúcido) sin regla. | Contornos inconsistentes en dark/light. | 2 bordes: `--border` (light) y `--border-strong`. |

### 3.6 Patrones de diseño

| ID | Sev | Ref | Hallazgo | Impacto | Recomendación |
|---|---|---|---|---|---|
| P-1 | P2 | `HeroPanel.vue:8` | Usa `AppCard large` pero `AppCard` no define prop `large` (solo `padded/hover/tone`). Clase `large` huérfana. | HeroPanel sin padding esperado; componente prácticamente muerto. | Eliminar HeroPanel o integrarlo con AppCard padded. |
| P-2 | P2 | `AppInput.vue` | Sin `id`/`aria` forwarding explícito ni estado de error; `outline: none` sin `:focus-visible`. | Accesibilidad de formularios. | Añadir `:focus-visible` ring y prop `error`. |
| P-3 | P2 | `AppModal.vue:45`, `AppCard.vue` | Modal radius `--radius-lg` (32) vs cards 24; inconsistente con dialog admin 32. OK pero dialog close 34 px. | Minor. | Estandarizar. |
| P-4 | P2 | `MedicamentosView.vue:129-144` | `.catalog-tools` es glass con padding 16/18; contiene input + button + meta en una barra translúcida. | Glass sobre glass en vista de catálogo. | Superficie sólida. |
| P-5 | P3 | `BlogView.vue:29` | Cards de blog con `.thumb` interno (radius 16) + card glass. | Anidamiento. | Simplificar. |
| P-6 | P2 | `ProyectoView.vue:149-157` | `.nav-card glass` para navegación anterior/siguiente; glass innecesario. | Ruido. | Superficie sólida con borde. |
| P-7 | P2 | `CalculadoraView.vue:92` | Calculadora card con `tabindex=0` y `outline:none`; foco invisible. | Accesibilidad teclado. | Añadir focus ring. |

### 3.7 Mobile (390 px)

| ID | Sev | Ref | Hallazgo | Impacto | Recomendación |
|---|---|---|---|---|---|
| M1 | P1 | `global.css:577-581` | `.pager button` height 34 px → target <44. | Dificultad táctil en paginación. | min-height 44 px. |
| M2 | P1 | `AppFooter.vue:130-138` | Social links 38×38 px. | Target subdimensionado mobile. | 44×44. |
| M3 | P2 | `AppButton.vue:123` | `.sm` min-height 40 px. | Botones pequeños (Consultar, filtros) bajo 44. | 44 px en mobile o padding vertical. |
| M4 | P2 | `AdminDialog.vue:72-73`, `AppModal` close? | Close button 34×34 px. | Target pequeño. | 40–44 px. |
| M5 | P2 | `MedicamentosView.vue:377` | `.med-lab` 0.68 rem uppercase. | Legibilidad baja en mobile. | ≥0.72 rem. |
| M6 | P2 | `MedicamentosView.vue:490-503` | `.detalle-facts` 3 columnas → 1 columna ≤620 OK. Pero gap 10 y padding 10/12; texto 0.82/0.66 rem. | Información densa en modal mobile. | Aumentar a 0.85 rem y gap 12. |
| M7 | P3 | `HomeView.vue:184-287` | Hero visual 1:1 en 366 px con floats 64 px; puede desbordar horizontalmente en 390 (float-a left -4%). | Posible scroll horizontal. | Contener con overflow:hidden y reducir floats en mobile. |
| M8 | P3 | `AppHeader.vue:320-330` | En ≤420 oculta brand span; `.login`/`.panel` padding reducido. | OK, pero burger 42×42 <44. | 44×44. |
| M9 | P2 | `admin.css:483-531` | Admin side tabs horizontal scroll en mobile; `.admin-tab` white-space nowrap. | Usable pero sin affordance de scroll. | Añadir fade/indicador. |
| M10 | P3 | `MedicamentosView.vue:280-282` | `.catalog-tools` padding 16/18 y gap 14; en mobile flex-direction column OK. | OK. | — |

### 3.8 Accesibilidad y foco

| ID | Sev | Ref | Hallazgo | Impacto | Recomendación |
|---|---|---|---|---|---|
| A1 | P1 | `AppInput.vue:38`, `global.css:428`, `CalculadoraView.vue:136` | `outline: none` sin `:focus-visible` en inputs/botones/calc. | Usuarios teclado no ven foco. | Añadir `:focus-visible { outline: 2px solid var(--blue-deep); outline-offset: 2px; }`. |
| A2 | P2 | `AppButton.vue` | Sin estado `:focus-visible`. | Ídem. | Añadir. |
| A3 | P2 | `AppHeader.vue` | Nav links sin focus ring visible (solo background hover). | Navegación teclado. | Añadir focus-visible. |
| A4 | P2 | `ImageTile.vue` | Tile es `<a>`/`RouterLink` sin focus-visible; hover translateY solo. | Foco invisible. | Añadir. |
| A5 | P3 | `PageHero.vue` | Bubbles `aria-hidden` OK; pero animaciones no respetan `prefers-reduced-motion`? Sí, global reduce motion desactiva `.reveal` y `.glass::before` y `body::after`, pero PageHero bubbles/glow/sheen tienen `@media (prefers-reduced-motion: no-preference)` → OK. | Bien. | Mantener. |

---

## 4. Tabla de contraste (pares clave)

| Par | Ratio | AA normal | AA large |
|---|---|---|---|
| `--muted` #4f7189 / #ffffff | 5.18 | OK | OK |
| `--muted` / #eaf6fb | 4.70 | OK (justo) | OK |
| `--muted-2` #7893a5 / #ffffff | 3.22 | FAIL | OK |
| `--blue` #0a84ff / #ffffff | 3.65 | FAIL | OK |
| `--blue-deep` #0062cc / #ffffff | 5.80 | OK | OK |
| Botón primary (min #2396ff) / #ffffff | 3.05 | FAIL | OK (justo) |
| `--ink` #082f4d / #eaf6fb | 12.51 | OK | OK |
| Error #a11b1b / #ff7a7a bg | 3.09 | FAIL | OK |

---

## 5. Recomendación de dirección de diseño (minimalista elegante diferenciado)

**Concepto:** "Farmacia clínica premium" — limpio, confiable, con un solo acento acuático. Diferenciarse de la competencia (sitios farmacéuticos saturados de azul genérico) mediante **tipografía editorial, espacio en blanco generoso y una sola superficie glass en el hero**, no en todas las cards.

### 5.1 Principios

1. **Un solo nivel de superficie.** Cards sólidas blancas (92% opacidad) con borde 1 px `rgba(12,74,112,0.08)` y sombra `--depth-sm`. Glass solo en el hero principal.
2. **Paleta reducida.** Primario `--ink` #082f4d (texto), acento `--blue-deep` #0062cc (CTA), neutros #f4f8fb/#ffffff. Eliminar mint/lavender/aqua del UI (reservar para ilustraciones).
3. **Tipografía editorial.** Mantener Inter pero con escala estricta: 12/14/16/20/28/40/56 px. Peso 400 body, 600 headings, 700 display. Line-height 1.5 body, 1.1 headings.
4. **Radios reducidos.** 8 (inputs/botones) / 12 (cards) / 16 (hero). Eliminar 24/32/40.
5. **Sombras en 2 niveles.** `--shadow-sm` (cards) y `--shadow-lg` (modales/hero). Eliminar sheen animado.
6. **Animación con propósito.** Solo: fade-in de secciones (reveal), hover lift en cards (translateY -2px), transición de página. Eliminar aurora/orbs/caustics/wave/bubbles/sheen.
7. **Mobile-first real.** Targets ≥44 px, texto mínimo 12 px, padding 16–24 px, sin scroll horizontal.
8. **Accesibilidad.** Focus-visible en todos los interactivos, contraste AA en todos los textos, `prefers-reduced-motion` respetado (ya parcial).

### 5.2 Cambios de alto impacto (orden sugerido)

1. Eliminar capas decorativas del ambient (`App.vue` ambient, `body::after`).
2. Reemplazar `.glass` en cards por superficie sólida; mantener glass solo en `PageHero`.
3. Simplificar `PageHero` (1 gradiente + 1 glow estático, sin bubbles).
4. Unificar radios/sombras vía tokens (3 radios, 2 sombras).
5. Corregir contraste: `--blue` → `--blue-deep` en texto; `--muted-2` → #5a7a92.
6. Añadir `:focus-visible` global.
7. Ajustar targets táctiles (pager, social, close, sm button) a ≥44 px.
8. Consolidar CTAs oscuros (canva/servicios/info-cenacap/blog) en un componente.

### 5.3 Métricas de éxito

- Lighthouse Performance ≥90 (mobile) — hoy penalizado por múltiples backdrop-filter + animaciones.
- Contraste AA 100% en texto.
- 0 contenedores glass anidados.
- Targets táctiles ≥44 px en todos los controles.
- Reducción de CSS por vista ≥30% al consolidar tokens.

---

## 6. Priorización consolidada

- **P0 (bloqueante):** Ninguno que rompa funcionalidad, pero C1/C2/C3 son bloqueantes para auditoría de accesibilidad (contraste).
- **P1 (importante):** T1, T4, T5, C1, C2, C3, G1, G2, G3, A1, M1, M2.
- **P2 (mejora):** T2, T3, T6, T7, D1, D2, G4, G5, G6, R1, R2, P-1..P-7, M3–M9, A2–A4, C4.
- **P3 (polish):** D3, D4, G7, R3, R4, C5, C6, M10, A5.

---

## 7. Notas para Usopp (capturas)

Adjuntar capturas con nombres sugeridos para correlacionar con hallazgos:

- `Home_1440.png`, `Home_390.png`
- `Medicamentos_1440.png`, `Medicamentos_390.png` (catálogo + modal detalle)
- `Login_1440.png`, `Registro_390.png`
- `Contactos_1440.png`
- `Admin_1440.png`, `Admin_390.png` (tabs horizontales)
- `Proyecto_1440.png` (galería + nav cards)
- `Blog_1440.png` (cards + CTA oscuro)

---

*Fin del informe. Sin modificaciones de código realizadas.*
