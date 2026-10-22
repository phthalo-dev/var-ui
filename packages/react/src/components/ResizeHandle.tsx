import {
  useCallback,
  useRef,
  type JSX,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { resizeHandle } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type ResizeHandleProps = {
  /** @default 'horizontal' */
  direction?: 'horizontal' | 'vertical';
  value: number;
  minValue: number;
  maxValue: number;
  onChange: (next: number) => void;
  /** Fired on double-click/Enter — bind to `useResizable().collapse`/`toggle`. */
  onCollapse?: () => void;
  isCollapsed?: boolean;
  'aria-label'?: string;
  className?: string;
};

const ARROW_STEP = 10;
const ARROW_STEP_LARGE = 50;

type DragState = { startPos: number; startValue: number };

/**
 * Accessible drag/keyboard separator for single-region resize. Bind to
 * `useResizable().handleProps`; pair with a `SideNav`/`Layout*` region.
 *
 * Arrow keys nudge by 10px (50px with Shift); Home/End jump to min/max;
 * mouse drag tracks delta from the drag start on the inline axis (window
 * listeners so the drag keeps tracking once the cursor leaves the handle).
 */
export function ResizeHandle({
  direction = 'horizontal',
  value,
  minValue,
  maxValue,
  onChange,
  onCollapse,
  isCollapsed = false,
  'aria-label': ariaLabel,
  className,
}: ResizeHandleProps): JSX.Element {
  const s = resizeHandle();
  const dragState = useRef<DragState | null>(null);
  const isHorizontal = direction === 'horizontal';

  const clamp = useCallback(
    (next: number) => Math.min(Math.max(next, minValue), maxValue),
    [minValue, maxValue],
  );

  const handleDragMove = useCallback(
    (event: globalThis.MouseEvent) => {
      const drag = dragState.current;
      if (!drag) return;
      const pos = isHorizontal ? event.clientX : event.clientY;
      onChange(clamp(drag.startValue + (pos - drag.startPos)));
    },
    [clamp, isHorizontal, onChange],
  );

  const handleDragEnd = useCallback(() => {
    dragState.current = null;
    window.removeEventListener('mousemove', handleDragMove);
    window.removeEventListener('mouseup', handleDragEnd);
  }, [handleDragMove]);

  const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>): void => {
    if (isCollapsed) return;
    event.preventDefault();
    dragState.current = {
      startPos: isHorizontal ? event.clientX : event.clientY,
      startValue: value,
    };
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const increaseKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    const decreaseKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    const step = event.shiftKey ? ARROW_STEP_LARGE : ARROW_STEP;
    switch (event.key) {
      case increaseKey:
        event.preventDefault();
        onChange(clamp(value + step));
        break;
      case decreaseKey:
        event.preventDefault();
        onChange(clamp(value - step));
        break;
      case 'Home':
        event.preventDefault();
        onChange(minValue);
        break;
      case 'End':
        event.preventDefault();
        onChange(maxValue);
        break;
      case 'Enter':
        if (onCollapse) {
          event.preventDefault();
          onCollapse();
        }
        break;
      default:
        break;
    }
  };

  return (
    <div
      role="separator"
      aria-orientation={direction}
      aria-valuenow={value}
      aria-valuemin={minValue}
      aria-valuemax={maxValue}
      aria-label={ariaLabel}
      tabIndex={0}
      data-orientation={direction}
      data-collapsed={isCollapsed ? '' : undefined}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      onDoubleClick={onCollapse}
      {...mergeProps(s.root, className)}
    >
      <div {...mergeProps(s.pill)} />
    </div>
  );
}
