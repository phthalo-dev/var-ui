import { keyframes, variant } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import {
  mapTone,
  semanticTone,
  tone,
  type SemanticToneKey,
  type Tone,
  type ToneAppearance,
} from './semanticTone';

const pulse = keyframes.create('var-ui-status-pulse', {
  from: { boxShadow: '0 0 0 0 color-mix(in srgb, currentColor 45%, transparent)' },
  to: { boxShadow: '0 0 0 6px color-mix(in srgb, currentColor 0%, transparent)' },
});

const statusDotAppearance = variant.enum(['filled', 'outline', 'subtle'], { default: 'filled' });

function toneColor(key: SemanticToneKey) {
  return { color: semanticTone[key].foreground };
}

/**
 * Semantic presence/status indicator. Pair with visible text or an
 * `aria-label` on the host element — the dot alone is decorative.
 */
export const statusDot = typestyles.recipe(
  'status-dot',
  {
    variants: {
      tone,
      appearance: statusDotAppearance,
      pulse: variant.boolean({ default: false }),
    },
  },
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
        tone: mapTone((key) => (key === 'neutral' ? {} : toneColor(key))),
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
    };
  },
  { layer: 'components' },
);

export type StatusDotRecipeProps = NonNullable<Parameters<typeof statusDot>[0]>;

export type StatusDotAppearance = Extract<ToneAppearance, 'filled' | 'outline' | 'subtle'>;

export type StatusDotVariantProps = {
  tone?: Tone;
  appearance?: StatusDotAppearance;
  pulse?: boolean;
};

export const statusDotVariantPropDocs = [
  { name: 'tone', type: 'Tone', required: false },
  { name: 'appearance', type: 'StatusDotAppearance', required: false },
  { name: 'pulse', type: 'boolean', required: false },
] as const satisfies ReadonlyArray<{
  name: keyof StatusDotVariantProps;
  type: string;
  required: false;
}>;
