import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { borderSide, border } from '../internal/border';
import { atForcedColors } from '../theme/conditions';
import { forced } from '../internal/forcedColors';
import { focusRing } from '../internal/focusRing';
import { transitionOf } from '../internal/motion';
/** Internal CSS variables for theme overrides (`vars` on `createDesignTheme`). */
const topNavVarDefinitions = {
  background: {
    ...atProperty.color,
    value: t.color.background.surface.var,
  },
  border: {
    ...atProperty.color,
    value: t.color.border.subtle.var,
  },
  headingColor: {
    ...atProperty.color,
    value: t.color.text.primary.var,
  },
  itemColor: {
    ...atProperty.color,
    value: t.color.navItem.foreground.var,
  },
  itemHoverColor: {
    ...atProperty.color,
    value: t.color.text.primary.var,
  },
  // Quieter than the selected pill: hover previews, selection states.
  itemHoverBackground: {
    ...atProperty.color,
    value: `color-mix(in oklch, ${t.color.navItem.hoverBackground.var} 45%, transparent)`,
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

export const topNav = typestyles.recipe({
  name: 'top-nav',
  layer: 'components',
  slots: [
    'root',
    'heading',
    'brand',
    'start',
    'center',
    'end',
    'item',
    'itemLabel',
    'menuTrigger',
    'menuList',
    'richBody',
    'megaRoot',
    'megaPanel',
    'megaItems',
    'megaItem',
    'featuredCard',
  ],
  vars: topNavVarDefinitions,
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: t.space.md.var,
          minWidth: 0,
          minHeight: t.size.nav.bar.var,
          paddingBlock: 0,
          paddingInline: t.space.md.var,
          backgroundColor: vars.background.var,
          ...borderSide('block-end', vars.border.var),
          '&[data-layout="grid"]': {
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
          },
        },
        heading: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space.xs.var,
          flexShrink: 0,
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.semibold.var,
          color: vars.headingColor.var,
        },
        brand: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space.xs.var,
          minWidth: 0,
          color: 'inherit',
          textDecoration: 'none',
        },
        start: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space.xxs.var,
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
          gap: t.space.xs.var,
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
          gap: t.space.xs.var,
          boxSizing: 'border-box',
          // Same height as the bar's controls (search, buttons) so every pill lines up.
          minHeight: t.size.control.md.var,
          paddingBlock: 0,
          paddingInline: t.space.sm.var,
          borderRadius: t.radius.navItem.var,
          border: 'none',
          backgroundColor: 'transparent',
          color: vars.itemColor.var,
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.medium.var,
          textDecoration: 'none',
          cursor: 'pointer',
          outline: 'none',
          whiteSpace: 'nowrap',
          transition: transitionOf(['background-color', 'color'], 'fast'),
          '&:hover:not([data-selected])': {
            backgroundColor: vars.itemHoverBackground.var,
            color: vars.itemHoverColor.var,
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
          '&[data-disabled]': {
            color: vars.itemColor.var,
            opacity: t.opacity.disabled.var,
            cursor: 'not-allowed',
            pointerEvents: 'none',
          },
        },
        // Reserves the semibold width (hidden `::after` copy of `data-label`) so selecting an
        // item never shifts its neighbours.
        itemLabel: {
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          '&::after': {
            // Empty alt text keeps the duplicate out of the accessibility tree.
            content: 'attr(data-label) / ""',
            height: 0,
            overflow: 'hidden',
            visibility: 'hidden',
            userSelect: 'none',
            pointerEvents: 'none',
            fontWeight: t.fontWeight.semibold.var,
          },
        },
        menuTrigger: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space.xxs.var,
          boxSizing: 'border-box',
          minHeight: t.size.control.md.var,
          paddingBlock: 0,
          paddingInline: t.space.sm.var,
          fontWeight: t.fontWeight.medium.var,
          borderRadius: t.radius.navItem.var,
          border: 'none',
          backgroundColor: 'transparent',
          color: vars.menuTriggerColor.var,
          fontSize: t.fontSize.md.var,
          cursor: 'pointer',
          outline: 'none',
          whiteSpace: 'nowrap',
          '&:hover': {
            backgroundColor: vars.itemHoverBackground.var,
            color: vars.itemHoverColor.var,
          },
          '&:focus-visible': {
            ...focusRing,
          },
          '&[data-disabled]': {
            opacity: t.opacity.disabled.var,
            cursor: 'not-allowed',
            pointerEvents: 'none',
          },
        },
        menuList: {
          display: 'flex',
          flexDirection: 'column',
          gap: `calc(${t.space.xxs.var} / 2)`,
          minWidth: t.size.panel.xs.var,
        },
        richBody: {
          display: 'flex',
          flexDirection: 'column',
          gap: `calc(${t.space.xxs.var} / 2)`,
          minWidth: 0,
        },
        // `display: contents` keeps the trigger a direct flex item of the bar zone.
        megaRoot: {
          display: 'contents',
        },
        megaPanel: {
          position: 'absolute',
          top: '100%',
          insetInlineStart: 0,
          insetInlineEnd: 0,
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: t.space.xl.var,
          paddingBlock: t.space.xl.var,
          paddingInline: t.space.xl.var,
          backgroundColor: vars.megaPanelBackground.var,
          ...borderSide('block-end', vars.megaPanelBorder.var),
          boxShadow: t.shadow.md.var,
          zIndex: t.zIndex.raised.var,
        },
        megaItems: {
          display: 'grid',
          gap: t.space.xxs.var,
          alignContent: 'start',
        },
        megaItem: {
          display: 'flex',
          flexDirection: 'column',
          gap: t.space.xxs.var,
          padding: t.space.sm.var,
          borderRadius: t.radius.navItem.var,
          color: vars.megaItemColor.var,
          textDecoration: 'none',
          cursor: 'pointer',
          outline: 'none',
          '&:hover': {
            backgroundColor: vars.megaItemHoverBackground.var,
          },
          '&:focus-visible': {
            ...focusRing,
          },
          '&[data-disabled]': {
            opacity: t.opacity.disabled.var,
            cursor: 'not-allowed',
            pointerEvents: 'none',
          },
        },
        featuredCard: {
          display: 'flex',
          flexDirection: 'column',
          gap: t.space.xs.var,
          padding: t.space.md.var,
          borderRadius: t.radius.lg.var,
          backgroundColor: vars.featuredCardBackground.var,
          ...border(vars.featuredCardBorder.var),
          minWidth: t.size.panel.sm.var,
          textDecoration: 'none',
          color: 'inherit',
        },
      },
    };
  },
});
