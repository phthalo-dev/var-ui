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
    'item',
    'itemLabel',
    'itemRow',
    'itemMain',
    'nestedGroup',
    'collapseButton',
  ],
  vars: sideNavVarDefinitions,
  styles: ({ vars }) => {
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
          gap: t.space[2].var,
          padding: t.space[3].var,
          ...borderSide('block-end', vars.border.var),
          backgroundColor: vars.background.var,
          zIndex: t.zIndex.raised.var,
          '[data-collapsed] &': {
            padding: t.space[2].var,
            borderBottom: 'none',
          },
        },
        topContent: {
          display: 'flex',
          flexDirection: 'column',
          gap: t.space[2].var,
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
          gap: t.space[4].var,
          padding: t.space[3].var,
          '[data-collapsed] &': {
            gap: t.space[2].var,
            padding: t.space[2].var,
          },
        },
        footer: {
          position: 'sticky',
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: t.space[2].var,
          padding: t.space[3].var,
          ...borderSide('block-start', vars.border.var),
          backgroundColor: vars.background.var,
          '[data-collapsed] &': {
            justifyContent: 'center',
            padding: t.space[2].var,
          },
        },
        footerIcons: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[1].var,
        },
        heading: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[2].var,
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.semibold.var,
          color: vars.headingColor.var,
        },
        headingBar: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: t.space[2].var,
          minWidth: 0,
        },
        headingBrand: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[2].var,
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
          display: 'flex',
          flexDirection: 'column',
          gap: t.space[1].var,
          '&:not(:first-child)': {
            marginTop: t.space[2].var,
          },
        },
        sectionHeader: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: t.space[2].var,
        },
        sectionTitles: {
          minWidth: 0,
        },
        sectionTitle: {
          padding: `${t.space[1].var} ${t.space[2].var}`,
          fontSize: t.fontSize.xs.var,
          fontWeight: t.fontWeight.semibold.var,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: vars.sectionTitleColor.var,
          '[data-collapsed] &': {
            display: 'none',
          },
        },
        item: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[2].var,
          padding: `${t.space[2].var} ${t.space[2].var}`,
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
            fontWeight: t.fontWeight.medium.var,
            ...atForcedColors(forced.selected),
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
            width: '2rem',
            minWidth: '2rem',
            padding: t.space[2].var,
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
          gap: `calc(${t.space[1].var} / 2)`,
        },
        itemMain: {
          flex: '1 1 auto',
          minWidth: 0,
        },
        nestedGroup: {
          display: 'flex',
          flexDirection: 'column',
          gap: `calc(${t.space[1].var} / 2)`,
          paddingInlineStart: t.space[5].var,
        },
        collapseButton: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          width: '2rem',
          height: '2rem',
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
