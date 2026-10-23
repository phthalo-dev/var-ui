import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { overlayPresenceStyles } from '../shared/overlayMotion';
import { layerZIndex } from './layerVars';
import { positioner } from './positionerVars';

/**
 * Slot recipe with no variants — placement is driven purely by the
 * `data-placement` attribute the Astro wrapper sets on the popover, so it is
 * CSS-only and kept out of the recipe schema.
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
    popoverBackground: {
      ...atProperty.color,
      value: t.color.background.surface.var,
    },
    popoverBorder: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    itemForeground: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    itemFocusedBackground: {
      ...atProperty.color,
      value: t.color.background.subtle.var,
    },
    itemDisabledForeground: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    sectionHeaderForeground: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    separatorColor: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    dangerForeground: {
      ...atProperty.color,
      value: t.color.tone.danger.foreground.var,
    },
    anchorX: { ...atProperty.length, value: '0px' },
    anchorY: { ...atProperty.length, value: '0px' },
  },
  styles: ({ vars }) => {
    const anchorGap = `calc(100% + ${t.space[2].var})`;
    /**
     * Recipe `value`s land on `.var-ui-menu`. React portals the popover, so
     * it must declare the same channels or registered colors stay transparent.
     * Inside the root (Astro), inherit so theme overrides on the host slot win.
     */
    const portaledColorVars = {
      [vars.popoverBackground.name]: t.color.background.surface.var,
      [vars.popoverBorder.name]: t.color.border.default.var,
      [vars.itemForeground.name]: t.color.text.primary.var,
      [vars.itemFocusedBackground.name]: t.color.background.subtle.var,
      [vars.itemDisabledForeground.name]: t.color.text.secondary.var,
      [vars.sectionHeaderForeground.name]: t.color.text.secondary.var,
      [vars.separatorColor.name]: t.color.border.default.var,
      [vars.dangerForeground.name]: t.color.tone.danger.foreground.var,
    };
    const inheritedColorVars = Object.fromEntries(
      Object.keys(portaledColorVars).map((name) => [name, 'inherit']),
    );
    const anchoredPopover = (
      origin: 'top left' | 'top right' | 'bottom left' | 'bottom right',
      edge: {
        top?: string;
        right?: 0;
        bottom?: string;
        left?: 0;
      },
    ) => ({
      position: 'absolute' as const,
      ...layerZIndex(t.zIndex.dropdown.var),
      ...edge,
      [positioner.vars.transformOrigin.name]: origin,
    });
    return {
      base: {
        /**
         * Anchor wrapper for frameworks without JS overlay positioning (Astro).
         * React renders `display: contents`-style through react-aria and never
         * applies this slot.
         */
        root: {
          display: 'inline-flex',
          position: 'relative',
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
          ...portaledColorVars,
          '.var-ui-menu &': inheritedColorVars,
          ...overlayPresenceStyles({ scale: true }),
          ...layerZIndex(t.zIndex.dropdown.var),
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.popoverBorder.var,
          borderRadius: t.radius.md.var,
          backgroundColor: vars.popoverBackground.var,
          boxShadow: t.shadow.md.var,
          padding: t.space[1].var,
          minWidth: '12rem',
          // CSS-only placement relative to the `root` anchor, keyed off the
          // `data-placement` attribute the Astro wrapper sets on this element.
          // React Aria positions the popover inline and never sets it.
          '&[data-placement="bottom-start"]': anchoredPopover('top left', {
            top: anchorGap,
            left: 0,
          }),
          '&[data-placement="bottom-end"]': anchoredPopover('top right', {
            top: anchorGap,
            right: 0,
          }),
          '&[data-placement="top-start"]': anchoredPopover('bottom left', {
            bottom: anchorGap,
            left: 0,
          }),
          '&[data-placement="top-end"]': anchoredPopover('bottom right', {
            bottom: anchorGap,
            right: 0,
          }),
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
          },
          '&[data-disabled]': {
            color: vars.itemDisabledForeground.var,
            cursor: 'not-allowed',
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
        },
        separator: {
          height: '1px',
          margin: `${t.space[1].var} 0`,
          backgroundColor: vars.separatorColor.var,
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
