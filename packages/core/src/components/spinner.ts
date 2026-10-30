import { atProperty, keyframes, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import {
  mapTone,
  semanticTone,
  subtleBackgroundColor,
  toneWithDefault,
} from '../shared/semanticTone';
import { controlSize, fillAppearance } from '../shared/variantAxes';
import { atForcedColors, atReducedMotion } from '../theme/conditions';

const spin = keyframes.create('var-ui-spin', {
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

/**
 * Indeterminate loading ring. Use `progressBar` when progress is measurable.
 */
export const spinner = typestyles.recipe({
  name: 'spinner',
  layer: 'components',
  slots: ['root', 'indicator'],
  variants: {
    size: controlSize,
    tone: toneWithDefault('accent'),
    appearance: fillAppearance,
  },
  vars: {
    indicatorColor: {
      ...atProperty.color,
      value: t.color.tone.accent.foreground.var,
    },
    trackColor: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    size: { ...atProperty.length, value: '20px' },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {},
        indicator: {
          display: 'inline-block',
          width: vars.size.var,
          height: vars.size.var,
          borderRadius: '50%',
          borderWidth: t.borderWidth.thick.var,
          borderStyle: 'solid',
          borderColor: vars.trackColor.var,
          borderTopColor: vars.indicatorColor.var,
          animation: `${spin} 800ms linear infinite`,
          // Slower rather than static: a frozen ring would no longer read as "loading".
          ...atReducedMotion({ animationDuration: '2400ms' }),
          // Forced colors replaces every border color; keep the arc distinguishable from the track.
          ...atForcedColors({ borderColor: 'GrayText', borderTopColor: 'Highlight' }),
        },
      },
      variants: {
        size: {
          sm: { indicator: { [vars.size.name]: '14px' } },
          md: { indicator: { [vars.size.name]: '20px' } },
          lg: { indicator: { [vars.size.name]: '32px', borderWidth: '3px' } },
        },
        tone: mapTone((key) => ({
          indicator: {
            [vars.indicatorColor.name]:
              key === 'neutral' ? t.color.text.secondary.var : semanticTone[key].foreground,
          },
        })),
        appearance: {
          solid: { indicator: {} },
          subtle: {
            indicator: {
              [vars.trackColor.name]: subtleBackgroundColor(vars.indicatorColor.var),
            },
          },
        },
      },
    };
  },
});

export type SpinnerVariantProps = RecipeVariants<typeof spinner>;
