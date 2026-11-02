import { StrictMode, useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { fireEvent, render, renderHook } from '@testing-library/react';
import { matchesHotkey, useHotkeys } from './useHotkeys';

describe('matchesHotkey', () => {
  afterEach(() => vi.restoreAllMocks());

  it('matches combos with exact modifiers and aliases', () => {
    const ev = (init: KeyboardEventInit) => new KeyboardEvent('keydown', init);
    expect(matchesHotkey(ev({ key: 'p', ctrlKey: true, shiftKey: true }), 'ctrl+shift+p')).toBe(
      true,
    );
    expect(matchesHotkey(ev({ key: 'p', ctrlKey: true }), 'ctrl+shift+p')).toBe(false);
    expect(matchesHotkey(ev({ key: ' ', altKey: true }), 'alt+space')).toBe(true);
    expect(matchesHotkey(ev({ key: 'Escape' }), 'esc')).toBe(true);
    expect(matchesHotkey(ev({ key: 'k' }), '')).toBe(false);
  });

  it('resolves mod per platform', () => {
    vi.spyOn(navigator, 'platform', 'get').mockReturnValue('MacIntel');
    expect(matchesHotkey(new KeyboardEvent('keydown', { key: 'k', metaKey: true }), 'mod+k')).toBe(
      true,
    );
    expect(matchesHotkey(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }), 'mod+k')).toBe(
      false,
    );
  });
});

describe('useHotkeys', () => {
  it('runs the handler and prevents default', () => {
    const handler = vi.fn();
    vi.spyOn(navigator, 'platform', 'get').mockReturnValue('Win32');
    renderHook(() => useHotkeys({ 'mod+k': handler }), { wrapper: StrictMode });
    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, cancelable: true });
    window.dispatchEvent(event);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it('ignores typing targets by default and honours ignoreInputs: false', () => {
    const handler = vi.fn();
    const { unmount } = render(<input aria-label="q" />);
    const input = document.querySelector('input')!;
    const hook = renderHook(
      ({ ignore }) => useHotkeys({ '/': handler }, { ignoreInputs: ignore }),
      {
        initialProps: { ignore: true },
      },
    );
    fireEvent.keyDown(input, { key: '/' });
    expect(handler).not.toHaveBeenCalled();
    fireEvent.keyDown(document.body, { key: '/' });
    expect(handler).toHaveBeenCalledTimes(1);
    hook.rerender({ ignore: false });
    fireEvent.keyDown(input, { key: '/' });
    expect(handler).toHaveBeenCalledTimes(2);
    unmount();
  });

  it('ignores contenteditable and key repeat', () => {
    const handler = vi.fn();
    renderHook(() => useHotkeys({ a: handler }));
    const editable = document.createElement('div');
    editable.contentEditable = 'true';
    // jsdom does not implement isContentEditable.
    Object.defineProperty(editable, 'isContentEditable', { value: true });
    document.body.append(editable);
    fireEvent.keyDown(editable, { key: 'a' });
    fireEvent.keyDown(document.body, { key: 'a', repeat: true });
    expect(handler).not.toHaveBeenCalled();
    editable.remove();
  });

  it('uses the latest handler without re-attaching, and honours enabled', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(({ fn, enabled }) => useHotkeys({ b: fn }, { enabled }), {
      initialProps: { fn: first, enabled: true },
    });
    rerender({ fn: second, enabled: true });
    fireEvent.keyDown(document.body, { key: 'b' });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
    rerender({ fn: second, enabled: false });
    fireEvent.keyDown(document.body, { key: 'b' });
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('can listen on a ref target', () => {
    const handler = vi.fn();
    function Fixture() {
      const ref = useRef<HTMLDivElement>(null);
      useHotkeys({ x: handler }, { target: ref });
      return <div ref={ref} data-testid="scope" />;
    }
    const { getByTestId } = render(<Fixture />);
    fireEvent.keyDown(document.body, { key: 'x' });
    expect(handler).not.toHaveBeenCalled();
    fireEvent.keyDown(getByTestId('scope'), { key: 'x' });
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
