import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { overlayPresenceStyles } from '../shared/overlayMotion';

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
export const hoverCard = typestyles.recipe(
  'hover-card',
  (c) => {
    const v = c.vars({
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
    });
    return {
      slots: ['root', 'title', 'content'],
      root: {
        ...overlayPresenceStyles({ scale: true }),
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: v.border.var,
        borderRadius: t.radius.md.var,
        backgroundColor: v.background.var,
        boxShadow: t.shadow.md.var,
        minWidth: '14rem',
        maxWidth: '22rem',
        outline: 'none',
      },
      title: {
        fontSize: t.fontSize.md.var,
        fontWeight: t.fontWeight.semibold.var,
        color: v.titleForeground.var,
        margin: 0,
        padding: `${t.space[4].var} ${t.space[4].var} ${t.space[3].var}`,
      },
      content: {
        padding: `${t.space[3].var} ${t.space[4].var} ${t.space[4].var}`,
        outline: 'none',
      },
    };
  },
  { layer: 'components' },
);
