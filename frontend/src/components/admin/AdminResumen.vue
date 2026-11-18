<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AppSkeleton from '../ui/AppSkeleton.vue';
import { ApiError, apiGet } from '../../composables/useApi';
import type { Contacto, Encuesta, Medicamento, Paginado } from '../../types/catalogo';
import { formatFecha } from '../../utils/format';

const cargando = ref(true);
const error = ref('');
const medicamentos = ref(0);
const encuestasTotal = ref(0);
const contactosTotal = ref(0);
const encuestas = ref<Encuesta[]>([]);

const promedio = computed(() => {
  if (!encuestas.value.length) return '0.0';
  const suma = encuestas.value.reduce((acc, e) => acc + e.calificacion, 0);
  return (suma / encuestas.value.length).toFixed(1);
});

const recomienda = computed(() => {
  if (!encuestas.value.length) return 0;
  const si = encuestas.value.filter((e) => e.recomendaria === 1).length;
  return Math.round((si / encuestas.value.length) * 100);
});

function estrellas(n: number): string {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

onMounted(async () => {
  try {
    const [med, enc, con] = await Promise.all([
      apiGet<Paginado<Medicamento>>('/medicamentos?limit=1'),
      apiGet<Paginado<Encuesta>>('/encuestas?limit=50'),
      apiGet<Paginado<Contacto>>('/contactos?limit=1'),
    ]);

    medicamentos.value = med.total;
    encuestasTotal.value = enc.total;
    contactosTotal.value = con.total;
    encuestas.value = enc.items;
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'No se pudo cargar el resumen.';
  } finally {
    cargando.value = false;
  }
});

function ultimos<T>(lista: T[]): T[] {
  return lista.slice(0, 3);
}

const encuestasRecientes = computed(() => ultimos(encuestas.value));
</script>

<template>
  <div v-if="cargando" aria-busy="true">
    <p class="sr-only" role="status">Cargando resumen...</p>

    <div class="stat-grid" aria-hidden="true">
      <div v-for="n in 4" :key="n" class="stat-card skeleton-stat">
        <AppSkeleton width="58px" height="30px" radius="8px" />
        <AppSkeleton width="82%" height="11px" radius="5px" />
      </div>
    </div>

    <div class="admin-two skeleton-list" aria-hidden="true">
      <div class="admin-card">
        <AppSkeleton width="42%" height="18px" radius="6px" />
        <div class="admin-list skeleton-list">
          <div v-for="n in 3" :key="n" class="admin-item skeleton-item">
            <div class="skeleton-row">
              <AppSkeleton width="38%" height="14px" radius="6px" />
              <AppSkeleton width="68px" height="12px" radius="6px" />
            </div>
            <AppSkeleton width="100%" height="10px" radius="5px" />
            <AppSkeleton width="76%" height="10px" radius="5px" />
            <AppSkeleton width="46%" height="9px" radius="5px" />
          </div>
        </div>
      </div>

      <div class="admin-card">
        <AppSkeleton width="52%" height="18px" radius="6px" />
        <div class="stat-grid skeleton-list">
          <div v-for="n in 2" :key="n" class="stat-card skeleton-stat">
            <AppSkeleton width="54px" height="28px" radius="8px" />
            <AppSkeleton width="78%" height="11px" radius="5px" />
          </div>
        </div>
        <div class="skeleton-lines skeleton-list">
          <AppSkeleton width="100%" height="10px" radius="5px" />
          <AppSkeleton width="82%" height="10px" radius="5px" />
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="error" class="admin-card">
    <div class="form-message error">{{ error }}</div>
  </div>

  <template v-else>
    <div class="stat-grid">
      <div class="stat-card">
        <strong>{{ medicamentos }}</strong>
        <span>Medicamentos registrados</span>
      </div>
      <div class="stat-card">
        <strong>{{ encuestasTotal }}</strong>
        <span>Encuestas respondidas</span>
      </div>
      <div class="stat-card">
        <strong>{{ contactosTotal }}</strong>
        <span>Mensajes de contacto</span>
      </div>
      <div class="stat-card">
        <strong>{{ promedio }}</strong>
        <span>Calificación promedio (de 5)</span>
      </div>
    </div>

    <div class="admin-two">
      <div class="admin-card">
        <h2>Últimas encuestas</h2>
        <div v-if="!encuestasRecientes.length" class="empty">Todavía no hay respuestas.</div>
        <div v-for="e in encuestasRecientes" :key="e.id" class="admin-item">
          <div class="admin-item-head">
            <h3>{{ e.nombre ?? 'Anónimo' }}</h3>
            <span class="stars">{{ estrellas(e.calificacion) }}</span>
          </div>
          <p>{{ e.comentario }}</p>
          <div class="admin-meta">
            <span>{{ formatFecha(e.creado_en) }}</span>
            <span>{{ e.recomendaria ? 'Sí recomienda' : 'No recomienda' }}</span>
          </div>
        </div>
      </div>

      <div class="admin-card">
        <h2>Actividad de la encuesta</h2>
        <div class="stat-grid">
          <div class="stat-card">
            <strong>{{ recomienda }}%</strong>
            <span>Recomendaría FarmApp</span>
          </div>
          <div class="stat-card">
            <strong>{{ encuestasTotal }}</strong>
            <span>Total de respuestas</span>
          </div>
        </div>
        <p class="nota">
          Los porcentajes se calculan sobre las últimas {{ encuestas.length }} respuestas
          consultadas.
        </p>
      </div>
    </div>
  </template>
</template>

<style scoped>
.nota {
  margin-top: 14px;
  font-size: 0.76rem;
  color: var(--muted);
}
</style>
