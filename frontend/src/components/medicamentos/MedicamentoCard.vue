<script setup lang="ts">
import { RouterLink } from 'vue-router';
import AppButton from '../ui/AppButton.vue';
import type { Medicamento } from '../../types/catalogo';

const props = defineProps<{ medicamento: Medicamento }>();
const emit = defineEmits<{ (e: 'open', medicamento: Medicamento): void }>();

function dosis(m: Medicamento): string {
  return [m.presentacion, m.concentracion].filter(Boolean).join(' · ');
}

function consulta(m: Medicamento) {
  const laboratorio = m.laboratorio === 'Genérico' ? '' : ` de ${m.laboratorio}`;
  return {
    path: '/contactos',
    query: {
      asunto: `Consulta sobre ${m.nombre}`,
      mensaje: `Hola, quiero consultar por ${m.nombre} (${dosis(m)})${laboratorio}. ¿Me pueden orientar?`,
    },
  };
}
</script>

<template>
  <article class="med-card">
    <div class="med-top">
      <span class="med-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <path d="M10.6 3.4a5 5 0 0 1 7.1 7.1l-7.2 7.1a5 5 0 0 1-7.1-7.1l7.2-7.1Z" stroke-linecap="round" />
          <path d="m6.9 6.9 7.2 7.2" stroke-linecap="round" />
        </svg>
      </span>
      <span class="med-lab">{{ medicamento.laboratorio }}</span>
    </div>
    <h3>{{ medicamento.nombre }}</h3>
    <p class="med-dose">{{ dosis(medicamento) }}</p>
    <p class="med-desc">{{ medicamento.descripcion ?? 'Sin descripción registrada.' }}</p>
    <div class="med-actions">
      <button type="button" class="med-link" @click="emit('open', medicamento)">
        Ver detalle <span aria-hidden="true">→</span>
      </button>
      <RouterLink :to="consulta(medicamento)">
        <AppButton size="sm">Consultar</AppButton>
      </RouterLink>
    </div>
  </article>
</template>

<style scoped>
.med-card { display:flex; flex-direction:column; padding:22px; border-radius:var(--radius); background:var(--glass-strong); border:1px solid var(--line); box-shadow:var(--inset),var(--depth-sm); -webkit-backdrop-filter:blur(22px) saturate(180%); backdrop-filter:blur(22px) saturate(180%); transition:transform 0.3s var(--ease),box-shadow 0.3s var(--ease); }
.med-card:hover { transform:translateY(-4px); box-shadow:var(--inset),var(--depth); }
.med-top { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:14px; }
.med-icon { display:grid; place-items:center; width:46px; height:46px; border-radius:14px; background:linear-gradient(145deg,rgba(10,132,255,0.16),rgba(126,224,192,0.24)); border:1px solid var(--line); color:var(--aqua); }
.med-icon svg { width:24px; height:24px; }
.med-lab { padding:5px 10px; border-radius:999px; background:rgba(255,255,255,0.08); border:1px solid var(--line-soft); font-size:0.75rem; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:var(--muted); }
.med-card h3 { font-size:1.15rem; letter-spacing:-0.03em; margin-bottom:4px; }
.med-dose { font-size:0.82rem; font-weight:600; color:var(--aqua); }
.med-desc { display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; margin-top:10px; font-size:0.88rem; color:var(--ink-soft); }
.med-actions { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:auto; padding-top:18px; }
.med-link { padding:0; border:0; background:transparent; color:var(--blue-deep); font-family:var(--font); font-size:0.82rem; font-weight:600; cursor:pointer; }
.med-link span { display:inline-block; transition:transform 0.2s var(--ease); }
.med-link:hover span { transform:translateX(3px); }
</style>
