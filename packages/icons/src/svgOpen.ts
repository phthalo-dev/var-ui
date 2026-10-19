/** Opening tag shared by every default glyph SVG string. */
export const defaultIconSvgOpenTag =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';

/** Full inline SVG for one glyph's inner markup. */
export function iconSvg(innerHtml: string): string {
  return `${defaultIconSvgOpenTag}${innerHtml}</svg>`;
}
