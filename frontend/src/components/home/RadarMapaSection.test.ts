import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import RadarMapaSection from './RadarMapaSection.vue';

describe('RadarMapaSection.vue (Apple / Airbnb style)', () => {
  const mountComponent = () => {
    return mount(RadarMapaSection, {
      global: {
        stubs: {
          SectionHeader: true,
          MapaVillavicencio: {
            template: '<div class="stub-mapa"><slot /></div>',
            methods: {
              enfocarDrogueria: vi.fn(),
            },
          },
        },
      },
    });
  };

  it('renderiza el canvas panorámico y la bandeja de farmacias', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('.map-panoramic-card').exists()).toBe(true);
    expect(wrapper.find('.radar-cards-tray').exists()).toBe(true);
  });

  it('renderiza controles flotantes tipo isla (24H, Domicilio, Boticarios)', () => {
    const wrapper = mountComponent();
    const islandButtons = wrapper.findAll('.island-btn');
    expect(islandButtons.length).toBe(3);
    expect(islandButtons[0].text()).toContain('24 Horas');
    expect(islandButtons[1].text()).toContain('Domicilio');
    expect(islandButtons[2].text()).toContain('Boticarios');
  });

  it('permite filtrar por 24 Horas al activar el botón de la isla', async () => {
    const wrapper = mountComponent();
    const btn24h = wrapper.findAll('.island-btn').find((b) => b.text().includes('24 Horas'));
    expect(btn24h).toBeDefined();

    await btn24h!.trigger('click');
    const cards = wrapper.findAll('.tray-card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('permite seleccionar una farmacia de la bandeja y emitir foco', async () => {
    const wrapper = mountComponent();
    const firstCard = wrapper.find('.tray-card');
    expect(firstCard.exists()).toBe(true);

    await firstCard.trigger('click');
    expect(firstCard.classes()).toContain('card--focused');
  });

  it('cada tarjeta cuenta con botón directo a WhatsApp', () => {
    const wrapper = mountComponent();
    const waLink = wrapper.find('.card-wa-btn');
    expect(waLink.exists()).toBe(true);
    expect(waLink.attributes('href')).toContain('https://wa.me/');
  });
});
