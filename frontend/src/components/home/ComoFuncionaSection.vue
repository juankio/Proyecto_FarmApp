<script setup lang="ts">
import SectionHeader from '../ui/SectionHeader.vue';
</script>

<template>
  <section class="como-funciona section reveal">
    <SectionHeader
      eyebrow="Fácil, Rápido y Transparente"
      title="¿Cómo funciona el Radar FarmApp?"
      lede="En solo tres pasos ahorras tiempo y dinero en tus medicamentos dentro de Villavicencio."
    />

    <div class="steps-grid">
      <!-- Paso 1 -->
      <div class="step-card">
        <div class="step-badge-num">01</div>
        <div class="step-illustration">
          <svg viewBox="0 0 200 160" width="100%" height="100%" fill="none" class="step-svg">
            <defs>
              <linearGradient id="grad-radar" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0a84ff" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#5ac8fa" stop-opacity="0.2" />
              </linearGradient>
              <filter id="glow-p1" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <!-- Ondas de radar concéntricas -->
            <circle cx="100" cy="85" r="60" stroke="#0a84ff" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.3" />
            <circle cx="100" cy="85" r="42" stroke="#5ac8fa" stroke-width="1.5" opacity="0.5" />
            <circle cx="100" cy="85" r="24" fill="url(#grad-radar)" opacity="0.4" />
            <!-- Chincheta de ubicación GPS -->
            <path
              d="M100 50 C89 50 80 59 80 70 C80 84 100 108 100 108 C100 108 120 84 120 70 C120 59 111 50 100 50 Z"
              fill="#0a84ff"
              filter="url(#glow-p1)"
            />
            <circle cx="100" cy="70" r="6" fill="#ffffff" />
            <!-- Pines de farmacias alrededor -->
            <circle cx="55" cy="65" r="5" fill="#30d158" />
            <circle cx="145" cy="60" r="5" fill="#ffd60a" />
            <circle cx="130" cy="115" r="5" fill="#ff375f" />
            <circle cx="65" cy="105" r="5" fill="#bf5af2" />
          </svg>
        </div>

        <div class="step-content">
          <span class="step-tag">Paso 1 · Cobertura Local</span>
          <h3 class="step-title">Ubica tu punto o barrio</h3>
          <p class="step-desc">
            Activa el botón de geolocalización GPS o selecciona tu barrio en Villavicencio (Centro, El Barzal, Siete de Agosto, La Esperanza, Porfía, etc.) para rastrear farmacias alrededor.
          </p>
          <ul class="step-bullets">
            <li>📍 Cálculo de distancia exacto en metros o kilómetros</li>
            <li>🏥 Más de 85 droguerías georreferenciadas</li>
          </ul>
        </div>
      </div>

      <!-- Paso 2 -->
      <div class="step-card">
        <div class="step-badge-num">02</div>
        <div class="step-illustration">
          <svg viewBox="0 0 200 160" width="100%" height="100%" fill="none" class="step-svg">
            <defs>
              <linearGradient id="grad-scale" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#30d158" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#10b981" stop-opacity="0.4" />
              </linearGradient>
            </defs>
            <!-- Balanza de comparación inteligente -->
            <path d="M100 35 L100 120" stroke="#0a84ff" stroke-width="3" stroke-linecap="round" />
            <path d="M70 120 L130 120" stroke="#0a84ff" stroke-width="4" stroke-linecap="round" />
            <!-- Brazo balanza -->
            <path d="M50 55 L150 45" stroke="#93a4c0" stroke-width="3" stroke-linecap="round" />
            <!-- Plato izquierdo (Menor Precio) -->
            <path d="M50 55 L35 85 L65 85 Z" fill="url(#grad-scale)" stroke="#30d158" stroke-width="1.5" />
            <circle cx="50" cy="74" r="6" fill="#ffffff" />
            <!-- Plato derecho (Menor Distancia) -->
            <path d="M150 45 L135 75 L165 75 Z" fill="rgba(10, 132, 255, 0.25)" stroke="#0a84ff" stroke-width="1.5" />
            <path d="M150 67 L150 78 M144 72 L156 72" stroke="#5ac8fa" stroke-width="2" stroke-linecap="round" />
            <!-- Moneda y Ahorro flotante -->
            <circle cx="100" cy="35" r="9" fill="#ffd60a" />
            <text x="97" y="39" font-size="11" font-weight="bold" fill="#000">$</text>
          </svg>
        </div>

        <div class="step-content">
          <span class="step-tag">Paso 2 · Ahorro Inteligente</span>
          <h3 class="step-title">Compara precio vs distancia</h3>
          <p class="step-desc">
            Visualiza en segundos quién tiene el precio más económico y quién te queda más cerca. Decide si prefieres ahorrar hasta un 45% o comprar en la esquina.
          </p>
          <ul class="step-bullets">
            <li>🏷️ Transparencia de precios sin comisiones ocultas</li>
            <li>⚖️ Filtro dual: "Mejor Precio" o "Menor Distancia"</li>
          </ul>
        </div>
      </div>

      <!-- Paso 3 -->
      <div class="step-card">
        <div class="step-badge-num">03</div>
        <div class="step-illustration">
          <svg viewBox="0 0 200 160" width="100%" height="100%" fill="none" class="step-svg">
            <defs>
              <linearGradient id="grad-wa" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#25d366" />
                <stop offset="100%" stop-color="#128c7e" />
              </linearGradient>
            </defs>
            <!-- Burbuja de WhatsApp y Domicilio -->
            <rect x="40" y="40" width="120" height="75" rx="18" fill="url(#grad-wa)" opacity="0.9" />
            <!-- Icono de mensajería dentro -->
            <path
              d="M75 75 C75 66 82 59 91 59 C100 59 107 66 107 75 C107 84 100 91 91 91 C88 91 85 90 82 89 L72 92 L75 82 C73 80 75 77 75 75 Z"
              fill="#ffffff"
            />
            <!-- Motocicleta / Domicilio express -->
            <circle cx="140" cy="115" r="14" stroke="#5ac8fa" stroke-width="2.5" fill="#0c1426" />
            <circle cx="85" cy="115" r="14" stroke="#5ac8fa" stroke-width="2.5" fill="#0c1426" />
            <path d="M85 115 L105 100 L125 100 L140 115" stroke="#5ac8fa" stroke-width="3" stroke-linecap="round" />
            <path d="M120 92 L128 100" stroke="#ffd60a" stroke-width="3" stroke-linecap="round" />
          </svg>
        </div>

        <div class="step-content">
          <span class="step-tag">Paso 3 · Pedido Inmediato</span>
          <h3 class="step-title">Pide por WhatsApp o llega en minutos</h3>
          <p class="step-desc">
            Haz clic para abrir un chat directo con el regente de farmacia con el medicamento precargado en el mensaje, o presiona "Cómo llegar" para abrir la ruta en Google Maps.
          </p>
          <ul class="step-bullets">
            <li>💬 Mensaje de cotización listo para enviar con 1 clic</li>
            <li>🌙 Identificación de droguerías de turno abiertas 24H</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.como-funciona {
  position: relative;
  padding: 48px 0;
  content-visibility: auto;
  contain-intrinsic-size: 1px 450px;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: 24px;
  margin-top: 24px;
}

.step-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 28px 24px;
  border-radius: var(--radius-lg);
  background: var(--glass-strong);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-sm), var(--inset);
  transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.24s;
  overflow: hidden;
}

.step-card:hover {
  transform: translateY(-4px);
  border-color: var(--blue-bright);
  box-shadow: var(--shadow-md), var(--inset);
}

.step-badge-num {
  position: absolute;
  top: 18px;
  right: 20px;
  font-size: 2.2rem;
  font-weight: 900;
  color: var(--line-soft);
  letter-spacing: -0.05em;
  user-select: none;
}

.step-illustration {
  width: 100%;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.step-svg {
  max-width: 180px;
  max-height: 140px;
  overflow: visible;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step-tag {
  font-size: 0.72rem;
  font-weight: 750;
  text-transform: uppercase;
  color: var(--aqua);
  letter-spacing: 0.05em;
}

.step-title {
  font-size: 1.25rem;
  font-weight: 850;
  color: var(--ink);
  letter-spacing: -0.025em;
  line-height: 1.25;
  text-wrap: balance;
}

.step-desc {
  font-size: 0.9rem;
  color: var(--muted);
  line-height: 1.5;
  text-wrap: pretty;
}

.step-bullets {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-top: 1px solid var(--line-soft);
  padding-top: 12px;
}

.step-bullets li {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--ink-soft);
}
</style>
