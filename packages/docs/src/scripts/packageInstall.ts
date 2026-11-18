const INIT_ATTR = 'data-package-install-initialized';
const STORAGE_KEY = 'var-docs-package-manager';

function readPreferred(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writePreferred(id: string): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Storage can be unavailable (private mode); the choice just isn't remembered.
  }
}

function select(root: HTMLElement, id: string): void {
  const tabs = root.querySelectorAll<HTMLButtonElement>('[role="tab"]');
  let command = '';
  tabs.forEach((tab) => {
    const selected = tab.dataset.packageManager === id;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(tab.getAttribute('aria-controls') ?? '');
    if (panel) {
      panel.hidden = !selected;
      if (selected) command = panel.textContent ?? '';
    }
  });
  const copy = root.querySelector<HTMLElement>('[data-var-ui-code-copy]');
  if (copy && command) copy.setAttribute('data-code', command);
}

/** Tab switching for `PackageInstall`; the chosen manager is shared across blocks and visits. */
export function initPackageInstall(): void {
  const preferred = readPreferred();
  document.querySelectorAll<HTMLElement>('[data-package-install]').forEach((root) => {
    if (preferred) select(root, preferred);
    if (root.hasAttribute(INIT_ATTR)) return;
    root.setAttribute(INIT_ATTR, '');
    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        const id = tab.dataset.packageManager ?? '';
        writePreferred(id);
        document
          .querySelectorAll<HTMLElement>('[data-package-install]')
          .forEach((block) => select(block, id));
      });
      tab.addEventListener('keydown', (event) => {
        const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
        if (!step) return;
        event.preventDefault();
        const next = tabs[(index + step + tabs.length) % tabs.length];
        next?.focus();
        next?.click();
      });
    });
  });
}
