import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { atForcedColors } from '../theme/conditions';
import { forced } from '../internal/forcedColors';
import { anchored } from '../shared/anchored';

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
          ...anchored({ defaultPlacement: 'top', defaultAlign: 'center' }),
          backgroundColor: vars.background.var,
          color: vars.foreground.var,
          fontSize: t.fontSize.sm.var,
          padding: `${t.space[1].var} ${t.space[2].var}`,
          borderRadius: t.radius.sm.var,
          boxShadow: t.shadow.sm.var,
          ...atForcedColors(forced.boundary),
          maxWidth: '16rem',
          lineHeight: 1.4,
        },
      },
    };
  },
});
