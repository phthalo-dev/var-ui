import { positioner } from '../components/positionerVars';
import { atReducedMotion } from '../theme/conditions';
import { designTokens as t } from '../tokens';

/**
 * Enter/exit opacity, with optional scale, for a floating layer.
 * Dialog, drawer, and popup recipes spread this onto their own slots so each
 * component keeps its public class names.
 */
export function overlayPresenceStyles(options: { scale?: boolean } = {}) {
  const scale = options.scale ?? false;
  return {
    transition: scale
      ? `${t.transition.panelEnter.var}, transform ${t.duration.slow.var} ${t.easing.emphasized.var}`
      : t.transition.backdrop.var,
    transformOrigin: positioner.vars.transformOrigin.var,
    '&[data-starting-style], &[data-ending-style]': {
      opacity: 0,
      ...(scale ? { transform: 'scale(0.98)' } : {}),
    },
    ...atReducedMotion({
      transition: 'none',
      transform: 'none',
      '&[data-starting-style], &[data-ending-style]': {
        opacity: 1,
      },
    }),
  };
}

/** iOS paints `position: fixed` backdrops against the layout viewport; pin them to the visual viewport. */
export const overlayIosAbsoluteBackdrop = {
  '@supports (-webkit-touch-callout: none)': {
    position: 'absolute',
    height: '100dvh',
  },
} as const;
