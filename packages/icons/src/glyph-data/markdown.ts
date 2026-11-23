import { iconSvg } from '../svgOpen';

export const innerHtml =
  '<rect x="2" y="5" width="20" height="14" rx="2" /><path d="M6 15V9l3 3 3-3v6" /><path d="M17 9v6" /><path d="M14.5 12.5L17 15l2.5-2.5" />';

/** Full inline SVG for the `markdown` glyph. */
export const svg = iconSvg(innerHtml);
