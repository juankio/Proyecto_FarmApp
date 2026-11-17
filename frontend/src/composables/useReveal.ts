import { onBeforeUnmount } from 'vue';

let observer: IntersectionObserver | null = null;
let mutation: MutationObserver | null = null;
let frame = 0;

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
    { threshold: 0.05, rootMargin: '0px 0px -30px 0px' },
  );
  return observer;
}

function scheduleReveal(): void {
  if (frame) return;
  frame = window.requestAnimationFrame(() => {
    frame = 0;
    revealNow();
  });
}

function revealNow(): void {
  const pendientes = document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)');

  if (!('IntersectionObserver' in window)) {
    pendientes.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = ensureObserver();
  pendientes.forEach((el) => io.observe(el));
}

export function useReveal() {
  function start(): void {
    revealNow();

    if (mutation) return;
    mutation = new MutationObserver(scheduleReveal);
    mutation.observe(document.body, { childList: true, subtree: true });
  }

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = null;
    mutation?.disconnect();
    mutation = null;
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
  });

  return { start, revealAll: scheduleReveal };
}
