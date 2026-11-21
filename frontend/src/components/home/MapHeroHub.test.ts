import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MapHeroHub from './MapHeroHub.vue';

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('MapHeroHub.vue', () => {
  const mountComponent = () => {
    return mount(MapHeroHub, {
      global: {
        stubs: {
          MapaVillavicencio: {
            template: '<div class="stub-mapa-villavicencio"><slot /></div>',
            methods: {
              enfocarDrogueria: vi.fn(),
            },
          },
          AppButton: true,
        },
      },
    });
  };

  it('renderiza encabezado principal y badges de valor', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain('Radar Geográfico en Vivo');
    expect(wrapper.text()).toContain('Villavicencio, Meta');
    expect(wrapper.text()).toContain('mejor precio');
    expect(wrapper.text()).toContain('menor distancia');
  });

  it('renderiza chips de medicamentos frecuentes', () => {
    const wrapper = mountComponent();
    const chips = wrapper.findAll('.med-chip');
    expect(chips.length).toBeGreaterThanOrEqual(5);
    expect(chips[0].text()).toBe('Acetaminofén');
  });

  it('cambiar de medicamento actualiza la tarjeta de ahorro y el mejor precio', async () => {
    const wrapper = mountComponent();
    const chips = wrapper.findAll('.med-chip');
    const ibupChip = chips.find((c) => c.text().includes('Ibuprofeno'));
    expect(ibupChip).toBeDefined();

    await ibupChip!.trigger('click');
    expect(wrapper.find('.med-name').text()).toBe('Ibuprofeno 400 mg');
    expect(wrapper.text()).toContain('Ahorras hasta');
  });

  it('permite filtrar por barrio de Villavicencio', async () => {
    const wrapper = mountComponent();
    const select = wrapper.find('.neighborhood-select-box select');
    await select.setValue('El Barzal');

    const cards = wrapper.findAll('.drogueria-card-mini');
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach((card) => {
      expect(card.find('.barrio-tag-mini').text()).toBe('El Barzal');
    });
  });

  it('filtra por droguerías 24 Horas al activar el botón toggle', async () => {
    const wrapper = mountComponent();
    const toggle24h = wrapper.findAll('.toggle-pill').find((b) => b.text().includes('24 Horas'));
    expect(toggle24h).toBeDefined();

    await toggle24h!.trigger('click');
    const cards = wrapper.findAll('.drogueria-card-mini');
    cards.forEach((card) => {
      expect(card.find('.tag-mini-24h').exists()).toBe(true);
    });
  });

  it('filtra por término de búsqueda en tiempo real', async () => {
    const wrapper = mountComponent();
    const input = wrapper.find('.search-input-box input');
    await input.setValue('Cruz Verde');

    const cards = wrapper.findAll('.drogueria-card-mini');
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach((card) => {
      expect(card.text().toLowerCase()).toContain('cruz verde');
    });
  });

  it('permite alternar el criterio de ordenamiento entre Precio y Distancia', async () => {
    const wrapper = mountComponent();
    const sortButtons = wrapper.findAll('.sort-pill');
    const distanciaBtn = sortButtons.find((b) => b.text().includes('Menor Distancia'));
    expect(distanciaBtn).toBeDefined();

    await distanciaBtn!.trigger('click');
    expect(wrapper.find('.order-info').text()).toContain('Distancia');

    const precioBtn = sortButtons.find((b) => b.text().includes('Mejor Precio'));
    await precioBtn!.trigger('click');
    expect(wrapper.find('.order-info').text()).toContain('Precio');
  });

  it('las tarjetas tienen enlace directo a WhatsApp con mensaje preconfigurado', () => {
    const wrapper = mountComponent();
    const firstWaBtn = wrapper.find('.wa-quick-btn');
    expect(firstWaBtn.exists()).toBe(true);
    const href = firstWaBtn.attributes('href');
    expect(href).toContain('https://wa.me/');
    expect(href).toContain('text=');
  });
});
