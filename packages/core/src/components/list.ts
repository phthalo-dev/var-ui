import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { density } from '../shared/variantAxes';

const listStyle = variant.enum(['none', 'disc', 'decimal'], { default: 'none' });
const listHasDividers = variant.boolean({ default: false });

/**
 * Generic vertical list chrome for settings rows, member lists, and static
 * content. Pair with the React `List` compound, which drives variant data
 * attributes on the root and interactive/disabled state on items.
 *
 * ```tsx
 * const s = list({ density: 'compact', hasDividers: true });
 * <ul className={s.root.className} {...s.root.attrs}>
 *   <li className={s.item.className} data-interactive>
 *     <span className={s.start.className}>…</span>
 *     <span className={s.label.className}>Ada</span>
 *     <span className={s.description.className}>Admin</span>
 *     <span className={s.end.className}>…</span>
 *   </li>
 * </ul>
 * ```
 */
export const list = typestyles.recipe({
  name: 'list',
  layer: 'components',
  slots: [
    'root',
    'header',
    'item',
    'label',
    'description',
    'start',
    'end',
    'divider',
    'overlayLink',
  ],
  variants: {
    density,
    listStyle,
    hasDividers: listHasDividers,
  },
  vars: {
    root: { ...atProperty.color, value: 'transparent' },
    labelColor: { ...atProperty.color, value: t.color.text.primary.var },
    descriptionColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    hoverBg: {
      ...atProperty.color,
      value: t.color.background.subtle.var,
    },
    pressBg: {
      ...atProperty.color,
      value: t.color.background.elevated.var,
    },
    dividerColor: { ...atProperty.color, value: t.color.border.default.var },
    itemPaddingY: { ...atProperty.length, value: t.space[2].var },
    itemPaddingX: { ...atProperty.length, value: t.space[3].var },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: vars.root.var,
          '&[data-list-style="disc"]': { listStyle: 'disc', paddingLeft: t.space[5].var },
          '&[data-list-style="decimal"]': { listStyle: 'decimal', paddingLeft: t.space[5].var },
        },
        header: {
          fontSize: t.fontSize.sm.var,
          fontWeight: t.fontWeight.semibold.var,
          color: vars.labelColor.var,
          padding: `${t.space[2].var} ${vars.itemPaddingX.var}`,
        },
        item: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[3].var,
          position: 'relative',
          padding: `${vars.itemPaddingY.var} ${vars.itemPaddingX.var}`,
          color: vars.labelColor.var,
          '&[data-interactive]': { cursor: 'pointer' },
          '&[data-interactive]:hover': { backgroundColor: vars.hoverBg.var },
          '&[data-interactive]:active': { backgroundColor: vars.pressBg.var },
          '&[data-disabled]': { opacity: t.opacity.disabled.var, pointerEvents: 'none' },
          '[data-has-dividers] >&:not(:last-child)': {
            borderBottomWidth: t.borderWidth.default.var,
            borderBottomStyle: 'solid',
            borderBottomColor: vars.dividerColor.var,
          },
        },
        label: {
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.medium.var,
          color: vars.labelColor.var,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        description: {
          fontSize: t.fontSize.sm.var,
          color: vars.descriptionColor.var,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        start: { display: 'flex', flexShrink: 0, alignItems: 'center' },
        end: { display: 'flex', flexShrink: 0, alignItems: 'center', marginLeft: 'auto' },
        divider: { display: 'none' },
        overlayLink: {
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          margin: 0,
          padding: 0,
          border: 'none',
          background: 'transparent',
          cursor: 'inherit',
          textDecoration: 'none',
        },
      },
      variants: {
        density: {
          compact: {
            item: {
              [vars.itemPaddingY.name]: t.space[1].var,
              [vars.itemPaddingX.name]: t.space[2].var,
            },
          },
          balanced: {},
          spacious: {
            item: {
              [vars.itemPaddingY.name]: t.space[3].var,
              [vars.itemPaddingX.name]: t.space[4].var,
            },
          },
        },
        listStyle: { none: {}, disc: {}, decimal: {} },
        hasDividers: { true: {}, false: {} },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type ListVariantProps = RecipeVariants<typeof list>;
