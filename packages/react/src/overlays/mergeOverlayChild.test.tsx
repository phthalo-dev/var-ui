import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { OverlayCloseContext, useOverlayClose } from './OverlayCloseContext';
import { mergeOverlayChild } from './mergeOverlayChild';

describe('mergeOverlayChild', () => {
  it('forwards onClick onto a single child', async () => {
    const parent = vi.fn();
    const child = vi.fn();
    const merged = mergeOverlayChild(
      <button type="button" onClick={child}>
        Go
      </button>,
      { onClick: parent },
    );
    render(merged);
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(child).toHaveBeenCalled();
    expect(parent).toHaveBeenCalled();
  });

  it('composes handlers child first', () => {
    const calls: string[] = [];
    const merged = mergeOverlayChild(
      <button
        type="button"
        onClick={() => calls.push('child-click')}
        onKeyDown={() => calls.push('child-keydown')}
        onPointerDown={() => calls.push('child-pointerdown')}
      />,
      {
        onClick: () => calls.push('parent-click'),
        onKeyDown: () => calls.push('parent-keydown'),
        onPointerDown: () => calls.push('parent-pointerdown'),
      },
    );

    // React 19 types `ReactElement['props']` as `unknown` unless the element is parameterized.
    const mergedProps = merged.props as {
      onClick: () => void;
      onKeyDown: () => void;
      onPointerDown: () => void;
    };
    mergedProps.onClick();
    mergedProps.onKeyDown();
    mergedProps.onPointerDown();

    expect(calls).toEqual([
      'child-click',
      'parent-click',
      'child-keydown',
      'parent-keydown',
      'child-pointerdown',
      'parent-pointerdown',
    ]);
  });

  it('composes onContextMenu child first', () => {
    const calls: string[] = [];
    const merged = mergeOverlayChild(
      <div onContextMenu={() => calls.push('child-contextmenu')} />,
      { onContextMenu: () => calls.push('parent-contextmenu') },
    );

    (merged.props as { onContextMenu: () => void }).onContextMenu();

    expect(calls).toEqual(['child-contextmenu', 'parent-contextmenu']);
  });

  it('composes onPress child first', () => {
    const calls: string[] = [];
    function PressHost({ onPress }: { onPress?: () => void }) {
      return (
        <button type="button" onClick={onPress}>
          Go
        </button>
      );
    }
    const merged = mergeOverlayChild(<PressHost onPress={() => calls.push('child-press')} />, {
      onPress: () => calls.push('parent-press'),
    });

    (merged.props as { onPress: () => void }).onPress();

    expect(calls).toEqual(['child-press', 'parent-press']);
  });

  it('merges class names and refs', () => {
    const childRef = createRef<HTMLButtonElement>();
    const parentRef = createRef<HTMLButtonElement>();
    const merged = mergeOverlayChild(<button ref={childRef} className="child" type="button" />, {
      className: 'parent',
      ref: parentRef,
    });

    render(merged);

    expect(screen.getByRole('button').className.split(' ')).toEqual(['child', 'parent']);
    expect(childRef.current).toBe(screen.getByRole('button'));
    expect(parentRef.current).toBe(screen.getByRole('button'));
  });

  it('composes callback refs child first', () => {
    const childRef = vi.fn();
    const parentRef = vi.fn();
    const merged = mergeOverlayChild(<button ref={childRef} type="button" />, {
      ref: parentRef,
    });

    render(merged);

    const button = screen.getByRole('button');
    expect(childRef).toHaveBeenCalledWith(button);
    expect(parentRef).toHaveBeenCalledWith(button);
    expect(childRef.mock.invocationCallOrder[0]).toBeLessThan(
      parentRef.mock.invocationCallOrder[0],
    );
  });

  it('throws when the child is not a valid element', () => {
    expect(() => mergeOverlayChild('not an element' as never, {})).toThrow();
  });
});

describe('useOverlayClose', () => {
  it('returns the close callback from context', () => {
    const close = vi.fn();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <OverlayCloseContext.Provider value={close}>{children}</OverlayCloseContext.Provider>
    );

    const { result } = renderHook(() => useOverlayClose(), { wrapper });

    expect(result.current).toBe(close);
  });

  it('throws outside a Popup', () => {
    expect(() => renderHook(() => useOverlayClose())).toThrow(
      'Close must be rendered inside a Popup',
    );
  });
});
