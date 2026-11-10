import { describe, expect, it, vi } from 'vite-plus/test';
import { act, renderHook } from '@testing-library/react';
import { useChatNewMessages } from './useChatNewMessages';

type ResizeCallback = () => void;

class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];
  callback: ResizeCallback;
  constructor(callback: ResizeCallback) {
    this.callback = callback;
    FakeResizeObserver.instances.push(this);
  }
  observe() {}
  disconnect() {}
  trigger() {
    this.callback();
  }
}

describe('useChatNewMessages', () => {
  it('calls onResize when locked and content grows', () => {
    (globalThis as { ResizeObserver: unknown }).ResizeObserver = FakeResizeObserver;
    FakeResizeObserver.instances = [];
    const onResize = vi.fn();
    const { result } = renderHook(() => useChatNewMessages({ locked: true, onResize }));

    const el = document.createElement('div');
    Object.defineProperty(el, 'scrollHeight', { value: 100, configurable: true });
    act(() => {
      result.current.contentRef(el);
    });

    Object.defineProperty(el, 'scrollHeight', { value: 200, configurable: true });
    act(() => {
      FakeResizeObserver.instances[0].trigger();
    });

    expect(onResize).toHaveBeenCalledTimes(1);
    expect(result.current.hasNewMessages).toBe(false);
  });

  it('sets hasNewMessages when unlocked and content grows, and dismiss clears it', () => {
    (globalThis as { ResizeObserver: unknown }).ResizeObserver = FakeResizeObserver;
    FakeResizeObserver.instances = [];
    const { result } = renderHook(() => useChatNewMessages({ locked: false }));

    const el = document.createElement('div');
    Object.defineProperty(el, 'scrollHeight', { value: 100, configurable: true });
    act(() => {
      result.current.contentRef(el);
    });

    Object.defineProperty(el, 'scrollHeight', { value: 200, configurable: true });
    act(() => {
      FakeResizeObserver.instances[0].trigger();
    });
    expect(result.current.hasNewMessages).toBe(true);

    act(() => {
      result.current.dismiss();
    });
    expect(result.current.hasNewMessages).toBe(false);
  });

  it('clears hasNewMessages when locked transitions to true', () => {
    (globalThis as { ResizeObserver: unknown }).ResizeObserver = FakeResizeObserver;
    FakeResizeObserver.instances = [];
    const { result, rerender } = renderHook(({ locked }) => useChatNewMessages({ locked }), {
      initialProps: { locked: false },
    });

    const el = document.createElement('div');
    Object.defineProperty(el, 'scrollHeight', { value: 100, configurable: true });
    act(() => {
      result.current.contentRef(el);
    });

    Object.defineProperty(el, 'scrollHeight', { value: 200, configurable: true });
    act(() => {
      FakeResizeObserver.instances[0].trigger();
    });
    expect(result.current.hasNewMessages).toBe(true);

    rerender({ locked: true });

    expect(result.current.hasNewMessages).toBe(false);
  });
});
