import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue';
import type { Ref } from 'vue';

export function useFocusTrap(
  open: Ref<boolean>,
  container: Ref<HTMLElement | null>,
  onClose: () => void,
): void {
  let previous: HTMLElement | null = null;

  function focusables(): HTMLElement[] {
    if (!container.value) return [];
    return Array.from(
      container.value.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      ),
    );
  }

  function onKeydown(event: KeyboardEvent): void {
    if (!open.value) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== 'Tab') return;
    const list = focusables();
    if (!list.length) {
      event.preventDefault();
      container.value?.focus();
      return;
    }
    const first = list[0];
    const last = list[list.length - 1];
    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  watch(open, async (isOpen) => {
    if (isOpen) {
      previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      await nextTick();
      container.value?.focus();
    } else if (previous) {
      previous.focus();
      previous = null;
    }
  });

  onMounted(() => window.addEventListener('keydown', onKeydown));
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
}