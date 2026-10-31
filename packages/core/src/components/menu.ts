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
    'itemSwatch',
    'separator',
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
    anchorX: { ...atProperty.length, value: '0px' },
    anchorY: { ...atProperty.length, value: '0px' },
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
          width: '1px',
          height: '1px',
          pointerEvents: 'none',
          opacity: 0,
        },
        popover: {
          ...anchored({ defaultAlign: 'start' }),
          ...popupSurface({
            background: vars.popoverBackground.var,
            border: vars.popoverBorder.var,
          }),
          padding: t.space[1].var,
          minWidth: '12rem',
        },
        menu: {
          outline: 'none',
        },
        section: {
          display: 'flex',
          flexDirection: 'column',
          gap: t.space[1].var,
        },
        sectionHeader: {
          fontSize: t.fontSize.sm.var,
          fontWeight: t.fontWeight.semibold.var,
          color: vars.sectionHeaderForeground.var,
          padding: `${t.space[1].var} ${t.space[3].var}`,
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
          gap: t.space[2].var,
          fontSize: t.fontSize.md.var,
          padding: `${t.space[2].var} ${t.space[3].var}`,
          borderRadius: t.radius.sm.var,
          cursor: 'pointer',
          color: vars.itemForeground.var,
          outline: 'none',
          '&[data-focused]': {
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
          width: '1rem',
          flexShrink: 0,
        },
        itemSwatch: {
          display: 'block',
          width: '0.875rem',
          height: '0.875rem',
          borderRadius: t.radius.full.var,
          flexShrink: 0,
          boxShadow: `inset 0 0 0 1px ${t.color.border.default.var}`,
          ...atForcedColors(forced.swatch),
        },
        separator: {
          height: '1px',
          margin: `${t.space[1].var} 0`,
          backgroundColor: vars.separatorColor.var,
          ...atForcedColors({ backgroundColor: 'CanvasText' }),
        },
        submenuChevron: {
          display: 'inline-flex',
          marginInlineStart: 'auto',
          color: vars.sectionHeaderForeground.var,
        },
      },
    };
  },
});
