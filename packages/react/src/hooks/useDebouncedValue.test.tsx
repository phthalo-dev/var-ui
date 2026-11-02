import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { act, renderHook } from '@testing-library/react';
import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('updates after the value has been quiet for the delay', () => {
    const { result, rerender } = renderHook(({ v }) => useDebouncedValue(v, 200), {
      initialProps: { v: 'a' },
      wrapper: StrictMode,
    });
    expect(result.current).toBe('a');
    rerender({ v: 'b' });
    act(() => void vi.advanceTimersByTime(150));
    rerender({ v: 'c' });
    act(() => void vi.advanceTimersByTime(150));
    expect(result.current).toBe('a');
    act(() => void vi.advanceTimersByTime(50));
    expect(result.current).toBe('c');
  });

  it('leading updates immediately, then trails', () => {
    const { result, rerender } = renderHook(
      ({ v }) => useDebouncedValue(v, 200, { leading: true }),
      { initialProps: { v: 'a' }, wrapper: StrictMode },
    );
    act(() => void vi.advanceTimersByTime(200));
    rerender({ v: 'b' });
    expect(result.current).toBe('b');
    rerender({ v: 'c' });
    expect(result.current).toBe('b');
    act(() => void vi.advanceTimersByTime(200));
    expect(result.current).toBe('c');
  });

  it('does not update after unmount', () => {
    const { rerender, unmount } = renderHook(({ v }) => useDebouncedValue(v, 100), {
      initialProps: { v: 1 },
    });
    rerender({ v: 2 });
    unmount();
    expect(() => act(() => void vi.runAllTimers())).not.toThrow();
  });
});
