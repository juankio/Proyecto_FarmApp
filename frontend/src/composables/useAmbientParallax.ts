import { onBeforeUnmount, onMounted } from 'vue';

export function useAmbientParallax(): void {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let cuadro = 0;
  let punteroX = 0;
  let punteroY = 0;

  function moverAmbiente(event: PointerEvent): void {
    if (event.pointerType === 'touch' || reduceMotion.matches) return;

    punteroX = event.clientX;
    punteroY = event.clientY;
    if (cuadro) return;

    cuadro = requestAnimationFrame(() => {
      cuadro = 0;
      const x = punteroX / window.innerWidth - 0.5;
      const y = punteroY / window.innerHeight - 0.5;

      const ambiente = document.querySelector<HTMLElement>('.ambient');
      if (ambiente) {
        ambiente.style.setProperty('--px', `${(x * 24).toFixed(1)}px`);
        ambiente.style.setProperty('--py', `${(y * 16).toFixed(1)}px`);
      }
    });
  }

  onMounted(() => {
    window.addEventListener('pointermove', moverAmbiente, { passive: true });
  });

  onBeforeUnmount(() => {
    window.removeEventListener('pointermove', moverAmbiente);
    if (cuadro) cancelAnimationFrame(cuadro);
    cuadro = 0;
  });
}
