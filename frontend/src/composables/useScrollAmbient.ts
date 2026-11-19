import { onBeforeUnmount, onMounted } from 'vue';

export function useScrollAmbient(): void {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let cuadroScroll = 0;

  function actualizarScroll(): void {
    cuadroScroll = 0;
    if (reduceMotion.matches) return;

    const ambiente = document.querySelector<HTMLElement>('.ambient');
    if (ambiente) {
      ambiente.style.setProperty('--scroll', `${window.scrollY}`);
    }
  }

  function manejarScroll(): void {
    if (cuadroScroll) return;
    cuadroScroll = requestAnimationFrame(actualizarScroll);
  }

  onMounted(() => {
    window.addEventListener('scroll', manejarScroll, { passive: true });
    manejarScroll();
  });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', manejarScroll);
    if (cuadroScroll) cancelAnimationFrame(cuadroScroll);
    cuadroScroll = 0;
  });
}
