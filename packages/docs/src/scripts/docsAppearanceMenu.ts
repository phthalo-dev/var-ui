import { createDocsThemeController, type DocsThemeController } from '../utils/theme/docs-theme';
import type { DocsThemePreset } from '../utils/theme/presets';

export type DocsAppearancePreset = Pick<
  DocsThemePreset,
  'id' | 'label' | 'className' | 'swatch' | 'lazyCss'
>;

export type DocsColorMode = 'light' | 'dark' | 'system';

/**
 * Events from `@var-ui/astro`, mirrored as literals because vitest cannot resolve the
 * `.astro`-re-exporting package barrel. Keep in sync with `MENU_ACTION_EVENT` and
 * `COLOR_MODE_CHANGE_EVENT`.
 */
const MENU_ACTION_EVENT = 'var-ui:menu-action';
const COLOR_MODE_CHANGE_EVENT = 'var-ui:color-mode-change';

/** Menu item ids: `mode-<light|dark|system>` and `theme-<preset id>`. */
export const MODE_ITEM_PREFIX = 'mode-';
export const THEME_ITEM_PREFIX = 'theme-';

const COLOR_MODES: readonly DocsColorMode[] = ['light', 'dark', 'system'];

function isColorMode(value: unknown): value is DocsColorMode {
  return typeof value === 'string' && (COLOR_MODES as readonly string[]).includes(value);
}

function parsePresets(raw: string | null): DocsAppearancePreset[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as DocsAppearancePreset[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Stored color-mode preference (`system` when unset), as `ThemeScript` applies it. */
export function readColorModePreference(storageKey: string): DocsColorMode {
  try {
    const stored = localStorage.getItem(storageKey);
    return isColorMode(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

/**
 * Reflect the current mode and theme into the menu: `aria-checked` on both groups,
 * `data-mode-preference` on the root (picks the trigger glyph) and the trigger swatch colour.
 */
export function applyDocsAppearanceSelection(
  root: HTMLElement,
  presets: readonly DocsAppearancePreset[],
  state: { mode: DocsColorMode; themeId: string | null },
): void {
  root.dataset.modePreference = state.mode;
  const theme = presets.find((preset) => preset.id === state.themeId) ?? presets[0];

  const swatch = root.querySelector<HTMLElement>('[data-docs-appearance-swatch]');
  if (swatch && theme?.swatch) swatch.style.backgroundColor = theme.swatch;

  root.querySelectorAll<HTMLElement>('[data-item-id]').forEach((item) => {
    const id = item.getAttribute('data-item-id') ?? '';
    if (id.startsWith(MODE_ITEM_PREFIX)) {
      item.setAttribute('aria-checked', String(id === `${MODE_ITEM_PREFIX}${state.mode}`));
    } else if (id.startsWith(THEME_ITEM_PREFIX) && theme) {
      item.setAttribute('aria-checked', String(id === `${THEME_ITEM_PREFIX}${theme.id}`));
    }
  });
}

export type DocsAppearanceMenuOptions = {
  /** Stores and applies a color mode (`setColorMode` from `@var-ui/astro`). */
  setColorMode: (mode: DocsColorMode, storageKey: string) => void;
};

/**
 * Wire one appearance menu: the `@var-ui/astro` Menu owns the popup and keyboard; this applies
 * the chosen color mode / theme and keeps the checks and trigger in sync (also when a
 * `ColorModeToggle` elsewhere on the page, or another tab, changes them).
 */
export function initDocsAppearanceMenu(root: Element, options: DocsAppearanceMenuOptions): void {
  if (!(root instanceof HTMLElement)) return;
  if (root.hasAttribute('data-docs-appearance-menu-initialized')) return;
  root.setAttribute('data-docs-appearance-menu-initialized', '');

  const presets = parsePresets(root.getAttribute('data-presets'));
  const colorModeStorageKey = root.getAttribute('data-color-mode-storage-key') ?? 'theme-mode';
  const controller: DocsThemeController | null =
    presets.length > 0
      ? createDocsThemeController(presets, {
          storageKey: root.getAttribute('data-storage-key') ?? undefined,
          fallbackClassName: root.getAttribute('data-fallback-class') ?? undefined,
        })
      : null;

  const sync = (themeId = controller?.readStoredThemeId() ?? null) =>
    applyDocsAppearanceSelection(root, presets, {
      mode: readColorModePreference(colorModeStorageKey),
      themeId,
    });

  sync();

  root.addEventListener(MENU_ACTION_EVENT, (event) => {
    const id = (event as CustomEvent<{ id?: string | null }>).detail?.id ?? '';
    if (id.startsWith(MODE_ITEM_PREFIX)) {
      const mode = id.slice(MODE_ITEM_PREFIX.length);
      if (isColorMode(mode)) options.setColorMode(mode, colorModeStorageKey);
    } else if (id.startsWith(THEME_ITEM_PREFIX) && controller) {
      const themeId = id.slice(THEME_ITEM_PREFIX.length);
      if (controller.isThemeId(themeId)) controller.setTheme(themeId);
    }
    sync();
  });

  document.addEventListener(COLOR_MODE_CHANGE_EVENT, () => sync());

  window.addEventListener('storage', (event) => {
    if (event.key === colorModeStorageKey) {
      sync();
      return;
    }
    if (!controller || event.key !== controller.storageKey) return;
    const nextId = controller.isThemeId(event.newValue)
      ? event.newValue
      : controller.readStoredThemeId();
    if (controller.isThemeId(nextId)) controller.applyThemeToDocument(nextId);
    sync(nextId);
  });
}

export function initDocsAppearanceMenus(
  options: DocsAppearanceMenuOptions,
  root: ParentNode = document,
): void {
  root.querySelectorAll('[data-docs-appearance-menu]').forEach((node) => {
    initDocsAppearanceMenu(node, options);
  });
}
