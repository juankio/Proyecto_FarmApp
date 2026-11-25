<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { site } from '../../data/site';
import AppLogo from '../ui/AppLogo.vue';

const columnas = [
  {
    titulo: 'Compañía',
    enlaces: [
      { label: 'Nosotros', to: '/informacion' },
      { label: 'Nuestros servicios', to: '/servicios' },
      { label: 'Nuestro blog', to: '/blog' },
      { label: 'Droguerías en Villavicencio', to: '/ubicaciones' },
    ],
  },
  {
    titulo: 'Ayuda',
    enlaces: [
      { label: 'Preguntas frecuentes', to: '/#preguntas' },
      { label: 'Participa en la encuesta', to: '/encuesta' },
      { label: 'Contacto', to: '/contactos' },
    ],
  },
];
</script>

<template>
  <footer class="footer">
    <div class="shell inner">
      <div class="brand-col">
        <RouterLink to="/" class="brand">
          <AppLogo :size="32" />
          <span>FarmApp</span>
        </RouterLink>
        <p>{{ site.descripcion }}</p>
        <div class="social">
          <a :href="site.redes.facebook" target="_blank" rel="noopener" aria-label="Facebook">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v6h3v-6h3l1-3h-4v-2c0-.6.4-1 1-1Z" />
            </svg>
          </a>
          <a :href="site.redes.instagram" target="_blank" rel="noopener" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.4" cy="6.6" r="1" class="fill" />
            </svg>
          </a>
          <a :href="site.redes.whatsapp" target="_blank" rel="noopener" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 11.8a8 8 0 0 1-11.9 7L4 20l1.3-4A8 8 0 1 1 20 11.8Z" />
              <path d="M9 8.5c.4 2.6 2 4.2 4.6 4.6l1-1.5 1.8.8c-.3 1.4-1.3 2-2.6 2-2.8 0-5.7-2.7-5.7-5.5 0-1.1.5-2 1.7-2.2l1 1.8Z" />
            </svg>
          </a>
        </div>
      </div>

      <nav v-for="col in columnas" :key="col.titulo" class="col" :aria-label="col.titulo">
        <h4>{{ col.titulo }}</h4>
        <RouterLink v-for="enlace in col.enlaces" :key="enlace.label" :to="enlace.to">
          {{ enlace.label }}
        </RouterLink>
      </nav>

      <div class="col">
        <h4>Explora</h4>
        <RouterLink to="/medicamentos">Medicamentos</RouterLink>
        <RouterLink to="/lenguajes">Lenguajes de programación</RouterLink>
        <RouterLink to="/banner-yt">Banner</RouterLink>
        <RouterLink to="/registro">Crear cuenta</RouterLink>
      </div>
    </div>

    <div class="shell bottom">
      <p>{{ site.copyright }}</p>
      <p class="mini">Hecho con Vue 3 · Express · SQLite</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  z-index: 1;
  margin-top: 56px;
  padding: 60px 0 28px;
  border-radius: 40px 40px 0 0;
  background: linear-gradient(180deg, var(--bg-2), var(--bg-0));
  border-top: 1px solid var(--surface-border);
}

[data-theme="light"] .footer {
  background: linear-gradient(180deg, #fffdf5, var(--bg-2));
  border-top: 1px solid rgba(22, 36, 29, 0.1);
}

[data-theme="light"] .social a {
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(15, 23, 42, 0.09);
  box-shadow: inset 0 1px 0 #ffffff, 0 2px 6px -2px rgba(15, 23, 42, 0.04);
}

[data-theme="light"] .social a:hover {
  background: rgba(31, 107, 79, 0.08);
  border-color: rgba(31, 107, 79, 0.3);
  box-shadow: inset 0 1px 0 #ffffff, 0 4px 12px -3px rgba(10, 132, 255, 0.2);
}

.inner {
  display: grid;
  grid-template-columns: 1.5fr repeat(3, 1fr);
  gap: 34px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 1.3rem;
  letter-spacing: -0.045em;
  color: var(--ink);
  margin-bottom: 12px;
}

.brand :deep(.app-logo),
.brand img {
  width: 34px;
  height: 34px;
}

.brand :deep(.app-logo) {
  filter: drop-shadow(0 4px 10px rgba(31, 107, 79, 0.35));
}

[data-theme="light"] .brand :deep(.app-logo),
[data-theme="light"] .brand img {
  filter: drop-shadow(0 4px 12px rgba(0, 102, 255, 0.3));
}

.brand-col p {
  font-size: 0.9rem;
  max-width: 34ch;
}

.social {
  display: flex;
  gap: 9px;
  margin-top: 18px;
}

.social a {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border-radius: var(--radius-sm);
  background: rgba(31, 107, 79, 0.08);
  border: 1px solid var(--surface-border);
  transition: transform 0.24s var(--spring), background 0.22s, border-color 0.22s;
}

.social a:hover {
  transform: translateY(-2px);
  background: rgba(31, 107, 79, 0.2);
  border-color: rgba(31, 107, 79, 0.45);
}

.social svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: var(--ink-soft);
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.social svg .fill {
  fill: var(--ink-soft);
  stroke: none;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

h4 {
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--verde);
  margin-bottom: 4px;
}

.col a {
  font-size: 0.89rem;
  color: var(--muted);
  transition: color 0.2s, transform 0.2s var(--ease);
  width: fit-content;
}

.col a:hover {
  color: var(--aqua);
  transform: translateX(3px);
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 44px;
  padding-top: 20px;
  border-top: 1px solid var(--line-soft);
}

.bottom p {
  font-size: 0.82rem;
  color: var(--muted-2);
}

.mini {
  font-size: 0.76rem !important;
}

@media (max-width: 900px) {
  .inner {
    grid-template-columns: 1fr 1fr;
  }
  .brand-col {
    grid-column: 1 / -1;
  }
}

@media (max-width: 560px) {
  .inner {
    grid-template-columns: 1fr;
    gap: 26px;
  }
  .footer {
    border-radius: 28px 28px 0 0;
  }
}
</style>
