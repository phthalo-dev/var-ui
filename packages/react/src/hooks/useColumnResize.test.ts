import { describe, expect, it, vi } from 'vite-plus/test';
import { act, renderHook } from '@testing-library/react';
import { useColumnResize, type ColumnWidths } from './useColumnResize';

const columns = ['name', 'status', 'region'];

describe('useColumnResize', () => {
  it('assigns default pixel widths to all columns', () => {
    const { result } = renderHook(() =>
      useColumnResize({
        columns,
        defaultWidths: { name: '200px', status: '120px' },
      }),
    );
    expect(result.current.getColumnProps('name').width).toBe('200px');
    expect(result.current.getColumnProps('status').width).toBe('120px');
    expect(result.current.getColumnProps('region').width).toMatch(/^\d+px$/);
  });

  it('updates adjacent column widths when resizing', () => {
    const { result } = renderHook(() =>
      useColumnResize({
        columns,
        defaultWidths: { name: '200px', status: '200px', region: '200px' },
        minWidth: 80,
      }),
    );

    act(() => result.current.getResizeHandleProps('name').onValueChange(240));

    expect(result.current.getColumnProps('name').width).toBe('240px');
    expect(result.current.getColumnProps('status').width).toBe('160px');
    expect(result.current.getColumnProps('region').width).toBe('200px');
  });

  it('clamps resize at minWidth for both columns', () => {
    const { result } = renderHook(() =>
      useColumnResize({
        columns: ['a', 'b'],
        defaultWidths: { a: '200px', b: '200px' },
        minWidth: 80,
      }),
    );

    act(() => result.current.getResizeHandleProps('a').onValueChange(360));
    expect(result.current.getColumnProps('a').width).toBe('200px');
    expect(result.current.getColumnProps('b').width).toBe('200px');
  });

  it('is controlled when widths are provided', () => {
    const onWidthsChange = vi.fn<(widths: ColumnWidths) => void>();
    const initial: ColumnWidths = { name: 200, status: 200, region: 200 };
    const { result, rerender } = renderHook(
      ({ widths }: { widths: ColumnWidths }) =>
        useColumnResize({ columns, widths, onWidthsChange }),
      { initialProps: { widths: initial } },
    );

    act(() => result.current.getResizeHandleProps('name').onValueChange(220));
    expect(onWidthsChange).toHaveBeenCalledWith({ name: 220, status: 180, region: 200 });
    expect(result.current.getColumnProps('name').width).toBe('200px');

    rerender({ widths: { name: 220, status: 180, region: 200 } });
    expect(result.current.getColumnProps('name').width).toBe('220px');
  });

  it('persists widths to localStorage when autoSaveId is set', () => {
    window.localStorage.clear();
    const { result } = renderHook(() =>
      useColumnResize({
        columns: ['a', 'b'],
        defaultWidths: { a: '160px', b: '160px' },
        autoSaveId: 'test-table',
        minWidth: 80,
      }),
    );

    act(() => result.current.getResizeHandleProps('a').onValueChange(180));
    expect(JSON.parse(window.localStorage.getItem('var-ui-column-resize:test-table')!)).toEqual({
      a: 180,
      b: 140,
    });
  });
});
