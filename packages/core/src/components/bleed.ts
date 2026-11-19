import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';

/**
 * How far a bleed reaches: from its parent's content edge to the nearest inline-size query
 * container's edge, plus `gutter` (the container's own inline padding, which `cqw` excludes).
 * The parent must be centred in that container.
 */
const reach = (gutter: string) => `calc((100cqw - 100%) / 2 + ${gutter})`;

/**
 * Full-bleed styles for a recipe slot: the element spans the frame edge to edge, and with
 * `align: 'content'` (the default) pads its own content back onto the page column.
 *
 * ```ts
 * pageBar: { ...bleedStyle({ gutter: page.vars.gutter.var }), borderBlockEnd: … }
 * ```
 */
export function bleedStyle({
  gutter = '0px',
  align = 'content',
}: { gutter?: string; align?: 'content' | 'edge' } = {}) {
  const r = reach(gutter);
  return {
    marginInline: `calc(-1 * ${r})`,
    ...(align === 'content' ? { paddingInline: r } : {}),
  };
}

/**
 * A full-bleed band inside a padded, centred frame: a page header strip, a banner, a wide image.
 * The frame (any ancestor) must be an inline-size container (`container-type: inline-size`);
 * set `--var-ui-bleed-gutter` to that container's inline padding.
 *
 * ```html
 * <main style="container-type: inline-size; padding-inline: 2rem">
 *   <article style="max-width: 40rem; margin-inline: auto">
 *     <div class="var-ui-bleed" style="--var-ui-bleed-gutter: 2rem">…</div>
 * ```
 */
export const bleed = typestyles.recipe({
  name: 'bleed',
  layer: 'components',
  variants: {
    /** `content`: the band bleeds, its children stay on the page column. `edge`: both bleed. */
    align: variant.enum(['content', 'edge'], { default: 'content' }),
  },
  vars: {
    /** The container's own inline padding (`100cqw` is its content box). */
    gutter: { ...atProperty.length, value: '0px' },
  },
  styles: ({ vars }) => ({
    base: {
      boxSizing: 'border-box',
      marginInline: `calc(-1 * ${reach(vars.gutter.var)})`,
    },
    variants: {
      align: {
        content: { paddingInline: reach(vars.gutter.var) },
        edge: {},
      },
    },
  }),
});

/** Visual props derived from the schema. */
export type BleedVariantProps = RecipeVariants<typeof bleed>;
