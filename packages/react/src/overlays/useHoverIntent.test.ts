import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import type { OverlayOpenChangeHandler } from './changeEvent';
import { useHoverIntent } from './useHoverIntent';
import { useOverlayRoot } from './useOverlayRoot';

describe('useHoverIntent', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  function setup(onOpenChange: OverlayOpenChangeHandler) {
    return renderHook(() => {
      const root = useOverlayRoot({ onOpenChange });
      return { root, intent: useHoverIntent(root, { openDelay: 100, closeDelay: 50 }) };
    });
  }

  it('opens after openDelay with reason hover and closes after closeDelay', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    const { result } = setup(onOpenChange);
    act(() => result.current.intent.scheduleOpen());
    act(() => void vi.advanceTimersByTime(99));
    expect(onOpenChange).not.toHaveBeenCalled();
    act(() => void vi.advanceTimersByTime(1));
    expect(onOpenChange.mock.calls[0]![0]).toBe(true);
    expect(onOpenChange.mock.calls[0]![1].reason).toBe('hover');
    act(() => result.current.intent.scheduleClose({ reason: 'focus' }));
    act(() => void vi.advanceTimersByTime(50));
    expect(onOpenChange.mock.calls[1]![0]).toBe(false);
    expect(onOpenChange.mock.calls[1]![1].reason).toBe('focus');
  });

  it('a later schedule cancels the pending opposite one', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    const { result } = setup(onOpenChange);
    act(() => result.current.intent.scheduleOpen());
    act(() => result.current.intent.scheduleClose());
    act(() => void vi.advanceTimersByTime(500));
    // close of an already-closed overlay is a no-op
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('clears the timer on unmount', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    const { result, unmount } = setup(onOpenChange);
    act(() => result.current.intent.scheduleOpen());
    unmount();
    act(() => void vi.advanceTimersByTime(500));
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
