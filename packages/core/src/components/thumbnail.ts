import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { border } from '../internal/border';
import { focusRing } from '../internal/focusRing';
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
    size: { ...atProperty.length, value: t.size.media.md.var },
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
          ...border(vars.border.var),
        },
        image: {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: 'inherit',
        },
        dismiss: {
          position: 'absolute',
          top: `calc(${t.space.xs.var} * -1)`,
          insetInlineEnd: `calc(${t.space.xs.var} * -1)`,
          display: 'grid',
          placeItems: 'center',
          width: '1.25rem',
          height: '1.25rem',
          borderRadius: '50%',
          ...border(vars.border.var),
          backgroundColor: t.color.background.surface.var,
          cursor: 'pointer',
          padding: 0,
          '&:hover': { backgroundColor: t.color.background.subtle.var },
          '&:focus-visible': {
            ...focusRing,
          },
        },
      },
      variants: {
        size: {
          sm: { root: { [vars.size.name]: t.size.media.sm.var } },
          md: { root: { [vars.size.name]: t.size.media.md.var } },
          lg: { root: { [vars.size.name]: t.size.media.lg.var } },
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type ThumbnailVariantProps = RecipeVariants<typeof thumbnail>;
