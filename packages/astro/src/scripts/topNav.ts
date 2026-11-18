import { observeTopNavIndicator } from '@var-ui/core/components/indicators/top-nav';

const INITIALIZED_ATTR = 'data-var-ui-top-nav-initialized';

/**
 * Start the sliding selected pill on a TopNav `start` zone. Whatever moves `data-selected`
 * between items (a click handler, a router hook) slides the pill; see `observeTopNavIndicator`.
 */
export function initTopNav(nav: Element): void {
  if (nav.hasAttribute(INITIALIZED_ATTR)) return;
  nav.setAttribute(INITIALIZED_ATTR, '');
  const start = nav.querySelector<HTMLElement>(':scope > [data-var-ui-top-nav-start]');
  if (start) observeTopNavIndicator(start);
}

export function initTopNavs(root: ParentNode = document): void {
  root.querySelectorAll('[data-var-ui-top-nav]').forEach((nav) => initTopNav(nav));
}
