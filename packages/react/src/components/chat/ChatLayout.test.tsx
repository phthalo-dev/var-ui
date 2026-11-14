import { useState } from 'react';
import { describe, expect, it } from 'vite-plus/test';
import { render, screen, fireEvent } from '@testing-library/react';
import { IconProvider } from '../../icons';
import { ChatLayout } from './ChatLayout';

type ResizeCallback = () => void;

class CountingResizeObserver {
  static constructedCount = 0;
  callback: ResizeCallback;
  constructor(callback: ResizeCallback) {
    this.callback = callback;
    CountingResizeObserver.constructedCount += 1;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('ChatLayout', () => {
  it('renders children and the composer', () => {
    render(
      <IconProvider icons={{}}>
        <ChatLayout composer={<div data-testid="composer" />}>
          <div data-testid="messages">messages</div>
        </ChatLayout>
      </IconProvider>,
    );
    expect(screen.getByTestId('messages')).toBeTruthy();
    expect(screen.getByTestId('composer')).toBeTruthy();
  });

  it('renders emptyState when there are no children', () => {
    render(
      <IconProvider icons={{}}>
        <ChatLayout composer={<div />} emptyState={<span>Start a conversation</span>}>
          {null}
        </ChatLayout>
      </IconProvider>,
    );
    expect(screen.getByText('Start a conversation')).toBeTruthy();
  });

  it('hides the scroll button entirely when scrollButton is null', () => {
    render(
      <IconProvider icons={{}}>
        <ChatLayout composer={<div />} scrollButton={null}>
          <div>messages</div>
        </ChatLayout>
      </IconProvider>,
    );
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders a custom scrollButton override', () => {
    render(
      <IconProvider icons={{}}>
        <ChatLayout composer={<div />} scrollButton={<button type="button">Custom</button>}>
          <div>messages</div>
        </ChatLayout>
      </IconProvider>,
    );
    expect(screen.getByRole('button', { name: 'Custom' })).toBeTruthy();
  });

  it('does not recreate the ResizeObserver when an unrelated re-render occurs', () => {
    const originalResizeObserver = globalThis.ResizeObserver;
    (globalThis as { ResizeObserver: unknown }).ResizeObserver = CountingResizeObserver;
    CountingResizeObserver.constructedCount = 0;

    function Harness() {
      const [tick, setTick] = useState(0);
      return (
        <IconProvider icons={{}}>
          <button type="button" data-testid="bump" onClick={() => setTick((t) => t + 1)}>
            bump {tick}
          </button>
          <ChatLayout composer={<div data-testid="composer" />}>
            <div data-testid="messages">messages</div>
          </ChatLayout>
        </IconProvider>
      );
    }

    render(<Harness />);

    expect(CountingResizeObserver.constructedCount).toBe(1);

    fireEvent.click(screen.getByTestId('bump'));
    fireEvent.click(screen.getByTestId('bump'));

    expect(screen.getByTestId('bump').textContent).toBe('bump 2');
    expect(CountingResizeObserver.constructedCount).toBe(1);

    (globalThis as { ResizeObserver: unknown }).ResizeObserver = originalResizeObserver;
  });

  it('assigns the maxHeight variable on the root and preserves user style', () => {
    const { container } = render(
      <ChatLayout composer={<div />} maxHeight="20rem" style={{ borderRadius: '4px' }}>
        <div>messages</div>
      </ChatLayout>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue('--var-ui-chat-layout-maxheight')).toBe('20rem');
    expect(root.style.borderRadius).toBe('4px');
  });
});
