import { designTokens as t, typestyles } from '@var-ui/core';
import type { MultiSlotReturn } from 'typestyles';

type DocsAppearanceMenuSlots = readonly ['root', 'trigger', 'modeIcon', 'swatch'];

/**
 * Header appearance menu: one icon button whose glyph shows the colour mode (`data-mode-preference`
 * on `root` picks it) over a short bar in the current theme's swatch colour.
 *
 * No `variants` here, so this is a plain multi-slot recipe (each slot is a className string).
 * Slot names that do not collide with CSS property names make TS pick the slot-with-variants
 * overload, so the runtime shape is pinned explicitly.
 */
export const docsAppearanceMenu = typestyles.recipe({
  name: 'docs-appearance-menu',
  layer: 'components',
  slots: ['root', 'trigger', 'modeIcon', 'swatch'],
  styles: () => ({
    base: {
      root: {
        display: 'inline-flex',
        // Until the client reads the preference, show the System glyph.
        '&:not([data-mode-preference]) [data-mode-icon]:not([data-mode-icon="system"])': {
          display: 'none',
        },
        '&[data-mode-preference="light"] [data-mode-icon]:not([data-mode-icon="light"])': {
          display: 'none',
        },
        '&[data-mode-preference="dark"] [data-mode-icon]:not([data-mode-icon="dark"])': {
          display: 'none',
        },
        '&[data-mode-preference="system"] [data-mode-icon]:not([data-mode-icon="system"])': {
          display: 'none',
        },
      },
      trigger: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 0,
        // Same quiet icon colour as the bar's other icon buttons; brightens with the button.
        color: t.color.text.secondary.var,
        transition: t.transition.surfaceFast.var,
        '[data-var-ui-menu-trigger]:hover &, [data-var-ui-menu-trigger][aria-expanded="true"] &': {
          color: t.color.text.primary.var,
        },
      },
      modeIcon: {
        display: 'inline-flex',
      },
      // Theme swatch: a short colour bar under the glyph (a colour chip, not a status dot).
      swatch: {
        position: 'absolute',
        insetInlineStart: '50%',
        insetBlockEnd: '-0.3125rem',
        width: '0.625rem',
        height: '0.125rem',
        borderRadius: t.radius.full.var,
        transform: 'translateX(-50%)',
        backgroundColor: t.color.tone.accent.foreground.var,
        pointerEvents: 'none',
      },
    },
  }),
}) as unknown as MultiSlotReturn<DocsAppearanceMenuSlots>;
