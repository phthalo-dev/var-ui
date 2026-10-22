import { atProperty, keyframes, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

const shimmer = keyframes.create('var-ui-shimmer', {
  from: { backgroundPosition: '200% 0' },
  to: { backgroundPosition: '-200% 0' },
});

/**
 * Loading placeholder. Size with inline width/height; pick `shape` to match
 * the content it stands in for. Reduced-motion users get a static tint.
 *
 * ```tsx
 * <div className={skeleton({ shape: 'text' })} style={{ width: '12ch' }} />
 * ```
 */
export const skeleton = typestyles.recipe({
  name: 'skeleton',
  layer: 'components',
  variants: {
    shape: variant.enum(['text', 'rect', 'circle'], { default: 'text' }),
  },
  vars: {
    baseColor: {
      ...atProperty.color,
      value: t.color.background.subtle.var,
    },
    highlightColor: {
      ...atProperty.color,
      value: t.color.background.surface.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        display: 'block',
        backgroundColor: vars.baseColor.var,
        backgroundImage: `linear-gradient(90deg, ${vars.baseColor.var} 25%, ${vars.highlightColor.var} 50%, ${vars.baseColor.var} 75%)`,
        backgroundSize: '200% 100%',
        animation: `${shimmer} 1600ms ease-in-out infinite`,
        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none',
          backgroundImage: 'none',
        },
      },
      variants: {
        shape: {
          text: { height: '1em', borderRadius: t.radius.sm.var },
          rect: { borderRadius: t.radius.md.var },
          circle: { borderRadius: '50%', aspectRatio: '1' },
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type SkeletonVariantProps = RecipeVariants<typeof skeleton>;
