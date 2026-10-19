import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { overlayPresenceStyles } from './overlayPresence';

/**
 * Slot recipe with no variants — placement is driven purely by the
 * `data-placement` attribute the Astro wrapper sets on the popover, so it is
 * CSS-only and kept out of the recipe schema.
 */
export const menu = typestyles.recipe(
  'menu',
  (c) => {
    const v = c.vars({
      popoverBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      popoverBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      itemForeground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      itemFocusedBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      itemDisabledForeground: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      sectionHeaderForeground: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      separatorColor: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      dangerForeground: {
        value: t.color.tone.danger.foreground.var,
        syntax: '<color>',
      },
    });
    const anchorGap = `calc(100% + ${t.space[2].var})`;
    const anchoredPopover = (
      origin: 'top left' | 'top right' | 'bottom left' | 'bottom right',
      edge: { top?: string; right?: 0; bottom?: string; left?: 0 },
    ) => ({
      position: 'absolute' as const,
      zIndex: t.zIndex.dropdown.var,
      ...edge,
      '--var-ui-transform-origin': origin,
    });

    return {
      vars: v,
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
      ],
      /**
       * Anchor wrapper for frameworks without JS overlay positioning (Astro).
       * React renders `display: contents`-style through react-aria and never
       * applies this slot.
       */
      root: {
        display: 'inline-flex',
        position: 'relative',
      },
      popover: {
        ...overlayPresenceStyles({ scale: true }),
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: v.popoverBorder.var,
        borderRadius: t.radius.md.var,
        backgroundColor: v.popoverBackground.var,
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
        color: v.sectionHeaderForeground.var,
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
        color: v.itemForeground.var,
        outline: 'none',
        '&[data-focused]': {
          backgroundColor: v.itemFocusedBackground.var,
        },
        '&[data-disabled]': {
          color: v.itemDisabledForeground.var,
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
        color: v.dangerForeground.var,
      },
      itemLabel: {
        flex: 1,
        minWidth: 0,
      },
      itemShortcut: {
        fontSize: t.fontSize.sm.var,
        color: v.sectionHeaderForeground.var,
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
        backgroundColor: v.separatorColor.var,
      },
      submenuChevron: {
        display: 'inline-flex',
        marginInlineStart: 'auto',
        color: v.sectionHeaderForeground.var,
      },
    };
  },
  { layer: 'components' },
);
