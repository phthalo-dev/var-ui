import { defaultThemeClassName } from '@var-ui/core';
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import {
  applyDocsAppearanceSelection,
  initDocsAppearanceMenu,
  readColorModePreference,
} from './docsAppearanceMenu';

// Events from `@var-ui/astro`, mirrored as literals (vitest cannot resolve the
// `.astro`-re-exporting barrel); keep in sync with MENU_ACTION_EVENT / COLOR_MODE_CHANGE_EVENT.
const MENU_ACTION_EVENT = 'var-ui:menu-action';
const COLOR_MODE_CHANGE_EVENT = 'var-ui:color-mode-change';

const PRESETS = [
  {
    id: 'default',
    label: 'Default',
    className: defaultThemeClassName,
    swatch: '#64748b',
    lazyCss: false,
  },
  { id: 'forest', label: 'Forest', className: 'theme-forest', swatch: '#16a34a', lazyCss: false },
];

function radio(id: string): string {
  return `<button type="button" role="menuitemradio" aria-checked="false" data-var-ui-menu-item data-item-id="${id}">${id}</button>`;
}

/** Mirrors `DocsAppearanceMenu.astro`: a Menu with a Mode group and a Theme group. */
function mountMenu(): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = `
    <div data-docs-appearance-menu data-presets='${JSON.stringify(PRESETS)}'
      data-storage-key="docs-theme-id" data-fallback-class="${defaultThemeClassName}"
      data-color-mode-storage-key="theme-mode">
      <div data-var-ui-menu-root>
        <button type="button" data-var-ui-menu-trigger>
          <span data-docs-appearance-swatch></span>
        </button>
        <div role="menu">
          <div role="group" data-var-ui-menu-group>${radio('mode-light')}${radio('mode-dark')}${radio('mode-system')}</div>
          <div role="group" data-var-ui-menu-group>${radio('theme-default')}${radio('theme-forest')}</div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(host);
  return host.querySelector('[data-docs-appearance-menu]') as HTMLElement;
}

function checked(root: HTMLElement): string[] {
  return Array.from(root.querySelectorAll('[aria-checked="true"]')).map(
    (el) => el.getAttribute('data-item-id') ?? '',
  );
}

function act(root: HTMLElement, id: string): void {
  root.dispatchEvent(new CustomEvent(MENU_ACTION_EVENT, { bubbles: true, detail: { id } }));
}

describe('readColorModePreference', () => {
  beforeEach(() => localStorage.clear());

  it('falls back to system when nothing valid is stored', () => {
    expect(readColorModePreference('theme-mode')).toBe('system');
    localStorage.setItem('theme-mode', 'bogus');
    expect(readColorModePreference('theme-mode')).toBe('system');
    localStorage.setItem('theme-mode', 'dark');
    expect(readColorModePreference('theme-mode')).toBe('dark');
  });
});

describe('applyDocsAppearanceSelection', () => {
  it('checks one item per group, sets the trigger glyph state and swatch', () => {
    document.body.innerHTML = '';
    const root = mountMenu();

    applyDocsAppearanceSelection(root, PRESETS, { mode: 'dark', themeId: 'forest' });

    expect(checked(root)).toEqual(['mode-dark', 'theme-forest']);
    expect(root.dataset.modePreference).toBe('dark');
    // Never `data-color-mode`: that attribute pins a colour scheme on the subtree.
    expect(root.hasAttribute('data-color-mode')).toBe(false);
    expect(
      (root.querySelector('[data-docs-appearance-swatch]') as HTMLElement).style.backgroundColor,
    ).toBe('rgb(22, 163, 74)');
  });
});

describe('initDocsAppearanceMenu', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
    document.documentElement.className = defaultThemeClassName;
  });

  it('reflects the stored mode and theme on init', () => {
    localStorage.setItem('theme-mode', 'light');
    localStorage.setItem('docs-theme-id', 'forest');
    const root = mountMenu();
    initDocsAppearanceMenu(root, { setColorMode: vi.fn() });

    expect(checked(root)).toEqual(['mode-light', 'theme-forest']);
  });

  it('applies a mode through setColorMode without touching the theme', () => {
    const root = mountMenu();
    const setColorMode = vi.fn((mode: string) => localStorage.setItem('theme-mode', mode));
    initDocsAppearanceMenu(root, { setColorMode });

    act(root, 'mode-dark');

    expect(setColorMode).toHaveBeenCalledWith('dark', 'theme-mode');
    expect(checked(root)).toEqual(['mode-dark', 'theme-default']);
  });

  it('persists and applies a theme without touching the mode', () => {
    const root = mountMenu();
    const setColorMode = vi.fn();
    initDocsAppearanceMenu(root, { setColorMode });

    act(root, 'theme-forest');

    expect(localStorage.getItem('docs-theme-id')).toBe('forest');
    expect(document.documentElement.classList.contains('theme-forest')).toBe(true);
    expect(setColorMode).not.toHaveBeenCalled();
    expect(checked(root)).toEqual(['mode-system', 'theme-forest']);
  });

  it('ignores unknown ids', () => {
    const root = mountMenu();
    const setColorMode = vi.fn();
    initDocsAppearanceMenu(root, { setColorMode });

    act(root, 'theme-unknown');
    act(root, 'mode-sepia');

    expect(localStorage.getItem('docs-theme-id')).toBeNull();
    expect(setColorMode).not.toHaveBeenCalled();
  });

  it('follows colour-mode changes made elsewhere on the page', () => {
    const root = mountMenu();
    initDocsAppearanceMenu(root, { setColorMode: vi.fn() });

    localStorage.setItem('theme-mode', 'dark');
    document.dispatchEvent(new CustomEvent(COLOR_MODE_CHANGE_EVENT));

    expect(root.dataset.modePreference).toBe('dark');
  });

  it('syncs the theme when storage changes in another tab', () => {
    const root = mountMenu();
    initDocsAppearanceMenu(root, { setColorMode: vi.fn() });

    localStorage.setItem('docs-theme-id', 'forest');
    window.dispatchEvent(new StorageEvent('storage', { key: 'docs-theme-id', newValue: 'forest' }));

    expect(checked(root)).toContain('theme-forest');
  });

  it('ignores duplicate initialization', () => {
    const root = mountMenu();
    const setColorMode = vi.fn();
    initDocsAppearanceMenu(root, { setColorMode });
    initDocsAppearanceMenu(root, { setColorMode });

    act(root, 'mode-light');

    expect(setColorMode).toHaveBeenCalledTimes(1);
  });
});
