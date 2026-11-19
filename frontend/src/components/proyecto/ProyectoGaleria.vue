<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import SectionHeader from '../ui/SectionHeader.vue';
import type { Proyecto } from '../../data/proyectos';
import { optimizarCloudinary } from '../../utils/imagen';

const props = defineProps<{ proyecto: Proyecto }>();

function imgOpt(url: string): string {
  return optimizarCloudinary(url, 800);
}

const ampliada = ref<string | null>(null);

watch(
  () => props.proyecto,
  () => {
    ampliada.value = null;
  },
);
</script>

<template>
  <section id="galeria" class="section reveal">
    <SectionHeader
      eyebrow="Galería"
      title="Imágenes del producto"
      lede="Haz clic en cualquier imagen para verla en grande."
    />
    <div class="gallery">
      <button
        v-for="(img, i) in props.proyecto.galeria"
        :key="img"
        type="button"
        class="shot"
        :class="{ wide: i % 5 === 0 }"
        @click="ampliada = img"
      >
        <img :src="imgOpt(img)" :alt="`${props.proyecto.producto} ${i + 1}`" loading="lazy" decoding="async" />
      </button>
    </div>
  </section>

  <Teleport to="body">
    <Transition name="modal">
      <div v-if="ampliada" class="lightbox" @click.self="ampliada = null">
        <button type="button" class="close" aria-label="Cerrar" @click="ampliada = null">✕</button>
        <img :src="imgOpt(ampliada)" :alt="props.proyecto.producto" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr));
  gap: 14px;
}

.shot {
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  cursor: zoom-in;
  box-shadow: var(--inset), 0 14px 30px -20px rgba(0, 0, 0, 0.7);
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

@media (max-width: 640px) {
  .shot.wide {
    grid-column: span 1;
  }
  .shot.wide img {
    aspect-ratio: 1 / 1;
  }
}
</style>