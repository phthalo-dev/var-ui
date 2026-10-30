import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing as focusRingStyle } from '../internal/focusRing';
import { atForcedColors } from '../theme/conditions';

/**
 * Draggable/keyboard-resizable separator. Pair with the React `ResizeHandle`
 * (and `useResizable`), which drives `data-orientation` + drag/keyboard math.
 *
 * ```tsx
 * <div className={resizeHandle().root.className}>
 *   <div className={resizeHandle().pill.className} />
 * </div>
 * ```
 */
export const resizeHandle = typestyles.recipe({
  name: 'resize-handle',
  layer: 'components',
  slots: ['root', 'pill'],
  vars: {
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
      value: t.color.border.focus.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          position: 'relative',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: vars.lineColor.var,
          ...atForcedColors({ backgroundColor: 'CanvasText' }),
          outline: 'none',
          touchAction: 'none',
          // Invisible hit area: the visible line stays 1px, the grab target is wider.
          '&::before': {
            content: '""',
            position: 'absolute',
          },
          '&[data-orientation="horizontal"]::before': {
            insetBlock: 0,
            insetInline: '-4px',
          },
          '&[data-orientation="vertical"]::before': {
            insetInline: 0,
            insetBlock: '-4px',
          },
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
            ...focusRingStyle,
            outline: `2px solid ${vars.focusRing.var}`,
          },
        },
        pill: {
          width: '4px',
          height: '24px',
          borderRadius: t.radius.sm.var,
          backgroundColor: vars.pillColor.var,
          ...atForcedColors({ backgroundColor: 'CanvasText' }),
          pointerEvents: 'none',
          '[data-orientation="vertical"] &': {
            width: '24px',
            height: '4px',
          },
        },
      },
    };
  },
});
