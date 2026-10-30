import { designTokens as t } from '../tokens';

/**
 * Building blocks for `forced-colors: active` (Windows High Contrast). In that mode the browser
 * replaces author colors with the system palette, drops `box-shadow` and background images, and
 * keeps `outline`, `border`, and system-color keywords. Anything that conveys a boundary, a state
 * or a fill through `background-color` / `box-shadow` alone disappears unless it gets one of these.
 *
 * Fragments, not media blocks: `atForcedColors` can appear once per style object (a second spread
 * under the same key replaces the first), so combine fragments inside one call:
 *
 * ```ts
 * ...atForcedColors({ ...forced.boundary, ...forced.focus })
 * ```
 *
 * System colors are honored as authored in forced-colors mode, so none of these need
 * `forced-color-adjust: none` (only {@link forced.swatch} does, because it keeps authored colors).
 */
export const forced = {
  /** A visible edge for surfaces that are bounded only by `box-shadow` or a background tint. */
  boundary: {
    borderWidth: t.borderWidth.default.var,
    borderStyle: 'solid',
    borderColor: 'CanvasText',
  },
  /** The selected/active item in a list, menu, tab, segment, or calendar cell. */
  selected: {
    backgroundColor: 'Highlight',
    color: 'HighlightText',
  },
  /** A filled indicator: progress or slider range, checked box/switch track, status dot. */
  fill: {
    backgroundColor: 'Highlight',
  },
  /** The empty rail behind a fill; `CanvasText` border keeps the control's extent visible. */
  track: {
    backgroundColor: 'Canvas',
    borderWidth: t.borderWidth.default.var,
    borderStyle: 'solid',
    borderColor: 'CanvasText',
  },
  /** A glyph or thumb that sits on top of a {@link forced.fill}: check mark, radio dot, switch thumb. */
  mark: {
    backgroundColor: 'HighlightText',
    color: 'HighlightText',
  },
  /** Focus for controls that hide the native outline and signal focus with a border or shadow. */
  focus: {
    outline: `${t.borderWidth.thick.var} solid Highlight`,
    outlineOffset: '2px',
  },
  /** Disabled text and edges. */
  disabled: {
    color: 'GrayText',
    borderColor: 'GrayText',
  },
  /** Colors that are the content (color swatches, gradient previews): opt out of the palette swap. */
  swatch: {
    forcedColorAdjust: 'none',
  },
} as const;
