import { useRef } from 'react';
import { describe, expect, it } from 'vite-plus/test';
import { fireEvent, render, screen } from '@testing-library/react';
import { arrowDelta, stepRovingItem, useRovingFocus } from './useRovingFocus';

function Row({ wrap = false, orientation }: { wrap?: boolean; orientation?: 'vertical' }) {
  const ref = useRef<HTMLDivElement>(null);
  const roving = useRovingFocus(ref, { itemSelector: '[data-item]', wrap, orientation });
  return (
    <div ref={ref} onKeyDown={roving.onKeyDown} onFocus={roving.onFocus}>
      <button data-item>a</button>
      <button data-item disabled>
        b
      </button>
      <button data-item aria-disabled="true">
        c
      </button>
      <button data-item>d</button>
      <button>not an item</button>
    </div>
  );
}

describe('useRovingFocus', () => {
  it('gives the first enabled item the only tab stop and follows focus', () => {
    render(<Row />);
    expect(screen.getByText('a').tabIndex).toBe(0);
    expect(screen.getByText('d').tabIndex).toBe(-1);
    expect(screen.getByText('not an item').tabIndex).toBe(0);
    fireEvent.focus(screen.getByText('d'));
    expect(screen.getByText('d').tabIndex).toBe(0);
    expect(screen.getByText('a').tabIndex).toBe(-1);
  });

  it('skips disabled and aria-disabled items, stops at the ends unless wrapping', () => {
    const { unmount } = render(<Row />);
    screen.getByText('a').focus();
    fireEvent.keyDown(screen.getByText('a'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(screen.getByText('d'));
    fireEvent.keyDown(screen.getByText('d'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(screen.getByText('d'));
    unmount();
    render(<Row wrap />);
    screen.getByText('d').focus();
    fireEvent.keyDown(screen.getByText('d'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(screen.getByText('a'));
  });

  it('uses Up/Down when vertical', () => {
    render(<Row orientation="vertical" />);
    screen.getByText('a').focus();
    fireEvent.keyDown(screen.getByText('a'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(screen.getByText('a'));
    fireEvent.keyDown(screen.getByText('a'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByText('d'));
  });

  it('helpers: arrowDelta mirrors in RTL, stepRovingItem wraps', () => {
    expect(arrowDelta('ArrowRight', 'horizontal', false)).toBe(1);
    expect(arrowDelta('ArrowRight', 'horizontal', true)).toBe(-1);
    expect(arrowDelta('ArrowDown', 'horizontal', false)).toBe(0);
    expect(arrowDelta('ArrowUp', 'vertical', true)).toBe(-1);
    const els = [document.createElement('i'), document.createElement('i')] as HTMLElement[];
    expect(stepRovingItem(els, els[1]!, 1, true)).toBe(els[0]);
    expect(stepRovingItem(els, els[1]!, 1, false)).toBeUndefined();
  });
});
