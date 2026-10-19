import type { IconName } from '@var-ui/core';

/** Inner SVG markup for a default glyph (children of the root `<svg>`). */
export const defaultGlyphInnerHtml = {
  close: '<path d="M6 6l12 12M18 6L6 18" />',
  chevronDown: '<path d="M6 9.5l6 6 6-6" />',
  chevronLeft: '<path d="M14.5 6l-6 6 6 6" />',
  chevronRight: '<path d="M9.5 6l6 6-6 6" />',
  check: '<path d="M4.5 12.5l5 5L19.5 7" />',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2" /><path d="M15 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h1" />',
  search: '<circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" />',
  info: '<circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" />',
  success: '<circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 4.5-5.5" />',
  warning:
    '<path d="M12 3.5L2.8 19.5a1 1 0 0 0 .87 1.5h16.66a1 1 0 0 0 .87-1.5L12 3.5z" /><path d="M12 9.5v5M12 17.5h.01" />',
  error: '<circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5h.01" />',
  arrowDown: '<path d="M12 5v14M6 13l6 6 6-6" />',
  arrowUp: '<path d="M12 19V5M6 11l6-6 6 6" />',
  arrowsUpDown: '<path d="M12 5v5M8 9l4-4 4 4" /><path d="M12 19v-5M8 15l4 4 4-4" />',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none" />',
  wrench:
    '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.65 2.65-2-2z" />',
  clock: '<circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" />',
  menu: '<path d="M4 7h16M4 12h16M4 17h16" />',
  moreHorizontal:
    '<circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />',
  colorModeLight:
    '<circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />',
  colorModeDark: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />',
  colorModeSystem:
    '<rect height="12" rx="1.5" width="18" x="3" y="4" /><path d="M8 20h8M12 16v4" />',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" />',
  eyeOff:
    '<path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19M6.12 6.12A18.5 18.5 0 0 0 2 12s3.5 7 10 7a10.94 10.94 0 0 0 4.24-.9M2 2l20 20" />',
} as const satisfies Partial<Record<IconName, string>>;

export type DefaultGlyphName = keyof typeof defaultGlyphInnerHtml;

const defaultIconSvgOpenTag =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';

/** Full inline SVG string for a default glyph (24×24, `currentColor`). */
export function defaultIconSvg(name: DefaultGlyphName): string {
  return `${defaultIconSvgOpenTag}${defaultGlyphInnerHtml[name]}</svg>`;
}

/** All default glyph SVG strings keyed by semantic icon name. */
export const defaultIconSvgs = Object.fromEntries(
  (Object.keys(defaultGlyphInnerHtml) as DefaultGlyphName[]).map((name) => [
    name,
    defaultIconSvg(name),
  ]),
) as Record<DefaultGlyphName, string>;
