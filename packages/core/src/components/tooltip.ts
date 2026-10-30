import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { atForcedColors } from '../theme/conditions';
import { forced } from '../internal/forcedColors';
import { overlayPresenceStyles } from '../shared/overlayMotion';
import { layerZIndex } from './layerVars';

/**
 * Compact dark-surface tooltip chrome.
 *
 * ```ts
 * const tip = tooltip();
 * <div className={tip.root}>More info</div>
 * ```
 */
export const tooltip = typestyles.recipe({
  name: 'tooltip',
  layer: 'components',
  slots: ['root'],
  vars: {
    background: { ...atProperty.color, value: t.color.text.primary.var },
    foreground: { ...atProperty.color, value: t.color.background.surface.var },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          ...overlayPresenceStyles({ scale: true }),
          backgroundColor: vars.background.var,
          color: vars.foreground.var,
          fontSize: t.fontSize.sm.var,
          padding: `${t.space[1].var} ${t.space[2].var}`,
          borderRadius: t.radius.sm.var,
          boxShadow: t.shadow.sm.var,
          ...atForcedColors(forced.boundary),
          ...layerZIndex(t.zIndex.dropdown.var),
          maxWidth: '16rem',
          lineHeight: 1.4,
        },
      },
    };
  },
});
