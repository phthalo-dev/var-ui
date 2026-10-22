import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Breadcrumb trail chrome. Pair with the React `Breadcrumbs` wrapper, which
 * composes this on top of RAC `Breadcrumbs`/`Breadcrumb`/`Link`.
 *
 * ```ts
 * const b = breadcrumbs();
 * <nav className={b.root}><ol className={b.list}>…</ol></nav>
 * ```
 */
export const breadcrumbs = typestyles.recipe({
  name: 'breadcrumbs',
  layer: 'components',
  slots: ['root', 'list', 'item', 'ellipsisItem', 'link'],
  vars: {
    separator: { value: '"/"', syntax: '*' },
    textColor: { ...atProperty.color, value: t.color.text.secondary.var },
    currentColor: { ...atProperty.color, value: t.color.text.primary.var },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          display: 'block',
        },
        list: {
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          gap: t.space[1].var,
        },
        item: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space[1].var,
          fontSize: t.fontSize.sm.var,
          color: vars.textColor.var,
          '&:not(:last-child)::after': {
            content: vars.separator.var,
            marginInlineStart: t.space[1].var,
            color: vars.textColor.var,
          },
          '&[data-current]': {
            color: vars.currentColor.var,
            fontWeight: t.fontWeight.medium.var,
          },
        },
        ellipsisItem: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space[1].var,
          fontSize: t.fontSize.sm.var,
          color: vars.textColor.var,
          '&:not(:last-child)::after': {
            content: vars.separator.var,
            marginInlineStart: t.space[1].var,
            color: vars.textColor.var,
          },
        },
        link: {
          color: 'inherit',
          textDecoration: 'none',
          appearance: 'none',
          border: 'none',
          background: 'transparent',
          padding: 0,
          font: 'inherit',
          cursor: 'pointer',
          '&:hover': {
            textDecoration: 'underline',
          },
          '&[data-disabled]': {
            cursor: 'default',
            textDecoration: 'none',
          },
        },
      },
    };
  },
});
