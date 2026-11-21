import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import BentoComparadorSection from './BentoComparadorSection.vue';

describe('BentoComparadorSection.vue', () => {
  const mountComponent = () => {
    return mount(BentoComparadorSection, {
      global: {
        stubs: {
          SectionHeader: true,
        },
      },
    });
  };

  it('renderiza la cuadrícula Bento de 4 tarjetas', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('.bento-grid').exists()).toBe(true);
    expect(wrapper.findAll('.bento-card').length).toBe(4);
  });

  it('renderiza chips de medicamentos y permite cambiar de selección', async () => {
    const wrapper = mountComponent();
    const chips = wrapper.findAll('.med-chip-btn');
    expect(chips.length).toBeGreaterThanOrEqual(5);

    const amoxiChip = chips.find((c) => c.text().includes('Amoxicilina'));
    expect(amoxiChip).toBeDefined();

    await amoxiChip!.trigger('click');
    expect(wrapper.find('.med-dossier-name').text()).toContain('Amoxicilina');
    expect(wrapper.find('.rx-pill').text()).toContain('Requiere Fórmula');
  });

  it('calcula y muestra el ahorro porcentual y en pesos', () => {
    const wrapper = mountComponent();
    const saveHighlight = wrapper.find('.savings-pill-highlight');
    expect(saveHighlight.exists()).toBe(true);
    expect(saveHighlight.text()).toMatch(/Ahorro de hasta \d+%/);
  });

  it('muestra las barras de precios y los enlaces a WhatsApp', () => {
    const wrapper = mountComponent();
    const rows = wrapper.findAll('.bar-item-row');
    expect(rows.length).toBeGreaterThan(0);

    const waLinks = wrapper.findAll('.bar-pedir-link');
    expect(waLinks.length).toBeGreaterThan(0);
    expect(waLinks[0].attributes('href')).toContain('https://wa.me/');
  });
});
