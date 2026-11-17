<script setup lang="ts">
import PageHero from '../components/layout/PageHero.vue';
import SectionHeader from '../components/ui/SectionHeader.vue';
import AppCard from '../components/ui/AppCard.vue';
import { lenguajes } from '../data/lenguajes';

const iniciales: Record<string, string> = {
  'C++': 'C++',
  Python: 'Py',
  'C#': 'C#',
  Java: 'Jv',
};
</script>

<template>
  <PageHero
    eyebrow="Educación"
    title="Lenguajes de programación"
    lede="Una guía breve para entender los lenguajes de bajo y alto nivel, su clasificación y sus ventajas."
  />

  <section class="section reveal">
    <AppCard class="prose-card">
      <SectionHeader
        eyebrow="Fundamentos"
        title="¿Qué son los lenguajes de bajo nivel?"
        left
      />
      <p v-for="p in lenguajes.intro" :key="p">{{ p }}</p>
    </AppCard>
  </section>

  <section class="section reveal">
    <SectionHeader
      eyebrow="Ventajas"
      title="¿Cuáles son las ventajas de los lenguajes de bajo nivel?"
    />
    <div class="grid grid-2">
      <AppCard v-for="(v, i) in lenguajes.ventajas" :key="v" class="advantage">
        <span class="num">{{ String(i + 1).padStart(2, '0') }}</span>
        <p>{{ v }}</p>
      </AppCard>
    </div>
  </section>

  <section class="section reveal">
    <SectionHeader
      eyebrow="Clasificación"
      title="Tipos de lenguajes de bajo nivel"
      lede="Cada nivel se acerca más al hardware y exige un conocimiento más profundo de la máquina."
    />
    <div class="grid grid-3">
      <AppCard v-for="c in lenguajes.clasificacion" :key="c.titulo" hover>
        <h3>{{ c.titulo }}</h3>
        <p>{{ c.texto }}</p>
      </AppCard>
    </div>
  </section>

  <section class="section reveal">
    <SectionHeader
      eyebrow="Alto nivel"
      title="Lenguajes de programación de alto nivel"
      lede="Más cercanos al lenguaje humano, ideales para construir aplicaciones complejas con menos esfuerzo."
    />
    <div class="grid grid-4">
      <AppCard v-for="l in lenguajes.altoNivel" :key="l.nombre" hover class="lang">
        <span class="lang-icon" :style="{ background: l.color }">
          {{ iniciales[l.nombre] }}
        </span>
        <h3>{{ l.nombre }}</h3>
        <p>{{ l.texto }}</p>
      </AppCard>
    </div>
  </section>
</template>

<style scoped>
.prose-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.prose-card p {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--ink-soft);
}

.advantage {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.num {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--blue-deep);
  background: rgba(10, 132, 255, 0.12);
  border-radius: 10px;
  padding: 6px 10px;
  line-height: 1;
}

.advantage p {
  font-size: 0.95rem;
  color: var(--ink-soft);
}

.lang {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lang-icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 13px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 10px 20px -12px rgba(8, 47, 77, 0.6);
}

.lang-icon {
  color: #fff;
  font-size: 0.92rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.lang h3 {
  font-size: 1.05rem;
}

.lang p {
  font-size: 0.88rem;
}
</style>
