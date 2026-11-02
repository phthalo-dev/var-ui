import { StrictMode } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { act, renderHook } from '@testing-library/react';
import { useControllableState } from './useControllableState';

describe('useControllableState', () => {
  it('stores its own state when uncontrolled and reports changes', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: 1, onChange }), {
      wrapper: StrictMode,
    });
    expect(result.current[0]).toBe(1);
    act(() => result.current[1](2));
    expect(result.current[0]).toBe(2);
    expect(onChange).toHaveBeenCalledExactlyOnceWith(2);
  });

  it('does not store state when controlled', () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState({ value, defaultValue: 0, onChange }),
      { initialProps: { value: 5 } },
    );
    act(() => result.current[1](6));
    expect(result.current[0]).toBe(5);
    expect(onChange).toHaveBeenCalledWith(6);
    rerender({ value: 6 });
    expect(result.current[0]).toBe(6);
  });

  it('skips no-op changes', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: 'a', onChange }));
    act(() => result.current[1]('a'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('compounds updaters within one batch and keeps setValue stable', () => {
    const { result } = renderHook(() => useControllableState({ defaultValue: 0 }));
    const setValue = result.current[1];
    act(() => {
      result.current[1]((n) => n + 1);
      result.current[1]((n) => n + 1);
    });
    expect(result.current[0]).toBe(2);
    expect(result.current[1]).toBe(setValue);
  });
});
