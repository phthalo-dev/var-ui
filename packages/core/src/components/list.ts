import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

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
export const list = typestyles.recipe(
  'list',
  (c) => {
    const v = c.vars({
      root: { value: 'transparent', syntax: '<color>' },
      labelColor: { value: t.color.text.primary.var, syntax: '<color>' },
      descriptionColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      hoverBg: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      pressBg: {
        value: t.color.background.elevated.var,
        syntax: '<color>',
      },
      dividerColor: { value: t.color.border.default.var, syntax: '<color>' },
      itemPaddingY: { value: t.space[2].var, syntax: '<length>' },
      itemPaddingX: { value: t.space[3].var, syntax: '<length>' },
    });
    return {
      slots: ['root', 'header', 'item', 'label', 'description', 'start', 'end', 'divider'],
      base: {
        root: {
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: v.root.var,
          '&[data-list-style="disc"]': { listStyle: 'disc', paddingLeft: t.space[5].var },
          '&[data-list-style="decimal"]': { listStyle: 'decimal', paddingLeft: t.space[5].var },
        },
        header: {
          fontSize: t.fontSize.sm.var,
          fontWeight: t.fontWeight.semibold.var,
          color: v.labelColor.var,
          padding: `${t.space[2].var} ${v.itemPaddingX.var}`,
        },
        item: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[3].var,
          position: 'relative',
          padding: `${v.itemPaddingY.var} ${v.itemPaddingX.var}`,
          color: v.labelColor.var,
          '&[data-interactive]': { cursor: 'pointer' },
          '&[data-interactive]:hover': { backgroundColor: v.hoverBg.var },
          '&[data-interactive]:active': { backgroundColor: v.pressBg.var },
          '&[data-disabled]': { opacity: t.opacity.disabled.var, pointerEvents: 'none' },
          '[data-has-dividers] >&:not(:last-child)': {
            borderBottomWidth: t.borderWidth.default.var,
            borderBottomStyle: 'solid',
            borderBottomColor: v.dividerColor.var,
          },
        },
        label: {
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.medium.var,
          color: v.labelColor.var,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        description: {
          fontSize: t.fontSize.sm.var,
          color: v.descriptionColor.var,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        start: { display: 'flex', flexShrink: 0, alignItems: 'center' },
        end: { display: 'flex', flexShrink: 0, alignItems: 'center', marginLeft: 'auto' },
        divider: { display: 'none' },
      },
      variants: {
        density: {
          compact: {
            item: {
              [v.itemPaddingY.name]: t.space[1].var,
              [v.itemPaddingX.name]: t.space[2].var,
            },
          },
          balanced: {},
          spacious: {
            item: {
              [v.itemPaddingY.name]: t.space[3].var,
              [v.itemPaddingX.name]: t.space[4].var,
            },
          },
        },
        listStyle: { none: {}, disc: {}, decimal: {} },
        hasDividers: { true: {}, false: {} },
      },
      defaultVariants: { density: 'balanced', listStyle: 'none', hasDividers: false },
    };
  },
  { layer: 'components' },
);
