import { designTokens as t } from '../tokens';
import type { ControlSize } from '../shared/variantAxes';

type ControlSizeMetrics = {
  height: string;
  fontSize: string;
  paddingInline: string;
  gap: string;
  iconSize: string;
};

/** Canonical sm/md/lg metrics for inline controls — backed by `size.control` tokens. */
export const controlSizeMetrics: Record<ControlSize, ControlSizeMetrics> = {
  sm: {
    height: t.size.control.sm.var,
    fontSize: t.fontSize.sm.var,
    paddingInline: t.space.sm.var,
    gap: t.space.xxs.var,
    iconSize: t.size.icon.sm.var,
  },
  md: {
    height: t.size.control.md.var,
    fontSize: t.fontSize.md.var,
    paddingInline: t.space.md.var,
    gap: t.space.xs.var,
    iconSize: t.size.icon.md.var,
  },
  lg: {
    height: t.size.control.lg.var,
    fontSize: t.fontSize.lg.var,
    paddingInline: t.space.lg.var,
    gap: t.space.xs.var,
    iconSize: t.size.icon.lg.var,
  },
};

type ControlSurfaceOptions = {
  /** Tighter horizontal inset for icon + input shells (search, combobox, select). */
  inset?: 'default' | 'compact';
};

/** Horizontal inset for icon + input shells and text-entry fields (`inset: 'compact'`). */
export const compactPaddingInline: Record<ControlSize, string> = {
  sm: t.space.xs.var,
  md: t.space.sm.var,
  lg: t.space.md.var,
};

/** Fixed-height surface styles for buttons, inputs, and select triggers. */
export function controlSurfaceSize(size: ControlSize, options: ControlSurfaceOptions = {}) {
  const metrics = controlSizeMetrics[size];
  return {
    boxSizing: 'border-box' as const,
    height: metrics.height,
    minHeight: metrics.height,
    fontSize: metrics.fontSize,
    paddingInline: options.inset === 'compact' ? compactPaddingInline[size] : metrics.paddingInline,
    paddingBlock: 0,
    gap: metrics.gap,
  };
}

export function controlSizeVariants<T extends Record<string, unknown>>(
  apply: (size: ControlSize) => T,
): Record<ControlSize, T> {
  return {
    sm: apply('sm'),
    md: apply('md'),
    lg: apply('lg'),
  };
}

/** One fontSize step below the control's: secondary text inside a control (tokens, hints, file names). */
export const controlSecondaryFontSize: Record<ControlSize, string> = {
  sm: t.fontSize.xs.var,
  md: t.fontSize.sm.var,
  lg: t.fontSize.md.var,
};

/** Vertical inset for auto-height text-entry surfaces (text areas, wrapping token groups). */
export const controlPaddingBlock: Record<ControlSize, string> = {
  sm: t.space.xxs.var,
  md: t.space.xs.var,
  lg: t.space.xs.var,
};

/**
 * Geometry for checkbox / radio / switch at a control size: the indicator box (checkbox square,
 * radio ring, switch thumb), radio dot, switch track, the label's fontSize and the indicator-label
 * gap. Backed by `size.indicator` tokens.
 */
export function indicatorSize(size: ControlSize) {
  const { box, dot, trackWidth, trackHeight } = t.size.indicator;
  return {
    box: box[size].var,
    dot: dot[size].var,
    trackWidth: trackWidth[size].var,
    trackHeight: trackHeight[size].var,
    labelFontSize: controlSizeMetrics[size].fontSize,
    markFontSize: controlSecondaryFontSize[size],
    gap: controlSizeMetrics[size].gap,
  };
}
