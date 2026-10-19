import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { controlSize } from './variantAxes';
import { type RecipeVariants } from 'typestyles';

/**
 * Square media preview with an optional floating remove control.
 *
 * ```tsx
 * const s = thumbnail({ size: 'md' });
 * <span className={s.root}><img className={s.image} … /></span>
 * ```
 */
export const thumbnail = typestyles.recipe(
  'thumbnail',
  {
    slots: ['root', 'image', 'dismiss'],
    variants: {
      size: controlSize,
    },
  },
  (c) => {
    const v = c.vars({
      size: { value: '64px', syntax: '<length>' },
      border: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
    });
    return {
      base: {
        root: {
          position: 'relative',
          display: 'inline-block',
          width: v.size.var,
          height: v.size.var,
          borderRadius: t.radius.md.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: v.border.var,
        },
        image: {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: 'inherit',
        },
        dismiss: {
          position: 'absolute',
          top: `calc(${t.space[2].var} * -1)`,
          right: `calc(${t.space[2].var} * -1)`,
          display: 'grid',
          placeItems: 'center',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: v.border.var,
          backgroundColor: t.color.background.surface.var,
          cursor: 'pointer',
          padding: 0,
          '&:hover': { backgroundColor: t.color.background.subtle.var },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '1px',
          },
        },
      },
      variants: {
        size: {
          sm: { root: { [v.size.name]: '48px' } },
          md: { root: { [v.size.name]: '64px' } },
          lg: { root: { [v.size.name]: '96px' } },
        },
      },
    };
  },
  { layer: 'components' },
);

/** Visual props derived from the schema. */
export type ThumbnailVariantProps = RecipeVariants<typeof thumbnail>;
