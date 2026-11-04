import { atProperty, type RecipeVariants } from 'typestyles';
import { orientation } from '../shared/variantAxes';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing as focusRingStyle } from '../internal/focusRing';
import { atForcedColors } from '../theme/conditions';

/**
 * Draggable/keyboard-resizable separator. Pair with the React `ResizeHandle`
 * (and `useResizable`), which drives the `orientation` variant + drag/keyboard math.
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
  variants: { orientation },
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
    /** How far the invisible grab area extends past the 1px line on each side. */
    hitOutset: { ...atProperty.length, value: '0.25rem' },
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
          '&[data-collapsed]': {
            display: 'none',
          },
          '&:focus-visible': {
            ...focusRingStyle,
            outline: `0.125rem solid ${vars.focusRing.var}`,
          },
        },
        pill: {
          width: '0.25rem',
          height: '1.5rem',
          borderRadius: t.radius.sm.var,
          backgroundColor: vars.pillColor.var,
          ...atForcedColors({ backgroundColor: 'CanvasText' }),
          pointerEvents: 'none',
        },
      },
      variants: {
        orientation: {
          horizontal: {
            root: {
              width: '0.0625rem',
              alignSelf: 'stretch',
              cursor: 'col-resize',
              '&::before': { insetBlock: 0, insetInline: `calc(${vars.hitOutset.var} * -1)` },
            },
          },
          vertical: {
            root: {
              height: '0.0625rem',
              width: '100%',
              cursor: 'row-resize',
              '&::before': { insetInline: 0, insetBlock: `calc(${vars.hitOutset.var} * -1)` },
            },
            pill: { width: '1.5rem', height: '0.25rem' },
          },
        },
      },
    };
  },
});

export type ResizeHandleVariantProps = RecipeVariants<typeof resizeHandle>;
