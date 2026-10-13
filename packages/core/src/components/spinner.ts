import { keyframes } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import {
  semanticTone,
  subtleBackgroundColor,
  type ButtonTone,
  type ControlSize,
  type SpinnerAppearance,
} from './semanticTone';

const spin = keyframes.create('var-ui-spin', {
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

/**
 * Indeterminate loading ring. Use `progressBar` when progress is measurable.
 */
export const spinner = typestyles.recipe(
  'spinner',
  (c) => {
    const v = c.vars({
      indicatorColor: {
        value: t.color.tone.accent.foreground.var,
        syntax: '<color>',
      },
      trackColor: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      size: { value: '20px', syntax: '<length>' },
    });
    return {
      slots: ['root', 'indicator'],
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
        tone: {
          accent: { indicator: { [v.indicatorColor.name]: semanticTone.accent.foreground } },
          success: { indicator: { [v.indicatorColor.name]: semanticTone.success.foreground } },
          warning: { indicator: { [v.indicatorColor.name]: semanticTone.warning.foreground } },
          danger: { indicator: { [v.indicatorColor.name]: semanticTone.danger.foreground } },
          info: { indicator: { [v.indicatorColor.name]: semanticTone.info.foreground } },
          neutral: { indicator: { [v.indicatorColor.name]: t.color.text.secondary.var } },
        },
        appearance: {
          solid: { indicator: {} },
          subtle: {
            indicator: {
              [v.trackColor.name]: subtleBackgroundColor(v.indicatorColor.var),
            },
          },
        },
      },
      defaultVariants: { size: 'md', tone: 'accent', appearance: 'solid' },
    };
  },
  { layer: 'components' },
);

export type SpinnerRecipeProps = NonNullable<Parameters<typeof spinner>[0]>;

export type SpinnerVariantProps = {
  size?: ControlSize;
  tone?: ButtonTone;
  appearance?: SpinnerAppearance;
};

export const spinnerVariantPropDocs = [
  { name: 'size', type: 'ControlSize', required: false },
  { name: 'tone', type: 'ButtonTone', required: false },
  { name: 'appearance', type: 'SpinnerAppearance', required: false },
] as const satisfies ReadonlyArray<{
  name: keyof SpinnerVariantProps;
  type: string;
  required: false;
}>;
