import { atProperty, keyframes, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { atForcedColors, atReducedMotion } from '../theme/conditions';
import { forced } from '../internal/forcedColors';
import { transitionOf } from '../internal/motion';
import { designTokens as t } from '../tokens';
import { semanticTone, toneValues, toneWithDefault, type Tone } from '../shared/semanticTone';
import { fillAppearance } from '../shared/variantAxes';

const slide = keyframes.create('var-ui-progress-slide', {
  from: { transform: 'translateX(-100%)' },
  to: { transform: 'translateX(400%)' },
});

// Mirrored for RTL: the segment starts at the inline-end edge and travels toward inline-start.
const slideRtl = keyframes.create('var-ui-progress-slide-rtl', {
  from: { transform: 'translateX(100%)' },
  to: { transform: 'translateX(-400%)' },
});

/**
 * Linear progress. Fill width is set inline by the React wrapper
 * (percentage); the `indeterminate` variant animates a sliding segment.
 */
export const progressBar = typestyles.recipe({
  name: 'progress-bar',
  layer: 'components',
  slots: ['root', 'header', 'label', 'valueText', 'track', 'fill'],
  variants: {
    tone: toneWithDefault('accent'),
    appearance: fillAppearance,
    indeterminate: variant.boolean({ default: false }),
  },
  vars: {
    trackColor: {
      ...atProperty.color,
      value: t.color.background.subtle.var,
    },
    fillColor: {
      ...atProperty.color,
      value: t.color.tone.accent.foreground.var,
    },
    fillWidth: {
      ...atProperty.percentage,
      value: '0%',
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: { display: 'grid', gap: t.space[1].var, minWidth: '160px' },
        header: { display: 'flex', justifyContent: 'space-between', gap: t.space[3].var },
        label: { fontSize: t.fontSize.sm.var, fontWeight: t.fontWeight.medium.var },
        valueText: { fontSize: t.fontSize.sm.var, color: t.color.text.secondary.var },
        track: {
          height: '6px',
          borderRadius: t.radius.full.var,
          backgroundColor: vars.trackColor.var,
          overflow: 'hidden',
          ...atForcedColors(forced.track),
        },
        fill: {
          height: '100%',
          width: vars.fillWidth.var,
          borderRadius: 'inherit',
          backgroundColor: vars.fillColor.var,
          transition: transitionOf('width'),
          ...atForcedColors(forced.fill),
        },
      },
      variants: {
        tone: Object.fromEntries(
          toneValues.map((key) => [
            key,
            {
              root: {
                [vars.fillColor.name]:
                  key === 'neutral' ? t.color.text.secondary.var : semanticTone[key].background,
              },
            },
          ]),
        ) as Record<
          Tone,
          {
            root: Record<string, string>;
          }
        >,
        appearance: {
          solid: {},
          subtle: {
            fill: {
              backgroundColor: `color-mix(in srgb, ${vars.fillColor.var} 55%, ${t.color.background.subtle.var})`,
              ...atForcedColors(forced.fill),
            },
          },
        },
        indeterminate: {
          true: {
            fill: {
              width: '25%',
              animation: `${slide} 1200ms ease-in-out infinite`,
              '[dir="rtl"] &': {
                animation: `${slideRtl} 1200ms ease-in-out infinite`,
                ...atReducedMotion({ animation: 'none' }),
              },
              ...atReducedMotion({
                animation: 'none',
                width: '100%',
                opacity: 0.5,
              }),
            },
          },
          false: {},
        },
      },
    };
  },
});

export type ProgressBarVariantProps = RecipeVariants<typeof progressBar>;
