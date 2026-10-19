import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { clamp, type Hsv } from './convert';

export type PointerPoint = Pick<PointerEvent, 'clientX' | 'clientY'>;

export function getRelativePosition(
  rect: DOMRect,
  clientX: number,
  clientY: number,
): { x: number; y: number } {
  return {
    x: clamp((clientX - rect.left) / rect.width, 0, 1),
    y: clamp((clientY - rect.top) / rect.height, 0, 1),
  };
}

export function getHorizontalPosition(rect: DOMRect, clientX: number): number {
  return clamp((clientX - rect.left) / rect.width, 0, 1);
}

export function saturationValueFromPointer(
  rect: DOMRect,
  clientX: number,
  clientY: number,
): Pick<Hsv, 's' | 'v'> {
  const { x, y } = getRelativePosition(rect, clientX, clientY);
  return { s: x * 100, v: (1 - y) * 100 };
}

export function hueFromPointer(rect: DOMRect, clientX: number): number {
  return getHorizontalPosition(rect, clientX) * 360;
}

export function alphaFromPointer(rect: DOMRect, clientX: number): number {
  return getHorizontalPosition(rect, clientX);
}

export function bindPointerDrag(
  ref: RefObject<HTMLElement | null>,
  onMove: (event: PointerPoint) => void,
): (event: ReactPointerEvent) => void {
  return (event) => {
    const element = ref.current;
    if (!element) return;

    const move = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== event.pointerId) return;
      onMove(moveEvent);
    };

    const up = (upEvent: PointerEvent) => {
      if (upEvent.pointerId !== event.pointerId) return;
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerup', up);
      element.removeEventListener('pointercancel', up);
    };

    element.setPointerCapture(event.pointerId);
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerup', up);
    element.addEventListener('pointercancel', up);
    onMove(event);
  };
}
