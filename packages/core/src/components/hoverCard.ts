import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { anchored, popupSurface } from '../shared/anchored';

/**
 * Non-modal rich preview card chrome — surface treatment like `popover`, with
 * slightly richer padding to accommodate denser preview content (avatars,
 * links, multi-line copy).
 *
 * ```ts
 * const hc = hoverCard();
 * <div className={hc.root}>…</div>
 * ```
 */
export const hoverCard = typestyles.recipe({
  name: 'hover-card',
  layer: 'components',
  slots: ['root', 'title', 'content'],
  vars: {
    background: {
      ...atProperty.color,
      value: t.color.background.surface.var,
    },
    border: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    titleForeground: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          ...anchored({ defaultPlacement: 'top', defaultAlign: 'center' }),
          ...popupSurface({ background: vars.background.var, border: vars.border.var }),
          minWidth: '14rem',
          maxWidth: '22rem',
          outline: 'none',
        },
        title: {
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.semibold.var,
          color: vars.titleForeground.var,
          margin: 0,
          padding: `${t.space[4].var} ${t.space[4].var} ${t.space[3].var}`,
        },
        content: {
          padding: `${t.space[3].var} ${t.space[4].var} ${t.space[4].var}`,
          outline: 'none',
        },
      },
    };
  },
});
