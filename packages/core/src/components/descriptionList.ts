import { variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

const descriptionListColumns = variant.enum(['single', 'multi'], { default: 'single' });
const descriptionListLabelPosition = variant.enum(['start', 'top'], { default: 'start' });

/**
 * Semantic key/value display chrome for `<dl>` / `<dt>` / `<dd>` pairs. Pair with
 * the React `DescriptionList` compound, which drives variant data attributes on
 * the root and item slots and sets `--var-ui-description-list-columns` for numeric
 * column counts.
 *
 * ```tsx
 * const s = descriptionList({ columns: 'single', labelPosition: 'start' });
 * <dl className={s.root.className} {...s.root.attrs}>
 *   <div className={s.title.className}>Details</div>
 *   <div className={s.item.className}>
 *     <dt className={s.term.className}>Owner</dt>
 *     <dd className={s.details.className}>Ada</dd>
 *   </div>
 * </dl>
 * ```
 */
export const descriptionList = typestyles.recipe(
  'description-list',
  {
    slots: ['root', 'title', 'item', 'term', 'details', 'toggle'],
    variants: {
      columns: descriptionListColumns,
      labelPosition: descriptionListLabelPosition,
    },
  },
  (c) => {
    const v = c.vars({
      termColor: { value: t.color.text.secondary.var, syntax: '<color>' },
      detailsColor: { value: t.color.text.primary.var, syntax: '<color>' },
      gap: { value: t.space[4].var, syntax: '<length>' },
      termWidth: { value: '8rem', syntax: '<length>' },
      columns: { value: '2', syntax: '<integer>' },
    });
    return {
      base: {
        root: {
          display: 'grid',
          gap: v.gap.var,
          margin: 0,
        },
        title: {
          gridColumn: '1 / -1',
          margin: 0,
          fontSize: t.fontSize.sm.var,
          fontWeight: t.fontWeight.semibold.var,
          color: v.termColor.var,
        },
        item: {
          display: 'grid',
          gap: t.space[1].var,
          minWidth: 0,
        },
        term: {
          margin: 0,
          fontSize: t.fontSize.sm.var,
          fontWeight: t.fontWeight.medium.var,
          color: v.termColor.var,
        },
        details: {
          margin: 0,
          fontSize: t.fontSize.sm.var,
          color: v.detailsColor.var,
          minWidth: 0,
        },
        toggle: {
          gridColumn: '1 / -1',
          justifySelf: 'start',
        },
      },
      variants: {
        columns: {
          single: {
            root: { gridTemplateColumns: '1fr' },
          },
          multi: {
            root: {
              gridTemplateColumns: `repeat(${v.columns.var}, minmax(0, 1fr))`,
            },
          },
        },
        labelPosition: {
          start: {
            item: {
              gridTemplateColumns: `${v.termWidth.var} 1fr`,
              alignItems: 'baseline',
            },
          },
          top: {
            item: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            },
          },
        },
      },
    };
  },
  { layer: 'components' },
);

/** Visual props derived from the schema. */
export type DescriptionListVariantProps = RecipeVariants<typeof descriptionList>;
