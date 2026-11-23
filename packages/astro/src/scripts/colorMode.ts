export type ColorMode = 'light' | 'dark' | 'system';
export type ResolvedColorMode = 'light' | 'dark';

import { COLOR_MODE_ATTRIBUTE } from '@var-ui/core/theme-constants';
import {
  initSegmentedControl,
  SEGMENTED_CONTROL_CHANGE_EVENT,
  setSegmentedControlValue,
} from './segmentedControl';

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
  root.style.colorScheme = '';
  if (mode === 'light' || mode === 'dark') {
    root.setAttribute(COLOR_MODE_ATTRIBUTE, mode);
  } else {
    root.removeAttribute(COLOR_MODE_ATTRIBUTE);
  }
}

export function persistColorMode(storageKey: string, mode: ColorMode): void {
  localStorage.setItem(storageKey, mode);
}

export function setColorMode(mode: ColorMode, storageKey = 'theme-mode'): void {
  persistColorMode(storageKey, mode);
  applyColorModeToDocument(mode);
  syncColorModeToggles(storageKey);
  document.dispatchEvent(
    new CustomEvent(COLOR_MODE_CHANGE_EVENT, { detail: { mode, storageKey } }),
  );
}

/** The stored preference, or `system` when nothing valid is stored. */
export function readColorModePreference(storageKey: string): ColorMode {
  return readStoredColorMode(storageKey) ?? 'system';
}

/** The mode a toggle shows as checked: the stored preference, resolved when there is no System segment. */
export function colorModeToggleValue(
  storageKey: string,
  includeSystem: boolean,
): ColorMode | ResolvedColorMode {
  const mode = readColorModePreference(storageKey);
  return includeSystem || mode !== 'system' ? mode : resolveColorMode(mode);
}

function syncToggleRoot(root: Element, storageKey: string): void {
  const includeSystem = root.getAttribute('data-var-ui-include-system') === 'true';
  setSegmentedControlValue(root, colorModeToggleValue(storageKey, includeSystem));
}

/** Event dispatched on `document` after `setColorMode` changes the preference. */
export const COLOR_MODE_CHANGE_EVENT = 'var-ui:color-mode-change';

function syncColorModeToggles(storageKey?: string): void {
  document.querySelectorAll('[data-var-ui-color-mode-toggle]').forEach((root) => {
    const key = storageKey ?? root.getAttribute('data-var-ui-storage-key') ?? 'theme-mode';
    syncToggleRoot(root, key);
  });
}

/**
 * Wire every `ColorModeToggle` on the page: check the stored mode and store the one the user
 * picks. The toggle is a `SegmentedControl` radio group (arrow keys move and check).
 */
export function initColorModeToggle(): void {
  document.querySelectorAll('[data-var-ui-color-mode-toggle]').forEach((root) => {
    if (root.hasAttribute('data-var-ui-color-mode-initialized')) return;
    root.setAttribute('data-var-ui-color-mode-initialized', '');

    const storageKey = root.getAttribute('data-var-ui-storage-key') ?? 'theme-mode';

    initSegmentedControl(root);
    syncToggleRoot(root, storageKey);

    root.addEventListener(SEGMENTED_CONTROL_CHANGE_EVENT, (event) => {
      const mode = (event as CustomEvent<{ id?: string | null }>).detail?.id;
      if (mode === 'light' || mode === 'dark' || mode === 'system') {
        setColorMode(mode, storageKey);
      }
    });
  });
}
