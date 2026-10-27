import {
  useCallback,
  useRef,
  type JSX,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
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

type DragState = { pointerId: number; startPos: number; startValue: number };

/**
 * Accessible drag/keyboard separator for single-region resize. Bind to
 * `useResizable().handleProps`; pair with a `SideNav`/`Layout*` region.
 *
 * Arrow keys nudge by 10px (50px with Shift); Home/End jump to min/max;
 * mouse, touch, and pen drags use pointer events with pointer capture, so the
 * drag keeps tracking once the pointer leaves the handle. The visible line is
 * 1px, but the grab target extends a few px past it on both sides.
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

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (dragState.current != null) return;
    if (isCollapsed || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    dragState.current = {
      pointerId: event.pointerId,
      startPos: isHorizontal ? event.clientX : event.clientY,
      startValue: value,
    };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Capture unavailable (synthetic events); the drag still tracks while over the handle.
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const pos = isHorizontal ? event.clientX : event.clientY;
    onChange(clamp(drag.startValue + (pos - drag.startPos)));
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (dragState.current?.pointerId !== event.pointerId) return;
    dragState.current = null;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Already released (e.g. `pointercancel`).
    }
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
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onKeyDown={handleKeyDown}
      onDoubleClick={onCollapse}
      {...mergeProps(s.root, className)}
    >
      <div {...mergeProps(s.pill)} />
    </div>
  );
}
