import { appShellMobileBreakpointQueries } from '@var-ui/core/components/breakpoints';
import type { AppShellMobileBreakpoint } from '@var-ui/core';

/** `id` of the `<main>` landmark — target of the skip-to-content link. */
export const APP_SHELL_MAIN_ID = 'var-ui-app-shell-main';

export function initAppShell(root: HTMLElement): () => void {
  const breakpoint = (root.dataset.mobileBreakpoint ?? 'md') as AppShellMobileBreakpoint;
  const query = appShellMobileBreakpointQueries[breakpoint] ?? appShellMobileBreakpointQueries.md;
  const mql = window.matchMedia(query);

  const update = () => {
    if (mql.matches) {
      root.setAttribute('data-mobile', '');
    } else {
      root.removeAttribute('data-mobile');
    }
  };

  update();
  mql.addEventListener('change', update);
  return () => mql.removeEventListener('change', update);
}

export function initAppShells(): void {
  document.querySelectorAll('[data-var-ui-app-shell]').forEach((root) => {
    initAppShell(root as HTMLElement);
  });
}
