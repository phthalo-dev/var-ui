import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { density } from './variantAxes';
import { type RecipeVariants } from 'typestyles';

/**
 * Hierarchical expandable list chrome for file explorers and nested navigation.
 * Pair with the React `Tree` compound, which drives density on the root,
 * `data-expanded` on toggles, `data-selected` / `data-disabled` on rows, and
 * nests child items inside the `group` slot.
 *
 * `item` (the `<li role="treeitem">`) owns focus — `tabIndex` and the click
 * handler both live there, not on `row` — so a nested `group` stays a real
 * DOM descendant of its owning treeitem for assistive tech, while `row`
 * stays a plain visual box scoping hover/selected/disabled paint to just
 * that row (not the expanded subtree beneath it).
 *
 * ```tsx
 * const s = tree({ density: 'compact' });
 * <ul className={s.root.className} {...s.root.attrs} role="tree">
 *   <li className={s.item.className} role="treeitem" tabIndex={0}>
 *     <div className={s.row.className}>
 *       <button className={s.toggle.className} data-expanded type="button" />
 *       <span className={s.start.className}>…</span>
 *       <span className={s.label.className}>src</span>
 *       <span className={s.description.className}>Directory</span>
 *       <span className={s.end.className}>…</span>
 *     </div>
 *     <ul className={s.group.className} role="group">…</ul>
 *   </li>
 * </ul>
 * ```
 */
export const tree = typestyles.recipe(
  'tree',
  {
    slots: ['root', 'item', 'row', 'toggle', 'label', 'description', 'group', 'start', 'end'],
    variants: { density },
  },
  (c) => {
    const v = c.vars({
      labelColor: { value: t.color.text.primary.var, syntax: '<color>' },
      descriptionColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      hoverBg: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      selectedBg: {
        value: t.color.tone.accent.subtleBackground.var,
        syntax: '<color>',
      },
      indentSize: { value: t.space[4].var, syntax: '<length>' },
      rowPaddingY: { value: t.space[2].var, syntax: '<length>' },
      rowPaddingX: { value: t.space[2].var, syntax: '<length>' },
    });
    return {
      base: {
        root: {
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
        },
        item: {
          listStyle: 'none',
          margin: 0,
          padding: 0,
          outline: 'none',
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '2px',
            borderRadius: t.radius.md.var,
          },
        },
        row: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[2].var,
          padding: `${v.rowPaddingY.var} ${v.rowPaddingX.var}`,
          borderRadius: t.radius.md.var,
          color: v.labelColor.var,
          cursor: 'default',
          minWidth: 0,
          '&:hover': { backgroundColor: v.hoverBg.var },
          '&[data-selected]': {
            backgroundColor: v.selectedBg.var,
            fontWeight: t.fontWeight.medium.var,
          },
          '&[data-disabled]': { opacity: t.opacity.disabled.var, pointerEvents: 'none' },
        },
        toggle: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: 'none',
          background: 'none',
          padding: 0,
          cursor: 'pointer',
          color: 'inherit',
          transition: 'transform 0.15s ease',
          // Expand rotates toward "down". In RTL the chevron is mirrored
          // (scaleX(-1) on the icon), so +90deg would point up — use -90deg.
          '&[data-expanded]': { transform: 'rotate(90deg)' },
          '[dir="rtl"] &[data-expanded]': { transform: 'rotate(-90deg)' },
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
        group: {
          listStyle: 'none',
          margin: 0,
          padding: 0,
          paddingLeft: v.indentSize.var,
        },
        start: { display: 'flex', flexShrink: 0, alignItems: 'center' },
        end: { display: 'flex', flexShrink: 0, alignItems: 'center', marginLeft: 'auto' },
      },
      variants: {
        density: {
          compact: {
            row: {
              [v.rowPaddingY.name]: t.space[1].var,
              [v.rowPaddingX.name]: t.space[2].var,
            },
          },
          balanced: {},
          spacious: {
            row: {
              [v.rowPaddingY.name]: t.space[3].var,
              [v.rowPaddingX.name]: t.space[4].var,
            },
          },
        },
      },
    };
  },
  { layer: 'components' },
);

/** Visual props derived from the schema. */
export type TreeVariantProps = RecipeVariants<typeof tree>;
