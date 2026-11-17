<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import PageHero from '../components/layout/PageHero.vue';
import SectionHeader from '../components/ui/SectionHeader.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppButton from '../components/ui/AppButton.vue';
import { buscarProyecto, proyectos } from '../data/proyectos';

const route = useRoute();
const proyecto = computed(() => buscarProyecto(String(route.params.slug)));
const indice = computed(() =>
  proyectos.findIndex((p) => p.slug === String(route.params.slug)),
);
const anterior = computed(
  () => proyectos[(indice.value - 1 + proyectos.length) % proyectos.length],
);
const siguiente = computed(() => proyectos[(indice.value + 1) % proyectos.length]);
const ampliada = ref<string | null>(null);

watch(
  () => route.params.slug,
  () => {
    ampliada.value = null;
  },
);
</script>

<template>
  <div v-if="proyecto" class="proyecto">
    <PageHero
      :eyebrow="`Stand ${proyecto.numero} · ${proyecto.empresa}`"
      :title="proyecto.producto"
      :lede="proyecto.descripcion"
    >
      <template #actions>
        <RouterLink to="/feria">
          <AppButton variant="secondary">← Volver a la feria</AppButton>
        </RouterLink>
        <a href="#galeria">
          <AppButton>Ver galería</AppButton>
        </a>
      </template>

      <template #media>
        <div class="logo-stage">
          <div class="logo-glow" />
          <img :src="proyecto.logo" :alt="proyecto.producto" />
          <span class="pill blue">{{ proyecto.empresa }}</span>
        </div>
      </template>
    </PageHero>

    <section class="section reveal">
      <AppCard class="intro">
        <p>{{ proyecto.intro }}</p>
      </AppCard>
    </section>

    <section v-if="proyecto.precios?.length" class="section reveal">
      <SectionHeader eyebrow="Precios" title="Precios y promociones" />
      <div class="grid grid-3">
        <AppCard v-for="precio in proyecto.precios" :key="precio.etiqueta" class="price">
          <span class="price-label">{{ precio.etiqueta }}</span>
          <strong>{{ precio.valor }}</strong>
          <p v-if="precio.nota">{{ precio.nota }}</p>
        </AppCard>
      </div>
    </section>

    <section v-if="proyecto.objetivo || proyecto.sirve" class="section reveal">
      <SectionHeader eyebrow="Ficha del producto" title="Objetivo y beneficios" />
      <div class="grid grid-2">
        <AppCard v-if="proyecto.objetivo">
          <span class="mini-title">Objetivo</span>
          <p>{{ proyecto.objetivo }}</p>
        </AppCard>
        <AppCard v-if="proyecto.sirve">
          <span class="mini-title">Sirve para</span>
          <p>{{ proyecto.sirve }}</p>
        </AppCard>
      </div>
    </section>

    <section v-if="proyecto.ingredientes.length" class="section reveal">
      <SectionHeader
        eyebrow="Fórmula"
        title="Ingredientes"
        lede="Manejamos ingredientes seleccionados para cada producto."
      />
      <AppCard>
        <ul class="chips">
          <li v-for="ing in proyecto.ingredientes" :key="ing">{{ ing }}</li>
        </ul>
      </AppCard>
    </section>

    <section v-if="proyecto.variantes?.length" class="section reveal">
      <SectionHeader
        eyebrow="Para cada tipo de cabello"
        title="Elige tu variante"
        lede="Selene se adapta al cabello crespo, liso y ondulado."
      />
      <div class="grid grid-3">
        <AppCard v-for="v in proyecto.variantes" :key="v.nombre" class="variant">
          <img :src="v.imagen" :alt="v.nombre" loading="lazy" />
          <h3>{{ v.nombre }}</h3>
          <p>{{ v.texto }}</p>
        </AppCard>
      </div>
    </section>

    <section class="section reveal">
      <SectionHeader eyebrow="La empresa" title="Misión y visión" />
      <div class="grid grid-2">
        <AppCard tone="dark">
          <span class="mini-title light">Misión</span>
          <p class="light-text">{{ proyecto.mision }}</p>
        </AppCard>
        <AppCard tone="dark">
          <span class="mini-title light">Visión</span>
          <p class="light-text">{{ proyecto.vision }}</p>
        </AppCard>
      </div>
    </section>

    <section id="galeria" class="section reveal">
      <SectionHeader
        eyebrow="Galería"
        title="Imágenes del producto"
        lede="Haz clic en cualquier imagen para verla en grande."
      />
      <div class="gallery">
        <button
          v-for="(img, i) in proyecto.galeria"
          :key="img"
          type="button"
          class="shot"
          :class="{ wide: i % 5 === 0 }"
          @click="ampliada = img"
        >
          <img :src="img" :alt="`${proyecto.producto} ${i + 1}`" loading="lazy" />
        </button>
      </div>
    </section>

    <section class="section reveal">
      <div class="nav-projects">
        <RouterLink :to="`/proyectos/${anterior.slug}`" class="nav-card glass">
          <span>← Anterior</span>
          <strong>{{ anterior.producto }}</strong>
        </RouterLink>
        <RouterLink :to="`/proyectos/${siguiente.slug}`" class="nav-card glass right">
          <span>Siguiente →</span>
          <strong>{{ siguiente.producto }}</strong>
        </RouterLink>
      </div>
    </section>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="ampliada" class="lightbox" @click.self="ampliada = null">
          <button type="button" class="close" aria-label="Cerrar" @click="ampliada = null">✕</button>
          <img :src="ampliada" :alt="proyecto.producto" />
        </div>
      </Transition>
    </Teleport>
  </div>

  <AppCard v-else class="not-found">
    <h1>Proyecto no encontrado</h1>
    <p>El proyecto que buscas no existe o cambió de nombre.</p>
    <RouterLink to="/feria"><AppButton>Volver a la feria</AppButton></RouterLink>
  </AppCard>
</template>

<style scoped>
.logo-stage {
  position: relative;
  display: grid;
  place-items: center;
  width: min(100%, 380px);
  aspect-ratio: 1 / 1;
}

.logo-glow {
  position: absolute;
  inset: 6%;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, rgba(255, 255, 255, 0.95), rgba(90, 200, 250, 0.3) 58%, transparent 74%);
  filter: blur(8px);
}

.logo-stage img {
  position: relative;
  width: 62%;
  max-height: 260px;
  object-fit: contain;
  filter: drop-shadow(0 24px 38px rgba(8, 47, 77, 0.36));
}

.logo-stage .pill {
  position: absolute;
  bottom: 6%;
}

.intro {
  font-size: 1rem;
  text-align: center;
}

.price {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: center;
}

.price-label {
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--blue-deep);
}

.price strong {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--ink);
}

.mini-title {
  display: inline-block;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--blue-deep);
  margin-bottom: 10px;
}

.mini-title.light {
  color: #9fdcf7;
}

.light-text {
  color: rgba(234, 246, 251, 0.82);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chips li {
  padding: 9px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.85);
  font-size: 0.86rem;
  font-weight: 550;
  color: var(--ink-soft);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.variant img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 16px;
}

.variant h3 {
  margin-bottom: 8px;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr));
  gap: 14px;
}

.shot {
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.4);
  cursor: zoom-in;
  box-shadow: var(--inset), 0 14px 30px -20px rgba(8, 47, 77, 0.5);
  transition: transform 0.3s var(--ease);
}

.shot:hover {
  transform: translateY(-4px);
}

.shot img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  transition: transform 0.5s var(--ease);
}

.shot:hover img {
  transform: scale(1.05);
}

.shot.wide {
  grid-column: span 2;
}

.shot.wide img {
  aspect-ratio: 16 / 9;
}

.nav-projects {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.nav-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 22px 24px;
  border-radius: var(--radius);
  background: var(--glass-strong);
  transition: transform 0.25s var(--ease);
}

.nav-card:hover {
  transform: translateY(-3px);
}

.nav-card.right {
  text-align: right;
}

.nav-card span {
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--blue-deep);
}

.nav-card strong {
  font-size: 1.1rem;
  letter-spacing: -0.02em;
}

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(6, 26, 42, 0.72);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.lightbox img {
  max-width: min(94vw, 1000px);
  max-height: 86vh;
  border-radius: 18px;
  box-shadow: 0 40px 90px -30px rgba(0, 0, 0, 0.6);
}

.close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.22s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.not-found {
  text-align: center;
  padding: 60px 30px;
}

.not-found h1 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.not-found p {
  margin-bottom: 22px;
}

@media (max-width: 640px) {
  .nav-projects {
    grid-template-columns: 1fr;
  }
  .shot.wide {
    grid-column: span 1;
  }
  .shot.wide img {
    aspect-ratio: 1 / 1;
  }
}
</style>
