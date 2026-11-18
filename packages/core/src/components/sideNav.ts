import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { borderSide } from '../internal/border';
import { forced } from '../internal/forcedColors';
import { transitionOf } from '../internal/motion';
import { atForcedColors } from '../theme/conditions';

/** Icon-only rail width in px when the nav is collapsed. */
export const SIDE_NAV_COLLAPSED_WIDTH = 56;

/** Internal CSS variables for theme overrides (`vars` on theme `components`). */
const sideNavVarDefinitions = {
  background: {
    ...atProperty.color,
    value: t.color.background.surface.var,
  },
  border: {
    ...atProperty.color,
    value: t.color.border.default.var,
  },
  headingColor: {
    ...atProperty.color,
    value: t.color.text.primary.var,
  },
  sectionTitleColor: {
    ...atProperty.color,
    value: t.color.text.secondary.var,
  },
  itemColor: {
    ...atProperty.color,
    value: t.color.navItem.foreground.var,
  },
  itemHoverBackground: {
    ...atProperty.color,
    value: t.color.navItem.hoverBackground.var,
  },
  itemSelectedBackground: {
    ...atProperty.color,
    value: t.color.navItem.selectedBackground.var,
  },
  itemSelectedColor: {
    ...atProperty.color,
    value: t.color.navItem.selectedForeground.var,
  },
  width: { syntax: '*', value: 'auto' },
} as const;

/**
 * Persistent side navigation chrome: sticky header, scrollable section list,
 * sticky footer, and a collapsible/resizable root. Pair with the React
 * `SideNav` compound, which drives `data-collapsed` on the root and
 * `data-selected` on items (resize handle reuses the `resizeHandle` recipe).
 *
 * ```tsx
 * const s = sideNav();
 * <nav className={s.root} data-collapsed={isCollapsed || undefined}>
 *   <div className={s.stickyTop}>
 *     <div className={s.heading}>…</div>
 *     <div className={s.topContent}>…</div>
 *   </div>
 *   <ScrollArea className={s.scrollArea}>
 *     <div className={s.scrollable}>
 *     <div className={s.section}>
 *       <div className={s.sectionTitle}>Main</div>
 *       <a className={s.item} data-selected>
 *         <span className={s.itemLabel}>Dashboard</span>
 *       </a>
 *     </div>
 *   </ScrollArea>
 *   <div className={s.footer}>
 *     <div className={s.footerIcons}>…</div>
 *     <button className={s.collapseButton} />
 *   </div>
 * </nav>
 * ```
 */

export const sideNav = typestyles.recipe({
  name: 'side-nav',
  layer: 'components',
  slots: [
    'root',
    'stickyTop',
    'topContent',
    'scrollArea',
    'scrollable',
    'footer',
    'footerIcons',
    'heading',
    'headingBar',
    'headingBrand',
    'headingBrandText',
    'headingBrandTitle',
    'headingBrandMeta',
    'section',
    'sectionHeader',
    'sectionTitles',
    'sectionTitle',
    'sectionSummary',
    'sectionCount',
    'sectionChevron',
    'sectionItems',
    'item',
    'itemLabel',
    'itemRow',
    'itemMain',
    'nestedGroup',
    'collapseButton',
  ],
  vars: sideNavVarDefinitions,
  styles: ({ vars }) => {
    // Sections and items also render outside a `SideNav` root (e.g. inside `MobileNav`). The
    // vars are registered with transparent initial values, so re-declare the defaults on a
    // section/item that has no side-nav ancestor; inside a root they keep inheriting its values
    // (and any theme overrides on it).
    const orphanVarDefaults = Object.fromEntries(
      Object.entries(sideNavVarDefinitions)
        .filter(([key]) => key !== 'width')
        .map(([key, definition]) => [
          vars[key as keyof typeof sideNavVarDefinitions].name,
          definition.value,
        ]),
    );
    const orphan = {
      '&:not(.var-ui-side-nav *):not(.var-ui-side-nav__section *)': orphanVarDefaults,
    };
    return {
      base: {
        root: {
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 auto',
          minHeight: 0,
          minWidth: 0,
          height: '100%',
          width: vars.width.var,
          backgroundColor: vars.background.var,
          '&[data-collapsed]': {
            alignItems: 'center',
            width: '3.5rem',
          },
          '&[data-collapsed] .var-ui-scroll-area__fadeTop': {
            display: 'none',
          },
          '&[data-collapsed] .var-ui-scroll-area__fadeBottom': {
            display: 'none',
          },
        },
        stickyTop: {
          position: 'sticky',
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: t.space.xs.var,
          padding: t.space.sm.var,
          ...borderSide('block-end', vars.border.var),
          backgroundColor: vars.background.var,
          zIndex: t.zIndex.raised.var,
          '[data-collapsed] &': {
            padding: t.space.xs.var,
            borderBottom: 'none',
          },
        },
        topContent: {
          display: 'flex',
          flexDirection: 'column',
          gap: t.space.xs.var,
        },
        scrollArea: {
          flex: '1 1 auto',
          minHeight: 0,
          '--var-ui-scroll-area-fadecolor': vars.background.var,
          '[data-collapsed] &': {
            overflow: 'hidden',
          },
        },
        scrollable: {
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: t.space.md.var,
          padding: t.space.sm.var,
          // Collapsible groups read as a list of disclosures: their summary rows set the rhythm.
          '&:has(> [data-collapsible])': {
            gap: t.space.xxs.var,
          },
          '[data-collapsed] &': {
            gap: t.space.xs.var,
            padding: t.space.xs.var,
          },
        },
        footer: {
          position: 'sticky',
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: t.space.xs.var,
          padding: t.space.sm.var,
          ...borderSide('block-start', vars.border.var),
          backgroundColor: vars.background.var,
          '[data-collapsed] &': {
            justifyContent: 'center',
            padding: t.space.xs.var,
          },
        },
        footerIcons: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space.xxs.var,
        },
        heading: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space.xs.var,
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.semibold.var,
          color: vars.headingColor.var,
        },
        headingBar: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: t.space.xs.var,
          minWidth: 0,
        },
        headingBrand: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space.xs.var,
          minWidth: 0,
          color: 'inherit',
          textDecoration: 'none',
        },
        headingBrandText: {
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
          '[data-collapsed] &': {
            display: 'none',
          },
        },
        headingBrandTitle: {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        headingBrandMeta: {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: t.fontSize.sm.var,
          color: t.color.text.secondary.var,
        },
        section: {
          ...orphan,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.125rem',
          '&:not(:first-child)': {
            marginTop: t.space.sm.var,
          },
          '&[data-collapsible]:not(:first-child)': {
            marginTop: 0,
          },
        },
        sectionHeader: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: t.space.xs.var,
        },
        // Collapsible section (`<details>`): the summary is the disclosure button and sticks to
        // the top of the scroll area while its items scroll beneath it.
        sectionSummary: {
          position: 'sticky',
          top: 0,
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: t.space.xs.var,
          minHeight: '2rem',
          paddingInline: t.space.sm.var,
          listStyle: 'none',
          cursor: 'pointer',
          borderRadius: t.radius.navItem.var,
          backgroundColor: vars.background.var,
          outline: 'none',
          '&::-webkit-details-marker': { display: 'none' },
          '&::marker': { content: '""' },
          '&:hover': {
            color: vars.headingColor.var,
          },
          '&:focus-visible': {
            ...focusRing,
          },
          '& > [class*="sectionTitle"]': {
            flex: '1 1 auto',
            paddingInline: 0,
          },
          '[data-collapsed] &': {
            display: 'none',
          },
        },
        sectionCount: {
          fontSize: t.fontSize.xs.var,
          fontVariantNumeric: 'tabular-nums',
          color: vars.sectionTitleColor.var,
          opacity: 0.8,
        },
        sectionChevron: {
          display: 'inline-flex',
          flexShrink: 0,
          color: vars.sectionTitleColor.var,
          transform: 'rotate(-90deg)',
          transition: transitionOf('transform', 'fast'),
          '[open] > summary > &': {
            transform: 'none',
          },
          '[dir="rtl"] &': {
            transform: 'rotate(90deg)',
          },
          '[dir="rtl"] [open] > summary > &': {
            transform: 'none',
          },
          '& svg': { width: '0.875rem', height: '0.875rem' },
        },
        sectionItems: {
          display: 'flex',
          flexDirection: 'column',
          gap: '0.125rem',
          paddingBlockStart: '0.125rem',
        },
        sectionTitles: {
          minWidth: 0,
        },
        sectionTitle: {
          padding: `${t.space.xxs.var} ${t.space.sm.var}`,
          fontSize: t.fontSize.xs.var,
          fontWeight: t.fontWeight.semibold.var,
          letterSpacing: t.letterSpacing.caps.var,
          textTransform: 'uppercase',
          color: vars.sectionTitleColor.var,
          '[data-collapsed] &': {
            display: 'none',
          },
        },
        item: {
          // Items without `href` render a <button>: reset native button chrome so both
          // element types look identical.
          ...orphan,
          appearance: 'none',
          boxSizing: 'border-box',
          width: '100%',
          margin: 0,
          border: 'none',
          backgroundColor: 'transparent',
          font: 'inherit',
          textAlign: 'start',
          display: 'flex',
          alignItems: 'center',
          gap: t.space.xs.var,
          // 14/20 on a 32px row: dense enough for long catalogs, still a comfortable target.
          position: 'relative',
          minHeight: '2rem',
          paddingBlock: '0.375rem',
          paddingInline: t.space.sm.var,
          fontSize: t.fontSize.md.var,
          lineHeight: '1.25rem',
          borderRadius: t.radius.navItem.var,
          color: vars.itemColor.var,
          textDecoration: 'none',
          cursor: 'pointer',
          outline: 'none',
          transition: transitionOf(['background-color', 'color'], 'fast'),
          '&:hover:not([data-selected]):not([data-disabled])': {
            backgroundColor: vars.itemHoverBackground.var,
            color: vars.itemColor.var,
          },
          '&:focus-visible': {
            ...focusRing,
          },
          '&[data-selected]': {
            backgroundColor: vars.itemSelectedBackground.var,
            color: vars.itemSelectedColor.var,
            fontWeight: t.fontWeight.semibold.var,
            ...atForcedColors(forced.selected),
          },
          // Active marker: a 2px accent bar on the leading edge, inset from the row's radius.
          '&[data-selected]::before': {
            content: '""',
            position: 'absolute',
            insetInlineStart: 0,
            insetBlock: '0.375rem',
            width: '0.125rem',
            borderRadius: t.radius.full.var,
            backgroundColor: vars.itemSelectedColor.var,
          },
          '[data-collapsed] &[data-selected]::before': {
            display: 'none',
          },
          // `selectionStyle="text"` on the section: the current item is marked by its accent
          // label alone (no fill, no bar), so a neighbouring list's filled row stays the one fill.
          '[data-selection-style="text"] &[data-selected]': {
            backgroundColor: 'transparent',
          },
          '[data-selection-style="text"] &[data-selected]::before': {
            display: 'none',
          },
          '[data-selection-style="text"] &[data-selected]:hover': {
            backgroundColor: vars.itemHoverBackground.var,
          },
          '[data-selection-style="text"] &[data-selected]:active': {
            backgroundColor: t.color.navItem.activeBackground.var,
          },
          '&[data-selected]:hover': {
            backgroundColor: vars.itemSelectedBackground.var,
            color: vars.itemSelectedColor.var,
          },
          '&:active:not([data-disabled])': {
            backgroundColor: t.color.navItem.activeBackground.var,
          },
          '&[data-selected]:active': {
            backgroundColor: vars.itemSelectedBackground.var,
          },
          '&[data-disabled]': {
            color: vars.itemColor.var,
            opacity: t.opacity.disabled.var,
            cursor: 'not-allowed',
            pointerEvents: 'none',
          },
          '[data-collapsed] &': {
            justifyContent: 'center',
            width: t.size.control.md.var,
            minWidth: t.size.control.md.var,
            padding: t.space.xs.var,
          },
          '[data-collapsed] &:not(:has(svg, img))': {
            display: 'none',
          },
        },
        itemLabel: {
          flex: '1 1 auto',
          minWidth: 0,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          '[data-collapsed] &': {
            display: 'none',
          },
        },
        itemRow: {
          display: 'flex',
          alignItems: 'stretch',
          gap: `calc(${t.space.xxs.var} / 2)`,
        },
        itemMain: {
          flex: '1 1 auto',
          minWidth: 0,
        },
        nestedGroup: {
          display: 'flex',
          flexDirection: 'column',
          gap: `calc(${t.space.xxs.var} / 2)`,
          paddingInlineStart: t.space.lg.var,
        },
        collapseButton: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          width: t.size.control.md.var,
          height: t.size.control.md.var,
          borderRadius: t.radius.navItem.var,
          border: 'none',
          backgroundColor: 'transparent',
          color: vars.itemColor.var,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: vars.itemHoverBackground.var,
          },
          '&:focus-visible': {
            ...focusRing,
          },
        },
      },
    };
  },
});
