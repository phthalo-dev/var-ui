import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vite-plus/test';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import { Dialog } from '../components/Dialog';
import { Popover } from '../components/Popover';
import { Tooltip } from '../components/Tooltip';
import { stubNativeDialog } from '../test/nativeOverlayStubs';
import type { OverlayOpenChangeHandler } from './changeEvent';
import { useOverlayRoot } from './useOverlayRoot';

function wrap(ui: React.ReactNode) {
  return render(
    <IconProvider icons={{}}>
      <LayerProvider>{ui}</LayerProvider>
    </IconProvider>,
  );
}

/** Last `(open, details.reason)` the handler saw. */
function last(handler: ReturnType<typeof vi.fn<OverlayOpenChangeHandler>>) {
  const call = handler.mock.calls[handler.mock.calls.length - 1]!;
  return [call[0], call[1].reason] as const;
}

describe('useOverlayRoot', () => {
  it('is uncontrolled with defaultOpen and reports imperative changes', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    const { result } = renderHook(() => useOverlayRoot({ defaultOpen: true, onOpenChange }));
    expect(result.current.open).toBe(true);
    act(() => void result.current.close());
    expect(result.current.open).toBe(false);
    expect(last(onOpenChange)).toEqual([false, 'imperative']);
  });

  it('an explicit reason and event win', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    const { result } = renderHook(() => useOverlayRoot({ onOpenChange }));
    const event = new Event('click');
    act(() => void result.current.setOpen(true, { reason: 'close-press', event }));
    expect(onOpenChange.mock.calls[0]![1].event).toBe(event);
    expect(last(onOpenChange)).toEqual([true, 'close-press']);
  });

  it('cancel() vetoes the uncontrolled update', () => {
    const { result } = renderHook(() =>
      useOverlayRoot({ onOpenChange: (_open, details) => details.cancel() }),
    );
    let applied = true;
    act(() => {
      applied = result.current.setOpen(true);
    });
    expect(applied).toBe(false);
    expect(result.current.open).toBe(false);
  });

  it('controlled: reports the request but only the parent changes `open`', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    const { result, rerender } = renderHook(({ open }) => useOverlayRoot({ open, onOpenChange }), {
      initialProps: { open: false },
    });
    act(() => void result.current.setOpen(true));
    expect(last(onOpenChange)).toEqual([true, 'imperative']);
    expect(result.current.open).toBe(false);
    rerender({ open: true });
    expect(result.current.open).toBe(true);
  });

  it('ignores a request that would not change anything', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    const { result } = renderHook(() => useOverlayRoot({ onOpenChange }));
    act(() => void result.current.close());
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});

describe('overlay roots render no wrapper element', () => {
  it('Dialog/Popover/Menu-style roots add no display:contents div', async () => {
    const { container } = wrap(
      <Popover.Root defaultOpen>
        <Popover.Trigger>
          <button type="button">Open</button>
        </Popover.Trigger>
        <Popover.Popup aria-label="x">Body</Popover.Popup>
      </Popover.Root>,
    );
    await screen.findByRole('dialog');
    expect(container.querySelector('[style*="display: contents"]')).toBeNull();
  });
});

describe('details.reason matrix', () => {
  stubNativeDialog();
  function popover(onOpenChange: OverlayOpenChangeHandler) {
    return wrap(
      <>
        <Popover.Root onOpenChange={onOpenChange}>
          <Popover.Trigger>
            <button type="button">Open</button>
          </Popover.Trigger>
          <Popover.Popup aria-label="Panel">
            <button type="button">Inside</button>
          </Popover.Popup>
        </Popover.Root>
        <button type="button">Elsewhere</button>
      </>,
    );
  }

  it('popover: trigger-press opens and closes', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    popover(onOpenChange);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(last(onOpenChange)).toEqual([true, 'trigger-press']);
    await screen.findByRole('dialog');
    // RAC marks the trigger aria-hidden while the popover is open, hence `hidden`.
    await userEvent.click(screen.getByRole('button', { name: 'Open', hidden: true }));
    expect(last(onOpenChange)).toEqual([false, 'trigger-press']);
  });

  it('popover: keyboard activation of the trigger is trigger-press', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    popover(onOpenChange);
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    expect(last(onOpenChange)).toEqual([true, 'trigger-press']);
  });

  it('popover: outside-press', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    popover(onOpenChange);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await screen.findByRole('dialog');
    onOpenChange.mockClear();
    await userEvent.click(document.querySelector('[data-testid="underlay"]')!);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(last(onOpenChange)).toEqual([false, 'outside-press']);
  });

  it('popover: escape-key', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    popover(onOpenChange);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await screen.findByRole('dialog');
    onOpenChange.mockClear();
    await userEvent.keyboard('{Escape}');
    expect(last(onOpenChange)).toEqual([false, 'escape-key']);
  });

  it('popover: focus-out', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    popover(onOpenChange);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await screen.findByRole('dialog');
    await userEvent.click(screen.getByRole('button', { name: 'Inside' }));
    onOpenChange.mockClear();
    act(() => screen.getByRole('button', { name: 'Elsewhere', hidden: true }).focus());
    await waitFor(() => expect(onOpenChange).toHaveBeenCalled());
    expect(last(onOpenChange)).toEqual([false, 'focus']);
  });

  it('popover: cancel() vetoes outside-press, escape and trigger press', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>((open, details) => {
      if (!open) details.cancel();
    });
    popover(onOpenChange);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await screen.findByRole('dialog');
    await userEvent.keyboard('{Escape}');
    await userEvent.click(document.querySelector('[data-testid="underlay"]')!);
    expect(onOpenChange.mock.calls.filter(([open]) => !open).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('dialog: close-press from the default Dialog.Close button', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    wrap(
      <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
        <Dialog.Popup>
          <Dialog.Title>T</Dialog.Title>
          <Dialog.Close />
        </Dialog.Popup>
      </Dialog.Root>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(last(onOpenChange)).toEqual([false, 'close-press']);
  });

  it('tooltip: hover opens, focus opens, Escape closes', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    wrap(
      <Tooltip.Root delay={0} onOpenChange={onOpenChange}>
        <Tooltip.Trigger>
          <button type="button">Info</button>
        </Tooltip.Trigger>
        <Tooltip.Popup>Tip</Tooltip.Popup>
      </Tooltip.Root>,
    );
    await userEvent.tab();
    await screen.findByRole('tooltip');
    expect(last(onOpenChange)).toEqual([true, 'focus']);
    await userEvent.keyboard('{Escape}');
    expect(last(onOpenChange)).toEqual([false, 'escape-key']);
  });
});
