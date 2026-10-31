import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { anchored, popupSurface } from '../shared/anchored';

/**
 * Standalone popover panel chrome (distinct from menu/select popover slots). `root` is the
 * `[popover]` element, anchor-positioned from `data-placement` (see `shared/anchored`).
 *
 * ```ts
 * const p = popover();
 * <div className={p.root.className}>…</div>
 * ```
 */
export const popover = typestyles.recipe({
  name: 'popover',
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
          ...anchored(),
          ...popupSurface({ background: vars.background.var, border: vars.border.var }),
          minWidth: '12rem',
          outline: 'none',
        },
        title: {
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.semibold.var,
          color: vars.titleForeground.var,
          margin: 0,
          padding: `${t.space[3].var} ${t.space[3].var} ${t.space[2].var}`,
        },
        content: {
          padding: `${t.space[2].var} ${t.space[3].var} ${t.space[3].var}`,
          outline: 'none',
        },
      },
    };
  },
});
