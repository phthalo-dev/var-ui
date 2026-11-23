import { syncSegmentedControlIndicator } from '@var-ui/core/components/indicators/segmented-control';
import { FRAMEWORK_COOKIE, type DocsFramework } from '../framework';

const ONE_YEAR = 60 * 60 * 24 * 365;
const ROOT_SELECTOR = '[data-framework-switcher]';
const INITIALIZED_ATTR = 'data-framework-switcher-initialized';
/**
 * Change event of the `@var-ui/astro` SegmentedControl the switcher renders. Mirrored as a
 * literal because vitest cannot resolve the `.astro`-re-exporting package barrel; keep in sync
 * with `SEGMENTED_CONTROL_CHANGE_EVENT`.
 */
const SEGMENTED_CONTROL_CHANGE_EVENT = 'var-ui:segmented-control-change';

export function frameworkCookieWriteValue(framework: DocsFramework): string {
  return `${FRAMEWORK_COOKIE}=${encodeURIComponent(framework)}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax`;
}

export function refreshDocsPage(): void {
  void import('astro:transitions/client').then(({ navigate }) => navigate(window.location.href));
}

/** Check `framework` in one switcher (radio + `data-selected`) and move its indicator. */
function reflectFramework(root: HTMLElement, framework: DocsFramework): void {
  root.querySelectorAll<HTMLElement>(':scope > [data-var-ui-segment-id]').forEach((segment) => {
    const selected = segment.dataset.varUiSegmentId === framework;
    segment.toggleAttribute('data-selected', selected);
    const radio = segment.querySelector<HTMLInputElement>('input[type="radio"]');
    if (radio) radio.checked = selected;
  });
  syncSegmentedControlIndicator(root);
}

/**
 * Switch the docs to `framework`: store the cookie, update `<html data-framework>`, mirror the
 * choice into every switcher on the page (header + mobile drawer) and re-render the page.
 */
export function selectFramework(framework: DocsFramework): void {
  if (document.documentElement.dataset.framework === framework) return;
  document.querySelectorAll<HTMLElement>(ROOT_SELECTOR).forEach((root) => {
    reflectFramework(root, framework);
  });
  document.cookie = frameworkCookieWriteValue(framework);
  document.documentElement.dataset.framework = framework;
  refreshDocsPage();
}

function isDocsFramework(value: unknown): value is DocsFramework {
  return value === 'react' || value === 'astro' || value === 'html';
}

/** Bind every `[data-framework-switcher]` root (Astro module scripts). */
export function initFrameworkSwitcher(): void {
  document.querySelectorAll(ROOT_SELECTOR).forEach((root) => {
    if (!(root instanceof HTMLElement)) return;
    if (root.hasAttribute(INITIALIZED_ATTR)) return;
    root.setAttribute(INITIALIZED_ATTR, '');

    // A persisted header can outlive the page that rendered it: show the current framework.
    const current = document.documentElement.dataset.framework;
    if (isDocsFramework(current)) reflectFramework(root, current);

    root.addEventListener(SEGMENTED_CONTROL_CHANGE_EVENT, (event) => {
      const framework = (event as CustomEvent<{ id?: string | null }>).detail?.id;
      if (isDocsFramework(framework)) selectFramework(framework);
    });
  });
}
