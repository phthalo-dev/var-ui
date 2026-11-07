import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { atForcedColors } from '../theme/conditions';
import { forced } from '../internal/forcedColors';
import { transitionOf } from '../internal/motion';
import { designTokens as t } from '../tokens';
import { mapTone, semanticTone, toneWithDefault, type Tone } from '../shared/semanticTone';
import { controlSize, fillAppearance } from '../shared/variantAxes';

export type MeterThresholds = {
  value: number;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** Upper bound of the "low" region. @default min */
  low?: number;
  /** Lower bound of the "high" region. @default max */
  high?: number;
  /** The ideal value. @default the midpoint of min and max */
  optimum?: number;
};

/**
 * The tone a native `<meter>` paints, from the HTML "meter" algorithm: the region (low, middle,
 * high) holding `optimum` is the good one. A value in it is `success`, in the neighbouring region
 * `warning`, and in the region on the far side `danger`.
 */
export function getMeterTone({
  value,
  min = 0,
  max = 100,
  low,
  high,
  optimum,
}: MeterThresholds): Extract<Tone, 'success' | 'warning' | 'danger'> {
  const hi = Math.max(min, max);
  const clamp = (n: number) => Math.min(hi, Math.max(min, n));
  const lo = clamp(low ?? min);
  const up = Math.max(lo, clamp(high ?? hi));
  const best = clamp(optimum ?? (min + hi) / 2);
  const region = (n: number) => (n < lo ? 0 : n > up ? 2 : 1);
  const distance = Math.abs(region(clamp(value)) - region(best));
  return distance === 0 ? 'success' : distance === 1 ? 'warning' : 'danger';
}

/**
 * A scalar measurement inside a known range (disk usage, password strength). Unlike
 * `progressBar` it has no "in progress" state and its tone says whether the value is good.
 * Fill width is set inline (percentage) by the React / Astro components.
 */
export const meter = typestyles.recipe({
  name: 'meter',
  layer: 'components',
  slots: ['root', 'header', 'label', 'valueText', 'track', 'fill'],
  variants: {
    size: controlSize,
    tone: toneWithDefault('success'),
    appearance: fillAppearance,
  },
  vars: {
    trackColor: { ...atProperty.color, value: t.color.background.subtle.var },
    fillColor: { ...atProperty.color, value: t.color.tone.success.foreground.var },
    trackSize: { ...atProperty.length, value: '0.5rem' },
  },
  styles: ({ vars }) => ({
    base: {
      root: { display: 'grid', gap: t.space[1].var, minWidth: t.size.field.minWidthCompact.var },
      header: { display: 'flex', justifyContent: 'space-between', gap: t.space[3].var },
      label: { fontSize: t.fontSize.sm.var, fontWeight: t.fontWeight.medium.var },
      valueText: { fontSize: t.fontSize.sm.var, color: t.color.text.secondary.var },
      track: {
        blockSize: vars.trackSize.var,
        borderRadius: t.radius.full.var,
        backgroundColor: vars.trackColor.var,
        overflow: 'hidden',
        ...atForcedColors(forced.track),
      },
      fill: {
        blockSize: '100%',
        borderRadius: 'inherit',
        backgroundColor: vars.fillColor.var,
        transition: transitionOf('width'),
        ...atForcedColors(forced.fill),
      },
    },
    variants: {
      size: {
        sm: { root: { [vars.trackSize.name]: '0.25rem' } },
        md: { root: { [vars.trackSize.name]: '0.5rem' } },
        lg: { root: { [vars.trackSize.name]: '0.75rem' } },
      },
      tone: mapTone((key) => ({
        root: {
          [vars.fillColor.name]:
            key === 'neutral' ? t.color.text.secondary.var : semanticTone[key].background,
        },
      })),
      appearance: {
        solid: {},
        subtle: {
          fill: {
            backgroundColor: `color-mix(in srgb, ${vars.fillColor.var} 55%, ${t.color.background.subtle.var})`,
            ...atForcedColors(forced.fill),
          },
        },
      },
    },
  }),
});

export type MeterVariantProps = RecipeVariants<typeof meter>;
