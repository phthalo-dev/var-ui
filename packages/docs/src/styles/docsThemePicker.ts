import { typestyles } from '@var-ui/core';
import type { MultiSlotReturn } from 'typestyles';

type DocsThemePickerSlots = readonly ['root'];

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
    slots: ['root'],
    root: {
      display: 'inline-flex',
    },
  }),
  { layer: 'utilities' },
) as unknown as MultiSlotReturn<DocsThemePickerSlots>;
