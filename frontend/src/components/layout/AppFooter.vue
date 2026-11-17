<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <footer class="glass-footer">
    <div class="shell">
      <div class="grid">
        <div>
          <h4>Compañía</h4>
          <RouterLink to="/informacion">Nosotros</RouterLink>
          <RouterLink to="/servicios">Servicios</RouterLink>
          <RouterLink to="/blog">Blog</RouterLink>
        </div>
        <div>
          <h4>Ayuda</h4>
          <RouterLink to="/contactos">Preguntas</RouterLink>
          <RouterLink to="/encuesta">Encuesta</RouterLink>
        </div>
        <div>
          <h4>Síguenos</h4>
          <a href="https://www.facebook.com/farmapp01" target="_blank" rel="noopener">Facebook</a>
          <a href="https://www.instagram.com/farmapp01" target="_blank" rel="noopener">Instagram</a>
        </div>
      </div>
      <p class="copy">Proyecto realizado por CódigoX © 2024</p>
    </div>
  </footer>
</template>

<style scoped>
.glass-footer { margin-top: 24px; padding: 42px 16px; border-radius: 26px 26px 0 0; background: var(--glass-strong); -webkit-backdrop-filter: blur(20px); backdrop-filter: blur(20px); border-top: 1px solid var(--line); box-shadow: var(--inset); }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; }
h4 { font-size: .95rem; margin: 0 0 14px; }
a { display: block; color: var(--muted); font-size: .88rem; margin-bottom: 8px; }
a:hover { color: var(--blue); }
.copy { text-align: center; margin-top: 28px; font-size: .85rem; color: #7c95a6; }
</style>
