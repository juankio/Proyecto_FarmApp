<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { site } from '../../data/site';
import { LOGO_URL } from '../../data/logo';

const columnas = [
  {
    titulo: 'Compañía',
    enlaces: [
      { label: 'Nosotros', to: '/informacion' },
      { label: 'Nuestros servicios', to: '/servicios' },
      { label: 'Nuestro blog', to: '/blog' },
      { label: 'Feria empresarial', to: '/feria' },
    ],
  },
  {
    titulo: 'Ayuda',
    enlaces: [
      { label: 'Preguntas frecuentes', to: '/#preguntas' },
      { label: 'Participa en la encuesta', to: '/encuesta' },
      { label: 'Contacto', to: '/contactos' },
      { label: 'Calculadora', to: '/calculadora' },
    ],
  },
];
</script>

<template>
  <footer class="footer">
    <div class="shell inner">
      <div class="brand-col">
        <RouterLink to="/" class="brand">
          <img :src="LOGO_URL" alt="FarmApp" />
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
        <RouterLink to="/info-cenacap">Cenacap</RouterLink>
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
  margin-top: 40px;
  padding: 54px 0 26px;
  border-radius: 36px 36px 0 0;
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.5));
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  backdrop-filter: blur(28px) saturate(180%);
  border-top: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 -20px 50px -30px rgba(8, 47, 77, 0.3);
}

.inner {
  display: grid;
  grid-template-columns: 1.5fr repeat(3, 1fr);
  gap: 34px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-weight: 800;
  font-size: 1.3rem;
  letter-spacing: -0.04em;
  color: var(--ink);
  margin-bottom: 12px;
}

.brand img {
  width: 34px;
  height: 34px;
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
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition: transform 0.2s var(--ease), background 0.2s;
}

.social a:hover {
  transform: translateY(-2px);
  background: #fff;
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
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--blue-deep);
  margin-bottom: 4px;
}

.col a {
  font-size: 0.89rem;
  color: var(--muted);
  transition: color 0.2s, transform 0.2s;
  width: fit-content;
}

.col a:hover {
  color: var(--blue-deep);
  transform: translateX(2px);
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 42px;
  padding-top: 20px;
  border-top: 1px solid rgba(12, 74, 112, 0.1);
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
    border-radius: 26px 26px 0 0;
  }
}
</style>
