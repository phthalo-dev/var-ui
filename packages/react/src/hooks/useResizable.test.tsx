import { describe, expect, it, vi } from 'vite-plus/test';
import { act, renderHook } from '@testing-library/react';
import { useResizable } from './useResizable';

describe('useResizable', () => {
  it('starts at defaultWidth 260', () => {
    const { result } = renderHook(() => useResizable(true));
    expect(result.current.width).toBe(260);
    expect(result.current.isCollapsed).toBe(false);
  });

  it('returns a usable result when config is false', () => {
    const { result } = renderHook(() => useResizable(false));
    expect(result.current.width).toBe(260);
    expect(typeof result.current.resize).toBe('function');
  });

  it('clamps resize to min/max', () => {
    const { result } = renderHook(() =>
      useResizable({ defaultWidth: 260, minWidth: 180, maxWidth: 480 }),
    );
    act(() => result.current.resize(100));
    expect(result.current.width).toBe(180);
    act(() => result.current.resize(900));
    expect(result.current.width).toBe(480);
  });

  it('collapse / expand toggles isCollapsed', () => {
    const { result } = renderHook(() => useResizable({ collapsible: true }));
    act(() => result.current.collapse());
    expect(result.current.isCollapsed).toBe(true);
    act(() => result.current.expand());
    expect(result.current.isCollapsed).toBe(false);
  });

  it('collapses when dragged below collapsedSize with collapsible enabled', () => {
    const { result } = renderHook(() =>
      useResizable({ collapsible: true, collapsedSize: 160, minWidth: 180 }),
    );
    act(() => result.current.resize(120));
    expect(result.current.isCollapsed).toBe(true);
    act(() => result.current.resize(300));
    expect(result.current.isCollapsed).toBe(false);
  });

  it('calls onWidthChange when resized', () => {
    const widths: number[] = [];
    const { result } = renderHook(() => useResizable({ onWidthChange: (w) => widths.push(w) }));
    act(() => result.current.resize(300));
    expect(widths).toEqual([300]);
  });

  it('exposes handleProps bound to current state', () => {
    const { result } = renderHook(() =>
      useResizable({ defaultWidth: 260, minWidth: 180, maxWidth: 480 }),
    );
    expect(result.current.handleProps).toMatchObject({
      direction: 'horizontal',
      value: 260,
      minValue: 180,
      maxValue: 480,
      collapsed: false,
    });
  });

  it('persists width when autoSaveId is set', () => {
    const key = 'var-ui-resizable:test-sidebar';
    localStorage.removeItem(key);
    const { result, unmount } = renderHook(() =>
      useResizable({ autoSaveId: 'test-sidebar', defaultWidth: 260 }),
    );
    act(() => result.current.resize(300));
    unmount();
    const { result: result2 } = renderHook(() =>
      useResizable({ autoSaveId: 'test-sidebar', defaultWidth: 260 }),
    );
    expect(result2.current.width).toBe(300);
    localStorage.removeItem(key);
  });

  it('returns independent regions for multi-region config', () => {
    const { result } = renderHook(() =>
      useResizable({
        regions: {
          start: { defaultWidth: 200, minWidth: 160, maxWidth: 300 },
          end: { defaultWidth: 380, minWidth: 320, maxWidth: 480 },
        },
      }),
    );
    expect(result.current.start.width).toBe(200);
    expect(result.current.end.width).toBe(380);
    act(() => result.current.end.resize(400));
    expect(result.current.end.width).toBe(400);
    expect(result.current.start.width).toBe(200);
  });

  it('prefixes autoSaveId per region key', () => {
    localStorage.removeItem('var-ui-resizable:panels:end');
    const { result, unmount } = renderHook(() =>
      useResizable({
        autoSaveId: 'panels',
        regions: { end: { defaultWidth: 380 } },
      }),
    );
    act(() => result.current.end.resize(420));
    unmount();
    const { result: result2 } = renderHook(() =>
      useResizable({ autoSaveId: 'panels', regions: { end: { defaultWidth: 380 } } }),
    );
    expect(result2.current.end.width).toBe(420);
    localStorage.removeItem('var-ui-resizable:panels:end');
  });

  it('renders defaultWidth on the server and applies the persisted width after mount', () => {
    localStorage.setItem('var-ui-resizable:ssr', '320');
    const seen: number[] = [];
    const { result } = renderHook(() => {
      const r = useResizable({ autoSaveId: 'ssr', defaultWidth: 260 });
      seen.push(r.width);
      return r;
    });
    expect(seen[0]).toBe(260);
    expect(result.current.width).toBe(320);
    localStorage.removeItem('var-ui-resizable:ssr');
  });

  it('does not throw when localStorage access throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const { result } = renderHook(() => useResizable({ autoSaveId: 'blocked', defaultWidth: 260 }));
    expect(result.current.width).toBe(260);
    spy.mockRestore();
  });
});
