import { useState } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import type { OverlayOpenChangeHandler } from '../overlays';
import { Dialog } from './Dialog';
import { SimpleDialog } from './SimpleDialog';
import { Tooltip } from './Tooltip';

function renderReasonDialog(onOpenChange: OverlayOpenChangeHandler) {
  return render(
    <IconProvider icons={{}}>
      <LayerProvider>
        <Dialog.Root onOpenChange={onOpenChange}>
          <Dialog.Trigger>
            <button type="button">Custom</button>
          </Dialog.Trigger>
          <Dialog.Backdrop>
            <Dialog.Popup>
              <Dialog.Title>Only title</Dialog.Title>
            </Dialog.Popup>
          </Dialog.Backdrop>
        </Dialog.Root>
      </LayerProvider>
    </IconProvider>,
  );
}

describe('Dialog', () => {
  it('opens from a custom trigger and allows omitting Close', async () => {
    render(
      <IconProvider icons={{}}>
        <LayerProvider>
          <Dialog.Root>
            <Dialog.Trigger>
              <button type="button">Custom</button>
            </Dialog.Trigger>
            <Dialog.Backdrop>
              <Dialog.Popup>
                <Dialog.Title>Only title</Dialog.Title>
              </Dialog.Popup>
            </Dialog.Backdrop>
          </Dialog.Root>
        </LayerProvider>
      </IconProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Custom' }));
    expect(screen.getByText('Only title')).toBeTruthy();
    expect(screen.queryByLabelText('Close')).toBeNull();
  });

  it('supports controlled isOpen', async () => {
    function Controlled() {
      const [open, setOpen] = useState(true);
      return (
        <IconProvider icons={{}}>
          <LayerProvider>
            <Dialog.Root open={open} onOpenChange={(next) => setOpen(next)}>
              <Dialog.Backdrop>
                <Dialog.Popup>
                  <Dialog.Title>Pinned</Dialog.Title>
                </Dialog.Popup>
              </Dialog.Backdrop>
            </Dialog.Root>
          </LayerProvider>
        </IconProvider>
      );
    }
    render(<Controlled />);
    expect(screen.getByText('Pinned')).toBeTruthy();
  });

  it('opens and closes from isOpen', async () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <IconProvider icons={{}}>
          <LayerProvider>
            <>
              <button type="button" onClick={() => setOpen(true)}>
                Open
              </button>
              <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Backdrop>
                  <Dialog.Popup>
                    <Dialog.Title>Settings</Dialog.Title>
                  </Dialog.Popup>
                </Dialog.Backdrop>
              </Dialog.Root>
            </>
          </LayerProvider>
        </IconProvider>
      );
    }
    render(<Harness />);
    expect(screen.queryByRole('dialog')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(await screen.findByRole('dialog', { name: 'Settings' })).toBeTruthy();
  });

  it('nests Tooltip on Dialog.Trigger', async () => {
    render(
      <IconProvider icons={{}}>
        <LayerProvider>
          <Dialog.Root>
            <Tooltip.Root delay={0}>
              <Tooltip.Trigger>
                <Dialog.Trigger>
                  <button type="button">Custom</button>
                </Dialog.Trigger>
              </Tooltip.Trigger>
              <Tooltip.Popup>Opens the dialog</Tooltip.Popup>
            </Tooltip.Root>
            <Dialog.Backdrop>
              <Dialog.Popup>
                <Dialog.Title>Only title</Dialog.Title>
              </Dialog.Popup>
            </Dialog.Backdrop>
          </Dialog.Root>
        </LayerProvider>
      </IconProvider>,
    );
    await userEvent.tab();
    expect((await screen.findByRole('tooltip')).textContent).toBe('Opens the dialog');
  });

  it('still fires a Trigger child onClick', async () => {
    const onClick = vi.fn();
    const onPointerDown = vi.fn();
    render(
      <IconProvider icons={{}}>
        <LayerProvider>
          <Dialog.Root>
            <Dialog.Trigger>
              <button type="button" onClick={onClick} onPointerDown={onPointerDown}>
                Custom
              </button>
            </Dialog.Trigger>
            <Dialog.Backdrop>
              <Dialog.Popup>
                <Dialog.Title>Only title</Dialog.Title>
              </Dialog.Popup>
            </Dialog.Backdrop>
          </Dialog.Root>
        </LayerProvider>
      </IconProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Custom' }));
    expect(onClick).toHaveBeenCalled();
    expect(onPointerDown).toHaveBeenCalled();
    expect(screen.getByText('Only title')).toBeTruthy();
  });

  it('dismisses when Close wraps a native button', async () => {
    render(
      <IconProvider icons={{}}>
        <LayerProvider>
          <Dialog.Root defaultOpen>
            <Dialog.Backdrop>
              <Dialog.Popup>
                <Dialog.Title>Only title</Dialog.Title>
                <Dialog.Close>
                  <button type="button">Dismiss</button>
                </Dialog.Close>
              </Dialog.Popup>
            </Dialog.Backdrop>
          </Dialog.Root>
        </LayerProvider>
      </IconProvider>,
    );
    expect(screen.getByText('Only title')).toBeTruthy();
    await userEvent.click(screen.getByText('Dismiss'));
    await waitFor(() => expect(screen.queryByText('Only title')).toBeNull());
  });

  it('keeps the dialog open when cancel() is called while uncontrolled', async () => {
    const onOpenChange: OverlayOpenChangeHandler = (_next, details) => {
      details.cancel();
    };
    render(
      <IconProvider icons={{}}>
        <LayerProvider>
          <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
            <Dialog.Backdrop>
              <Dialog.Popup>
                <Dialog.Title>Pinned</Dialog.Title>
              </Dialog.Popup>
            </Dialog.Backdrop>
          </Dialog.Root>
        </LayerProvider>
      </IconProvider>,
    );
    expect(screen.getByText('Pinned')).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    expect(screen.getByText('Pinned')).toBeTruthy();
  });

  it('reports trigger-press when opened from the trigger', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    renderReasonDialog(onOpenChange);
    await userEvent.click(screen.getByRole('button', { name: 'Custom' }));
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(true);
    expect(onOpenChange.mock.calls[0]?.[1].reason).toBe('trigger-press');
  });

  it('reports outside-press when dismissed via the overlay', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    renderReasonDialog(onOpenChange);
    await userEvent.click(screen.getByRole('button', { name: 'Custom' }));
    onOpenChange.mockClear();

    const overlay = document.querySelector('.var-ui-dialog__overlay');
    expect(overlay).toBeTruthy();
    await userEvent.click(overlay!);

    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(false);
    expect(onOpenChange.mock.calls[0]?.[1].reason).toBe('outside-press');
  });

  it('reports escape-key when dismissed with Escape', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    renderReasonDialog(onOpenChange);
    await userEvent.click(screen.getByRole('button', { name: 'Custom' }));
    onOpenChange.mockClear();

    await userEvent.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(false);
    expect(onOpenChange.mock.calls[0]?.[1].reason).toBe('escape-key');
  });
});

describe('SimpleDialog', () => {
  it('opens on trigger press and shows the title/description', async () => {
    render(
      <IconProvider icons={{}}>
        <LayerProvider>
          <SimpleDialog triggerLabel="Open dialog" title="Confirm" description="Are you sure?" />
        </LayerProvider>
      </IconProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
    expect(screen.getByText('Confirm')).toBeTruthy();
    expect(screen.getByText('Are you sure?')).toBeTruthy();
  });

  it('portals the modal into a custom portalContainer when provided', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    render(
      <IconProvider icons={{}}>
        <LayerProvider>
          <SimpleDialog
            triggerLabel="Open dialog"
            title="Confirm"
            description="Are you sure?"
            portalContainer={container}
          />
        </LayerProvider>
      </IconProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));

    const heading = await screen.findByText('Confirm');
    expect(container.contains(heading)).toBe(true);

    document.body.removeChild(container);
  });

  it('describes the dialog with Dialog.Description only when rendered', async () => {
    render(
      <IconProvider icons={{}}>
        <Dialog.Root defaultOpen>
          <Dialog.Backdrop>
            <Dialog.Popup>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Helpful text</Dialog.Description>
            </Dialog.Popup>
          </Dialog.Backdrop>
        </Dialog.Root>
        <Dialog.Root defaultOpen>
          <Dialog.Backdrop>
            <Dialog.Popup>
              <Dialog.Title>Bare</Dialog.Title>
            </Dialog.Popup>
          </Dialog.Backdrop>
        </Dialog.Root>
      </IconProvider>,
    );
    const dialogs = await screen.findAllByRole('dialog', { hidden: true });
    expect(dialogs).toHaveLength(2);
    const describedBy = dialogs[0].getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)?.textContent).toBe('Helpful text');
    expect(dialogs[1].hasAttribute('aria-describedby')).toBe(false);
  });
});
