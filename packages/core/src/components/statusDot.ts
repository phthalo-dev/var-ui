import { atProperty, keyframes, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { mapTone, semanticTone, tone, type SemanticToneKey } from '../shared/semanticTone';

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
      size: { ...atProperty.length, value: '8px' },
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

export type StatusDotVariantProps = RecipeVariants<typeof statusDot>;
