import { defineStore } from 'pinia';
import { computed } from 'vue';
import { proyectos as datos, buscarProyecto } from '../data/proyectos';
import type { Proyecto } from '../data/proyectos';

export const useProyectosStore = defineStore('proyectos', () => {
  const items = computed<Proyecto[]>(() => datos);

  function getBySlug(slug: string): Proyecto | undefined {
    return buscarProyecto(slug);
  }

  const porSlug = computed(() => (slug: string): Proyecto | undefined => buscarProyecto(slug));

  return { items, getBySlug, porSlug };
});