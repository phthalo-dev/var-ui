import { afterEach, beforeEach } from 'vite-plus/test';

/**
 * jsdom has no top layer and no `showModal()`/`close()`. Call once at the top of a test file to
 * stub them with their observable effects (the `open` attribute, the `close` event) for API-shape
 * tests. Behaviour that needs the platform (focus, inertness, Escape, `::backdrop`, animations)
 * belongs in a `*.browser.test.tsx` file instead.
 */
export function stubNativeDialog(): void {
  const proto = HTMLDialogElement.prototype;
  beforeEach(() => {
    Object.assign(proto, {
      showModal(this: HTMLDialogElement) {
        this.setAttribute('open', '');
      },
      close(this: HTMLDialogElement) {
        if (!this.open) return;
        this.removeAttribute('open');
        queueMicrotask(() => this.dispatchEvent(new Event('close')));
      },
    });
  });
  afterEach(() => {
    Reflect.deleteProperty(proto, 'showModal');
    Reflect.deleteProperty(proto, 'close');
  });
}
