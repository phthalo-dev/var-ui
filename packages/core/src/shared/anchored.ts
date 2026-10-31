import { border } from '../internal/border';
import { designTokens as t } from '../tokens';
import { nativeEnterExit } from './overlayMotion';

/**
 * Anchor-positioned `[popover]` primitives shared by popover, menu, tooltip, hover card and the
 * select-like field popups.
 *
 * The anchor is wired at runtime by JS (`anchor-name` on the trigger, `position-anchor` on the
 * popup, both inline custom idents), so none of these rules name an anchor. Placement is the
 * public `data-placement` vocabulary, `side` or `side align`:
 *
 * - side: `top | bottom | start | end` (`start`/`end` are inline sides: they mirror in RTL)
 * - align: `start | center | end` along the other axis (inline for block sides, block for inline sides)
 *
 * `data-placement` is the REQUESTED placement. The browser flips the popup when it does not fit
 * (`position-try-fallbacks`), and the transform origin stays on the requested side.
 */

export type PopupSide = 'top' | 'bottom' | 'start' | 'end';
export type PopupAlign = 'start' | 'center' | 'end';
export type PopupPlacement = PopupSide | `${PopupSide} ${PopupAlign}`;

const SIDES: readonly PopupSide[] = ['top', 'bottom', 'start', 'end'];
const ALIGNS: readonly PopupAlign[] = ['start', 'center', 'end'];

/** Every valid `data-placement` value (4 sides, 12 side + align pairs). */
export const popupPlacements: readonly PopupPlacement[] = SIDES.flatMap((side) => [
  side,
  ...ALIGNS.map((align) => `${side} ${align}` as const),
]);

/** Custom property: gap between the anchor and the popup. Falls back to a space token. */
export const popupOffsetVar = '--var-ui-popup-offset';
/** Custom property: cap on the popup height (default is the viewport minus a space token). */
export const popupMaxHeightVar = '--var-ui-popup-max-height';
/** Custom property: cap on the popup width (default is the viewport minus a space token). */
export const popupMaxWidthVar = '--var-ui-popup-max-width';

const isBlockSide = (side: PopupSide) => side === 'top' || side === 'bottom';

/** `position-area` for a placement. Logical values, so start/end mirror in RTL with no JS. */
export function popupPositionArea(side: PopupSide, align: PopupAlign): string {
  if (isBlockSide(side)) {
    const block = side === 'bottom' ? 'block-end' : 'block-start';
    if (align === 'center') return block;
    return `${block} ${align === 'start' ? 'span-inline-end' : 'span-inline-start'}`;
  }
  const inline = side === 'start' ? 'inline-start' : 'inline-end';
  if (align === 'center') return inline;
  return `${inline} ${align === 'start' ? 'span-block-end' : 'span-block-start'}`;
}

/** Flip along the placement axis first, then the other, then both. */
export function popupTryFallbacks(side: PopupSide): string {
  return isBlockSide(side)
    ? 'flip-block, flip-inline, flip-block flip-inline'
    : 'flip-inline, flip-block, flip-block flip-inline';
}

/** Per-side `[ltr, rtl]` transform origin: grows out of the edge that faces the anchor. */
function popupOrigin(side: PopupSide, align: PopupAlign): [string, string] {
  if (isBlockSide(side)) {
    const v = side === 'bottom' ? 'top' : 'bottom';
    if (align === 'center') return [`${v} center`, `${v} center`];
    return align === 'start' ? [`${v} left`, `${v} right`] : [`${v} right`, `${v} left`];
  }
  const v = align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center';
  return side === 'start' ? [`right ${v}`, `left ${v}`] : [`left ${v}`, `right ${v}`];
}

/** Placement block: `position-area`, fallbacks, facing-side offset margin and transform origin. */
function placementStyles(side: PopupSide, align: PopupAlign, offset: string) {
  const facing = {
    bottom: 'marginBlockStart',
    top: 'marginBlockEnd',
    start: 'marginInlineEnd',
    end: 'marginInlineStart',
  }[side];
  const [ltr, rtl] = popupOrigin(side, align);
  return {
    positionArea: popupPositionArea(side, align),
    positionTryFallbacks: popupTryFallbacks(side),
    // The offset is a margin on the facing side only; `flip-*` swaps margins with the side.
    margin: 0,
    [facing]: offset,
    transformOrigin: ltr,
    ...(ltr !== rtl ? { '[dir="rtl"] &': { transformOrigin: rtl } } : {}),
  };
}

export type AnchoredOptions = {
  /** Placement used when `data-placement` is absent. Default `bottom`. */
  defaultPlacement?: PopupSide;
  /** Align used when `data-placement` is a side only, and by the default placement. Default `start`. */
  defaultAlign?: PopupAlign;
  /** Fallback for `--var-ui-popup-offset`. Default `space[2]`. */
  offset?: string;
  /** Fallback for `--var-ui-popup-max-height`. Default: viewport minus `2 * space[4]`. */
  maxHeight?: string;
  /** Fallback for `--var-ui-popup-max-width`. Default: viewport minus `2 * space[4]`. */
  maxWidth?: string;
  /** Size to the trigger: `exact` sets `width`, `min` only `min-width` (see {@link anchoredMatchWidth}). */
  matchWidth?: 'exact' | 'min';
};

/**
 * `width: anchor-size(width)` for listbox popups that match the trigger. `exact` pins the width;
 * `min` lets the popup grow past the trigger. Needs `position-anchor` (set by `useAnchor`).
 */
export function anchoredMatchWidth(mode: 'exact' | 'min' = 'exact') {
  return {
    boxSizing: 'border-box',
    minWidth: 'anchor-size(width)',
    ...(mode === 'exact' ? { width: 'anchor-size(width)' } : {}),
  } as const;
}

/**
 * Styles for a `[popover]` element positioned against its `position-anchor`. Spread onto the popup
 * slot of a recipe. Includes the UA popover reset, `position: fixed` placement from
 * `data-placement`, offset, size caps that do not defeat flipping, and the shared enter/exit
 * ({@link nativeEnterExit} on `:popover-open`, which also covers reduced motion through the
 * duration tokens).
 *
 * No `z-index`: the top layer orders popups by insertion.
 *
 * Do not redefine the `&:popover-open` key after spreading; use extra declarations on the slot.
 */
export function anchored(options: AnchoredOptions = {}) {
  const side = options.defaultPlacement ?? 'bottom';
  const defaultAlign = options.defaultAlign ?? 'start';
  const offset = `var(${popupOffsetVar}, ${options.offset ?? t.space[2].var})`;
  // Caps are tokens, NOT `max-height: 100%`: a clamp to the position-area cell never overflows,
  // so `flip-block` would never trigger.
  const viewportGutter = `2 * ${t.space[4].var}`;
  const maxHeight = `min(var(${popupMaxHeightVar}, ${options.maxHeight ?? `calc(100dvh - ${viewportGutter})`}), 100dvh)`;
  const maxWidth = `min(var(${popupMaxWidthVar}, ${options.maxWidth ?? `calc(100vw - ${viewportGutter})`}), 100vw)`;

  const placements: Record<string, unknown> = {};
  for (const s of SIDES) {
    placements[`&[data-placement="${s}"]`] = placementStyles(s, defaultAlign, offset);
    for (const a of ALIGNS) {
      placements[`&[data-placement="${s} ${a}"]`] = placementStyles(s, a, offset);
    }
  }

  return {
    // UA `[popover]` reset: it is `inset: 0; margin: auto; border; padding; width: fit-content`.
    position: 'fixed',
    inset: 'auto',
    border: 'none',
    padding: 0,
    color: 'inherit',
    overflow: 'auto',
    maxHeight,
    maxWidth,
    ...(options.matchWidth ? anchoredMatchWidth(options.matchWidth) : {}),
    ...placementStyles(side, defaultAlign, offset),
    ...placements,
    ...nativeEnterExit({ open: ':popover-open', scale: true }),
  };
}

/**
 * Shared popup surface: border, radius, background and shadow. `background` and `border` are color
 * values (usually a recipe var). Padding is left to the recipe.
 */
export function popupSurface(colors: { background: string; border: string }) {
  return {
    ...border(colors.border),
    borderRadius: t.radius.md.var,
    backgroundColor: colors.background,
    boxShadow: t.shadow.md.var,
  };
}
