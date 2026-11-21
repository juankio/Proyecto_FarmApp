import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ComparadorPreciosVisual from './ComparadorPreciosVisual.vue';

describe('ComparadorPreciosVisual.vue', () => {
  const mountComponent = () => {
    return mount(ComparadorPreciosVisual, {
      global: {
        stubs: {
          AppButton: true,
        },
      },
    });
  };

  it('renderiza título principal y badge de transparencia', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain('Transparencia de Precios en Villavicencio');
    expect(wrapper.text()).toContain('Compara antes de comprar y ahorra');
  });

  it('renderiza la lista de pestañas de medicamentos populares', () => {
    const wrapper = mountComponent();
    const tabs = wrapper.findAll('.med-tab-card');
    expect(tabs.length).toBeGreaterThanOrEqual(6);
  });

  it('cambia el medicamento seleccionado al hacer clic en una pestaña', async () => {
    const wrapper = mountComponent();
    const tabs = wrapper.findAll('.med-tab-card');
    const amoxiTab = tabs.find((t) => t.text().includes('Amoxicilina'));
    expect(amoxiTab).toBeDefined();

    await amoxiTab!.trigger('click');
    expect(wrapper.find('.prod-title').text()).toContain('Amoxicilina');
    expect(wrapper.find('.receta-tag').text()).toContain('Requiere Fórmula Médica');
  });

  it('calcula y muestra el ahorro estimado en pesos y porcentaje', () => {
    const wrapper = mountComponent();
    const calloutVal = wrapper.find('.callout-val');
    expect(calloutVal.exists()).toBe(true);
    expect(calloutVal.text()).toMatch(/Hasta .* menos/);
  });

  it('muestra barras de precios por droguería y enlaces a WhatsApp', () => {
    const wrapper = mountComponent();
    const rows = wrapper.findAll('.price-row-item');
    expect(rows.length).toBeGreaterThan(0);

    const waLinks = wrapper.findAll('.btn-pedir-wa');
    expect(waLinks.length).toBeGreaterThan(0);
    expect(waLinks[0].attributes('href')).toContain('https://wa.me/');
  });
});
