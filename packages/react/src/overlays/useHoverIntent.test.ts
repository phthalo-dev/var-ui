import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import type { OverlayOpenChangeHandler } from './changeEvent';
import { HOVER_WARM_UP_WINDOW, resetHoverWarmUp, useHoverIntent } from './useHoverIntent';
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

describe('useHoverIntent warm-up and Escape', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetHoverWarmUp();
  });
  afterEach(() => vi.useRealTimers());

  function setupWarm(onOpenChange: OverlayOpenChangeHandler, warmUp = true, defaultOpen = false) {
    return renderHook(() => {
      const root = useOverlayRoot({ onOpenChange, defaultOpen });
      return { root, intent: useHoverIntent(root, { openDelay: 700, closeDelay: 50, warmUp }) };
    });
  }

  it('opens with no delay when another warm overlay closed < 500ms ago, else waits', () => {
    const first = vi.fn<OverlayOpenChangeHandler>();
    const a = setupWarm(first, true, true);
    // `a` is open: a second warm overlay opens immediately
    const second = vi.fn<OverlayOpenChangeHandler>();
    const b = setupWarm(second);
    act(() => b.result.current.intent.scheduleOpen());
    expect(second).toHaveBeenCalledTimes(1);
    a.unmount();
    b.unmount();
    // both gone just now: still warm
    const third = vi.fn<OverlayOpenChangeHandler>();
    const c = setupWarm(third);
    act(() => c.result.current.intent.scheduleOpen());
    expect(third).toHaveBeenCalledTimes(1);
    // after the window, the full delay applies again
    act(() => void vi.advanceTimersByTime(HOVER_WARM_UP_WINDOW + 1));
    c.unmount();
    act(() => void vi.advanceTimersByTime(HOVER_WARM_UP_WINDOW + 1));
    const fourth = vi.fn<OverlayOpenChangeHandler>();
    const d = setupWarm(fourth);
    act(() => d.result.current.intent.scheduleOpen());
    expect(fourth).not.toHaveBeenCalled();
    act(() => void vi.advanceTimersByTime(700));
    expect(fourth).toHaveBeenCalledTimes(1);
  });

  it('without warmUp the delay always applies', () => {
    const a = setupWarm(vi.fn(), true, true);
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    const b = setupWarm(onOpenChange, false);
    act(() => b.result.current.intent.scheduleOpen());
    expect(onOpenChange).not.toHaveBeenCalled();
    a.unmount();
    b.unmount();
  });

  it('Escape while open closes with reason escape-key and is default-prevented', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    setupWarm(onOpenChange, false, true);
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    act(() => void document.dispatchEvent(event));
    expect(onOpenChange.mock.calls[0]![0]).toBe(false);
    expect(onOpenChange.mock.calls[0]![1].reason).toBe('escape-key');
    expect(event.defaultPrevented).toBe(true);
  });

  it('Escape does nothing while closed or with escape: false', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    setupWarm(onOpenChange, false, false);
    act(() => void document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('trigger props ignore touch pointers', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    const { result } = setupWarm(onOpenChange, false);
    act(() =>
      result.current.intent.triggerProps.onPointerEnter({
        pointerType: 'touch',
        nativeEvent: new Event('pointerenter'),
      } as never),
    );
    act(() => void vi.advanceTimersByTime(2000));
    expect(onOpenChange).not.toHaveBeenCalled();
    act(() =>
      result.current.intent.triggerProps.onPointerEnter({
        pointerType: 'mouse',
        nativeEvent: new Event('pointerenter'),
      } as never),
    );
    act(() => void vi.advanceTimersByTime(700));
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });
});
