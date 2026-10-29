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
    paddingInline: t.space[3].var,
    gap: t.space[1].var,
    iconSize: t.size.icon.sm.var,
  },
  md: {
    height: t.size.control.md.var,
    fontSize: t.fontSize.md.var,
    paddingInline: t.space[4].var,
    gap: t.space[2].var,
    iconSize: t.size.icon.md.var,
  },
  lg: {
    height: t.size.control.lg.var,
    fontSize: t.fontSize.lg.var,
    paddingInline: t.space[5].var,
    gap: t.space[2].var,
    iconSize: t.size.icon.lg.var,
  },
};

type ControlSurfaceOptions = {
  /** Tighter horizontal inset for icon + input shells (search, combobox, select). */
  inset?: 'default' | 'compact';
};

const compactPaddingInline: Record<ControlSize, string> = {
  sm: t.space[2].var,
  md: t.space[3].var,
  lg: t.space[4].var,
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
