/**
 * The single shared placeholder rendered for every unmapped IconName.
 * Keeps the em-box sized (via the `icon` recipe on the wrapping span) while
 * shipping zero glyph payload for apps that bring their own icon system.
 */
export const emptyFallback = (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" data-var-ui-icon-fallback="" />
);
