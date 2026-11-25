<script setup lang="ts">
import { drogueriasVillavicencio } from '../../data/droguerias';

type Pin = {
  marca: string;
  barrio: string;
  rating: string;
  color: string;
  x: number;
  y: number;
  delay: string;
};

const pines: Pin[] = [
  { marca: 'La Rebaja', barrio: 'Centro', rating: '4.8', color: '#b0281f', x: 32, y: 30, delay: '0s' },
  { marca: 'Cruz Verde', barrio: 'El Barzal', rating: '4.6', color: '#1e7a45', x: 66, y: 22, delay: '0.5s' },
  { marca: 'Pasteur', barrio: 'Siete de Agosto', rating: '4.5', color: '#22303a', x: 48, y: 62, delay: '1s' },
  { marca: 'La Economía', barrio: 'La Esperanza', rating: '4.4', color: '#c05a32', x: 74, y: 70, delay: '1.5s' },
];
</script>

<template>
  <div class="recetario">
    <svg
      class="trazado"
      viewBox="0 0 420 360"
      role="img"
      aria-label="Mapa ilustrado de Villavicencio con droguerías cercanas"
    >
      <defs>
        <pattern id="retícula" width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M22 0H0v22" fill="none" stroke="#1F6B4F" stroke-opacity="0.1" stroke-width="1" />
        </pattern>
      </defs>
      <rect width="420" height="360" fill="url(#retícula)" />
      <g fill="none" stroke="#1F6B4F" stroke-opacity="0.28" stroke-width="1.4">
        <path d="M-10 76c62-30 78 22 132 4s86-46 148-16 96 6 160-26" />
        <path d="M-10 118c62-30 78 22 132 4s86-46 148-16 96 6 160-26" />
        <path d="M-10 262c62-30 78 22 132 4s86-46 148-16 96 6 160-26" />
      </g>
      <path
        d="M-6 196c54 8 74-26 118-18s52 44 100 40 58-34 108-22 76 40 108 34"
        fill="none"
        stroke="#2A6480"
        stroke-opacity="0.35"
        stroke-width="3"
        stroke-linecap="round"
      />
      <g fill="#1F6B4F" fill-opacity="0.12">
        <path d="M298 300c16-14 40-12 52 4-8 18-32 26-52 16-4-2-4-14 0-20Z" />
        <path d="M36 34c12-10 30-9 38 3-6 13-24 19-38 12-3-1-3-10 0-15Z" />
      </g>
      <circle cx="210" cy="180" r="86" fill="none" stroke="#1F6B4F" stroke-opacity="0.16" stroke-dasharray="3 7" />
      <circle cx="210" cy="180" r="132" fill="none" stroke="#1F6B4F" stroke-opacity="0.1" stroke-dasharray="2 9" />
    </svg>

    <div class="pines">
      <div
        v-for="pin in pines"
        :key="pin.marca"
        class="pin"
        :style="{ left: pin.x + '%', top: pin.y + '%', '--pin-color': pin.color, animationDelay: pin.delay }"
      >
        <span class="pin-dot">
          <span class="pin-core" />
        </span>
        <span class="pin-label">
          <strong>{{ pin.marca }}</strong>
          <span>{{ pin.barrio }}</span>
          <span class="pin-rating">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor" aria-hidden="true">
              <path d="m12 2 3 6.4 7 1-5 4.9 1.2 7L12 18l-6.2 3.3L7 14.3 2 9.4l7-1L12 2Z" />
            </svg>
            {{ pin.rating }}
          </span>
        </span>
      </div>
    </div>

    <div class="sello" aria-hidden="true">
      <svg viewBox="0 0 120 120" width="104" height="104" fill="currentColor">
        <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="4 4" />
        <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" stroke-width="1" />
        <path d="M60 38v44M42 52h36" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
        <text x="60" y="88" text-anchor="middle" font-size="7.4" letter-spacing="1.6" fill="currentColor">FARMACIA</text>
        <text x="60" y="26" text-anchor="middle" font-size="7.4" letter-spacing="1.6" fill="currentColor">VERIFICADA</text>
      </svg>
    </div>

    <figure class="ahorro">
      <figcaption>Ahorro promedio</figcaption>
      <p class="ahorro-cifra">38<span>%</span></p>
      <p class="ahorro-nota">Comparando 5 droguerías del mismo barrio</p>
    </figure>

    <p class="cobertura">
      <span class="cobertura-punto" aria-hidden="true" />
      {{ drogueriasVillavicencio.length }} droguerías verificadas · Villavicencio, Meta
    </p>
  </div>
</template>

<style scoped>
.recetario {
  position: relative;
  width: 100%;
  aspect-ratio: 420 / 360;
  border-radius: 22px;
  background: var(--bg-1);
  border: 1.5px solid var(--ink);
  box-shadow: 8px 8px 0 rgba(22, 36, 29, 0.9);
  overflow: visible;
  isolation: isolate;
}

.trazado {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 21px;
  background:
    radial-gradient(80% 70% at 70% 20%, rgba(216, 154, 43, 0.16), transparent 62%),
    radial-gradient(70% 60% at 20% 84%, rgba(31, 107, 79, 0.12), transparent 66%);
}

.pines {
  position: absolute;
  inset: 0;
}

.pin {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  transform: translate(-50%, -50%);
  animation: pin-in 0.7s var(--ease) backwards;
}

.pin-dot {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50% 50% 50% 2px;
  background: var(--pin-color);
  border: 2px solid var(--bg-1);
  box-shadow: 0 4px 10px rgba(22, 36, 29, 0.28);
  transform: rotate(-45deg);
  flex: 0 0 auto;
}

.pin-core {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--bg-1);
}

.pin-label {
  display: grid;
  gap: 1px;
  padding: 7px 10px;
  border-radius: 9px;
  background: var(--bg-1);
  border: 1px solid var(--surface-border);
  box-shadow: 0 6px 14px -8px rgba(22, 36, 29, 0.5);
  white-space: nowrap;
}

.pin-label strong {
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--ink);
  letter-spacing: -0.01em;
}

.pin-label > span:not(.pin-rating) {
  font-size: 0.62rem;
  color: var(--muted);
}

.pin-rating {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-top: 2px;
  font-size: 0.64rem;
  font-weight: 800;
  color: var(--verde-texto);
}

.sello {
  position: absolute;
  top: 14px;
  right: 14px;
  transform: rotate(9deg);
  opacity: 0.9;
  color: var(--verde);
}

.ahorro {
  position: absolute;
  left: -26px;
  bottom: -44px;
  margin: 0;
  padding: 16px 20px 14px;
  border-radius: 14px;
  background: var(--panel-oscuro);
  color: var(--texto-panel);
  border: 1px solid var(--panel-oscuro);
  box-shadow: 6px 6px 0 rgba(192, 90, 50, 0.55);
  min-width: 186px;
}

.ahorro figcaption {
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--texto-panel);
  opacity: 0.72;
}

.ahorro-cifra {
  margin: 2px 0 0;
  font-family: var(--font-display);
  font-size: 2.9rem;
  font-weight: 600;
  line-height: 1;
  color: var(--texto-panel);
  font-variant-numeric: tabular-nums;
}

.ahorro-cifra span {
  font-size: 1.4rem;
  vertical-align: super;
  color: var(--ambar);
}

.ahorro-nota {
  margin-top: 4px;
  font-size: 0.66rem;
  line-height: 1.45;
  color: var(--texto-panel);
  opacity: 0.75;
  max-width: 22ch;
}

.cobertura {
  position: absolute;
  top: 12px;
  left: 12px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 9px;
  border-radius: 8px;
  background: var(--bg-1);
  border: 1px solid var(--surface-border);
  box-shadow: 0 4px 12px -9px rgba(22, 36, 29, 0.6);
  font-size: 0.64rem;
  font-weight: 600;
  color: var(--ink-soft);
}

.cobertura-punto {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--verde);
  box-shadow: 0 0 0 3px rgba(31, 107, 79, 0.18);
}

@keyframes pin-in {
  from {
    opacity: 0;
    transform: translate(-50%, -34%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

@media (max-width: 1024px) {
  .recetario {
    max-width: 460px;
    margin-inline: auto;
    box-shadow: 6px 6px 0 rgba(22, 36, 29, 0.9);
  }
  .sello {
    right: -6px;
    transform: rotate(9deg) scale(0.82);
  }
}

@media (max-width: 620px) {
  .recetario {
    aspect-ratio: 1 / 1;
    box-shadow: 4px 4px 0 rgba(22, 36, 29, 0.9);
  }
  .pin-label {
    padding: 5px 7px;
  }
  .pin-label strong {
    font-size: 0.64rem;
  }
  .ahorro {
    left: 8px;
    bottom: -22px;
    padding: 12px 14px;
    min-width: 148px;
  }
  .ahorro-cifra {
    font-size: 2.1rem;
  }
  .cobertura {
    position: static;
    margin: 18px auto 0;
    justify-content: center;
  }
  .sello {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pin {
    animation: none;
  }
}
</style>
