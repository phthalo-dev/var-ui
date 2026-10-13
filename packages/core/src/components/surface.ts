import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Bordered content box — a single-slot surface without title/body slots (see `card`).
 *
 * ```tsx
 * <div className={surface({ padding: 'md' })}>…</div>
 * ```
 */
export const surface = typestyles.recipe(
  'surface',
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
      defaultVariants: {
        padding: 'md',
      },
    };
  },
  { layer: 'components' },
);
