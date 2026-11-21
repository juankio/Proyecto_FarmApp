<script setup lang="ts">
import SectionHeader from '../ui/SectionHeader.vue';

const GUIAS_SALUD = [
  {
    icono: 'receta',
    titulo: 'Venta Libre vs Bajo Fórmula Médica',
    sub: 'Normativa INVIMA y MinSalud Colombia',
    desc: 'Los antibióticos, antihipertensivos, hipoglicemiantes y medicamentos de control especial requieren prescripción médica original firmada. Los analgésicos menores y antihistamínicos básicos son de venta libre.',
    tips: ['Nunca compres antibióticos sin fórmula', 'Verifica fecha de expedición de la receta', 'Consulta al regente de farmacia'],
  },
  {
    icono: 'clima',
    titulo: 'Cadena de Frío en Clima Cálido',
    sub: 'Protección térmica en Villavicencio',
    desc: 'Villavicencio registra temperaturas promedio de 28°C a 34°C. Medicamentos como insulinas, colirios y vacunas deben mantenerse estrictamente entre 2°C y 8°C dentro de neveras con termómetro calibrado.',
    tips: ['Exige empaque con gel refrigerante para traslado', 'No dejes medicamentos dentro del carro', 'Revisa sellos intactos'],
  },
  {
    icono: 'generico',
    titulo: 'Genéricos Bioequivalentes vs Marca',
    sub: 'Mismo principio activo, mayor ahorro',
    desc: 'Los medicamentos genéricos producidos por laboratorios certificados (MK, Genfar, Laproff, Lafrancol) contienen exactamente la misma molécula activa y dosis que la marca comercial, costando hasta un 60% menos.',
    tips: ['Pregunta siempre por la opción genérica', 'Verifica el registro sanitario INVIMA', 'Compara el valor por miligramo'],
  },
  {
    icono: 'urgencia',
    titulo: 'Líneas de Urgencias y Toxicología',
    sub: 'Atención 24 Horas en Villavicencio',
    desc: 'Si presentas una reacción alérgica severa, sobredosis accidental o intoxicación medicamentosa, acude de inmediato a los centros asistenciales de alta complejidad de la ciudad.',
    tips: ['Hospital Departamental: (608) 681-8800', 'Línea de Emergencias: 123', 'Clínica Servimédicos: (608) 661-4400'],
  },
];
</script>

<template>
  <section class="salud-info section reveal">
    <SectionHeader
      eyebrow="Salud Responsable y Seguridad"
      title="Información médica que protege tu bienestar"
      lede="Comprar medicamentos no es solo comparar precios; es garantizar su autenticidad, uso responsable y conservación adecuada."
    />

    <div class="guias-grid">
      <div v-for="guia in GUIAS_SALUD" :key="guia.titulo" class="guia-card">
        <div class="guia-icon-box">
          <!-- Icono SVG según tipo -->
          <svg v-if="guia.icono === 'receta'" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>

          <svg v-else-if="guia.icono === 'clima'" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
          </svg>

          <svg v-else-if="guia.icono === 'generico'" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <path d="m4.93 4.93 4.24 4.24" />
            <path d="m14.83 9.17 4.24-4.24" />
            <path d="m14.83 14.83 4.24 4.24" />
            <path d="m9.17 14.83-4.24 4.24" />
            <circle cx="12" cy="12" r="4" />
          </svg>

          <svg v-else viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>

        <div class="guia-body">
          <span class="guia-sub">{{ guia.sub }}</span>
          <h3 class="guia-title">{{ guia.titulo }}</h3>
          <p class="guia-desc">{{ guia.desc }}</p>

          <div class="guia-tips">
            <div v-for="tip in guia.tips" :key="tip" class="tip-item">
              <span class="tip-dot">✓</span>
              <span>{{ tip }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.salud-info {
  position: relative;
  padding: 48px 0;
}

.guias-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
  gap: 24px;
  margin-top: 24px;
}

.guia-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 26px;
  border-radius: var(--radius-lg);
  background: var(--glass-strong);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-sm), var(--inset);
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.22s;
}

.guia-card:hover {
  transform: translateY(-3px);
  border-color: var(--aqua);
}

.guia-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(90, 200, 250, 0.14);
  color: var(--aqua);
  border: 1px solid rgba(90, 200, 250, 0.28);
  display: grid;
  place-items: center;
}

.guia-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.guia-sub {
  font-size: 0.72rem;
  font-weight: 750;
  text-transform: uppercase;
  color: var(--aqua);
  letter-spacing: 0.04em;
}

.guia-title {
  font-size: 1.18rem;
  font-weight: 800;
  color: var(--ink);
  line-height: 1.25;
}

.guia-desc {
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.55;
  margin: 0;
}

.guia-tips {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 14px;
  border-top: 1px solid var(--line-soft);
  margin-top: 6px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--ink-soft);
  line-height: 1.4;
}

.tip-dot {
  color: #30d158;
  font-weight: 850;
}
</style>
