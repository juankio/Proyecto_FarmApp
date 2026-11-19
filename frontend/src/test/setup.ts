import { vi } from 'vitest';

// jsdom no implementa matchMedia por defecto; stub seguro.
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// Silenciar console.error ruidoso en tests (opcional, mantenemos warnings).
vi.spyOn(console, 'error').mockImplementation(() => {});