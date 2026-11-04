import { atProperty, keyframes, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { atForcedColors, atReducedMotion } from '../theme/conditions';
import { transitionOf } from '../internal/motion';
import { designTokens as t } from '../tokens';
import {
  mapTone,
  semanticTone,
  subtleBackgroundColor,
  toneWithDefault,
} from '../shared/semanticTone';
import { controlSize, fillAppearance } from '../shared/variantAxes';

const spin = keyframes.create('var-ui-progress-circle-spin', {
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

/**
 * Circular progress. The ring is an SVG with two circles of `pathLength="100"`, so the fill's
 * dash length is the progress itself: `stroke-dasharray: calc(progress * 100) 100`.
 * `--var-ui-progress-circle-progress` (0..1) is set inline by the React / Astro components.
 * The `indeterminate` variant spins a fixed quarter arc. Use `progressBar` for a linear
 * indicator, `spinner` when no region is reserved for a measurable ring.
 */
export const progressCircle = typestyles.recipe({
  name: 'progress-circle',
  layer: 'components',
  slots: ['root', 'ring', 'track', 'fill', 'content'],
  variants: {
    size: controlSize,
    tone: toneWithDefault('accent'),
    appearance: fillAppearance,
    indeterminate: variant.boolean({ default: false }),
  },
  vars: {
    progress: { ...atProperty.number, value: '0' },
    size: { ...atProperty.length, value: t.size.control.lg.var },
    // Stroke width in the ring's 100-unit viewBox (unitless user units, so it scales with the size).
    thickness: { ...atProperty.number, value: '10' },
    fillColor: { ...atProperty.color, value: t.color.tone.accent.foreground.var },
    trackColor: { ...atProperty.color, value: t.color.border.default.var },
  },
  styles: ({ vars }) => ({
    base: {
      root: {
        position: 'relative',
        display: 'inline-grid',
        placeItems: 'center',
        inlineSize: vars.size.var,
        blockSize: vars.size.var,
        flexShrink: 0,
        verticalAlign: 'middle',
      },
      ring: {
        position: 'absolute',
        inset: 0,
        inlineSize: '100%',
        blockSize: '100%',
        // Start at 12 o'clock; RTL mirrors the sweep so it runs counter-clockwise.
        transform: 'rotate(-90deg)',
        '[dir="rtl"] &': { transform: 'scaleX(-1) rotate(-90deg)' },
        overflow: 'visible',
      },
      track: {
        fill: 'none',
        stroke: vars.trackColor.var,
        strokeWidth: vars.thickness.var,
        ...atForcedColors({ stroke: 'GrayText' }),
      },
      fill: {
        fill: 'none',
        stroke: vars.fillColor.var,
        strokeWidth: vars.thickness.var,
        strokeDasharray: `calc(${vars.progress.var} * 100) 100`,
        transition: transitionOf('stroke-dasharray'),
        ...atForcedColors({ stroke: 'Highlight' }),
      },
      content: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: t.fontSize.xs.var,
        fontWeight: t.fontWeight.medium.var,
        fontVariantNumeric: 'tabular-nums',
        color: t.color.text.primary.var,
        lineHeight: 1,
      },
    },
    variants: {
      size: {
        sm: { root: { [vars.size.name]: t.size.control.sm.var, [vars.thickness.name]: '14' } },
        md: { root: { [vars.size.name]: t.size.control.lg.var, [vars.thickness.name]: '10' } },
        lg: {
          root: { [vars.size.name]: t.size.media.md.var, [vars.thickness.name]: '8' },
          content: { fontSize: t.fontSize.md.var },
        },
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
          root: {
            [vars.trackColor.name]: subtleBackgroundColor(vars.fillColor.var),
          },
        },
      },
      indeterminate: {
        true: {
          fill: {
            strokeDasharray: '25 75',
            transformBox: 'fill-box',
            transformOrigin: 'center',
            animation: `${spin} 1000ms linear infinite`,
            transition: 'none',
            // A frozen arc still reads as "busy" next to its label; the motion is what stops.
            ...atReducedMotion({ animation: 'none' }),
          },
        },
        false: {},
      },
    },
  }),
});

export type ProgressCircleVariantProps = RecipeVariants<typeof progressCircle>;
