import { onBeforeUnmount, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export function useAuthBootstrap(): void {
  const route = useRoute();
  const router = useRouter();
  const auth = useAuthStore();

  function sesionExpirada(): void {
    auth.logout();
    router.push({ path: '/login', query: { redirect: route.fullPath } });
  }

  onMounted(async () => {
    if (!auth.user) {
      try {
        await auth.fetchMe();
      } catch {
        auth.logout();
      }
    }
    window.addEventListener('farmapp:unauthorized', sesionExpirada);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('farmapp:unauthorized', sesionExpirada);
  });
}