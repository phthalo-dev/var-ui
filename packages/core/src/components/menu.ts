import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { forced } from '../internal/forcedColors';
import { atForcedColors } from '../theme/conditions';
import { designTokens as t } from '../tokens';
import { anchored, popupSurface } from '../shared/anchored';

/**
 * Slot recipe with no variants. The `popover` slot is the `[popover]` element, anchor-positioned
 * from its `data-placement` attribute (`bottom`, `top start`, `end center`, ...; see
 * `shared/anchored`), so placement is CSS-only and kept out of the recipe schema.
 */
export const menu = typestyles.recipe({
  name: 'menu',
  layer: 'components',
  slots: [
    'root',
    'popover',
    'menu',
    'section',
    'sectionHeader',
    'item',
    'itemDanger',
    'itemLabel',
    'itemShortcut',
    'itemCheck',
    'itemIcon',
    'itemSwatch',
    'separator',
    'submenuPopover',
    'submenuChevron',
    'contextAnchor',
  ],
  vars: {
    /** Declared on the `popover` slot (the top-layer element), which owns the menu surface. */
    popoverBackground: {
      ...atProperty.color,
      slots: ['popover'],
      value: t.color.background.surface.var,
    },
    popoverBorder: {
      ...atProperty.color,
      slots: ['popover'],
      value: t.color.border.default.var,
    },
    itemForeground: {
      ...atProperty.color,
      slots: ['popover'],
      value: t.color.text.primary.var,
    },
    itemFocusedBackground: {
      ...atProperty.color,
      slots: ['popover'],
      value: t.color.background.subtle.var,
    },
    itemDisabledForeground: {
      ...atProperty.color,
      slots: ['popover'],
      value: t.color.text.secondary.var,
    },
    sectionHeaderForeground: {
      ...atProperty.color,
      slots: ['popover'],
      value: t.color.text.secondary.var,
    },
    separatorColor: {
      ...atProperty.color,
      slots: ['popover'],
      value: t.color.border.default.var,
    },
    dangerForeground: {
      ...atProperty.color,
      slots: ['popover'],
      value: t.color.tone.danger.foreground.var,
    },
    anchorX: { ...atProperty.length, value: '0rem' },
    anchorY: { ...atProperty.length, value: '0rem' },
  },
  styles: ({ vars }) => {
    return {
      base: {
        /** Wrapper around trigger + popup. The popup is positioned by anchor, not by this box. */
        root: {
          display: 'inline-flex',
        },
        contextAnchor: {
          position: 'fixed',
          left: vars.anchorX.var,
          top: vars.anchorY.var,
          width: '0.0625rem',
          height: '0.0625rem',
          pointerEvents: 'none',
          opacity: 0,
        },
        popover: {
          ...anchored({ defaultAlign: 'start' }),
          ...popupSurface({
            background: vars.popoverBackground.var,
            border: vars.popoverBorder.var,
          }),
          padding: t.space.xxs.var,
          minWidth: t.size.panel.xs.var,
        },
        menu: {
          outline: 'none',
        },
        section: {
          display: 'flex',
          flexDirection: 'column',
          gap: t.space.xxs.var,
        },
        sectionHeader: {
          fontSize: t.fontSize.sm.var,
          fontWeight: t.fontWeight.semibold.var,
          color: vars.sectionHeaderForeground.var,
          padding: `${t.space.xxs.var} ${t.space.sm.var}`,
        },
        item: {
          // Reset UA button/link chrome so the slot works on <button>/<a>
          // (Astro) as well as React Aria's element items.
          appearance: 'none',
          borderWidth: 0,
          borderStyle: 'none',
          background: 'transparent',
          margin: 0,
          font: 'inherit',
          width: '100%',
          textAlign: 'start',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: t.space.xs.var,
          fontSize: t.fontSize.md.var,
          padding: `${t.space.xs.var} ${t.space.sm.var}`,
          borderRadius: t.radius.sm.var,
          cursor: 'pointer',
          color: vars.itemForeground.var,
          outline: 'none',
          '&[data-focused]': {
            backgroundColor: vars.itemFocusedBackground.var,
            ...atForcedColors(forced.selected),
          },
          // A submenu trigger keeps the focused look while its submenu is open.
          '&[data-open]': {
            backgroundColor: vars.itemFocusedBackground.var,
            ...atForcedColors(forced.selected),
          },
          '&[data-disabled]': {
            color: vars.itemDisabledForeground.var,
            cursor: 'not-allowed',
            ...atForcedColors(forced.disabled),
          },
          // Radio-item check reveal (Astro renders the attr; hidden via
          // `visibility` so checked and unchecked rows stay aligned).
          '& [data-var-ui-menu-item-check]': {
            visibility: 'hidden',
          },
          '&[aria-checked="true"] [data-var-ui-menu-item-check]': {
            visibility: 'visible',
          },
        },
        itemDanger: {
          color: vars.dangerForeground.var,
        },
        itemLabel: {
          flex: 1,
          minWidth: 0,
        },
        itemShortcut: {
          fontSize: t.fontSize.sm.var,
          color: vars.sectionHeaderForeground.var,
        },
        itemCheck: {
          display: 'inline-flex',
          width: t.size.icon.md.var,
          flexShrink: 0,
        },
        itemIcon: {
          display: 'inline-flex',
          flexShrink: 0,
        },
        itemSwatch: {
          display: 'block',
          width: t.size.icon.sm.var,
          height: t.size.icon.sm.var,
          borderRadius: t.radius.full.var,
          flexShrink: 0,
          boxShadow: `inset 0 0 0 0.0625rem ${t.color.border.default.var}`,
          ...atForcedColors(forced.swatch),
        },
        separator: {
          height: '0.0625rem',
          margin: `${t.space.xxs.var} 0`,
          backgroundColor: vars.separatorColor.var,
          ...atForcedColors({ backgroundColor: 'CanvasText' }),
        },
        /**
         * Extra class on a submenu's `[popover]` (next to `popover`). The submenu sits beside its
         * trigger item (`end start`); the block-axis shift equals the popup padding so its first
         * item lines up with the trigger item. `translate` leaves the enter/exit `transform` alone.
         */
        submenuPopover: {
          translate: `0 calc(-1 * ${t.space.xxs.var})`,
        },
        /** Trailing indicator of a submenu trigger item; flips in right-to-left. */
        submenuChevron: {
          display: 'inline-flex',
          flexShrink: 0,
          marginInlineStart: 'auto',
          color: 'inherit',
          '[dir="rtl"] &': { transform: 'scaleX(-1)' },
        },
      },
    };
  },
});
