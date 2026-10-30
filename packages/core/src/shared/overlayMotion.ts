import { positioner } from '../components/positionerVars';
import { typestyles } from '../runtime';
import { atReducedMotion } from '../theme/conditions';
import { designTokens as t } from '../tokens';

/**
 * Enter/exit opacity, with optional scale, for a floating layer.
 * Dialog, drawer, and popup recipes spread this onto their own slots so each
 * component keeps its public class names.
 */
export function overlayPresenceStyles(options: { scale?: boolean } = {}) {
  const scale = options.scale ?? false;
  return {
    transition: scale
      ? `${t.transition.panelEnter.var}, transform ${t.duration.slow.var} ${t.easing.emphasized.var}`
      : t.transition.backdrop.var,
    transformOrigin: positioner.vars.transformOrigin.var,
    '&[data-starting-style], &[data-ending-style]': {
      opacity: 0,
      ...(scale ? { transform: 'scale(0.98)' } : {}),
    },
    ...atReducedMotion({
      transition: 'none',
      transform: 'none',
      '&[data-starting-style], &[data-ending-style]': {
        opacity: 1,
      },
    }),
  };
}

/**
 * Registered, inherited number that drives a native `::backdrop` fade. `@starting-style` cannot
 * target a pseudo-element, so the dialog itself transitions this property (it inherits into
 * `::backdrop`) and {@link nativeBackdrop} reads it. Registered so it interpolates.
 */
export const backdropAlpha = typestyles.property.declare('backdrop-alpha', {
  syntax: '<number>',
  inherits: true,
  initial: 0,
});

type NativeOpenSelector = '[open]' | ':popover-open';
export type NativeSlidePlacement = 'start' | 'end' | 'bottom';

const SCALE_FROM = 'scale(0.98)';

/** Off-screen `translate` per placement; the inline sides flip under `[dir="rtl"]`. */
const slideFrom = {
  start: { ltr: '-100% 0', rtl: '100% 0' },
  end: { ltr: '100% 0', rtl: '-100% 0' },
  bottom: { ltr: '0 100%', rtl: '0 100%' },
} as const;

/**
 * Enter/exit for a top-layer element: a `<dialog>` (`open: '[open]'`) or a `[popover]`
 * (`open: ':popover-open'`). The base block is the CLOSED look and the transition list includes
 * `overlay` and `display` with `allow-discrete`, so the element stays rendered in the top layer
 * while it animates out after `close()` / `hidePopover()`. The open block carries the open look and
 * a nested `@starting-style` for the enter. Spread onto the popup slot.
 *
 * - `scale`: fade plus a slight scale (dialogs, popups).
 * - `slide`: also transition `translate`; pair with {@link nativeSlideFrom} per placement.
 * - `backdrop`: also fade `::backdrop` through {@link backdropAlpha} (dialogs only); pair with
 *   {@link nativeBackdrop}.
 * - `whenOpen`: extra declarations for the open state (for example `display: 'flex'`). The helper
 *   owns the `&[open]` key, so put open-only styles here rather than redefining that key.
 *
 * Durations and easings are tokens, which resolve to `0ms` under reduced motion, so no extra
 * reduced-motion block is needed.
 */
export function nativeEnterExit(
  options: {
    open?: NativeOpenSelector;
    scale?: boolean;
    slide?: boolean;
    backdrop?: boolean;
    whenOpen?: Record<string, unknown>;
  } = {},
) {
  const open = options.open ?? '[open]';
  const dur = t.duration.slow.var;
  const ease = t.easing.emphasized.var;
  const transitions = [`opacity ${dur} ${ease}`];
  if (options.scale) transitions.push(`transform ${dur} ${ease}`);
  if (options.slide) transitions.push(`translate ${dur} ${ease}`);
  if (options.backdrop) transitions.push(`${backdropAlpha.name} ${dur} ${ease}`);
  transitions.push(`overlay ${dur} allow-discrete`, `display ${dur} allow-discrete`);

  const closed: Record<string, string | number> = { opacity: 0 };
  if (options.scale) closed.transform = SCALE_FROM;
  if (options.backdrop) closed[backdropAlpha.name] = '0'; // string: TypeStyles appends `px` to bare numbers

  const opened: Record<string, string | number> = { opacity: 1 };
  if (options.scale) opened.transform = 'none';
  if (options.backdrop) opened[backdropAlpha.name] = '1';

  return {
    ...closed,
    transition: transitions.join(', '),
    [`&${open}`]: { ...opened, ...options.whenOpen, '@starting-style': closed },
  };
}

/**
 * Slide-in styles for one placement (`start` | `end` | `bottom`), to spread INSIDE the recipe's own
 * `'&[data-placement="start"]'` (or `data-side`) block. Closed = off-screen via `translate`
 * (flipped for the inline sides under `[dir="rtl"]`); open = in place, with `@starting-style` for
 * the enter. Needs `nativeEnterExit({ slide: true })` on the same slot for the transition.
 */
export function nativeSlideFrom(
  placement: NativeSlidePlacement,
  open: NativeOpenSelector = '[open]',
) {
  const { ltr, rtl } = slideFrom[placement];
  const flips = ltr !== rtl;
  return {
    translate: ltr,
    ...(flips ? { '[dir="rtl"] &': { translate: rtl } } : {}),
    [`&${open}`]: {
      translate: 'none',
      '@starting-style': {
        translate: ltr,
        ...(flips ? { '[dir="rtl"] &': { translate: rtl } } : {}),
      },
    },
  };
}

/**
 * `::backdrop` rule for a dialog whose popup spreads `nativeEnterExit({ backdrop: true })`.
 * `color` is a (possibly translucent) color value; its alpha is scaled by the animated property.
 */
export function nativeBackdrop(color: string) {
  return {
    '&::backdrop': {
      backgroundColor: `color-mix(in srgb, ${color} calc(${backdropAlpha.var} * 100%), transparent)`,
    },
  };
}

/** Dialog reset shared by every `<dialog>` popup: scroll containment, no UA border/padding. */
export const nativeDialogReset = {
  overscrollBehavior: 'contain',
  padding: 0,
  border: 'none',
  color: 'inherit',
} as const;
