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

const spin = keyframes.create('var-ui-spin', {
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

/**
 * Indeterminate loading ring. Use `progressBar` when progress is measurable.
 */
export const spinner = typestyles.recipe(
  'spinner',
  {
    slots: ['root', 'indicator'],
    variants: {
      size: controlSize,
      tone: toneWithDefault('accent'),
      appearance: fillAppearance,
    },
  },
  (c) => {
    const v = c.vars({
      indicatorColor: {
        ...atProperty.color,
        value: t.color.tone.accent.foreground.var,
      },
      trackColor: {
        ...atProperty.color,
        value: t.color.border.default.var,
      },
      size: { ...atProperty.length, value: '20px' },
    });
    return {
      base: {
        root: {},
        indicator: {
          display: 'inline-block',
          width: v.size.var,
          height: v.size.var,
          borderRadius: '50%',
          borderWidth: t.borderWidth.thick.var,
          borderStyle: 'solid',
          borderColor: v.trackColor.var,
          borderTopColor: v.indicatorColor.var,
          animation: `${spin} 800ms linear infinite`,
          '@media (prefers-reduced-motion: reduce)': {
            animationDuration: '2400ms',
          },
        },
      },
      variants: {
        size: {
          sm: { indicator: { [v.size.name]: '14px' } },
          md: { indicator: { [v.size.name]: '20px' } },
          lg: { indicator: { [v.size.name]: '32px', borderWidth: '3px' } },
        },
        tone: mapTone((key) => ({
          indicator: {
            [v.indicatorColor.name]:
              key === 'neutral' ? t.color.text.secondary.var : semanticTone[key].foreground,
          },
        })),
        appearance: {
          solid: { indicator: {} },
          subtle: {
            indicator: {
              [v.trackColor.name]: subtleBackgroundColor(v.indicatorColor.var),
            },
          },
        },
      },
    };
  },
  { layer: 'components' },
);

export type SpinnerVariantProps = RecipeVariants<typeof spinner>;
