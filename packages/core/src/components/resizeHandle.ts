import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Draggable/keyboard-resizable separator. Pair with the React `ResizeHandle`
 * (and `useResizable`), which drives `data-orientation` + drag/keyboard math.
 *
 * ```tsx
 * <div className={resizeHandle().root}>
 *   <div className={resizeHandle().pill} />
 * </div>
 * ```
 */
export const resizeHandle = typestyles.recipe(
  'resize-handle',
  (c) => {
    const v = c.vars({
      lineColor: {
        ...atProperty.color,
        value: t.color.border.default.var,
      },
      pillColor: {
        ...atProperty.color,
        value: t.color.border.strong.var,
      },
      focusRing: {
        ...atProperty.color,
        value: t.color.tone.accent.foreground.var,
      },
    });
    return {
      slots: ['root', 'pill'],
      root: {
        position: 'relative',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: v.lineColor.var,
        outline: 'none',
        '&[data-orientation="horizontal"]': {
          width: '1px',
          alignSelf: 'stretch',
          cursor: 'col-resize',
        },
        '&[data-orientation="vertical"]': {
          height: '1px',
          width: '100%',
          cursor: 'row-resize',
        },
        '&[data-collapsed]': {
          display: 'none',
        },
        '&:focus-visible': {
          outline: `2px solid ${v.focusRing.var}`,
          outlineOffset: '2px',
        },
      },
      pill: {
        width: '4px',
        height: '24px',
        borderRadius: t.radius.sm.var,
        backgroundColor: v.pillColor.var,
        pointerEvents: 'none',
        '[data-orientation="vertical"] &': {
          width: '24px',
          height: '4px',
        },
      },
    };
  },
  { layer: 'components' },
);
