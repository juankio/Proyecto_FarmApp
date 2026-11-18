import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { useAuthStore } from '../stores/auth';

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, _from, saved) {
    if (saved) return saved;
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 90 };
    return { top: 0 };
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
      path: '/feria',
      name: 'feria',
      component: () => import('../views/FeriaView.vue'),
      meta: { title: 'Feria empresarial' },
    },
    {
      path: '/medicamentos',
      name: 'medicamentos',
      component: () => import('../views/MedicamentosView.vue'),
      meta: { title: 'Medicamentos' },
    },
    {
      path: '/proyectos/:slug',
      name: 'proyecto',
      component: () => import('../views/ProyectoView.vue'),
      meta: { title: 'Proyecto' },
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
      name: 'info-cenacap',
      component: () => import('../views/InfoCenacapView.vue'),
      meta: { title: 'Cenacap' },
    },
    {
      path: '/lenguajes',
      name: 'lenguajes',
      component: () => import('../views/LenguajesView.vue'),
      meta: { title: 'Lenguajes de programación' },
    },
    {
      path: '/calculadora',
      name: 'calculadora',
      component: () => import('../views/CalculadoraView.vue'),
      meta: { title: 'Calculadora' },
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

  if (!auth.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } };
  }

  if (!auth.user) {
    try {
      await auth.fetchMe();
    } catch {
      auth.logout();
      return { path: '/login', query: { redirect: to.fullPath } };
    }
  }

  if (!auth.isAdmin) return { path: '/', query: { denied: '1' } };
  return true;
});

router.afterEach((to) => {
  document.title = to.meta.title ? `FarmApp · ${to.meta.title}` : 'FarmApp';
});
