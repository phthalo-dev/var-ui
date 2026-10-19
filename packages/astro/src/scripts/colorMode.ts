export type ColorMode = 'light' | 'dark' | 'system';
export type ResolvedColorMode = 'light' | 'dark';

import {
  observeSegmentedControlIndicator,
  syncSegmentedControlIndicator,
} from '@var-ui/core/components/indicators/segmented-control';

const VALID: ReadonlySet<string> = new Set(['light', 'dark', 'system']);

export function readStoredColorMode(storageKey: string): ColorMode | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(storageKey);
  return raw && VALID.has(raw) ? (raw as ColorMode) : null;
}

export function resolveColorMode(mode: ColorMode): ResolvedColorMode {
  if (mode === 'light' || mode === 'dark') return mode;
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

export function applyColorModeToDocument(mode: ColorMode): void {
  const root = document.documentElement;
  if (mode === 'system') {
    root.removeAttribute('data-mode');
    root.style.colorScheme = '';
  } else {
    root.setAttribute('data-mode', mode);
    root.style.colorScheme = mode;
  }
}

export function persistColorMode(storageKey: string, mode: ColorMode): void {
  localStorage.setItem(storageKey, mode);
}

export function setColorMode(mode: ColorMode, storageKey = 'theme-mode'): void {
  persistColorMode(storageKey, mode);
  applyColorModeToDocument(mode);
  syncColorModeToggles(storageKey);
}

function prefersDarkColorScheme(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

/** Boot path used by ThemeScript (class + data-mode + color-scheme). */
export function applyThemeBoot(
  doc: Document,
  themeClass: string,
  storageKey = 'theme-mode',
): ColorMode {
  const root = doc.documentElement;
  const prefersDark = prefersDarkColorScheme();
  const stored = readStoredColorMode(storageKey);
  const mode: ColorMode = stored ?? (prefersDark ? 'dark' : 'light');

  root.classList.add(themeClass);
  if (stored === 'system') {
    root.removeAttribute('data-mode');
    root.style.colorScheme = '';
  } else if (stored === 'light' || stored === 'dark') {
    root.setAttribute('data-mode', stored);
    root.style.colorScheme = stored;
  } else {
    const fallback = prefersDark ? 'dark' : 'light';
    root.setAttribute('data-mode', fallback);
    root.style.colorScheme = fallback;
  }
  return mode;
}

export function bootTheme(themeClass: string, storageKey = 'theme-mode'): ColorMode {
  return applyThemeBoot(document, themeClass, storageKey);
}

type AstroBeforeSwapEvent = Event & { newDocument: Document };

const themeNavigationBound = new WeakSet<object>();

/** Keep stored color mode on the incoming document during Astro view transitions. */
export function watchThemeOnNavigation(themeClass: string, storageKey = 'theme-mode'): void {
  const boundKey = { themeClass, storageKey };
  if (themeNavigationBound.has(boundKey)) return;
  themeNavigationBound.add(boundKey);

  document.addEventListener('astro:before-swap', (event) => {
    applyThemeBoot((event as AstroBeforeSwapEvent).newDocument, themeClass, storageKey);
  });

  document.addEventListener('astro:after-swap', () => {
    bootTheme(themeClass, storageKey);
  });
}

function readEffectiveColorMode(storageKey: string): ColorMode {
  const stored = readStoredColorMode(storageKey);
  if (stored) return stored;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

function syncToggleRoot(root: Element, storageKey: string): void {
  const includeSystem = root.getAttribute('data-include-system') === 'true';
  const mode = readEffectiveColorMode(storageKey);
  const selected: ColorMode | ResolvedColorMode =
    includeSystem || mode !== 'system' ? mode : resolveColorMode(mode);

  root.querySelectorAll('[data-color-mode]').forEach((button) => {
    const buttonMode = button.getAttribute('data-color-mode');
    const pressed = buttonMode === selected;
    button.setAttribute('aria-pressed', String(pressed));
    if (pressed) {
      button.setAttribute('data-selected', '');
    } else {
      button.removeAttribute('data-selected');
    }
  });
  if (root instanceof HTMLElement) {
    syncSegmentedControlIndicator(root);
  }
}

function syncColorModeToggles(storageKey?: string): void {
  document.querySelectorAll('[data-var-ui-color-mode-toggle]').forEach((root) => {
    const key = storageKey ?? root.getAttribute('data-storage-key') ?? 'theme-mode';
    syncToggleRoot(root, key);
  });
}

export function initColorModeToggle(): void {
  document.querySelectorAll('[data-var-ui-color-mode-toggle]').forEach((root) => {
    if (root.hasAttribute('data-var-ui-color-mode-initialized')) return;
    root.setAttribute('data-var-ui-color-mode-initialized', '');

    const storageKey = root.getAttribute('data-storage-key') ?? 'theme-mode';

    syncToggleRoot(root, storageKey);
    if (root instanceof HTMLElement) {
      observeSegmentedControlIndicator(root);
    }

    root.querySelectorAll('[data-color-mode]').forEach((button) => {
      button.addEventListener('click', () => {
        const mode = button.getAttribute('data-color-mode');
        if (mode === 'light' || mode === 'dark' || mode === 'system') {
          setColorMode(mode, storageKey);
        }
      });
    });
  });
}
