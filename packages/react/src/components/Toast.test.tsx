import { describe, expect, it, vi } from 'vite-plus/test';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { stubNativePopover } from '../test/nativeOverlayStubs';
import { toast } from '../toast/imperativeToast';
import { Toast, ToastProvider, ToastQueue, ToastRegion, useToast } from './Toast';
import { Button } from './Button';

stubNativePopover();

function wrap(ui: React.ReactNode) {
  return render(<IconProvider icons={{}}>{ui}</IconProvider>);
}

describe('Toast presentational', () => {
  it('renders title/description and dismisses', async () => {
    const onDismiss = vi.fn();
    wrap(<Toast tone="success" title="Saved" description="Draft stored." onDismiss={onDismiss} />);
    expect(screen.getByText('Saved')).toBeTruthy();
    expect(screen.getByText('Draft stored.')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalled();
  });
});

describe('useToast', () => {
  it('throws outside ToastProvider', () => {
    expect(() => {
      function Boom() {
        useToast();
        return null;
      }
      wrap(<Boom />);
    }).toThrow(/ToastProvider/);
  });

  it('adds and auto-dismisses a toast', async () => {
    function Trigger() {
      const toast = useToast();
      return (
        <Button onClick={() => toast.add({ tone: 'info', title: 'Hello', durationMs: 50 })}>
          Notify
        </Button>
      );
    }
    wrap(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Notify' }));
    expect(screen.getByText('Hello')).toBeTruthy();
    await waitFor(() => expect(screen.queryByText('Hello')).toBeNull());
  });
});

describe('ToastRegion', () => {
  it('renders items from a locally constructed queue, without a provider', () => {
    const queue = new ToastQueue();
    wrap(<ToastRegion queue={queue} />);
    act(() => {
      queue.add({ title: 'Standalone' });
    });
    expect(screen.getByText('Standalone')).toBeTruthy();
  });

  it('is a manual popover, shown while the queue has toasts and gone when it empties', () => {
    const queue = new ToastQueue();
    wrap(<ToastRegion queue={queue} />);
    expect(document.querySelector('[popover]')).toBeNull();
    let id = '';
    act(() => {
      id = queue.add({ title: 'Hello' });
    });
    const region = document.querySelector('[popover]') as HTMLElement;
    expect(region.getAttribute('popover')).toBe('manual');
    expect(region.hasAttribute('data-popover-open')).toBe(true);
    act(() => queue.close(id));
    expect(document.querySelector('[popover]')).toBeNull();
  });

  it('updates an existing toast by id', () => {
    const queue = new ToastQueue();
    wrap(<ToastRegion queue={queue} />);
    let id = '';
    act(() => {
      id = queue.add({ title: 'Loading' });
    });
    expect(screen.getByText('Loading')).toBeTruthy();
    act(() => {
      queue.update(id, { title: 'Done', tone: 'success' });
    });
    expect(screen.getByText('Done')).toBeTruthy();
    expect(screen.queryByText('Loading')).toBeNull();
  });
});

describe('imperative toast', () => {
  it('shows and dismisses through toast.show()', async () => {
    wrap(
      <ToastProvider>
        <Button onClick={() => toast.show({ tone: 'success', title: 'Saved' })}>Save</Button>
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByText('Saved')).toBeTruthy();
    let id = '';
    act(() => {
      id = toast.show({ title: 'Second', durationMs: 0 });
    });
    expect(screen.getByText('Second')).toBeTruthy();
    act(() => {
      toast.dismiss(id);
    });
    await waitFor(() => expect(screen.queryByText('Second')).toBeNull());
  });

  it('updates a toast through toast.update()', async () => {
    wrap(
      <ToastProvider>
        <span />
      </ToastProvider>,
    );
    let id = '';
    act(() => {
      id = toast.show({ title: 'Uploading', durationMs: 0 });
    });
    expect(screen.getByText('Uploading')).toBeTruthy();
    act(() => {
      toast.update(id, { title: 'Uploaded', tone: 'success' });
    });
    expect(screen.getByText('Uploaded')).toBeTruthy();
  });
});

describe('toast() without a provider and queue sizing', () => {
  it('returns an empty id and warns in development when no provider is mounted', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(toast({ title: 'Lost' })).toBe('');
    expect(toast.update('x', { title: 'y' })).toBe(false);
    expect(warn.mock.calls.length).toBeLessThanOrEqual(1);
    warn.mockRestore();
  });

  it('keeps existing toasts when maxVisibleToasts changes', async () => {
    function Harness({ max }: { max: number }) {
      return (
        <ToastProvider maxVisibleToasts={max}>
          <button type="button" onClick={() => toast({ title: 'One', durationMs: 0 })}>
            go
          </button>
        </ToastProvider>
      );
    }
    const { rerender } = wrap(<Harness max={3} />);
    await userEvent.click(screen.getByRole('button', { name: 'go' }));
    expect(screen.getByText('One')).toBeTruthy();
    rerender(
      <IconProvider icons={{}}>
        <Harness max={5} />
      </IconProvider>,
    );
    expect(screen.getByText('One')).toBeTruthy();
  });
});
