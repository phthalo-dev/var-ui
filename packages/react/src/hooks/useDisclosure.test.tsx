import { StrictMode } from 'react';
import { describe, expect, it } from 'vite-plus/test';
import { act, renderHook } from '@testing-library/react';
import { useDisclosure } from './useDisclosure';

describe('useDisclosure', () => {
  it('starts closed and honours the initial value', () => {
    expect(renderHook(() => useDisclosure()).result.current.open).toBe(false);
    expect(renderHook(() => useDisclosure(true)).result.current.open).toBe(true);
  });

  it('shows, hides, toggles and sets', () => {
    const { result } = renderHook(() => useDisclosure(), { wrapper: StrictMode });
    act(() => result.current.show());
    expect(result.current.open).toBe(true);
    act(() => result.current.hide());
    expect(result.current.open).toBe(false);
    act(() => result.current.toggle());
    expect(result.current.open).toBe(true);
    act(() => result.current.setOpen(false));
    expect(result.current.open).toBe(false);
  });

  it('keeps callbacks stable across renders', () => {
    const { result } = renderHook(() => useDisclosure());
    const { show, hide, toggle, setOpen } = result.current;
    act(() => result.current.toggle());
    expect(result.current.show).toBe(show);
    expect(result.current.hide).toBe(hide);
    expect(result.current.toggle).toBe(toggle);
    expect(result.current.setOpen).toBe(setOpen);
  });
});
