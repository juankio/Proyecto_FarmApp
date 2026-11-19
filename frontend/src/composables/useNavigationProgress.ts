import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Router } from 'vue-router';

export function useNavigationProgress(routerArg?: Router) {
  const router = routerArg ?? useRouter();
  const navegando = ref(false);

  let inicioNavegacion = 0;
  let temporizadorBarra: number | undefined;
  let instalado = false;
  let quitarGuardia: (() => void) | null = null;
  let quitarSeguimiento: (() => void) | null = null;

  function instalar(): () => void {
    if (instalado) {
      return () => undefined;
    }
    instalado = true;

    quitarGuardia = router.beforeEach(() => {
      inicioNavegacion = performance.now();
      navegando.value = true;
    });

    quitarSeguimiento = router.afterEach(() => {
      const restante = Math.max(0, 160 - (performance.now() - inicioNavegacion));
      window.clearTimeout(temporizadorBarra);
      temporizadorBarra = window.setTimeout(() => {
        navegando.value = false;
      }, restante);
    });

    return () => {
      quitarGuardia?.();
      quitarSeguimiento?.();
      window.clearTimeout(temporizadorBarra);
      temporizadorBarra = undefined;
      instalado = false;
      quitarGuardia = null;
      quitarSeguimiento = null;
    };
  }

  return { navegando, instalar };
}
