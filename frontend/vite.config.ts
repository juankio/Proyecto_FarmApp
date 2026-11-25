import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget =
    env.VITE_API_PROXY_TARGET ||
    env.VITE_PROXY_TARGET ||
    'http://localhost:3000';

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api/farmacias/foto': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
        '/api/medicamentos': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
