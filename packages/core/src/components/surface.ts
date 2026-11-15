import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { border } from '../internal/border';
import { gapValues } from '../shared/variantAxes';

/**
 * Full `space` scale, 1:1 — `md` is always `space.md`, wherever it is used
 * (#133). Includes `none` for zero padding.
 */
const surfacePadding = variant.enum(gapValues, { default: 'md' });

/**
 * Bordered content box — a single-slot surface without title/body slots (see `card`).
 *
 * ```tsx
 * <div className={surface({ padding: 'md' })}>…</div>
 * ```
 */
export const surface = typestyles.recipe({
  name: 'surface',
  layer: 'components',
  variants: {
    padding: surfacePadding,
  },
  vars: {
    padding: {
      ...atProperty.length,
      value: t.space.md.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        backgroundColor: t.color.background.surface.var,
        ...border(),
        borderRadius: t.radius.md.var,
        padding: vars.padding.var,
      },
      variants: {
        // Step names map 1:1 to the space tokens (#133).
        padding: {
          none: { [vars.padding.name]: t.space.none.var },
          xxs: { [vars.padding.name]: t.space.xxs.var },
          xs: { [vars.padding.name]: t.space.xs.var },
          sm: { [vars.padding.name]: t.space.sm.var },
          md: { [vars.padding.name]: t.space.md.var },
          lg: { [vars.padding.name]: t.space.lg.var },
          xl: { [vars.padding.name]: t.space.xl.var },
          xxl: { [vars.padding.name]: t.space.xxl.var },
          xxxl: { [vars.padding.name]: t.space.xxxl.var },
          xxxxl: { [vars.padding.name]: t.space.xxxxl.var },
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type SurfaceVariantProps = RecipeVariants<typeof surface>;
