import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Centered placeholder for empty lists/tables/search results: icon well,
 * headline, supporting copy, call to action.
 *
 * ```tsx
 * const e = emptyState();
 * <div className={e.root}>…</div>
 * ```
 */
export const emptyState = typestyles.recipe({
  name: 'empty-state',
  layer: 'components',
  slots: ['root', 'icon', 'title', 'description', 'action'],
  vars: {
    iconColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    iconBackground: {
      ...atProperty.color,
      value: t.color.background.subtle.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: t.space.xs.var,
          padding: `${t.space.xxxl.var} ${t.space.md.var}`,
        },
        icon: {
          display: 'grid',
          placeItems: 'center',
          width: t.size.media.sm.var,
          height: t.size.media.sm.var,
          borderRadius: '50%',
          color: vars.iconColor.var,
          backgroundColor: vars.iconBackground.var,
          marginBottom: t.space.xxs.var,
        },
        title: {
          margin: 0,
          fontSize: t.fontSize.lg.var,
          fontWeight: t.fontWeight.semibold.var,
        },
        description: {
          margin: 0,
          fontSize: t.fontSize.md.var,
          color: t.color.text.secondary.var,
          maxWidth: '40ch',
        },
        action: {
          marginTop: t.space.xs.var,
        },
      },
    };
  },
});
