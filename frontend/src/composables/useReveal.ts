import { onBeforeUnmount } from 'vue';

// Duración de entrada alineada con --motion-slow (src/styles/motion.css).
// Mantener sincronizado si se cambia el token.
const DURACION_REVEAL_MS = 850;
const MARGEN_REVEAL_PX = 200;

let observer: IntersectionObserver | null = null;
let mutation: MutationObserver | null = null;
let frame = 0;
let cuadroScroll = 0;
let recienInsertados: HTMLElement[] = [];

function ensureObserver(): IntersectionObserver {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer?.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.05, rootMargin: '0px 0px 120px 0px' },
  );
  return observer;
}

function revelarVisibles(elementos: HTMLElement[]): void {
  const margen = window.innerHeight + MARGEN_REVEAL_PX;
  const visibles: HTMLElement[] = [];

  for (const el of elementos) {
    if (!el.classList.contains('is-visible') && el.getBoundingClientRect().top < margen) {
      visibles.push(el);
    }
  }

  const io = ensureObserver();
  for (const el of visibles) el.classList.add('is-visible');
  for (const el of elementos) {
    if (!el.classList.contains('is-visible')) io.observe(el);
  }
}

function revelarPorPosicion(): void {
  const elementos = new Set<HTMLElement>(document.querySelectorAll<HTMLElement>('.reveal'));
  for (const el of recienInsertados) elementos.add(el);
  recienInsertados = [];
  revelarVisibles(Array.from(elementos));
}

function scheduleReveal(): void {
  if (frame) return;
  frame = window.requestAnimationFrame(() => {
    frame = 0;
    revelarPorPosicion();
  });
}

function alHacerScroll(): void {
  if (cuadroScroll) return;
  cuadroScroll = window.requestAnimationFrame(() => {
    cuadroScroll = 0;
    revelarPorPosicion();
  });
}

function alRedimensionar(): void {
  scheduleReveal();
}

export function useReveal() {
  function start(): void {
    revelarPorPosicion();

    if (mutation) return;
    mutation = new MutationObserver((registros) => {
      for (const registro of registros) {
        for (const nodo of Array.from(registro.addedNodes)) {
          if (!(nodo instanceof HTMLElement) || nodo.closest('.leaflet-container, .map-stage')) {
            continue;
          }
          if (nodo.classList.contains('reveal')) recienInsertados.push(nodo);
          nodo.querySelectorAll<HTMLElement>('.reveal').forEach((el) => recienInsertados.push(el));
        }
      }
      scheduleReveal();
    });
    mutation.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('scroll', alHacerScroll, { passive: true });
    window.addEventListener('resize', alRedimensionar, { passive: true });
    window.addEventListener('load', scheduleReveal);

    // Revelar todo el contenido en el siguiente frame: garantiza que ninguna
    // sección quede atrapada por scroll instantáneo o layout shift, manteniendo
    // la transición de entrada (0.85s) visible.
    window.requestAnimationFrame(() => {
      document
        .querySelectorAll<HTMLElement>('.reveal:not(.is-visible)')
        .forEach((el) => el.classList.add('is-visible'));
    });
  }

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = null;
    mutation?.disconnect();
    mutation = null;
    window.removeEventListener('scroll', alHacerScroll);
    window.removeEventListener('resize', alRedimensionar);
    window.removeEventListener('load', scheduleReveal);
    if (frame) window.cancelAnimationFrame(frame);
    if (cuadroScroll) window.cancelAnimationFrame(cuadroScroll);
    frame = 0;
    cuadroScroll = 0;
    recienInsertados = [];
  });

  return { start, revealAll: scheduleReveal };
}
