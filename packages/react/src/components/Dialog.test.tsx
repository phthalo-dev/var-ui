import { useState } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import type { OverlayOpenChangeHandler } from '../overlays';
import { stubNativeDialog, stubNativePopover } from '../test/nativeOverlayStubs';
import { Button } from './Button';
import { Dialog, type DialogRootProps } from './Dialog';
import { Tooltip } from './Tooltip';

// API-shape tests. Platform behaviour (Escape, backdrop, focus, inert, animation) is covered in
// Dialog.browser.test.tsx.
stubNativeDialog();
stubNativePopover();

function renderDialog(props: Partial<DialogRootProps>) {
  return render(
    <IconProvider icons={{}}>
      <Dialog.Root {...props}>
        <Dialog.Trigger>
          <button type="button">Custom</button>
        </Dialog.Trigger>
        <Dialog.Popup>
          <Dialog.Title>Only title</Dialog.Title>
        </Dialog.Popup>
      </Dialog.Root>
    </IconProvider>,
  );
}

describe('Dialog', () => {
  it('renders a native <dialog> as the popup, open after the trigger is pressed', async () => {
    renderDialog({});
    const dialog = document.querySelector('dialog') as HTMLDialogElement;
    expect(dialog).toBeTruthy();
    expect(dialog.open).toBe(false);
    expect(screen.queryByText('Only title')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Custom' }));
    expect(dialog.open).toBe(true);
    expect(screen.getByText('Only title')).toBeTruthy();
    expect(screen.queryByLabelText('Close')).toBeNull();
  });

  it('puts aria-haspopup and aria-expanded on the trigger and labels the dialog by its title', async () => {
    renderDialog({});
    const trigger = screen.getByRole('button', { name: 'Custom' });
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    await userEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('dialog', { name: 'Only title' })).toBeTruthy();
  });

  it('supports controlled open', () => {
    function Controlled() {
      const [open, setOpen] = useState(true);
      return (
        <Dialog.Root open={open} onOpenChange={(next) => setOpen(next)}>
          <Dialog.Popup>
            <Dialog.Title>Pinned</Dialog.Title>
          </Dialog.Popup>
        </Dialog.Root>
      );
    }
    render(<Controlled />);
    expect(screen.getByText('Pinned')).toBeTruthy();
  });

  it('opens and closes from the open prop', async () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen((o) => !o)}>
            Toggle
          </button>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Popup>
              <Dialog.Title>Settings</Dialog.Title>
            </Dialog.Popup>
          </Dialog.Root>
        </>
      );
    }
    render(<Harness />);
    expect(screen.queryByRole('dialog')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(await screen.findByRole('dialog', { name: 'Settings' })).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    await waitFor(() => expect(screen.queryByText('Settings')).toBeNull());
  });

  it('nests Tooltip on Dialog.Trigger', async () => {
    render(
      <IconProvider icons={{}}>
        <Dialog.Root>
          <Tooltip.Root openDelay={0}>
            <Tooltip.Trigger>
              <Dialog.Trigger>
                <button type="button">Custom</button>
              </Dialog.Trigger>
            </Tooltip.Trigger>
            <Tooltip.Popup>Opens the dialog</Tooltip.Popup>
          </Tooltip.Root>
          <Dialog.Popup>
            <Dialog.Title>Only title</Dialog.Title>
          </Dialog.Popup>
        </Dialog.Root>
      </IconProvider>,
    );
    await userEvent.tab();
    expect((await screen.findByRole('tooltip')).textContent).toBe('Opens the dialog');
  });

  it('merges onto a component trigger child too', async () => {
    render(
      <IconProvider icons={{}}>
        <Dialog.Root>
          <Dialog.Trigger>
            <Button>Open dialog</Button>
          </Dialog.Trigger>
          <Dialog.Popup>
            <Dialog.Title>Body</Dialog.Title>
          </Dialog.Popup>
        </Dialog.Root>
      </IconProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
    expect(screen.getByText('Body')).toBeTruthy();
  });

  it('still fires a Trigger child onClick', async () => {
    const onClick = vi.fn();
    const onPointerDown = vi.fn();
    render(
      <Dialog.Root>
        <Dialog.Trigger>
          <button type="button" onClick={onClick} onPointerDown={onPointerDown}>
            Custom
          </button>
        </Dialog.Trigger>
        <Dialog.Popup>
          <Dialog.Title>Only title</Dialog.Title>
        </Dialog.Popup>
      </Dialog.Root>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Custom' }));
    expect(onClick).toHaveBeenCalled();
    expect(onPointerDown).toHaveBeenCalled();
    expect(screen.getByText('Only title')).toBeTruthy();
  });

  it('dismisses when Close wraps a native button', async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Popup>
          <Dialog.Title>Only title</Dialog.Title>
          <Dialog.Close>
            <button type="button">Dismiss</button>
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Root>,
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
      <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
        <Dialog.Popup>
          <Dialog.Title>Pinned</Dialog.Title>
          <Dialog.Close />
        </Dialog.Popup>
      </Dialog.Root>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.getByText('Pinned')).toBeTruthy();
  });

  it('reports trigger-press when opened from the trigger and close-press from Close', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(
      <IconProvider icons={{}}>
        <Dialog.Root onOpenChange={onOpenChange}>
          <Dialog.Trigger>
            <button type="button">Custom</button>
          </Dialog.Trigger>
          <Dialog.Popup>
            <Dialog.Close />
          </Dialog.Popup>
        </Dialog.Root>
      </IconProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Custom' }));
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(true);
    expect(onOpenChange.mock.calls[0]?.[1].reason).toBe('trigger-press');
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange.mock.calls[1]?.[0]).toBe(false);
    expect(onOpenChange.mock.calls[1]?.[1].reason).toBe('close-press');
  });

  it('describes the dialog with Dialog.Description only when rendered', () => {
    render(
      <>
        <Dialog.Root defaultOpen>
          <Dialog.Popup>
            <Dialog.Title>Title</Dialog.Title>
            <Dialog.Description>Helpful text</Dialog.Description>
          </Dialog.Popup>
        </Dialog.Root>
        <Dialog.Root defaultOpen>
          <Dialog.Popup>
            <Dialog.Title>Bare</Dialog.Title>
          </Dialog.Popup>
        </Dialog.Root>
      </>,
    );
    const dialogs = screen.getAllByRole('dialog');
    expect(dialogs).toHaveLength(2);
    const describedBy = dialogs[0].getAttribute('aria-describedby');
    expect(document.getElementById(describedBy as string)?.textContent).toBe('Helpful text');
    expect(dialogs[1].hasAttribute('aria-describedby')).toBe(false);
  });

  it('renders in place: no portal, no backdrop element', () => {
    const { container } = render(
      <Dialog.Root defaultOpen>
        <Dialog.Popup>
          <Dialog.Title>Inline</Dialog.Title>
        </Dialog.Popup>
      </Dialog.Root>,
    );
    expect(container.querySelector('dialog')?.textContent).toContain('Inline');
    expect(document.querySelector('.var-ui-dialog__overlay')).toBeNull();
    expect((Dialog as unknown as Record<string, unknown>).Backdrop).toBeUndefined();
  });
});
