/**
 * Load a showcase theme's extracted stylesheet (`/themes/<id>.css`) once. Mirrors the docs
 * kit's `ensureDocsThemeStyles` (same `data-docs-theme-style` marker, so the header theme
 * picker and the homepage never add a theme twice) without importing the kit's utils
 * barrel, which pulls Node-only modules into the client bundle.
 */
export function ensureShowcaseThemeStyles(
  theme: { id: string; lazyCss?: boolean },
  onReady?: () => void,
): void {
  if (theme.lazyCss === false || theme.id === 'default') {
    onReady?.();
    return;
  }
  const existing = document.querySelector<HTMLLinkElement>(
    `link[data-docs-theme-style="${theme.id}"]`,
  );
  if (existing) {
    if (existing.sheet) onReady?.();
    else existing.addEventListener('load', () => onReady?.(), { once: true });
    return;
  }
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `/themes/${theme.id}.css`;
  link.dataset.docsThemeStyle = theme.id;
  link.dataset.astroTransitionPersist = `docs-theme-style-${theme.id}`;
  link.addEventListener('load', () => onReady?.(), { once: true });
  document.head.appendChild(link);
}
