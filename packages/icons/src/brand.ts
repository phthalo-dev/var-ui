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

/**
 * 16px optical size of the mark, on a 16×16 grid: 2-unit strokes (a crisp 2px at 16px), parens
 * pushed out towards the tile edge, and a dash on whole pixels so it reads as `-`, not `·`. Use
 * it at 20px and below (favicons, tab strips, dense UI); the 24 grid wins from 24px up.
 */
export const varUiMarkSmallInnerHtml =
  '<path d="M5 3A6 6 0 0 0 5 13M11 3A6 6 0 0 1 11 13M6 8h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="butt" />';

/** Inline `<svg>` for the 16px glyph alone (16×16, `currentColor`, decorative). */
export const varUiMarkSmallSvg = `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">${varUiMarkSmallInnerHtml}</svg>`;

export interface VarUiFaviconOptions {
  /** Tile colour. @default '#007255' (phthalo, the default theme accent) */
  background?: string;
  /** Glyph colour. @default '#ffffff' */
  foreground?: string;
}

/**
 * Standalone favicon SVG: the 16px glyph ({@link varUiMarkSmallInnerHtml}) on a rounded tile,
 * since tabs draw favicons at 16px. Favicons cannot read page CSS variables, so the colours
 * are literal.
 */
export function varUiFaviconSvg({
  background = '#007255',
  foreground = '#ffffff',
}: VarUiFaviconOptions = {}): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" rx="4" fill="${background}"/><g color="${foreground}">${varUiMarkSmallInnerHtml}</g></svg>`;
}
