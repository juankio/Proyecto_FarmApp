<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import AppButton from '../components/ui/AppButton.vue';
import AppCard from '../components/ui/AppCard.vue';
import PageHero from '../components/layout/PageHero.vue';
import SectionHeader from '../components/ui/SectionHeader.vue';
import ImageTile from '../components/ui/ImageTile.vue';
import ServiceCard from '../components/ui/ServiceCard.vue';
import AppAccordion from '../components/ui/AppAccordion.vue';
import { accesos, site } from '../data/site';
import { LOGO_URL } from '../data/logo';
import { services } from '../data/services';
import { faq } from '../data/faq';
import { proyectos } from '../data/proyectos';

const route = useRoute();

const stats = [
  { valor: '12', label: 'Medicamentos' },
  { valor: '7', label: 'Empresas aliadas' },
  { valor: '7', label: 'Productos' },
  { valor: '100%', label: 'Gratis' },
];

const destacados = proyectos.filter((p) => p.slug !== 'codigox').slice(0, 4);
</script>

<template>
  <PageHero
    eyebrow="Salud y bienestar"
    title="La información farmacéutica que necesitas, en un solo lugar."
    lede="Consulta medicamentos, ubica droguerías cercanas y descubre los productos de nuestra feria empresarial. Todo claro, rápido y sin costo."
  >
    <template #actions>
      <AppButton size="lg" @click="$router.push('/servicios')">
        Explorar servicios
      </AppButton>
      <AppButton size="lg" variant="secondary" @click="$router.push('/feria')">
        Ver la feria
      </AppButton>
    </template>

    <template #media>
      <div class="visual">
        <div class="halo" />
        <img class="hero-logo" :src="LOGO_URL" alt="Logo de FarmApp" />
        <div class="float float-a glass">
          <img :src="proyectos[1].logo" :alt="proyectos[1].producto" />
          <span>{{ proyectos[1].producto }}</span>
        </div>
        <div class="float float-b glass">
          <img :src="proyectos[6].logo" :alt="proyectos[6].producto" />
          <span>{{ proyectos[6].producto }}</span>
        </div>
        <div class="chip glass">
          <span class="dot" />
          Información actualizada
        </div>
      </div>
    </template>
  </PageHero>

  <div v-if="route.query.denied" class="denied form-message error">
    No tienes permisos para acceder al panel de administración.
  </div>

  <section class="section reveal">
    <div class="welcome glass">
      <div class="welcome-copy">
        <span class="eyebrow">Lea, aprenda y conozca más</span>
        <h2>Bienvenidos a nuestro aplicativo farmacéutico</h2>
        <p>
          En FarmApp, facilitamos el acceso a la información sobre medicamentos para mejorar tu
          bienestar y experiencia en salud. Nuestra plataforma ofrece una base de datos completa con
          información básica sobre medicamentos, ayudándote a tomar decisiones informadas en tu
          cuidado personal.
        </p>
        <RouterLink to="/informacion" class="inline-link">Conoce nuestro origen →</RouterLink>
      </div>
      <div class="stats">
        <div v-for="s in stats" :key="s.label" class="stat">
          <strong>{{ s.valor }}</strong>
          <span>{{ s.label }}</span>
        </div>
      </div>
    </div>
  </section>

  <section class="section reveal">
    <SectionHeader
      eyebrow="Accesos rápidos"
      title="Conoce más de nuestros servicios"
      lede="Cuatro puertas de entrada a la información que necesitas, con nuestro catálogo y fuentes confiables."
    />
    <div class="grid grid-4">
      <ImageTile
        v-for="a in accesos"
        :key="a.nombre"
        :src="a.imagen"
        :title="a.nombre"
        :text="a.descripcion"
        :to="a.to"
        :href="a.href"
        fit="contain"
        ratio="square"
      />
    </div>
  </section>

  <section class="section reveal">
    <SectionHeader
      eyebrow="Servicios"
      title="Todo lo que puedes hacer en FarmApp"
      lede="Herramientas pensadas para pacientes, droguerías y profesionales de la salud."
    />
    <div class="grid grid-3">
      <ServiceCard v-for="s in services" :key="s.title" v-bind="s" />
    </div>
    <div class="row center more-row">
      <RouterLink to="/servicios">
        <AppButton variant="secondary">Ver todos los servicios</AppButton>
      </RouterLink>
    </div>
  </section>

  <section class="section reveal">
    <SectionHeader
      eyebrow="Feria empresarial"
      title="Productos de nuestras empresas aliadas"
      lede="Cada marca de la feria tiene su propio espacio, con su historia, misión y galería."
    />
    <div class="grid grid-4">
      <ImageTile
        v-for="p in destacados"
        :key="p.slug"
        :src="p.logo"
        :title="p.producto"
        :text="p.empresa"
        :badge="p.empresa"
        :to="`/proyectos/${p.slug}`"
        fit="contain"
        ratio="square"
      />
    </div>
    <div class="row center more-row">
      <RouterLink to="/feria">
        <AppButton variant="secondary">Ver las 7 empresas</AppButton>
      </RouterLink>
    </div>
  </section>

  <section class="section reveal">
    <div class="canva glass">
      <div class="canva-copy">
        <span class="eyebrow">Presentación</span>
        <h2>Descubre nuestra presentación en Canva</h2>
        <p>
          Explora más sobre FarmApp a través de nuestra presentación interactiva en Canva. ¡Haz clic
          en el botón y conócenos mejor!
        </p>
      </div>
      <a :href="site.canva" target="_blank" rel="noopener">
        <AppButton size="lg">Ver presentación</AppButton>
      </a>
    </div>
  </section>

  <section id="preguntas" class="section reveal">
    <SectionHeader
      eyebrow="Preguntas frecuentes"
      title="Resolvemos tus dudas"
      lede="Lo que más nos preguntan sobre FarmApp, el uso de la información y nuestras alianzas."
    />
    <div class="faq-grid">
      <AppCard v-for="grupo in faq" :key="grupo.titulo">
        <h3 class="faq-title">{{ grupo.titulo }}</h3>
        <AppAccordion :items="grupo.preguntas" />
      </AppCard>
    </div>
  </section>
</template>

<style scoped>
.visual {
  position: relative;
  width: min(100%, 460px);
  aspect-ratio: 1 / 1;
  display: grid;
  place-items: center;
}

.halo {
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.92), rgba(90, 200, 250, 0.35) 55%, transparent 72%);
  filter: blur(10px);
}

.hero-logo {
  position: relative;
  width: 46%;
  max-width: 200px;
  filter: drop-shadow(0 22px 34px rgba(8, 47, 77, 0.35));
  animation: float 7s ease-in-out infinite;
}

.float {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: var(--inset), 0 18px 36px -20px rgba(8, 47, 77, 0.5);
  animation: float 9s ease-in-out infinite;
}

.float img {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.float span {
  font-size: 0.72rem;
  font-weight: 650;
  color: var(--ink-soft);
}

.float-a {
  top: 4%;
  left: -2%;
  animation-delay: -2s;
}

.float-b {
  bottom: 6%;
  right: -2%;
  animation-delay: -4s;
}

.chip {
  position: absolute;
  bottom: 16%;
  left: 4%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--ink-soft);
  background: rgba(255, 255, 255, 0.86);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.2);
  animation: pulse 2.4s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(-1deg);
  }
  50% {
    transform: translateY(-12px) rotate(1deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.55;
  }
}

.denied {
  margin-top: 16px;
}

.welcome {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: clamp(24px, 4vw, 48px);
  padding: clamp(28px, 4vw, 52px);
  border-radius: var(--radius-lg);
  background: var(--glass-strong);
  -webkit-backdrop-filter: blur(26px) saturate(180%);
  backdrop-filter: blur(26px) saturate(180%);
  border: 1px solid var(--line);
  box-shadow: var(--inset), var(--depth);
}

.welcome-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
}

.welcome-copy h2 {
  max-width: 22ch;
}

.inline-link {
  font-size: 0.88rem;
  font-weight: 650;
  color: var(--blue-deep);
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-content: center;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.stat strong {
  font-size: 1.7rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--blue-deep);
  line-height: 1.1;
}

.stat span {
  font-size: 0.76rem;
  font-weight: 550;
  color: var(--muted);
}

.more-row {
  margin-top: 26px;
}

.canva {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  padding: clamp(28px, 4vw, 50px);
  border-radius: var(--radius-lg);
  background:
    radial-gradient(120% 160% at 90% 0%, rgba(90, 200, 250, 0.4), transparent 60%),
    linear-gradient(150deg, rgba(8, 47, 77, 0.92), rgba(10, 90, 140, 0.86));
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22), var(--depth-lg);
}

.canva-copy {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 64ch;
}

.canva .eyebrow {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.22);
  color: #dff4ff;
  width: fit-content;
}

.canva h2,
.canva p {
  color: #fff;
}

.canva p {
  color: rgba(234, 246, 251, 0.78);
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
  gap: 22px;
  align-items: start;
}

.faq-title {
  font-size: 1.05rem;
  margin-bottom: 16px;
  color: var(--blue-deep);
}

@media (max-width: 900px) {
  .welcome {
    grid-template-columns: 1fr;
  }
  .canva {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 560px) {
  .stats {
    grid-template-columns: 1fr 1fr;
  }
  .float-a {
    left: -4%;
  }
  .float-b {
    right: -4%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-logo,
  .float,
  .dot {
    animation: none;
  }
}
</style>
