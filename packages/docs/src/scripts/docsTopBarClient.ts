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

type BeforePreparationEvent = Event & { to?: URL };

/**
 * Keep the header selection on the current section. The selection moves as soon as navigation
 * starts (`astro:before-preparation`, which carries the destination), so the selected pill
 * slides with the click instead of after the new page is swapped in; `astro:after-swap` and
 * `astro:page-load` then confirm it against the final URL (redirects).
 *
 * `astro:page-load` can land well after the swap (scripts, fonts). If the user has already
 * clicked again by then, it must not pull the selection back to the page it belongs to.
 */
export function initDocsTopBar(): void {
  if (bound || typeof document === 'undefined') return;
  bound = true;
  const base = import.meta.env.BASE_URL;
  const sync = (pathname: string) => syncDocsTopBarSelection(stripAstroBase(pathname, base));
  let navigating = false;
  sync(window.location.pathname);
  document.addEventListener('astro:before-preparation', (event) => {
    const to = (event as BeforePreparationEvent).to;
    if (!(to instanceof URL) || to.origin !== window.location.origin) return;
    navigating = true;
    sync(to.pathname);
  });
  document.addEventListener('astro:after-swap', () => {
    navigating = false;
    sync(window.location.pathname);
  });
  document.addEventListener('astro:page-load', () => {
    if (!navigating) sync(window.location.pathname);
  });
}
