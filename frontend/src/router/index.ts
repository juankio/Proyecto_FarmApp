import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/servicios', name: 'servicios', component: () => import('../views/ServiciosView.vue'), meta: { title: 'Servicios' } },
    { path: '/registro', name: 'registro', component: () => import('../views/RegistroView.vue'), meta: { title: 'Registro' } },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue'), meta: { title: 'Ingreso' } },
    { path: '/feria', name: 'feria', component: () => import('../views/FeriaView.vue'), meta: { title: 'Feria' } },
    { path: '/blog', name: 'blog', component: () => import('../views/BlogView.vue'), meta: { title: 'Blog' } },
    { path: '/informacion', name: 'informacion', component: () => import('../views/InformacionView.vue'), meta: { title: 'Información' } },
    { path: '/encuesta', name: 'encuesta', component: () => import('../views/EncuestaView.vue'), meta: { title: 'Encuesta' } },
    { path: '/contactos', name: 'contactos', component: () => import('../views/ContactosView.vue'), meta: { title: 'Contacto' } },
    { path: '/proyectos/:slug', name: 'proyecto', component: () => import('../views/ProyectoView.vue'), meta: { title: 'Proyecto' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});

router.afterEach((to) => {
  document.title = `FarmApp${to.meta.title ? ` - ${to.meta.title}` : ''}`;
});
