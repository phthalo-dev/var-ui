import { defaultThemeClassName } from '@var-ui/core';
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { applyDocsThemePickerSelection, initDocsThemePicker } from './docsThemePicker';

// Action event dispatched by the `@var-ui/astro` Menu inside the picker.
// Mirrored as a literal because vitest cannot resolve the `.astro`-re-exporting
// package barrel; keep in sync with `MENU_ACTION_EVENT`.
const MENU_ACTION_EVENT = 'var-ui:menu-action';

const PRESETS = [
  {
    id: 'default',
    label: 'Default',
    className: defaultThemeClassName,
    swatch: '#64748b',
    lazyCss: false,
  },
  {
    id: 'forest',
    label: 'Forest',
    className: 'theme-forest',
    swatch: '#16a34a',
    lazyCss: false,
  },
];

function mountPicker(storageKey = 'docs-theme-id'): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = `
    <div
      data-docs-theme-picker
      data-presets='${JSON.stringify(PRESETS)}'
      data-storage-key="${storageKey}"
      data-fallback-class="${defaultThemeClassName}"
    >
      <div data-var-ui-menu-root data-selection-mode="single">
        <button
          type="button"
          data-var-ui-menu-trigger
          aria-haspopup="menu"
          aria-expanded="false"
        >
          <svg viewBox="0 0 24 24">
            <rect data-docs-theme-picker-swatch fill="#64748b"></rect>
          </svg>
        </button>
        <div data-var-ui-menu-popover data-placement="bottom-end" hidden>
          <div role="menu" aria-label="Site theme">
            <button
              type="button"
              role="menuitemradio"
              aria-checked="false"
              data-var-ui-menu-item
              data-item-id="default"
            >
              <span data-var-ui-menu-item-check>✓</span>
              Default
            </button>
            <button
              type="button"
              role="menuitemradio"
              aria-checked="false"
              data-var-ui-menu-item
              data-item-id="forest"
            >
              <span data-var-ui-menu-item-check>✓</span>
              Forest
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(host);
  return host.querySelector('[data-docs-theme-picker]') as HTMLElement;
}

function item(root: HTMLElement, id: string): HTMLButtonElement {
  return root.querySelector(`[data-item-id="${id}"]`) as HTMLButtonElement;
}

function dispatchMenuAction(root: HTMLElement, id: string): void {
  root.dispatchEvent(new CustomEvent(MENU_ACTION_EVENT, { bubbles: true, detail: { id } }));
}

describe('applyDocsThemePickerSelection', () => {
  it('updates the trigger swatch and selected option', () => {
    const root = mountPicker();

    applyDocsThemePickerSelection(root, PRESETS, 'forest');

    expect(root.querySelector('[data-docs-theme-picker-swatch]')?.getAttribute('fill')).toBe(
      '#16a34a',
    );
    expect(item(root, 'forest').getAttribute('aria-checked')).toBe('true');
    expect(item(root, 'default').getAttribute('aria-checked')).toBe('false');
  });
});

describe('initDocsThemePicker', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
    document.documentElement.className = defaultThemeClassName;
  });

  it('marks the stored theme as selected on init', () => {
    localStorage.setItem('docs-theme-id', 'forest');
    const root = mountPicker();
    initDocsThemePicker(root);

    expect(item(root, 'forest').getAttribute('aria-checked')).toBe('true');
    expect(item(root, 'default').getAttribute('aria-checked')).toBe('false');
  });

  it('persists and applies a theme when a menu action fires', () => {
    const root = mountPicker();
    initDocsThemePicker(root);

    dispatchMenuAction(root, 'forest');

    expect(localStorage.getItem('docs-theme-id')).toBe('forest');
    expect(item(root, 'forest').getAttribute('aria-checked')).toBe('true');
    expect(document.documentElement.classList.contains('theme-forest')).toBe(true);
  });

  it('ignores menu actions with unknown theme ids', () => {
    const root = mountPicker();
    initDocsThemePicker(root);

    dispatchMenuAction(root, 'unknown');

    expect(localStorage.getItem('docs-theme-id')).toBeNull();
    expect(document.documentElement.classList.contains('theme-forest')).toBe(false);
  });

  it('syncs selection when storage changes in another tab', () => {
    const root = mountPicker();
    initDocsThemePicker(root);

    localStorage.setItem('docs-theme-id', 'forest');
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'docs-theme-id',
        newValue: 'forest',
      }),
    );

    expect(item(root, 'forest').getAttribute('aria-checked')).toBe('true');
  });

  it('ignores duplicate initialization', () => {
    const root = mountPicker();
    const addSpy = vi.spyOn(window, 'addEventListener');

    initDocsThemePicker(root);
    const storageListeners = addSpy.mock.calls.filter(([type]) => type === 'storage').length;
    initDocsThemePicker(root);

    expect(addSpy.mock.calls.filter(([type]) => type === 'storage').length).toBe(storageListeners);
  });
});
