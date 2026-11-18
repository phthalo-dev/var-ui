import { designTokens as t, typestyles } from '@var-ui/core';
import type { MultiSlotReturn } from 'typestyles';

type DocsAppearanceMenuSlots = readonly ['root', 'trigger', 'modeIcon', 'swatch', 'itemIcon'];

/**
 * Header appearance menu: one icon button whose glyph shows the colour mode (`data-mode-preference`
 * on `root` picks it) with a dot in the current theme's swatch colour.
 *
 * No `variants` here, so this is a plain multi-slot recipe (each slot is a className string).
 * Slot names that do not collide with CSS property names make TS pick the slot-with-variants
 * overload, so the runtime shape is pinned explicitly.
 */
export const docsAppearanceMenu = typestyles.recipe({
  name: 'docs-appearance-menu',
  layer: 'components',
  slots: ['root', 'trigger', 'modeIcon', 'swatch', 'itemIcon'],
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
      },
      modeIcon: {
        display: 'inline-flex',
      },
      // Theme swatch: a small dot on the glyph's lower edge, ringed in the bar colour.
      swatch: {
        position: 'absolute',
        insetInlineEnd: '-0.1875rem',
        insetBlockEnd: '-0.1875rem',
        width: '0.4375rem',
        height: '0.4375rem',
        borderRadius: t.radius.full.var,
        backgroundColor: t.color.tone.accent.foreground.var,
        boxShadow: `0 0 0 0.125rem ${t.color.background.surface.var}`,
        pointerEvents: 'none',
      },
      itemIcon: {
        display: 'inline-flex',
        color: t.color.text.secondary.var,
      },
    },
  }),
}) as unknown as MultiSlotReturn<DocsAppearanceMenuSlots>;
