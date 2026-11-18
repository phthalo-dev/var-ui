const STORAGE_KEY = 'var-docs-sidebar-open';
const INIT_ATTR = 'data-docs-sidebar-state-initialized';

function read(): Record<string, boolean> {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, boolean>;
  } catch {
    return {};
  }
}

function write(state: Record<string, boolean>): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable (private mode): open state just isn't remembered.
  }
}

/**
 * Remember which sidebar groups the reader opened or closed. The group holding the current page
 * always starts open, whatever was stored.
 */
export function initDocsSidebarState(): void {
  const state = read();
  document
    .querySelectorAll<HTMLDetailsElement>('details[data-docs-sidebar-section]')
    .forEach((details) => {
      const title = details.dataset.docsSidebarSection ?? '';
      if (!details.hasAttribute('data-current') && title in state) {
        details.open = Boolean(state[title]);
      }
      if (details.hasAttribute(INIT_ATTR)) return;
      details.setAttribute(INIT_ATTR, '');
      details.addEventListener('toggle', () => {
        const next = read();
        next[title] = details.open;
        write(next);
      });
    });
}

document.addEventListener('astro:page-load', () => initDocsSidebarState());
