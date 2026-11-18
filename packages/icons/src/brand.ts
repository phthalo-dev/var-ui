/**
 * Var UI brand mark: `(-)`, the `var(--)` call in miniature, drawn from Inconsolata's
 * proportions (wide, near-circular parens; a short flat dash on the centre line).
 *
 * The glyph sits on the same 24×24 grid as the default icons and paints with `currentColor`,
 * so a host can set it on any tile. The path carries its own stroke attributes (1.5, butt
 * caps), so it renders the same inside the default icon `<svg>` (2, round caps).
 */
export const varUiMarkInnerHtml =
  '<path d="M6.97 6.81A6.5 6.5 0 0 0 6.97 17.19M17.03 6.81A6.5 6.5 0 0 1 17.03 17.19M10.25 12h3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="butt" />';

/** Inline `<svg>` for the brand glyph alone (24×24, `currentColor`, decorative). */
export const varUiMarkSvg = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">${varUiMarkInnerHtml}</svg>`;

export interface VarUiFaviconOptions {
  /** Tile colour. @default '#007255' (phthalo, the default theme accent) */
  background?: string;
  /** Glyph colour. @default '#ffffff' */
  foreground?: string;
}

/**
 * Standalone favicon SVG: the glyph on a rounded tile. Favicons cannot read page CSS
 * variables, so the colours are literal.
 */
export function varUiFaviconSvg({
  background = '#007255',
  foreground = '#ffffff',
}: VarUiFaviconOptions = {}): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="${background}"/><g color="${foreground}">${varUiMarkInnerHtml}</g></svg>`;
}
