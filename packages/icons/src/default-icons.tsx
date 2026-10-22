import type { ReactNode } from 'react';
import type { IconName } from '@var-ui/core';
import { arrowDown } from './icons/arrowDown';
import { arrowUp } from './icons/arrowUp';
import { arrowsUpDown } from './icons/arrowsUpDown';
import { check } from './icons/check';
import { chevronDown } from './icons/chevronDown';
import { chevronLeft } from './icons/chevronLeft';
import { chevronRight } from './icons/chevronRight';
import { clock } from './icons/clock';
import { close } from './icons/close';
import { colorModeDark } from './icons/colorModeDark';
import { colorModeLight } from './icons/colorModeLight';
import { colorModeSystem } from './icons/colorModeSystem';
import { copy } from './icons/copy';
import { error } from './icons/error';
import { eye } from './icons/eye';
import { eyeOff } from './icons/eyeOff';
import { info } from './icons/info';
import { menu } from './icons/menu';
import { moreHorizontal } from './icons/moreHorizontal';
import { search } from './icons/search';
import { stop } from './icons/stop';
import { success } from './icons/success';
import { warning } from './icons/warning';
import { wrench } from './icons/wrench';

/** Default React glyphs — pass to `IconProvider`. */
export const defaultIcons: Record<IconName, ReactNode> = {
  arrowDown,
  arrowUp,
  arrowsUpDown,
  check,
  chevronDown,
  chevronLeft,
  chevronRight,
  clock,
  close,
  colorModeDark,
  colorModeLight,
  colorModeSystem,
  copy,
  error,
  eye,
  eyeOff,
  info,
  menu,
  moreHorizontal,
  search,
  stop,
  success,
  warning,
  wrench,
};
