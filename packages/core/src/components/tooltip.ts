import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { overlayPresenceStyles } from '../shared/overlayMotion';

/**
 * Compact dark-surface tooltip chrome.
 *
 * ```ts
 * const tip = tooltip();
 * <div className={tip.root}>More info</div>
 * ```
 */
export const tooltip = typestyles.recipe(
  'tooltip',
  (c) => {
    const v = c.vars({
      background: { ...atProperty.color, value: t.color.text.primary.var },
      foreground: { ...atProperty.color, value: t.color.background.surface.var },
    });
    return {
      slots: ['root'],
      root: {
        ...overlayPresenceStyles({ scale: true }),
        backgroundColor: v.background.var,
        color: v.foreground.var,
        fontSize: t.fontSize.sm.var,
        padding: `${t.space[1].var} ${t.space[2].var}`,
        borderRadius: t.radius.sm.var,
        boxShadow: t.shadow.sm.var,
        maxWidth: '16rem',
        lineHeight: 1.4,
      },
    };
  },
  { layer: 'components' },
);
