import { designTokens as t, typestyles } from '@var-ui/core';
import type { MultiSlotReturn } from 'typestyles';

type DocsThemePickerSlots = readonly ['root', 'menu', 'itemSwatch', 'itemReset'];

/**
 * No `variants` here, so this is a plain multi-slot recipe (each slot is a
 * className string). Because slot names don't collide with real CSS property
 * names, TS's `recipe()` overload resolution mistypes the call as
 * the slot-with-variants shape (`ComponentAttrsResult` per slot) — pin the real
 * runtime shape explicitly.
 */
export const docsThemePicker = typestyles.recipe(
  'docs-theme-picker',
  () => ({
    slots: ['root', 'menu', 'itemSwatch', 'itemReset'],
    root: {
      display: 'inline-flex',
      position: 'relative',
    },
    menu: {
      position: 'absolute',
      top: `calc(100% + ${t.space[2].var})`,
      right: 0,
    },
    itemSwatch: {
      display: 'block',
      width: '0.875rem',
      height: '0.875rem',
      borderRadius: t.radius.full.var,
      flexShrink: 0,
      boxShadow: `inset 0 0 0 1px ${t.color.border.default.var}`,
    },
    itemReset: {
      appearance: 'none',
      borderStyle: 'none',
      borderWidth: 0,
      background: 'transparent',
      boxShadow: 'none',
      margin: 0,
      font: 'inherit',
      color: 'inherit',
      width: '100%',
      textAlign: 'left',
      '&:hover, &[data-focused]': {
        backgroundColor: t.color.background.subtle.var,
      },
      '& [data-docs-theme-picker-check]': {
        visibility: 'hidden',
      },
      '&[aria-checked="true"] [data-docs-theme-picker-check]': {
        visibility: 'visible',
      },
    },
  }),
  { layer: 'utilities' },
) as unknown as MultiSlotReturn<DocsThemePickerSlots>;
