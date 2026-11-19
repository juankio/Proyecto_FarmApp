import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePaginatedQuery } from './usePaginatedQuery';

function mountQuery<T>(options: any) {
  let api: any;
  const Comp = defineComponent({
    setup() {
      api = usePaginatedQuery<T>(options);
      return () => h('div');
    },
  });
  const wrapper = mount(Comp);
  return { wrapper, get: () => api };
}

const flush = () => new Promise((r) => setTimeout(r, 20));

describe('usePaginatedQuery', () => {
  let fetcher: any;

  beforeEach(() => {
    fetcher = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('carga inicial y setea items/total', async () => {
    fetcher.mockResolvedValue({ items: [{ id: 1 }], total: 1 });
    const { get, wrapper } = mountQuery({ endpoint: '/api/x', limit: 5, minLoadingMs: 0, fetcher });
    await flush();
    const q = get();
    expect(fetcher).toHaveBeenCalled();
    expect(q.items.value).toEqual([{ id: 1 }]);
    expect(q.total.value).toBe(1);
    expect(q.cargando.value).toBe(false);
    wrapper.unmount();
  });

  it('maneja error', async () => {
    fetcher.mockRejectedValue(new Error('falló'));
    const { get, wrapper } = mountQuery({ endpoint: '/api/x', minLoadingMs: 0, fetcher });
    await flush();
    const q = get();
    expect(q.error.value).toBe('falló');
    expect(q.cargando.value).toBe(false);
    wrapper.unmount();
  });

  it('buscar filtra y reinicia página', async () => {
    fetcher.mockResolvedValue({ items: [], total: 0 });
    const { get, wrapper } = mountQuery({ endpoint: '/api/x', minLoadingMs: 0, delay: 0, fetcher });
    await flush();
    const q = get();
    q.page.value = 3;
    q.busqueda.value = 'abc';
    q.buscar();
    await flush();
    expect(q.filtro.value).toBe('abc');
    expect(q.page.value).toBe(1);
    wrapper.unmount();
  });

  it('cambiarPagina', async () => {
    fetcher.mockResolvedValue({ items: [], total: 0 });
    const { get, wrapper } = mountQuery({ endpoint: '/api/x', minLoadingMs: 0, fetcher });
    await flush();
    const q = get();
    q.cambiarPagina(2);
    await flush();
    expect(q.page.value).toBe(2);
    wrapper.unmount();
  });

  it('ignora respuesta obsoleta (race)', async () => {
    let resolve1: any, resolve2: any;
    fetcher
      .mockImplementationOnce(() => new Promise((r) => { resolve1 = r; }))
      .mockImplementationOnce(() => new Promise((r) => { resolve2 = r; }));

    const { get, wrapper } = mountQuery({ endpoint: '/api/x', minLoadingMs: 0, fetcher });
    // primera carga en vuelo; disparamos segunda página
    const q = get();
    q.cambiarPagina(2);
    // resolver segunda primero
    resolve2({ items: [{ id: 2 }], total: 1 });
    await flush();
    resolve1({ items: [{ id: 1 }], total: 1 });
    await flush();
    expect(q.items.value).toEqual([{ id: 2 }]);
    wrapper.unmount();
  });

  it('buildParams personalizado', async () => {
    fetcher.mockResolvedValue({ items: [], total: 0 });
    const buildParams = (page: number, limit: number, filtro: string) => {
      const p = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (filtro) p.set('custom', filtro);
      return p;
    };
    const { get, wrapper } = mountQuery({ endpoint: '/api/x', minLoadingMs: 0, fetcher, buildParams });
    await flush();
    const q = get();
    q.busqueda.value = 'zzz';
    q.buscar();
    await flush();
    const called = fetcher.mock.calls[fetcher.mock.calls.length - 1][0];
    expect(called).toContain('custom=zzz');
    wrapper.unmount();
  });
});