import type { ReactNode } from 'react';
import type { IconName } from '@var-ui/core';
import { arrowDown } from './icons/arrowDown';
import { arrowUp } from './icons/arrowUp';
import { arrowsUpDown } from './icons/arrowsUpDown';
import { box } from './icons/box';
import { check } from './icons/check';
import { chevronDown } from './icons/chevronDown';
import { chevronLeft } from './icons/chevronLeft';
import { chevronRight } from './icons/chevronRight';
import { clock } from './icons/clock';
import { close } from './icons/close';
import { code } from './icons/code';
import { colorModeDark } from './icons/colorModeDark';
import { colorModeLight } from './icons/colorModeLight';
import { colorModeSystem } from './icons/colorModeSystem';
import { component } from './icons/component';
import { copy } from './icons/copy';
import { error } from './icons/error';
import { externalLink } from './icons/externalLink';
import { eye } from './icons/eye';
import { eyeOff } from './icons/eyeOff';
import { file } from './icons/file';
import { github } from './icons/github';
import { info } from './icons/info';
import { markdown } from './icons/markdown';
import { menu } from './icons/menu';
import { moreHorizontal } from './icons/moreHorizontal';
import { page } from './icons/page';
import { palette } from './icons/palette';
import { search } from './icons/search';
import { sliders } from './icons/sliders';
import { star } from './icons/star';
import { stop } from './icons/stop';
import { success } from './icons/success';
import { terminal } from './icons/terminal';
import { warning } from './icons/warning';
import { wrench } from './icons/wrench';

/** Default React glyphs — pass to `IconProvider`. */
export const defaultIcons: Record<IconName, ReactNode> = {
  arrowDown,
  arrowUp,
  arrowsUpDown,
  box,
  check,
  chevronDown,
  chevronLeft,
  chevronRight,
  clock,
  close,
  code,
  colorModeDark,
  colorModeLight,
  colorModeSystem,
  component,
  copy,
  error,
  externalLink,
  eye,
  eyeOff,
  file,
  github,
  info,
  markdown,
  menu,
  moreHorizontal,
  page,
  palette,
  search,
  sliders,
  star,
  stop,
  success,
  terminal,
  warning,
  wrench,
};
