<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import AppButton from '../components/ui/AppButton.vue';
import PageHero from '../components/layout/PageHero.vue';
import SectionHeader from '../components/ui/SectionHeader.vue';
import ImageTile from '../components/ui/ImageTile.vue';
import ServiceCard from '../components/ui/ServiceCard.vue';
import HeroVisual from '../components/home/HeroVisual.vue';
import WelcomeBlock from '../components/home/WelcomeBlock.vue';
import FaqSection from '../components/home/FaqSection.vue';
import { accesos, site } from '../data/site';
import { services } from '../data/services';
import { proyectos } from '../data/proyectos';

const route = useRoute();

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
      <HeroVisual />
    </template>
  </PageHero>

  <div v-if="route.query.denied" class="denied form-message error">
    No tienes permisos para acceder al panel de administración.
  </div>

  <WelcomeBlock />

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
    <div class="canva">
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

  <FaqSection />
</template>

<style scoped>
.denied {
  margin-top: 16px;
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

@media (max-width: 900px) {
  .canva {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
