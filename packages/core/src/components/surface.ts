import { variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

const surfacePadding = variant.enum(['sm', 'md'], { default: 'md' });

/**
 * Bordered content box — a single-slot surface without title/body slots (see `card`).
 *
 * ```tsx
 * <div className={surface({ padding: 'md' })}>…</div>
 * ```
 */
export const surface = typestyles.recipe(
  'surface',
  {
    variants: {
      padding: surfacePadding,
    },
  },
  (c) => {
    const v = c.vars({
      padding: {
        value: t.space[4].var,
        syntax: '<length>',
      },
    });
    return {
      base: {
        backgroundColor: t.color.background.surface.var,
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: t.color.border.default.var,
        borderRadius: t.radius.md.var,
        padding: v.padding.var,
      },
      variants: {
        padding: {
          sm: { [v.padding.name]: t.space[2].var },
          md: { [v.padding.name]: t.space[4].var },
        },
      },
    };
  },
  { layer: 'components' },
);

/** Visual props derived from the schema. */
export type SurfaceVariantProps = RecipeVariants<typeof surface>;
