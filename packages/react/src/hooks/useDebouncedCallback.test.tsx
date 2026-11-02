import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { renderHook } from '@testing-library/react';
import { useDebouncedCallback } from './useDebouncedCallback';

describe('useDebouncedCallback', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('runs once with the last arguments after the delay', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 100), { wrapper: StrictMode });
    result.current('a');
    result.current('b');
    vi.advanceTimersByTime(99);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledExactlyOnceWith('b');
  });

  it('cancel drops the pending call', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 100));
    result.current('a');
    result.current.cancel();
    vi.runAllTimers();
    expect(fn).not.toHaveBeenCalled();
  });

  it('flush runs the pending call now, once', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 100));
    result.current.flush();
    expect(fn).not.toHaveBeenCalled();
    result.current('a');
    result.current.flush();
    expect(fn).toHaveBeenCalledExactlyOnceWith('a');
    vi.runAllTimers();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('is stable, calls the latest fn, and cancels on unmount', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender, unmount } = renderHook(({ fn }) => useDebouncedCallback(fn, 100), {
      initialProps: { fn: first },
    });
    const debounced = result.current;
    result.current('x');
    rerender({ fn: second });
    expect(result.current).toBe(debounced);
    vi.runAllTimers();
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith('x');
    result.current('y');
    unmount();
    vi.runAllTimers();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
