import type { IconName } from '@var-ui/core';
import { innerHtml as arrowDownInner, svg as arrowDownSvg } from './glyph-data/arrowDown';
import { innerHtml as arrowUpInner, svg as arrowUpSvg } from './glyph-data/arrowUp';
import { innerHtml as arrowsUpDownInner, svg as arrowsUpDownSvg } from './glyph-data/arrowsUpDown';
import { innerHtml as checkInner, svg as checkSvg } from './glyph-data/check';
import { innerHtml as chevronDownInner, svg as chevronDownSvg } from './glyph-data/chevronDown';
import { innerHtml as chevronLeftInner, svg as chevronLeftSvg } from './glyph-data/chevronLeft';
import { innerHtml as chevronRightInner, svg as chevronRightSvg } from './glyph-data/chevronRight';
import { innerHtml as clockInner, svg as clockSvg } from './glyph-data/clock';
import { innerHtml as closeInner, svg as closeSvg } from './glyph-data/close';
import {
  innerHtml as colorModeDarkInner,
  svg as colorModeDarkSvg,
} from './glyph-data/colorModeDark';
import {
  innerHtml as colorModeLightInner,
  svg as colorModeLightSvg,
} from './glyph-data/colorModeLight';
import {
  innerHtml as colorModeSystemInner,
  svg as colorModeSystemSvg,
} from './glyph-data/colorModeSystem';
import { innerHtml as copyInner, svg as copySvg } from './glyph-data/copy';
import { innerHtml as errorInner, svg as errorSvg } from './glyph-data/error';
import { innerHtml as eyeInner, svg as eyeSvg } from './glyph-data/eye';
import { innerHtml as eyeOffInner, svg as eyeOffSvg } from './glyph-data/eyeOff';
import { innerHtml as infoInner, svg as infoSvg } from './glyph-data/info';
import { innerHtml as menuInner, svg as menuSvg } from './glyph-data/menu';
import {
  innerHtml as moreHorizontalInner,
  svg as moreHorizontalSvg,
} from './glyph-data/moreHorizontal';
import { innerHtml as pauseInner, svg as pauseSvg } from './glyph-data/pause';
import { innerHtml as playInner, svg as playSvg } from './glyph-data/play';
import { innerHtml as repeatInner, svg as repeatSvg } from './glyph-data/repeat';
import { innerHtml as repeatOneInner, svg as repeatOneSvg } from './glyph-data/repeatOne';
import { innerHtml as searchInner, svg as searchSvg } from './glyph-data/search';
import { innerHtml as shuffleInner, svg as shuffleSvg } from './glyph-data/shuffle';
import { innerHtml as stopInner, svg as stopSvg } from './glyph-data/stop';
import { innerHtml as successInner, svg as successSvg } from './glyph-data/success';
import { innerHtml as warningInner, svg as warningSvg } from './glyph-data/warning';
import { innerHtml as wrenchInner, svg as wrenchSvg } from './glyph-data/wrench';

/** Inner SVG markup for a default glyph (children of the root `<svg>`). */
export const defaultGlyphInnerHtml = {
  arrowDown: arrowDownInner,
  arrowUp: arrowUpInner,
  arrowsUpDown: arrowsUpDownInner,
  check: checkInner,
  chevronDown: chevronDownInner,
  chevronLeft: chevronLeftInner,
  chevronRight: chevronRightInner,
  clock: clockInner,
  close: closeInner,
  colorModeDark: colorModeDarkInner,
  colorModeLight: colorModeLightInner,
  colorModeSystem: colorModeSystemInner,
  copy: copyInner,
  error: errorInner,
  eye: eyeInner,
  eyeOff: eyeOffInner,
  info: infoInner,
  menu: menuInner,
  moreHorizontal: moreHorizontalInner,
  pause: pauseInner,
  play: playInner,
  repeat: repeatInner,
  repeatOne: repeatOneInner,
  search: searchInner,
  shuffle: shuffleInner,
  stop: stopInner,
  success: successInner,
  warning: warningInner,
  wrench: wrenchInner,
} as const satisfies Record<IconName, string>;

export type DefaultGlyphName = keyof typeof defaultGlyphInnerHtml;

/** All default glyph SVG strings keyed by semantic icon name. */
export const defaultIconSvgs = {
  arrowDown: arrowDownSvg,
  arrowUp: arrowUpSvg,
  arrowsUpDown: arrowsUpDownSvg,
  check: checkSvg,
  chevronDown: chevronDownSvg,
  chevronLeft: chevronLeftSvg,
  chevronRight: chevronRightSvg,
  clock: clockSvg,
  close: closeSvg,
  colorModeDark: colorModeDarkSvg,
  colorModeLight: colorModeLightSvg,
  colorModeSystem: colorModeSystemSvg,
  copy: copySvg,
  error: errorSvg,
  eye: eyeSvg,
  eyeOff: eyeOffSvg,
  info: infoSvg,
  menu: menuSvg,
  moreHorizontal: moreHorizontalSvg,
  pause: pauseSvg,
  play: playSvg,
  repeat: repeatSvg,
  repeatOne: repeatOneSvg,
  search: searchSvg,
  shuffle: shuffleSvg,
  stop: stopSvg,
  success: successSvg,
  warning: warningSvg,
  wrench: wrenchSvg,
} as const satisfies Record<DefaultGlyphName, string>;

/** Full inline SVG string for a default glyph (24×24, `currentColor`). */
export function defaultIconSvg(name: DefaultGlyphName): string {
  return defaultIconSvgs[name];
}
