import { atProperty, keyframes, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { atForcedColors, atReducedMotion } from '../theme/conditions';
import { forced } from '../internal/forcedColors';
import { border } from '../internal/border';
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
export const statusDot = typestyles.recipe({
  name: 'status-dot',
  layer: 'components',
  variants: {
    tone,
    appearance: statusDotAppearance,
    pulse: variant.boolean({ default: false }),
  },
  vars: {
    size: { ...atProperty.length, value: '8px' },
  },
  styles: ({ vars }) => {
    return {
      base: {
        display: 'inline-block',
        width: vars.size.var,
        height: vars.size.var,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
        color: t.color.text.secondary.var,
        flexShrink: 0,
        boxSizing: 'border-box',
        // The dot is a `currentColor` background, which forced colors replaces with Canvas.
        ...atForcedColors(forced.fill),
      },
      variants: {
        tone: mapTone((key) => (key === 'neutral' ? {} : toneColor(key))),
        appearance: {
          filled: {},
          outline: {
            backgroundColor: 'transparent',
            ...border('currentColor', t.borderWidth.thick.var),
            ...atForcedColors({ backgroundColor: 'transparent' }),
          },
          subtle: {
            backgroundColor: 'color-mix(in srgb, currentColor 35%, transparent)',
            ...atForcedColors(forced.track),
          },
        },
        pulse: {
          true: {
            animation: `${pulse} 1400ms ease-out infinite`,
            ...atReducedMotion({ animation: 'none' }),
          },
          false: {},
        },
      },
    };
  },
});

export type StatusDotVariantProps = RecipeVariants<typeof statusDot>;
