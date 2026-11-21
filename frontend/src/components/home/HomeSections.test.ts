import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ComoFuncionaSection from './ComoFuncionaSection.vue';
import DirectorioMarcasSection from './DirectorioMarcasSection.vue';
import SaludInfoSection from './SaludInfoSection.vue';

describe('Secciones Informativas y Visuales de Home', () => {
  describe('ComoFuncionaSection.vue', () => {
    it('renderiza los 3 pasos con sus respectivos SVGs descriptivos', () => {
      const wrapper = mount(ComoFuncionaSection);
      expect(wrapper.text()).toContain('¿Cómo funciona el Radar FarmApp?');
      expect(wrapper.text()).toContain('Ubica tu punto o barrio');
      expect(wrapper.text()).toContain('Compara precio vs distancia');

      const svgs = wrapper.findAll('.step-illustration svg');
      expect(svgs.length).toBe(3);
    });
  });

  describe('DirectorioMarcasSection.vue', () => {
    it('muestra marcas de cadena y boticarios de barrio de Villavicencio', () => {
      const wrapper = mount(DirectorioMarcasSection, {
        global: {
          stubs: {
            RouterLink: {
              template: '<a><slot /></a>',
            },
            AppButton: true,
          },
        },
      });
      expect(wrapper.text()).toContain('La Rebaja');
      expect(wrapper.text()).toContain('Cruz Verde');
      expect(wrapper.text()).toContain('Copifam');
      expect(wrapper.text()).toContain('Boticarios de Barrio');

      const cards = wrapper.findAll('.marca-card');
      expect(cards.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('SaludInfoSection.vue', () => {
    it('renderiza guías de uso responsable, INVIMA y números de urgencias', () => {
      const wrapper = mount(SaludInfoSection);
      expect(wrapper.text()).toContain('Salud Responsable y Seguridad');
      expect(wrapper.text()).toContain('Venta Libre vs Bajo Fórmula Médica');
      expect(wrapper.text()).toContain('Cadena de Frío en Clima Cálido');
      expect(wrapper.text()).toContain('Genéricos Bioequivalentes vs Marca');
      expect(wrapper.text()).toContain('Líneas de Urgencias y Toxicología');

      const phoneLink = wrapper.find('a[href="tel:123"]');
      expect(phoneLink.exists()).toBe(true);
    });
  });
});
