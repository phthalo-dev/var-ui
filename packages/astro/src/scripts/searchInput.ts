import { getCommandPaletteController } from './commandPalette';

const TRIGGER_SELECTOR = '[data-var-ui-search-input][data-variant="command"]';
const INITIALIZED_ATTR = 'data-var-ui-search-input-initialized';

export function initSearchInput(root: HTMLElement): () => void {
  if (root.hasAttribute(INITIALIZED_ATTR)) {
    return () => {};
  }
  root.setAttribute(INITIALIZED_ATTR, '');

  const paletteId = root.dataset.commandPalette;
  if (!paletteId) return () => {};

  const palette = document.getElementById(paletteId);
  if (!palette) return () => {};

  const openPalette = () => {
    const controller = getCommandPaletteController(palette);
    controller?.open();
  };

  root.addEventListener('click', openPalette);

  return () => {};
}

/** Apple platforms show ⌘ for the palette hotkey; everything else uses Ctrl. */
export function isApplePlatform(
  nav: Pick<Navigator, 'platform' | 'userAgent'> = navigator,
): boolean {
  return /Mac|iPhone|iPad|iPod/i.test(nav.platform || nav.userAgent);
}

/** Text of the default `mod+<key>` shortcut hint for this platform (`⌘K` or `Ctrl K`). */
export function modShortcutLabel(key: string, apple = isApplePlatform()): string {
  return apple ? `⌘${key.toUpperCase()}` : `Ctrl ${key.toUpperCase()}`;
}

/** Swap default `⌘K` hints (`data-var-ui-mod-shortcut`) for `Ctrl K` off Apple platforms. */
export function localizeModShortcuts(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-var-ui-mod-shortcut]').forEach((el) => {
    const key = el.dataset.varUiModShortcut;
    if (key) el.textContent = modShortcutLabel(key);
  });
}

export function initSearchInputs(): void {
  localizeModShortcuts();
  document.querySelectorAll(TRIGGER_SELECTOR).forEach((node) => {
    if (node instanceof HTMLElement) initSearchInput(node);
  });
}
