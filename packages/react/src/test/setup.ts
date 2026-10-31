import { afterEach } from 'vite-plus/test';
import { cleanup } from '@testing-library/react';
import { stubNativeDialog, stubNativePopover } from './nativeOverlayStubs';

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = ResizeObserverStub as typeof ResizeObserver;
}

// jsdom doesn't implement `CSS.escape`; React Aria's virtual-focus collections (e.g. Autocomplete +
// ListBox) use it to look up the active item's DOM node. Polyfill per the CSSOM spec so those
// components don't crash in tests.
if (typeof globalThis.CSS === 'undefined') {
  (globalThis as unknown as { CSS: Partial<typeof CSS> }).CSS = {};
}
if (typeof globalThis.CSS.escape !== 'function') {
  globalThis.CSS.escape = (value: string): string =>
    String(value).replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`);
}

// jsdom has no top layer: stub `<dialog>.showModal()` and the `popover` API for every jsdom test
// (behaviour that needs the platform lives in `*.browser.test.tsx`).
if (typeof HTMLDialogElement !== 'undefined') {
  stubNativeDialog();
  stubNativePopover();
}

// RTL auto-cleanup relies on vitest globals; register it explicitly instead.
afterEach(() => {
  cleanup();
});
