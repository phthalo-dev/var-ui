import {
  observeSegmentedControlIndicator,
  syncSegmentedControlIndicator,
} from '@var-ui/core/components/indicators/segmented-control';
import { FRAMEWORK_COOKIE, type DocsFramework } from '../framework';

const ONE_YEAR = 60 * 60 * 24 * 365;
const ROOT_SELECTOR = '[data-framework-switcher]';
const INITIALIZED_ATTR = 'data-framework-switcher-initialized';

export function frameworkCookieWriteValue(framework: DocsFramework): string {
  return `${FRAMEWORK_COOKIE}=${encodeURIComponent(framework)}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax`;
}

export function refreshDocsPage(): void {
  void import('astro:transitions/client').then(({ navigate }) => navigate(window.location.href));
}

export function selectFrameworkInSwitcher(root: HTMLElement, framework: DocsFramework): void {
  const active = root.querySelector<HTMLElement>('[data-selected], [aria-pressed="true"]');
  if (active?.dataset.framework === framework) return;

  root.querySelectorAll<HTMLElement>('[data-framework]').forEach((button) => {
    const selected = button.dataset.framework === framework;
    button.toggleAttribute('data-selected', selected);
    button.setAttribute('aria-pressed', selected ? 'true' : 'false');
  });

  syncSegmentedControlIndicator(root);
  document.cookie = frameworkCookieWriteValue(framework);
  document.documentElement.dataset.framework = framework;
  refreshDocsPage();
}

function isDocsFramework(value: string | undefined): value is DocsFramework {
  return value === 'react' || value === 'astro' || value === 'html';
}

/** Bind click handlers on every `[data-framework-switcher]` root (Astro module scripts). */
export function initFrameworkSwitcher(): void {
  document.querySelectorAll(ROOT_SELECTOR).forEach((root) => {
    if (!(root instanceof HTMLElement)) return;
    if (root.hasAttribute(INITIALIZED_ATTR)) return;
    root.setAttribute(INITIALIZED_ATTR, '');

    observeSegmentedControlIndicator(root);

    root.addEventListener('click', (event) => {
      const target = (event.target as HTMLElement | null)?.closest('[data-framework]');
      if (!(target instanceof HTMLElement) || !root.contains(target)) return;
      const framework = target.dataset.framework;
      if (isDocsFramework(framework)) selectFrameworkInSwitcher(root, framework);
    });
  });
}
