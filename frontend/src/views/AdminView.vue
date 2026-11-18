<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import AdminResumen from '../components/admin/AdminResumen.vue';
import AdminMedicamentos from '../components/admin/AdminMedicamentos.vue';
import AdminEncuestas from '../components/admin/AdminEncuestas.vue';
import AdminContactos from '../components/admin/AdminContactos.vue';
import { useAuthStore } from '../stores/auth';
import { iniciales } from '../utils/format';
import '../styles/admin.css';

type Tab = 'resumen' | 'medicamentos' | 'encuestas' | 'contactos';

const auth = useAuthStore();
const tab = ref<Tab>('resumen');

const tabs: { id: Tab; label: string }[] = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'medicamentos', label: 'Medicamentos' },
  { id: 'encuestas', label: 'Encuestas' },
  { id: 'contactos', label: 'Contactos' },
];

const nombre = computed(() =>
  auth.user ? `${auth.user.nombres} ${auth.user.apellidos}` : 'Administrador',
);

const avatar = computed(() =>
  auth.user ? iniciales(auth.user.nombres, auth.user.apellidos) : 'FA',
);
</script>

<template>
  <section class="admin-head">
    <div>
      <span class="eyebrow">Administración</span>
      <h1>Panel de FarmApp</h1>
      <p>Gestiona el catálogo de medicamentos y revisa lo que envían los usuarios.</p>
    </div>
    <div class="admin-user">
      <div class="avatar">{{ avatar }}</div>
      <div>
        <strong>{{ nombre }}</strong>
        <span>{{ auth.user?.email }}</span>
      </div>
    </div>
  </section>

  <div class="admin-shell">
    <aside class="admin-side">
      <button
        v-for="item in tabs"
        :key="item.id"
        type="button"
        class="admin-tab"
        :class="{ active: tab === item.id }"
        @click="tab = item.id"
      >
        {{ item.label }}
      </button>
      <RouterLink to="/" class="admin-back">← Volver al sitio</RouterLink>
    </aside>

    <div class="admin-main">
      <Transition name="admin-panel" mode="out-in">
        <div :key="tab" class="admin-panel">
          <AdminResumen v-if="tab === 'resumen'" />
          <AdminMedicamentos v-else-if="tab === 'medicamentos'" />
          <AdminEncuestas v-else-if="tab === 'encuestas'" />
          <AdminContactos v-else />
        </div>
      </Transition>
    </div>
  </div>
</template>
