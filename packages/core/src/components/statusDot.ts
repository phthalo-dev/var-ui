import { keyframes } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import {
  semanticTone,
  type ButtonTone,
  type SemanticToneKey,
  type ToneAppearance,
} from './semanticTone';

const pulse = keyframes.create('var-ui-status-pulse', {
  from: { boxShadow: '0 0 0 0 color-mix(in srgb, currentColor 45%, transparent)' },
  to: { boxShadow: '0 0 0 6px color-mix(in srgb, currentColor 0%, transparent)' },
});

function toneColor(key: SemanticToneKey) {
  return { color: semanticTone[key].foreground };
}

/**
 * Semantic presence/status indicator. Pair with visible text or an
 * `aria-label` on the host element — the dot alone is decorative.
 */
export const statusDot = typestyles.recipe(
  'status-dot',
  (c) => {
    const v = c.vars({
      size: { value: '8px', syntax: '<length>' },
    });
    return {
      base: {
        display: 'inline-block',
        width: v.size.var,
        height: v.size.var,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
        color: t.color.text.secondary.var,
        flexShrink: 0,
        boxSizing: 'border-box',
      },
      variants: {
        tone: {
          neutral: {},
          accent: toneColor('accent'),
          success: toneColor('success'),
          warning: toneColor('warning'),
          danger: toneColor('danger'),
          info: toneColor('info'),
        },
        appearance: {
          filled: {},
          outline: {
            backgroundColor: 'transparent',
            borderWidth: t.borderWidth.thick.var,
            borderStyle: 'solid',
            borderColor: 'currentColor',
          },
          subtle: {
            backgroundColor: 'color-mix(in srgb, currentColor 35%, transparent)',
          },
        },
        pulse: {
          true: {
            animation: `${pulse} 1400ms ease-out infinite`,
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          },
          false: {},
        },
      },
      defaultVariants: { tone: 'neutral', appearance: 'filled', pulse: 'false' },
    };
  },
  { layer: 'components' },
);

export type StatusDotRecipeProps = NonNullable<Parameters<typeof statusDot>[0]>;

export type StatusDotAppearance = Extract<ToneAppearance, 'filled' | 'outline' | 'subtle'>;

export type StatusDotVariantProps = {
  tone?: ButtonTone;
  appearance?: StatusDotAppearance;
  pulse?: boolean;
};

export const statusDotVariantPropDocs = [
  { name: 'tone', type: 'ButtonTone', required: false },
  { name: 'appearance', type: 'StatusDotAppearance', required: false },
  { name: 'pulse', type: 'boolean', required: false },
] as const satisfies ReadonlyArray<{
  name: keyof StatusDotVariantProps;
  type: string;
  required: false;
}>;
