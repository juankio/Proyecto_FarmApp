import { onBeforeUnmount } from 'vue';

export function useDebounce<T extends (...args: any[]) => void>(fn: T, delay = 300) {
  let timer: number | undefined;

  const debounced = (...args: Parameters<T>): void => {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };

  const cancel = (): void => {
    if (timer) window.clearTimeout(timer);
    timer = undefined;
  };

  onBeforeUnmount(cancel);

  return { debounced, cancel };
}