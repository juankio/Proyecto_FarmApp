import { createRouter, createWebHistory } from 'vue-router';
import { nextTick } from 'vue';
import { useAuthStore } from '../stores/auth';
import HomeView from '../views/HomeView.vue';

const MAX_FRAMES_OBJETIVO = 90;

function esperarFrame(): Promise<void> {
  return new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
}

function buscarObjetivo(hash: string): HTMLElement | null {
  const id = hash.startsWith('#') ? hash.slice(1) : hash;
  try {
    return document.getElementById(decodeURIComponent(id));
  } catch {
    return document.getElementById(id);
  }
}

async function localizarObjetivo(hash: string): Promise<HTMLElement | null> {
  await nextTick();
  for (let espera = 0; espera < MAX_FRAMES_OBJETIVO; espera++) {
    const objetivo = buscarObjetivo(hash);
    if (objetivo && objetivo.offsetHeight > 0) return objetivo;
    await esperarFrame();
  }
  return buscarObjetivo(hash);
}

export const router = createRouter({
  history: createWebHistory(),
  async scrollBehavior(to, from, saved) {
    if (saved) return saved;
    if (!to.hash) return { top: 0 };

    const objetivo = await localizarObjetivo(to.hash);
    if (!objetivo) return { top: 0 };

    const comportamiento = from.path === to.path ? 'smooth' : 'auto';
    await esperarFrame();
    objetivo.scrollIntoView({ behavior: comportamiento, block: 'start' });

    if (comportamiento === 'auto') {
      await esperarFrame();
      if (objetivo.getBoundingClientRect().top < 0) {
        objetivo.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }
    return false;
  },
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Inicio' } },
    {
      path: '/servicios',
      name: 'servicios',
      component: () => import('../views/ServiciosView.vue'),
      meta: { title: 'Servicios' },
    },
    {
      path: '/proyectos/:slug',
      redirect: '/ubicaciones',
    },
    {
      path: '/ubicaciones',
      name: 'ubicaciones',
      component: () => import('../views/UbicacionesView.vue'),
      meta: { title: 'Droguerías en Villavicencio' },
    },
    {
      path: '/medicamentos',
      name: 'medicamentos',
      component: () => import('../views/MedicamentosView.vue'),
      meta: { title: 'Medicamentos' },
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogView.vue'),
      meta: { title: 'Blog' },
    },
    {
      path: '/informacion',
      name: 'informacion',
      component: () => import('../views/InformacionView.vue'),
      meta: { title: 'Nosotros' },
    },
    {
      path: '/info-cenacap',
      redirect: '/informacion',
    },
    {
      path: '/lenguajes',
      name: 'lenguajes',
      component: () => import('../views/LenguajesView.vue'),
      meta: { title: 'Lenguajes de programación' },
    },
    {
      path: '/calculadora',
      redirect: '/',
    },
    {
      path: '/banner-yt',
      name: 'banner-yt',
      component: () => import('../views/BannerYtView.vue'),
      meta: { title: 'Banner' },
    },
    {
      path: '/encuesta',
      name: 'encuesta',
      component: () => import('../views/EncuestaView.vue'),
      meta: { title: 'Encuesta' },
    },
    {
      path: '/contactos',
      name: 'contactos',
      component: () => import('../views/ContactosView.vue'),
      meta: { title: 'Contacto' },
    },
    {
      path: '/registro',
      name: 'registro',
      component: () => import('../views/RegistroView.vue'),
      meta: { title: 'Registro' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: 'Ingreso' },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { title: 'Panel', requiresAdmin: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: 'Página no encontrada' },
    },
  ],
});

router.beforeEach(async (to) => {
  if (!to.meta.requiresAdmin) return true;

  const auth = useAuthStore();

  if (!auth.user) {
    try {
      await auth.fetchMe();
    } catch {
      auth.logout();
      return { path: '/login', query: { redirect: to.fullPath } };
    }
  }

  if (!auth.isAuthenticated || !auth.isAdmin) {
    if (!auth.isAuthenticated) {
      return { path: '/login', query: { redirect: to.fullPath } };
    }
    return { path: '/', query: { denied: '1' } };
  }
  return true;
});

router.afterEach((to) => {
  document.title = to.meta.title ? `FarmApp · ${to.meta.title}` : 'FarmApp';
});
