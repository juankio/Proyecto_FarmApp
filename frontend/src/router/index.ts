import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

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
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: 'Página no encontrada' },
    },
  ],
});

router.afterEach((to) => {
  document.title = to.meta.title ? `FarmApp · ${to.meta.title}` : 'FarmApp';
});
