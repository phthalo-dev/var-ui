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
          gap: t.space[2].var,
          padding: `${t.space[8].var} ${t.space[4].var}`,
        },
        icon: {
          display: 'grid',
          placeItems: 'center',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          color: vars.iconColor.var,
          backgroundColor: vars.iconBackground.var,
          marginBottom: t.space[1].var,
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
          marginTop: t.space[2].var,
        },
      },
    };
  },
});
