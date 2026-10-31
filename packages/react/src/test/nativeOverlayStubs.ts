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

/**
 * jsdom has no `popover` API. Call once at the top of a test file to stub `showPopover` /
 * `hidePopover` / `togglePopover` with their observable effects: `data-popover-open` stands in for
 * `:popover-open`, and `beforetoggle` (cancelable when opening) and `toggle` events carry
 * `newState`/`oldState`/`source` like `ToggleEvent`. Returns `fire` to simulate native-initiated
 * changes (light dismiss, an invoker click) on an element.
 */
export function stubNativePopover(): {
  fire: (el: HTMLElement, newState: 'open' | 'closed', source?: Element | null) => void;
} {
  const proto = HTMLElement.prototype;
  const isOpen = (el: HTMLElement) => el.hasAttribute('data-popover-open');
  const fire = (el: HTMLElement, newState: 'open' | 'closed', source: Element | null = null) => {
    if (isOpen(el) === (newState === 'open')) return;
    const before = Object.assign(new Event('beforetoggle', { cancelable: newState === 'open' }), {
      newState,
      oldState: newState === 'open' ? 'closed' : 'open',
      source,
    });
    el.dispatchEvent(before);
    if (before.defaultPrevented) return;
    if (newState === 'open') el.setAttribute('data-popover-open', '');
    else el.removeAttribute('data-popover-open');
    queueMicrotask(() =>
      el.dispatchEvent(
        Object.assign(new Event('toggle'), {
          newState,
          oldState: newState === 'open' ? 'closed' : 'open',
          source,
        }),
      ),
    );
  };
  beforeEach(() => {
    Object.assign(proto, {
      showPopover(this: HTMLElement) {
        fire(this, 'open');
      },
      hidePopover(this: HTMLElement) {
        fire(this, 'closed');
      },
      togglePopover(this: HTMLElement) {
        fire(this, isOpen(this) ? 'closed' : 'open');
      },
    });
  });
  afterEach(() => {
    Reflect.deleteProperty(proto, 'showPopover');
    Reflect.deleteProperty(proto, 'hidePopover');
    Reflect.deleteProperty(proto, 'togglePopover');
  });
  return { fire };
}
