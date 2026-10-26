/**
 * Semantic icon names var-ui components reference internally. Names describe
 * *function*, not glyph (`close`, not `x-mark`). Glyphs resolve exclusively
 * through `IconProvider` in `@var-ui/react`. Default glyph SVGs live in
 * `@var-ui/icons/glyphs` (framework-agnostic strings); `@var-ui/icons` wraps them
 * for React. Extend this union as new components ship.
 */
export const iconNameList = [
  'close',
  'chevronDown',
  'chevronLeft',
  'chevronRight',
  'check',
  'copy',
  'search',
  'info',
  'success',
  'warning',
  'error',
  'arrowUp',
  'arrowDown',
  'arrowsUpDown',
  'stop',
  'play',
  'pause',
  'shuffle',
  'repeat',
  'repeatOne',
  'wrench',
  'clock',
  'menu',
  'moreHorizontal',
  'colorModeLight',
  'colorModeDark',
  'colorModeSystem',
  'eye',
  'eyeOff',
] as const;

export type IconName = (typeof iconNameList)[number];
