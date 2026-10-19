import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Mobile slide-out navigation drawer. Pair with the React `MobileNav` compound,
 * which drives open state on the overlay/panel and `data-side` on the panel
 * (`start` | `end`). Reuses SideNav section/item children inside the panel.
 *
 * ```tsx
 * const s = mobileNav();
 * <>
 *   <button className={s.toggle} aria-label="Open navigation">
 *     <Icon name="menu" />
 *   </button>
 *   <div className={s.overlay} data-open={isOpen || undefined}>
 *     <div className={s.panel} data-side="start" data-open={isOpen || undefined}>
 *       <div className={s.header}>
 *         Menu
 *         <button className={s.closeButton} aria-label="Close navigation" />
 *       </div>
 *       {children}
 *     </div>
 *   </div>
 * </>
 * ```
 */
export const mobileNav = typestyles.recipe(
  'mobile-nav',
  (c) => {
    const v = c.vars({
      overlayBackground: {
        ...atProperty.color,
        value: t.color.overlay.default.var,
      },
      panelBackground: {
        ...atProperty.color,
        value: t.color.background.surface.var,
      },
      panelBorder: {
        ...atProperty.color,
        value: t.color.border.default.var,
      },
      panelWidth: {
        ...atProperty.length,
        value: '320px',
      },
      headerColor: {
        ...atProperty.color,
        value: t.color.text.primary.var,
      },
      toggleColor: {
        ...atProperty.color,
        value: t.color.text.secondary.var,
      },
      toggleHoverBackground: {
        ...atProperty.color,
        value: t.color.background.subtle.var,
      },
      closeButtonColor: {
        ...atProperty.color,
        value: t.color.text.secondary.var,
      },
    });
    return {
      slots: ['overlay', 'panel', 'header', 'closeButton', 'toggle'],
      overlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: v.overlayBackground.var,
        '&:not([data-open])': {
          display: 'none',
        },
      },
      panel: {
        position: 'fixed',
        top: 0,
        bottom: 0,
        width: `min(${v.panelWidth.var}, 85vw)`,
        maxWidth: '85vw',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: v.panelBackground.var,
        boxShadow: t.shadow.lg.var,
        overflowY: 'auto',
        transition: 'transform 200ms ease',
        '&[data-side="start"]': {
          insetInlineStart: 0,
          borderInlineEndWidth: t.borderWidth.default.var,
          borderInlineEndStyle: 'solid',
          borderInlineEndColor: v.panelBorder.var,
          transform: 'translateX(0)',
          '&:not([data-open])': {
            transform: 'translateX(-100%)',
            boxShadow: 'none',
          },
          '[dir="rtl"] &:not([data-open])': {
            transform: 'translateX(100%)',
          },
        },
        '&[data-side="end"]': {
          insetInlineEnd: 0,
          borderInlineStartWidth: t.borderWidth.default.var,
          borderInlineStartStyle: 'solid',
          borderInlineStartColor: v.panelBorder.var,
          transform: 'translateX(0)',
          '&:not([data-open])': {
            transform: 'translateX(100%)',
            boxShadow: 'none',
          },
          '[dir="rtl"] &:not([data-open])': {
            transform: 'translateX(-100%)',
          },
        },
      },
      header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: t.space[3].var,
        padding: t.space[4].var,
        borderBottomWidth: t.borderWidth.default.var,
        borderBottomStyle: 'solid',
        borderBottomColor: v.panelBorder.var,
        color: v.headerColor.var,
        fontSize: t.fontSize.md.var,
        fontWeight: t.fontWeight.semibold.var,
        flexShrink: 0,
      },
      closeButton: {
        appearance: 'none',
        border: 'none',
        background: 'transparent',
        color: v.closeButtonColor.var,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: t.space[1].var,
        marginInlineEnd: `calc(${t.space[1].var} * -1)`,
        borderRadius: t.radius.sm.var,
        '&:hover': {
          backgroundColor: v.toggleHoverBackground.var,
          color: v.headerColor.var,
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus.var}`,
          outlineOffset: '1px',
        },
      },
      toggle: {
        appearance: 'none',
        border: 'none',
        background: 'transparent',
        color: v.toggleColor.var,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: t.space[2].var,
        borderRadius: t.radius.sm.var,
        '& svg': {
          display: 'block',
          width: t.size.icon.md.var,
          height: t.size.icon.md.var,
        },
        '&:hover': {
          backgroundColor: v.toggleHoverBackground.var,
          color: v.headerColor.var,
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus.var}`,
          outlineOffset: '1px',
        },
      },
    };
  },
  { layer: 'components' },
);
