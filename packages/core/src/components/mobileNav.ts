import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { borderSide } from '../internal/border';
import {
  nativeBackdrop,
  nativeDialogReset,
  nativeEnterExit,
  nativeSlideFrom,
} from '../shared/overlayMotion';

const mobileNavVarDefinitions = {
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
} as const;

/**
 * Mobile slide-out navigation drawer on a native `<dialog>`. The `popup` slot is the dialog element
 * itself (`showModal()` provides the top layer, `::backdrop` and focus handling); set `data-side`
 * (`start` | `end`) on it. Reuses SideNav section/item children inside.
 *
 * ```tsx
 * const s = mobileNav();
 * <>
 *   <button className={s.toggle} aria-label="Open navigation">
 *     <Icon name="menu" />
 *   </button>
 *   <dialog className={s.popup} data-side="start">
 *     <div className={s.header}>
 *       Menu
 *       <button className={s.closeButton} aria-label="Close navigation" />
 *     </div>
 *     {children}
 *   </dialog>
 * </>
 * ```
 */
export const mobileNav = typestyles.recipe({
  name: 'mobile-nav',
  layer: 'components',
  slots: ['popup', 'header', 'headerTitle', 'closeButton', 'toggle'],
  vars: mobileNavVarDefinitions,
  styles: ({ vars }) => {
    return {
      base: {
        // The native `<dialog>`: slides in from `data-side` (`start` | `end`) via `translate`.
        popup: {
          ...nativeDialogReset,
          ...nativeEnterExit({ slide: true, backdrop: true, whenOpen: { display: 'flex' } }),
          ...nativeBackdrop(vars.overlayBackground.var),
          margin: 0,
          insetBlock: 0,
          height: '100dvh',
          maxHeight: '100dvh',
          width: `min(${vars.panelWidth.var}, 85vw)`,
          maxWidth: '85vw',
          flexDirection: 'column',
          backgroundColor: vars.panelBackground.var,
          boxShadow: t.shadow.lg.var,
          overflowY: 'auto',
          '&[data-side="start"]': {
            ...nativeSlideFrom('start'),
            insetInlineStart: 0,
            insetInlineEnd: 'auto',
            ...borderSide('inline-end', vars.panelBorder.var),
          },
          '&[data-side="end"]': {
            ...nativeSlideFrom('end'),
            insetInlineEnd: 0,
            insetInlineStart: 'auto',
            ...borderSide('inline-start', vars.panelBorder.var),
          },
        },
        header: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: t.space[3].var,
          padding: t.space[4].var,
          ...borderSide('block-end', vars.panelBorder.var),
          color: vars.headerColor.var,
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.semibold.var,
          flexShrink: 0,
        },
        headerTitle: {
          minWidth: 0,
          flex: '1 1 auto',
        },
        closeButton: {
          appearance: 'none',
          border: 'none',
          background: 'transparent',
          color: vars.closeButtonColor.var,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: t.space[1].var,
          marginInlineEnd: `calc(${t.space[1].var} * -1)`,
          borderRadius: t.radius.sm.var,
          '&:hover': {
            backgroundColor: vars.toggleHoverBackground.var,
            color: vars.headerColor.var,
          },
          '&:focus-visible': {
            ...focusRing,
          },
        },
        toggle: {
          appearance: 'none',
          border: 'none',
          background: 'transparent',
          color: vars.toggleColor.var,
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
            backgroundColor: vars.toggleHoverBackground.var,
            color: vars.headerColor.var,
          },
          '&:focus-visible': {
            ...focusRing,
          },
        },
      },
    };
  },
});
