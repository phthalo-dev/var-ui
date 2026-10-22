import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { controlSize } from '../shared/variantAxes';
import { atProperty, type RecipeVariants } from 'typestyles';

/**
 * Square media preview with an optional floating remove control.
 *
 * ```tsx
 * const s = thumbnail({ size: 'md' });
 * <span className={s.root}><img className={s.image} … /></span>
 * ```
 */
export const thumbnail = typestyles.recipe({
  name: 'thumbnail',
  layer: 'components',
  slots: ['root', 'image', 'dismiss'],
  variants: {
    size: controlSize,
  },
  vars: {
    size: { ...atProperty.length, value: '64px' },
    border: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          position: 'relative',
          display: 'inline-block',
          width: vars.size.var,
          height: vars.size.var,
          borderRadius: t.radius.md.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.border.var,
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
          borderColor: vars.border.var,
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
          sm: { root: { [vars.size.name]: '48px' } },
          md: { root: { [vars.size.name]: '64px' } },
          lg: { root: { [vars.size.name]: '96px' } },
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type ThumbnailVariantProps = RecipeVariants<typeof thumbnail>;
