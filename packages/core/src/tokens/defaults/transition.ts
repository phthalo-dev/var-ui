import { tokens } from '../declare';
import type { DesignTokens } from '../types';

export const transition = {
  overlayFade: `opacity ${tokens.duration.slow.var} ${tokens.easing.standard.var}, visibility ${tokens.duration.slow.var} ${tokens.easing.standard.var}`,
  panelEnter: `opacity ${tokens.duration.slow.var} ${tokens.easing.emphasized.var}`,
  backdrop: `opacity ${tokens.duration.slow.var} ${tokens.easing.standard.var}`,
  surfaceFast: `background-color ${tokens.duration.fast.var} ${tokens.easing.standard.var}`,
  colorShift: `color ${tokens.duration.medium.var} ${tokens.easing.standard.var}, text-decoration-color ${tokens.duration.medium.var} ${tokens.easing.standard.var}`,
  controlSurface: `background-color ${tokens.duration.medium.var} ${tokens.easing.standard.var}, border-color ${tokens.duration.medium.var} ${tokens.easing.standard.var}`,
  /** `border-color` alone — inputs and selects that only recolor their edge. */
  border: `border-color ${tokens.duration.medium.var} ${tokens.easing.standard.var}`,
  /** `border-color` + `box-shadow` — fields whose focus/hover adds a ring. */
  borderShadow: `border-color ${tokens.duration.medium.var} ${tokens.easing.standard.var}, box-shadow ${tokens.duration.medium.var} ${tokens.easing.standard.var}`,
  /** `background-color` alone — switch tracks, radio dots. */
  background: `background-color ${tokens.duration.medium.var} ${tokens.easing.standard.var}`,
  /** `background-color` + `border-color` + `color` — chips and toggled buttons. */
  chrome: `background-color ${tokens.duration.medium.var} ${tokens.easing.standard.var}, border-color ${tokens.duration.medium.var} ${tokens.easing.standard.var}, color ${tokens.duration.medium.var} ${tokens.easing.standard.var}`,
  /** `transform` alone — thumbs, chevrons, disclosure rotation. */
  transform: `transform ${tokens.duration.medium.var} ${tokens.easing.standard.var}`,
} satisfies DesignTokens['transition'];
