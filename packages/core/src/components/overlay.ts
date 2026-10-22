import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { overlayIosAbsoluteBackdrop, overlayPresenceStyles } from '../shared/overlayMotion';

/**
 * Shared floating-layer chrome: a dimmed fixed backdrop plus a centered
 * positioner. Dialog, AlertDialog, and Lightbox overlays compose these
 * instead of re-declaring fixed-inset boxes. CommandPalette uses native
 * `<dialog>::backdrop` instead.
 *
 * ```tsx
 * const o = overlay();
 * <div className={o.backdrop} />
 * <div className={o.positioner}>{panel}</div>
 * ```
 */
export const overlay = typestyles.recipe({
  name: 'overlay',
  layer: 'components',
  slots: ['backdrop', 'positioner'],
  vars: {
    background: { ...atProperty.color, value: t.color.overlay.backdrop.var },
  },
  styles: ({ vars }) => {
    return {
      base: {
        backdrop: {
          ...overlayPresenceStyles(),
          ...overlayIosAbsoluteBackdrop,
          position: 'fixed',
          inset: 0,
          backgroundColor: vars.background.var,
        },
        positioner: {
          position: 'fixed',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          padding: t.space[4].var,
        },
      },
    };
  },
});
