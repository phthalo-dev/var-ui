import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { initDocsPageBar } from './docsPageBar';

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;
let trigger: Callback = () => {};

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: Callback) {
        trigger = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    'MutationObserver',
    class {
      observe() {}
      disconnect() {}
    },
  );
  document.body.innerHTML = `
    <div data-docs-page-bar aria-hidden="true">
      <button data-docs-bar-tab="props" tabindex="-1">Props</button>
    </div>
    <header data-docs-page-hero></header>
    <div data-docs-page-tabs>
      <div role="tablist">
        <button role="tab" id="tab-documentation" aria-selected="true"></button>
        <button role="tab" id="tab-props" aria-selected="false"></button>
      </div>
    </div>`;
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

describe('initDocsPageBar', () => {
  it('reveals the bar to keyboard and AT once the hero has scrolled past', () => {
    initDocsPageBar();
    const bar = document.querySelector<HTMLElement>('[data-docs-page-bar]')!;
    trigger([
      {
        isIntersecting: false,
        boundingClientRect: { top: -200 } as DOMRectReadOnly,
        rootBounds: { top: 0 } as DOMRectReadOnly,
      },
    ]);
    expect(bar.hasAttribute('data-stuck')).toBe(true);
    expect(bar.hasAttribute('aria-hidden')).toBe(false);
    expect(bar.querySelector('button')!.tabIndex).toBe(0);
  });

  it('drives the real page tab from a bar tab', () => {
    initDocsPageBar();
    const real = document.getElementById('tab-props')!;
    const clicked = vi.fn();
    real.addEventListener('click', clicked);
    Element.prototype.scrollIntoView = vi.fn();
    document.querySelector<HTMLElement>('[data-docs-bar-tab="props"]')!.click();
    expect(clicked).toHaveBeenCalled();
  });
});
