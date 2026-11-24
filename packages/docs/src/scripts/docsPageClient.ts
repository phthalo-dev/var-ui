import { initCodeBlockCopy } from '@var-ui/astro';
import { reattachTypestyles } from '../utils/reattachTypestyles';

/** Client entry for DocsPage — typestyles reattach after view transitions. */
function onPageLoad(): void {
  reattachTypestyles();
  // Markdown fenced code renders CodeBlock markup without the component's own script.
  initCodeBlockCopy();
  // In dev the nested scroller may not have layout when the browser runs the initial
  // fragment scroll, so re-apply it once the frame has settled.
  scheduleHashScroll();
}

/**
 * Scroll the docs main scroller to the URL hash target. Astro pages use a nested
 * `.var-ui-docs-page__main` scroller rather than `window`, and in dev typestyles
 * injects CSS at runtime, so the initial browser scroll can run before the target
 * has reachable layout. Re-trying after short delays makes hash links reliable.
 */
function scrollToHash(): void {
  const hash = window.location.hash.slice(1);
  if (!hash) return;

  const target = document.getElementById(hash);
  if (!target) return;

  const scroller = document.querySelector<HTMLElement>('.var-ui-docs-page__main');
  if (!scroller) return;

  const scrollerRect = scroller.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const offset = scrollerRect.top + 80;

  // Already positioned below the sticky bar: nothing to do.
  if (targetRect.top >= offset && targetRect.top < scrollerRect.bottom) return;

  const top = targetRect.top - scrollerRect.top + scroller.scrollTop - 80;
  scroller.scrollTo({ top, behavior: 'instant' });
}

function scheduleHashScroll(): void {
  scrollToHash();
  setTimeout(scrollToHash, 60);
  setTimeout(scrollToHash, 400);
}

onPageLoad();
document.addEventListener('astro:page-load', onPageLoad);
