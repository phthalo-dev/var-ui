const INIT_ATTR = 'data-package-install-initialized';
/** localStorage key holding the reader's package manager (`pnpm`, `npm`, …), shared by every block. */
export const PACKAGE_MANAGER_STORAGE_KEY = 'var-docs-package-manager';

function readPreferred(): string | null {
  try {
    return window.localStorage.getItem(PACKAGE_MANAGER_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writePreferred(id: string): void {
  try {
    window.localStorage.setItem(PACKAGE_MANAGER_STORAGE_KEY, id);
  } catch {
    // Storage can be unavailable (private mode); the choice just isn't remembered.
  }
}

function select(root: HTMLElement, id: string): void {
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  // A block without this manager keeps its current tab.
  if (!tabs.some((tab) => tab.dataset.packageManager === id)) return;
  tabs.forEach((tab) => {
    const selected = tab.dataset.packageManager === id;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    // Looked up inside the block, so two blocks with the same ids still switch independently.
    const panelId = tab.getAttribute('aria-controls') ?? '';
    const panel = Array.from(root.querySelectorAll<HTMLElement>('[role="tabpanel"]')).find(
      (candidate) => candidate.id === panelId,
    );
    if (panel) panel.hidden = !selected;
  });
  // The copy button copies the visible panel (`initCodeBlockCopy` reads the unhidden `pre`).
}

/**
 * Tab switching for `PackageInstall` / `packageInstallMarkup` blocks under `container`; the
 * chosen manager is shared across blocks and visits (`PACKAGE_MANAGER_STORAGE_KEY`). Safe to
 * call again after new blocks are added.
 */
export function initPackageInstall(container: ParentNode = document): void {
  const preferred = readPreferred();
  container.querySelectorAll<HTMLElement>('[data-package-install]').forEach((root) => {
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
