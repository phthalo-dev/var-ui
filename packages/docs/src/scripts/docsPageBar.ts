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
  bar.querySelectorAll<HTMLElement>('[data-docs-bar-tab]').forEach((button) => {
    if (button.dataset.docsBarTab === id) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  });
}

/**
 * Collapsed page bar: reveal it once the page hero has scrolled under it, mirror the selected
 * page tab, and let its tab buttons drive the real tabs (then bring the tab row into view).
 */
export function initDocsPageBar(): void {
  const bar = document.querySelector<HTMLElement>('[data-docs-page-bar]');
  const hero = document.querySelector<HTMLElement>('[data-docs-page-hero]');
  if (!bar || !hero || bar.hasAttribute(INIT_ATTR)) return;
  bar.setAttribute(INIT_ATTR, '');

  const root = scrollParent(hero);
  const barHeight = bar.offsetHeight || 56;
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return;
      const rootTop = entry.rootBounds?.top ?? 0;
      // Stuck once the hero has scrolled up past the bar (not when it is below the fold).
      setStuck(bar, !entry.isIntersecting && entry.boundingClientRect.top < rootTop);
    },
    { root, rootMargin: `-${barHeight}px 0px 0px 0px`, threshold: 0 },
  );
  observer.observe(hero);

  bar.querySelectorAll<HTMLElement>('[data-docs-bar-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      const tab = document.getElementById(`tab-${button.dataset.docsBarTab ?? ''}`);
      if (!tab) return;
      tab.click();
      tab.closest('[role="tablist"]')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  });

  const tablist = document.querySelector('[data-docs-page-tabs] [role="tablist"]');
  if (tablist) {
    new MutationObserver(() => syncTabs(bar)).observe(tablist, {
      subtree: true,
      attributeFilter: ['aria-selected'],
    });
    syncTabs(bar);
  }
}

document.addEventListener('astro:page-load', () => initDocsPageBar());
