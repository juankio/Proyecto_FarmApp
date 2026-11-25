<script setup lang="ts">
import { RouterLink } from 'vue-router';
import SectionHeader from '../ui/SectionHeader.vue';
import AppButton from '../ui/AppButton.vue';
import { CADENAS_CONFIG } from '../../data/droguerias';

const CADENAS_SHOWCASE = [
  {
    nombre: 'Drogas La Rebaja',
    tag: 'Red Cooperativa',
    sedesVillavicencio: '18+ sedes',
    color: '#dc2626',
    bgLight: 'rgba(239, 68, 68, 0.12)',
    sigla: 'LR',
    servicios: ['Inyectología', 'Toma de presión', 'Turnos 24H', 'Domicilios'],
    descripcion: 'Mayor cobertura en Villavicencio con presencia en Centro, Barzal, Esperanza y Porfía.',
  },
  {
    nombre: 'Cruz Verde',
    tag: 'Cadena Médica',
    sedesVillavicencio: '10+ sedes',
    color: '#059669',
    bgLight: 'rgba(16, 185, 129, 0.12)',
    sigla: '+',
    servicios: ['Entrega EPS', 'Medicamentos especializados', 'Dermocosmética', 'Convenios'],
    descripcion: 'Presencia estratégica en El Barzal (sector salud), centros comerciales y clínicas.',
  },
  {
    nombre: 'Droguerías Copifam',
    tag: 'Red Regional',
    sedesVillavicencio: '8+ sedes',
    color: '#0284c7',
    bgLight: 'rgba(14, 165, 233, 0.12)',
    sigla: 'CF',
    servicios: ['Droguería familiar', 'Línea pediátrica', 'Domicilio rápido', 'Precios populares'],
    descripcion: 'Atención cercana en barrios residenciales como Siete de Agosto, Cantarrana y La Grama.',
  },
  {
    nombre: 'Farmacenter',
    tag: 'Red Asociada',
    sedesVillavicencio: '12+ sedes',
    color: '#2563eb',
    bgLight: 'rgba(37, 99, 235, 0.12)',
    sigla: 'FC',
    servicios: ['Productos de aseo', 'Genéricos confiables', 'Atención comunitaria', 'Puntos'],
    descripcion: 'Droguerías independientes asociadas con excelente surtido en avenidas principales.',
  },
  {
    nombre: 'Boticarios de barrio',
    tag: 'Farmacias Tradicionales',
    sedesVillavicencio: '25+ boticas',
    color: '#7c3aed',
    bgLight: 'rgba(124, 58, 237, 0.12)',
    sigla: 'BOT',
    servicios: ['Atención personalizada', 'Fórmula magistral', 'Precios de barrio', 'Vecinos'],
    descripcion: 'Droguerías de toda la vida atendidas por sus dueños en Montecarlo, Catumare, Kirpas y Reliquia.',
  },
  {
    nombre: 'Droguerías Pasteur',
    tag: 'Alta Tradición',
    sedesVillavicencio: '5+ sedes',
    color: '#475569',
    bgLight: 'rgba(100, 116, 139, 0.12)',
    sigla: 'P',
    servicios: ['Dermatología', 'Cuidado materno', 'Vademécum completo', 'Asesoría'],
    descripcion: 'Especialistas en salud estética, fórmulas dermatológicas y nutrición en CC Viva y Unicentro.',
  },
];
</script>

<template>
  <section class="directorio-section section reveal">
    <SectionHeader
      eyebrow="Red Farmacéutica de la Ciudad"
      title="Cadenas líderes y boticarios tradicionales unidos"
      lede="En FarmApp no favorecemos a nadie: conectamos tanto a las grandes cadenas farmacéuticas como a la droguería de confianza de tu cuadra."
    />

    <div class="marcas-grid">
      <div
        v-for="marca in CADENAS_SHOWCASE"
        :key="marca.nombre"
        class="marca-card"
        :style="{ '--brand-color': marca.color, '--brand-light': marca.bgLight }"
      >
        <div class="marca-card-top">
          <div class="marca-avatar">
            <span class="avatar-sigla">{{ marca.sigla }}</span>
          </div>
          <div class="marca-info-head">
            <span class="marca-tag">{{ marca.tag }}</span>
            <h3 class="marca-title">{{ marca.nombre }}</h3>
            <span class="marca-sedes">{{ marca.sedesVillavicencio }}</span>
          </div>
        </div>

        <p class="marca-desc">{{ marca.descripcion }}</p>

        <div class="servicios-tags">
          <span v-for="srv in marca.servicios" :key="srv" class="srv-tag">
            ✓ {{ srv }}
          </span>
        </div>

        <div class="marca-card-footer">
          <RouterLink to="/ubicaciones" class="link-ver-mapa">
            <span>Ver sus farmacias en el mapa</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.directorio-section {
  position: relative;
  padding: 48px 0;
  content-visibility: auto;
  contain-intrinsic-size: 1px 420px;
}

.marcas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
  gap: 22px;
  margin-top: 24px;
}

.marca-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px;
  border-radius: var(--radius-lg);
  background: var(--glass-strong);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-sm), var(--inset);
  transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.24s;
}

.marca-card:hover {
  transform: translateY(-4px);
  border-color: var(--brand-color);
  box-shadow: 0 12px 30px -10px var(--brand-light), var(--inset);
}

.marca-card-top {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.marca-avatar {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--brand-color);
  color: var(--sobre-acento);
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 1.15rem;
  box-shadow: 0 6px 16px -4px var(--brand-color);
  flex-shrink: 0;
}

.marca-info-head {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.marca-tag {
  font-size: 0.7rem;
  font-weight: 750;
  text-transform: uppercase;
  color: var(--brand-color);
  letter-spacing: 0.04em;
}

.marca-title {
  font-size: 1.12rem;
  font-weight: 800;
  color: var(--ink);
  line-height: 1.2;
  text-wrap: balance;
}

.marca-sedes {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--muted);
}

.marca-desc {
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.5;
  margin: 0;
  text-wrap: pretty;
}

.servicios-tags {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.srv-tag {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--brand-light);
  color: var(--brand-color);
}

[data-theme='dark'] .marca-tag,
[data-theme='dark'] .srv-tag,
[data-theme='dark'] .link-ver-mapa {
  color: #86d9b5 !important;
}

.marca-card-footer {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--line-soft);
}

.link-ver-mapa {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--brand-color);
  text-decoration: none;
  transition: transform 0.2s ease;
}

.link-ver-mapa:hover {
  transform: translateX(3px);
  text-decoration: underline;
}
</style>
