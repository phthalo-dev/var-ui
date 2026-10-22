import { createDocsThemeController, type DocsThemeController } from '../utils/theme/docs-theme';
import type { DocsThemePreset } from '../utils/theme/presets';

export type DocsThemePickerPreset = Pick<
  DocsThemePreset,
  'id' | 'label' | 'className' | 'swatch' | 'lazyCss'
>;

/**
 * Action event dispatched by the `@var-ui/astro` Menu rendered inside the
 * picker. Mirrored as a literal because vitest cannot resolve the
 * `.astro`-re-exporting package barrel; keep in sync with `MENU_ACTION_EVENT`.
 */
const MENU_ACTION_EVENT = 'var-ui:menu-action';

function parsePresets(raw: string | null): DocsThemePickerPreset[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as DocsThemePickerPreset[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getItems(root: ParentNode): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>('[data-item-id]'));
}

export function applyDocsThemePickerSelection(
  root: HTMLElement,
  presets: DocsThemePickerPreset[],
  selectedId: string,
): void {
  const selected = presets.find((theme) => theme.id === selectedId) ?? presets[0];
  if (!selected) return;

  const triggerSwatch = root.querySelector('[data-docs-theme-picker-swatch]');
  if (triggerSwatch instanceof Element && triggerSwatch.localName === 'rect') {
    triggerSwatch.setAttribute('fill', selected.swatch ?? '#64748b');
  }

  for (const item of getItems(root)) {
    const id = item.getAttribute('data-item-id');
    const isSelected = id === selectedId;
    item.setAttribute('aria-checked', String(isSelected));
  }
}

function syncRoot(
  root: HTMLElement,
  controller: DocsThemeController,
  presets: DocsThemePickerPreset[],
  selectedId = controller.readStoredThemeId(),
): void {
  applyDocsThemePickerSelection(root, presets, selectedId);
}

export function initDocsThemePicker(root: Element): void {
  if (!(root instanceof HTMLElement)) return;
  if (root.hasAttribute('data-docs-theme-picker-initialized')) return;
  root.setAttribute('data-docs-theme-picker-initialized', '');

  const presets = parsePresets(root.getAttribute('data-presets'));
  if (presets.length === 0) return;

  const storageKey = root.getAttribute('data-storage-key') ?? undefined;
  const fallbackClassName = root.getAttribute('data-fallback-class') ?? undefined;
  const controller = createDocsThemeController(presets, {
    storageKey,
    fallbackClassName,
  });

  syncRoot(root, controller, presets);

  // The Astro Menu owns trigger/popup behavior; the picker applies the theme.
  root.addEventListener(MENU_ACTION_EVENT, (event) => {
    const id = (event as CustomEvent<{ id?: string }>).detail?.id;
    if (!controller.isThemeId(id)) return;
    controller.setTheme(id);
    syncRoot(root, controller, presets);
  });

  window.addEventListener('storage', (event) => {
    if (event.key !== controller.storageKey) return;
    const nextId = controller.isThemeId(event.newValue)
      ? event.newValue
      : controller.readStoredThemeId();
    if (controller.isThemeId(nextId)) {
      controller.applyThemeToDocument(nextId);
    }
    syncRoot(root, controller, presets, nextId);
  });
}

export function initDocsThemePickers(root: ParentNode = document): void {
  root.querySelectorAll('[data-docs-theme-picker]').forEach((node) => {
    initDocsThemePicker(node);
  });
}
