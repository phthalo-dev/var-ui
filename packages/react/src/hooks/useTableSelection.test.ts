import { describe, expect, it, vi } from 'vite-plus/test';
import { act, renderHook } from '@testing-library/react';
import { useTableSelection } from './useTableSelection';

type Row = { id: string; name: string };

const data: Row[] = [
  { id: 'a', name: 'Alice' },
  { id: 'b', name: 'Bob' },
  { id: 'c', name: 'Charlie' },
];

const getRowId = (row: Row) => row.id;

describe('useTableSelection', () => {
  it('starts empty when no default/controlled value are given', () => {
    const { result } = renderHook(() => useTableSelection({ data, getRowId, multiple: true }));
    expect(result.current.value).toEqual([]);
    expect(result.current.isSelected('a')).toBe(false);
  });

  it('respects defaultValue (uncontrolled)', () => {
    const { result } = renderHook(() =>
      useTableSelection({ data, getRowId, multiple: true, defaultValue: ['a', 'b'] }),
    );
    expect(result.current.value).toEqual(['a', 'b']);
    expect(result.current.isSelected('a')).toBe(true);
    expect(result.current.isSelected('c')).toBe(false);
  });

  it('multiple: toggle adds and removes keys', () => {
    const { result } = renderHook(() => useTableSelection({ data, getRowId, multiple: true }));
    act(() => result.current.toggle('a'));
    expect(result.current.value).toEqual(['a']);
    act(() => result.current.toggle('b'));
    expect(result.current.value).toEqual(['a', 'b']);
    act(() => result.current.toggle('a'));
    expect(result.current.value).toEqual(['b']);
  });

  it('single: toggle replaces the current selection', () => {
    const { result } = renderHook(() => useTableSelection({ data, getRowId }));
    act(() => result.current.toggle('a'));
    expect(result.current.value).toEqual(['a']);
    act(() => result.current.toggle('b'));
    expect(result.current.value).toEqual(['b']);
  });

  it('single: toggling the selected key again deselects it', () => {
    const { result } = renderHook(() => useTableSelection({ data, getRowId }));
    act(() => result.current.toggle('a'));
    expect(result.current.value).toEqual(['a']);
    act(() => result.current.toggle('a'));
    expect(result.current.value).toEqual([]);
  });

  it('selectAll selects every row id when multiple', () => {
    const { result } = renderHook(() => useTableSelection({ data, getRowId, multiple: true }));
    act(() => result.current.selectAll());
    expect(result.current.value).toEqual(['a', 'b', 'c']);
  });

  it('selectAll selects only the first row id when single', () => {
    const { result } = renderHook(() => useTableSelection({ data, getRowId }));
    act(() => result.current.selectAll());
    expect(result.current.value).toEqual(['a']);
  });

  it('clear empties the selection', () => {
    const { result } = renderHook(() =>
      useTableSelection({ data, getRowId, multiple: true, defaultValue: ['a', 'b'] }),
    );
    act(() => result.current.clear());
    expect(result.current.value).toEqual([]);
  });

  it('calls onValueChange whenever selection changes', () => {
    const onValueChange = vi.fn<(value: string[]) => void>();
    const { result } = renderHook(() =>
      useTableSelection({ data, getRowId, multiple: true, onValueChange }),
    );
    act(() => result.current.toggle('a'));
    expect(onValueChange).toHaveBeenCalledWith(['a']);
  });

  it('is controlled when value is provided — internal state does not change', () => {
    const onValueChange = vi.fn<(value: string[]) => void>();
    const { result, rerender } = renderHook(
      ({ value }: { value: string[] }) =>
        useTableSelection({ data, getRowId, multiple: true, value, onValueChange }),
      { initialProps: { value: ['a'] } },
    );
    expect(result.current.value).toEqual(['a']);

    act(() => result.current.toggle('b'));
    expect(onValueChange).toHaveBeenCalledWith(['a', 'b']);
    // Controlled: prop unchanged, so selection is unaffected by the internal toggle call.
    expect(result.current.value).toEqual(['a']);

    rerender({ value: ['a', 'b'] });
    expect(result.current.value).toEqual(['a', 'b']);
  });

  it('setValue on the result replaces the selection', () => {
    const onValueChange = vi.fn<(value: string[]) => void>();
    const { result } = renderHook(() =>
      useTableSelection({ data, getRowId, multiple: true, onValueChange }),
    );
    act(() => result.current.setValue(['c']));
    expect(result.current.value).toEqual(['c']);
    expect(onValueChange).toHaveBeenCalledWith(['c']);
  });
});
