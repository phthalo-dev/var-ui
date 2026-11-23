import type { IconName } from '@var-ui/core';
import { innerHtml as arrowDownInner, svg as arrowDownSvg } from './glyph-data/arrowDown';
import { innerHtml as arrowUpInner, svg as arrowUpSvg } from './glyph-data/arrowUp';
import { innerHtml as arrowsUpDownInner, svg as arrowsUpDownSvg } from './glyph-data/arrowsUpDown';
import { innerHtml as boxInner, svg as boxSvg } from './glyph-data/box';
import { innerHtml as checkInner, svg as checkSvg } from './glyph-data/check';
import { innerHtml as chevronDownInner, svg as chevronDownSvg } from './glyph-data/chevronDown';
import { innerHtml as chevronLeftInner, svg as chevronLeftSvg } from './glyph-data/chevronLeft';
import { innerHtml as chevronRightInner, svg as chevronRightSvg } from './glyph-data/chevronRight';
import { innerHtml as clockInner, svg as clockSvg } from './glyph-data/clock';
import { innerHtml as closeInner, svg as closeSvg } from './glyph-data/close';
import { innerHtml as codeInner, svg as codeSvg } from './glyph-data/code';
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
import { innerHtml as componentInner, svg as componentSvg } from './glyph-data/component';
import { innerHtml as copyInner, svg as copySvg } from './glyph-data/copy';
import { innerHtml as errorInner, svg as errorSvg } from './glyph-data/error';
import { innerHtml as externalLinkInner, svg as externalLinkSvg } from './glyph-data/externalLink';
import { innerHtml as eyeInner, svg as eyeSvg } from './glyph-data/eye';
import { innerHtml as eyeOffInner, svg as eyeOffSvg } from './glyph-data/eyeOff';
import { innerHtml as fileInner, svg as fileSvg } from './glyph-data/file';
import { innerHtml as githubInner, svg as githubSvg } from './glyph-data/github';
import { innerHtml as infoInner, svg as infoSvg } from './glyph-data/info';
import { innerHtml as markdownInner, svg as markdownSvg } from './glyph-data/markdown';
import { innerHtml as menuInner, svg as menuSvg } from './glyph-data/menu';
import {
  innerHtml as moreHorizontalInner,
  svg as moreHorizontalSvg,
} from './glyph-data/moreHorizontal';
import { innerHtml as pageInner, svg as pageSvg } from './glyph-data/page';
import { innerHtml as paletteInner, svg as paletteSvg } from './glyph-data/palette';
import { innerHtml as searchInner, svg as searchSvg } from './glyph-data/search';
import { innerHtml as slidersInner, svg as slidersSvg } from './glyph-data/sliders';
import { innerHtml as starInner, svg as starSvg } from './glyph-data/star';
import { innerHtml as stopInner, svg as stopSvg } from './glyph-data/stop';
import { innerHtml as successInner, svg as successSvg } from './glyph-data/success';
import { innerHtml as terminalInner, svg as terminalSvg } from './glyph-data/terminal';
import { innerHtml as warningInner, svg as warningSvg } from './glyph-data/warning';
import { innerHtml as wrenchInner, svg as wrenchSvg } from './glyph-data/wrench';

/** Inner SVG markup for a default glyph (children of the root `<svg>`). */
export const defaultGlyphInnerHtml = {
  arrowDown: arrowDownInner,
  arrowUp: arrowUpInner,
  arrowsUpDown: arrowsUpDownInner,
  box: boxInner,
  check: checkInner,
  chevronDown: chevronDownInner,
  chevronLeft: chevronLeftInner,
  chevronRight: chevronRightInner,
  clock: clockInner,
  close: closeInner,
  code: codeInner,
  colorModeDark: colorModeDarkInner,
  colorModeLight: colorModeLightInner,
  colorModeSystem: colorModeSystemInner,
  component: componentInner,
  copy: copyInner,
  error: errorInner,
  externalLink: externalLinkInner,
  eye: eyeInner,
  eyeOff: eyeOffInner,
  file: fileInner,
  github: githubInner,
  info: infoInner,
  markdown: markdownInner,
  menu: menuInner,
  moreHorizontal: moreHorizontalInner,
  page: pageInner,
  palette: paletteInner,
  search: searchInner,
  sliders: slidersInner,
  star: starInner,
  stop: stopInner,
  success: successInner,
  terminal: terminalInner,
  warning: warningInner,
  wrench: wrenchInner,
} as const satisfies Record<IconName, string>;

export type DefaultGlyphName = keyof typeof defaultGlyphInnerHtml;

/** All default glyph SVG strings keyed by semantic icon name. */
export const defaultIconSvgs = {
  arrowDown: arrowDownSvg,
  arrowUp: arrowUpSvg,
  arrowsUpDown: arrowsUpDownSvg,
  box: boxSvg,
  check: checkSvg,
  chevronDown: chevronDownSvg,
  chevronLeft: chevronLeftSvg,
  chevronRight: chevronRightSvg,
  clock: clockSvg,
  close: closeSvg,
  code: codeSvg,
  colorModeDark: colorModeDarkSvg,
  colorModeLight: colorModeLightSvg,
  colorModeSystem: colorModeSystemSvg,
  component: componentSvg,
  copy: copySvg,
  error: errorSvg,
  externalLink: externalLinkSvg,
  eye: eyeSvg,
  eyeOff: eyeOffSvg,
  file: fileSvg,
  github: githubSvg,
  info: infoSvg,
  markdown: markdownSvg,
  menu: menuSvg,
  moreHorizontal: moreHorizontalSvg,
  page: pageSvg,
  palette: paletteSvg,
  search: searchSvg,
  sliders: slidersSvg,
  star: starSvg,
  stop: stopSvg,
  success: successSvg,
  terminal: terminalSvg,
  warning: warningSvg,
  wrench: wrenchSvg,
} as const satisfies Record<DefaultGlyphName, string>;

/** Full inline SVG string for a default glyph (24×24, `currentColor`). */
export function defaultIconSvg(name: DefaultGlyphName): string {
  return defaultIconSvgs[name];
}
