import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Scroll-snap carousel. CSS does the snapping; the React wrapper only adds
 * prev/next buttons that nudge `scrollLeft`. Keyboard users can scroll the
 * viewport natively (the wrapper makes it focusable).
 *
 * ```tsx
 * const s = carousel();
 * <div className={s.viewport}>{items.map(i => <div className={s.item}>{i}</div>)}</div>
 * ```
 */
export const carousel = typestyles.recipe(
  'carousel',
  (c) => {
    const v = c.vars({
      itemWidth: { ...atProperty.length, value: '280px' },
      controlBackground: {
        ...atProperty.color,
        value: t.color.background.surface.var,
      },
      controlBorder: {
        ...atProperty.color,
        value: t.color.border.default.var,
      },
    });
    return {
      slots: ['root', 'viewport', 'item', 'controls', 'control'],
      root: { display: 'grid', gap: t.space[3].var },
      viewport: {
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: v.itemWidth.var,
        gap: t.space[3].var,
        overflowX: 'auto',
        overscrollBehaviorX: 'contain',
        scrollSnapType: 'x mandatory',
        scrollPaddingInline: t.space[1].var,
        paddingBlock: t.space[1].var,
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus.var}`,
          outlineOffset: '2px',
        },
      },
      item: { scrollSnapAlign: 'start', minWidth: 0 },
      controls: { display: 'flex', gap: t.space[2].var, justifyContent: 'flex-end' },
      control: {
        appearance: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: t.radius.md.var,
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: v.controlBorder.var,
        backgroundColor: v.controlBackground.var,
        cursor: 'pointer',
        '&:hover': { backgroundColor: t.color.background.subtle.var },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus.var}`,
          outlineOffset: '1px',
        },
      },
    };
  },
  { layer: 'components' },
);
