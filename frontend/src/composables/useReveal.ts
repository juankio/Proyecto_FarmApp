import { onBeforeUnmount } from 'vue';

// Duración de entrada alineada con --motion-slow (src/styles/motion.css).
// Mantener sincronizado si se cambia el token.
const DURACION_REVEAL_MS = 850;

let observer: IntersectionObserver | null = null;
let mutation: MutationObserver | null = null;
let resizeObs: ResizeObserver | null = null;
let frame = 0;
let cuadroScroll = 0;
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
function revelarPorPosicion(): void {
  const margen = window.innerHeight + 200;
  document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)').forEach((el) => {
    if (el.getBoundingClientRect().top < margen) el.classList.add('is-visible');
  });
}
function revelarPendientes(): void {
  const io = ensureObserver();
  document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)').forEach((el) => io.observe(el));
}

function scheduleReveal(): void {
  if (frame) return;
  frame = window.requestAnimationFrame(() => {
    frame = 0;
    revelarPorPosicion();
    revelarPendientes();
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
    revelarPendientes();

    if (mutation) return;
    mutation = new MutationObserver(scheduleReveal);
    mutation.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('scroll', alHacerScroll, { passive: true });
    window.addEventListener('load', scheduleReveal);

    if ('ResizeObserver' in window) {
      resizeObs = new ResizeObserver(alRedimensionar);
      resizeObs.observe(document.body);
    }

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
    resizeObs?.disconnect();
    resizeObs = null;
    window.removeEventListener('scroll', alHacerScroll);
    window.removeEventListener('load', scheduleReveal);
    if (frame) window.cancelAnimationFrame(frame);
    if (cuadroScroll) window.cancelAnimationFrame(cuadroScroll);
    frame = 0;
    cuadroScroll = 0;
  });

  return { start, revealAll: scheduleReveal };
}
