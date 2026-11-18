import { normalizeDocsPath } from '../utils/docs-toc';
import { stripAstroBase } from '../utils/routing';

const ITEM_SELECTOR = '[data-docs-top-bar] [data-docs-top-nav-match]';

/**
 * Mark the header link whose `data-docs-top-nav-match` prefixes `pathname` as selected
 * (`data-selected` + `aria-current="page"`). The header is persisted across view transitions,
 * so the server-rendered selection would otherwise stay on the previous page's link.
 */
export function syncDocsTopBarSelection(pathname: string, root: ParentNode = document): void {
  const currentPath = normalizeDocsPath(pathname);
  root.querySelectorAll<HTMLElement>(ITEM_SELECTOR).forEach((item) => {
    const match = item.dataset.docsTopNavMatch;
    const selected = Boolean(match) && currentPath.startsWith(match!);
    item.toggleAttribute('data-selected', selected);
    if (selected) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
}

let bound = false;

export function initDocsTopBar(): void {
  if (bound || typeof document === 'undefined') return;
  bound = true;
  const sync = () =>
    syncDocsTopBarSelection(stripAstroBase(window.location.pathname, import.meta.env.BASE_URL));
  sync();
  document.addEventListener('astro:page-load', sync);
}
