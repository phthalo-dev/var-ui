import { positionTabsIndicator } from '@var-ui/core/components/indicators/tabs';

const INIT_ATTR = 'data-docs-page-bar-initialized';

function scrollParent(element: HTMLElement): Element | null {
  let node = element.parentElement;
  while (node) {
    const { overflowY } = getComputedStyle(node);
    if (/(auto|scroll)/.test(overflowY) && node.scrollHeight > node.clientHeight) return node;
    node = node.parentElement;
  }
  return null;
}

/**
 * Show the bar to assistive tech and the keyboard only while it is stuck (visible). The CSS
 * reveal is scroll-driven where supported; `data-stuck` drives the transition fallback.
 */
function setStuck(bar: HTMLElement, stuck: boolean): void {
  if (stuck && !bar.hasAttribute('data-stuck')) syncTabs(bar);
  bar.toggleAttribute('data-stuck', stuck);
  if (stuck) bar.removeAttribute('aria-hidden');
  else bar.setAttribute('aria-hidden', 'true');
  bar.querySelectorAll<HTMLElement>('a, button').forEach((control) => {
    control.tabIndex = stuck ? 0 : -1;
  });
}

function syncTabs(bar: HTMLElement): void {
  const selected = document.querySelector<HTMLElement>(
    '[data-docs-page-tabs] [role="tab"][aria-selected="true"]',
  );
  const id = selected?.id.replace(/^tab-/, '');
  let current: HTMLElement | null = null;
  bar.querySelectorAll<HTMLElement>('[data-docs-bar-tab]').forEach((button) => {
    const selected = button.dataset.docsBarTab === id;
    button.toggleAttribute('data-selected', selected);
    if (selected) {
      button.setAttribute('aria-current', 'true');
      current = button;
    } else button.removeAttribute('aria-current');
  });
  const list = bar.querySelector<HTMLElement>('[data-docs-bar-tabs]');
  if (list) positionTabsIndicator(list, current);
}

/**
 * Collapsed page bar: reveal it once the page's real tab row (or the hero, on pages without tabs)
 * has passed fully under the bar, mirror the selected tab, and let its tab buttons drive the real
 * tabs. A bar tab click lands the panel just below the bar, which is then fully shown.
 */
export function initDocsPageBar(): void {
  const bar = document.querySelector<HTMLElement>('[data-docs-page-bar]');
  const hero = document.querySelector<HTMLElement>('[data-docs-page-hero]');
  if (!bar || !hero || bar.hasAttribute(INIT_ATTR)) return;
  bar.setAttribute(INIT_ATTR, '');

  const tablist = document.querySelector<HTMLElement>('[data-docs-page-tabs] [role="tablist"]');
  // The last full-width row of the page header: once it is under the bar, nothing of the hero
  // (labels, tab underline) can show beside the bar's own copy.
  const sentinel = tablist ?? hero;
  const root = scrollParent(hero);
  const barHeight = bar.offsetHeight || 56;
  // Reveal once the sentinel is above the bar's rounded bottom corners too, so no sliver of the
  // real tab underline shows through them.
  const cornerRadius = parseFloat(getComputedStyle(bar).borderBottomLeftRadius) || 0;
  const revealLine = Math.max(barHeight - cornerRadius, 0);
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return;
      const rootTop = entry.rootBounds?.top ?? 0;
      setStuck(bar, !entry.isIntersecting && entry.boundingClientRect.top < rootTop);
    },
    { root, rootMargin: `-${revealLine}px 0px 0px 0px`, threshold: 0 },
  );
  observer.observe(sentinel);

  bar.querySelectorAll<HTMLElement>('[data-docs-bar-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.docsBarTab ?? '';
      const tab = document.getElementById(`tab-${id}`);
      if (!tab) return;
      tab.click();
      // Panels carry `scroll-margin-top` (bar height + 24px), so the first heading lands below
      // a fully shown bar rather than in the reveal range.
      const panel = document.getElementById(tab.getAttribute('aria-controls') ?? `panel-${id}`);
      (panel ?? tab).scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  });

  if (tablist) {
    new MutationObserver(() => syncTabs(bar)).observe(tablist, {
      subtree: true,
      attributeFilter: ['aria-selected'],
    });
    syncTabs(bar);
  }
}

document.addEventListener('astro:page-load', () => initDocsPageBar());
