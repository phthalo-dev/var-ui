import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
/** Internal CSS variables for theme overrides (`vars` on `createDesignTheme`). */
export const topNavVarDefinitions = {
  background: {
    ...atProperty.color,
    value: t.color.background.surface.var,
  },
  border: {
    ...atProperty.color,
    value: t.color.border.strong.var,
  },
  headingColor: {
    ...atProperty.color,
    value: t.color.text.primary.var,
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
  menuTriggerColor: {
    ...atProperty.color,
    value: t.color.navItem.foreground.var,
  },
  megaPanelBackground: {
    ...atProperty.color,
    value: t.color.background.surface.var,
  },
  megaPanelBorder: {
    ...atProperty.color,
    value: t.color.border.default.var,
  },
  megaItemColor: {
    ...atProperty.color,
    value: t.color.text.primary.var,
  },
  megaItemHoverBackground: {
    ...atProperty.color,
    value: t.color.background.subtle.var,
  },
  featuredCardBackground: {
    ...atProperty.color,
    value: t.color.background.subtle.var,
  },
  featuredCardBorder: {
    ...atProperty.color,
    value: t.color.border.default.var,
  },
} as const;

/**
 * Top navigation bar chrome with optional centered content and mega menu.
 * Pair with the React `TopNav` compound, which sets `data-layout="grid"` on
 * the root when `centerContent` is present and `data-selected` / `data-disabled`
 * on items.
 *
 * ```tsx
 * const s = topNav();
 * <nav className={s.root} data-layout={hasCenter ? 'grid' : undefined}>
 *   <div className={s.heading}>Acme</div>
 *   <div className={s.start}>
 *     <a className={s.item} data-selected href="/">Home</a>
 *     <button className={s.menuTrigger}>Products</button>
 *   </div>
 *   <div className={s.center}>…</div>
 *   <div className={s.end}>…</div>
 *   <div className={s.megaPanel}>
 *     <a className={s.megaItem} href="/solutions/a">…</a>
 *     <div className={s.featuredCard}>…</div>
 *   </div>
 * </nav>
 * ```
 */

export const topNav = typestyles.recipe(
  'top-nav',
  (c) => {
    const v = c.vars(topNavVarDefinitions);
    return {
      vars: v,
      slots: [
        'root',
        'heading',
        'start',
        'center',
        'end',
        'item',
        'menuTrigger',
        'megaPanel',
        'megaItem',
        'featuredCard',
      ],
      root: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: t.space[4].var,
        minWidth: 0,
        minHeight: t.size.nav.bar.var,
        paddingBlock: 0,
        paddingInline: t.space[4].var,
        backgroundColor: v.background.var,
        borderBottomWidth: t.borderWidth.default.var,
        borderBottomStyle: 'solid',
        borderBottomColor: v.border.var,
        boxShadow: t.shadow.sm.var,
        '&[data-layout="grid"]': {
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
        },
      },
      heading: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space[2].var,
        flexShrink: 0,
        fontSize: t.fontSize.md.var,
        fontWeight: t.fontWeight.semibold.var,
        color: v.headingColor.var,
      },
      start: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space[1].var,
        minWidth: 0,
        '[data-layout="grid"] &': {
          justifySelf: 'start',
        },
      },
      center: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 0,
        '[data-layout="grid"] &': {
          justifySelf: 'center',
        },
      },
      end: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space[2].var,
        flexShrink: 0,
        marginInlineStart: 'auto',
        '[data-layout="grid"] &': {
          justifySelf: 'end',
          marginInlineStart: 0,
        },
      },
      item: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space[2].var,
        padding: `${t.space[2].var} ${t.space[3].var}`,
        borderRadius: t.radius.navItem.var,
        border: 'none',
        backgroundColor: 'transparent',
        color: v.itemColor.var,
        fontSize: t.fontSize.md.var,
        textDecoration: 'none',
        cursor: 'pointer',
        outline: 'none',
        whiteSpace: 'nowrap',
        '&:hover': {
          backgroundColor: v.itemHoverBackground.var,
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus.var}`,
          outlineOffset: '2px',
        },
        '&[data-selected]': {
          backgroundColor: v.itemSelectedBackground.var,
          color: v.itemSelectedColor.var,
          fontWeight: t.fontWeight.medium.var,
        },
        '&[data-disabled]': {
          color: v.itemColor.var,
          opacity: 0.5,
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },
      },
      menuTrigger: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space[1].var,
        padding: `${t.space[2].var} ${t.space[3].var}`,
        borderRadius: t.radius.navItem.var,
        border: 'none',
        backgroundColor: 'transparent',
        color: v.menuTriggerColor.var,
        fontSize: t.fontSize.md.var,
        cursor: 'pointer',
        outline: 'none',
        whiteSpace: 'nowrap',
        '&:hover': {
          backgroundColor: v.itemHoverBackground.var,
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus.var}`,
          outlineOffset: '2px',
        },
        '&[data-disabled]': {
          opacity: 0.5,
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },
      },
      megaPanel: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: t.space[6].var,
        paddingBlock: t.space[6].var,
        paddingInline: t.space[6].var,
        backgroundColor: v.megaPanelBackground.var,
        borderBottomWidth: t.borderWidth.default.var,
        borderBottomStyle: 'solid',
        borderBottomColor: v.megaPanelBorder.var,
        boxShadow: t.shadow.md.var,
        zIndex: 1,
      },
      megaItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[1].var,
        padding: t.space[3].var,
        borderRadius: t.radius.navItem.var,
        color: v.megaItemColor.var,
        textDecoration: 'none',
        cursor: 'pointer',
        outline: 'none',
        '&:hover': {
          backgroundColor: v.megaItemHoverBackground.var,
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus.var}`,
          outlineOffset: '2px',
        },
        '&[data-disabled]': {
          opacity: 0.5,
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },
      },
      featuredCard: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[2].var,
        padding: t.space[4].var,
        borderRadius: t.radius.lg.var,
        backgroundColor: v.featuredCardBackground.var,
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: v.featuredCardBorder.var,
        minWidth: '16rem',
      },
    };
  },
  { layer: 'components' },
);
