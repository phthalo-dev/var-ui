const INIT_ATTR = 'data-demo-toolbar-initialized';
const THEME_CLASS_PREFIX = 'theme-var-ui-';

/** The page's resolved color mode: an explicit pin on `<html>`, else the OS preference. */
function pageMode(): 'light' | 'dark' {
  const pinned = document.documentElement.getAttribute('data-color-mode');
  if (pinned === 'light' || pinned === 'dark') return pinned;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Preview the stage in the opposite color mode: pin `data-color-mode` and copy the page's theme
 * class onto the stage, so the theme's tokens re-resolve for that subtree.
 */
function toggleColorMode(stage: HTMLElement, button: HTMLElement): void {
  const active = button.getAttribute('aria-pressed') === 'true';
  const themeClasses = Array.from(document.documentElement.classList).filter((name) =>
    name.startsWith(THEME_CLASS_PREFIX),
  );
  if (active) {
    stage.removeAttribute('data-color-mode');
    themeClasses.forEach((name) => stage.classList.remove(name));
  } else {
    stage.setAttribute('data-color-mode', pageMode() === 'dark' ? 'light' : 'dark');
    themeClasses.forEach((name) => stage.classList.add(name));
  }
  button.setAttribute('aria-pressed', String(!active));
}

function toggleDirection(inner: HTMLElement, button: HTMLElement): void {
  const active = button.getAttribute('aria-pressed') === 'true';
  if (active) inner.removeAttribute('dir');
  else inner.setAttribute('dir', 'rtl');
  button.setAttribute('aria-pressed', String(!active));
}

/** Wire the hover toolbar on docs demo stages (color mode and direction previews). */
export function initDemoStageToolbar(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-demo-toggle]').forEach((button) => {
    if (button.hasAttribute(INIT_ATTR)) return;
    button.setAttribute(INIT_ATTR, '');
    const wrap = button.closest('[role="toolbar"]')?.parentElement;
    const stage = wrap?.querySelector<HTMLElement>('[data-demo-stage]');
    const inner = wrap?.querySelector<HTMLElement>('[data-demo-stage-inner]');
    if (!stage || !inner) return;
    button.addEventListener('click', () => {
      if (button.dataset.demoToggle === 'color-mode') toggleColorMode(stage, button);
      else toggleDirection(inner, button);
    });
  });
}

document.addEventListener('astro:page-load', () => initDemoStageToolbar());
