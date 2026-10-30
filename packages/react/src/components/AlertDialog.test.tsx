import { describe, expect, it, vi } from 'vite-plus/test';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement, ReactNode } from 'react';
import type { OverlayOpenChangeHandler } from '../overlays';
import { Button } from './Button';
import { LayerProvider } from '../layers/LayerProvider';
import { AlertDialog } from './AlertDialog';

/** The documented confirm recipe (AlertDialog docs), as the tests' fixture. */
function Confirm({
  title,
  description,
  triggerLabel,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  destructive = false,
  onConfirm,
  ...root
}: {
  title: string;
  description: ReactNode;
  triggerLabel?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OverlayOpenChangeHandler;
}) {
  return (
    <AlertDialog {...root}>
      {triggerLabel ? (
        <AlertDialog.Trigger>
          <Button>{triggerLabel}</Button>
        </AlertDialog.Trigger>
      ) : null}
      <AlertDialog.Backdrop>
        <AlertDialog.Popup>
          <AlertDialog.Header>
            <AlertDialog.Title>{title}</AlertDialog.Title>
          </AlertDialog.Header>
          <AlertDialog.Description>{description}</AlertDialog.Description>
          <AlertDialog.Actions>
            <AlertDialog.Close>
              <Button autoFocus={destructive}>{cancelLabel}</Button>
            </AlertDialog.Close>
            <AlertDialog.Close>
              <Button
                tone={destructive ? 'danger' : 'accent'}
                appearance="filled"
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            </AlertDialog.Close>
          </AlertDialog.Actions>
        </AlertDialog.Popup>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}

function wrap(children: ReactElement) {
  return render(<LayerProvider>{children}</LayerProvider>);
}

describe('AlertDialog', () => {
  it('renders with alertdialog role and shows title/description', async () => {
    wrap(
      <Confirm
        triggerLabel="Open delete"
        title="Delete item?"
        description="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {}}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open delete' }));
    expect(screen.getByRole('alertdialog')).toBeTruthy();
    expect(screen.getByText('Delete item?')).toBeTruthy();
    expect(screen.getByText('This cannot be undone.')).toBeTruthy();
  });

  it('supports a custom trigger and confirm action through compound parts', async () => {
    const onConfirm = vi.fn();
    wrap(
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <button type="button">Review deletion</button>
        </AlertDialog.Trigger>
        <AlertDialog.Backdrop>
          <AlertDialog.Popup>
            <AlertDialog.Title>Delete custom item?</AlertDialog.Title>
            <AlertDialog.Actions>
              <button type="button" onClick={onConfirm}>
                Delete forever
              </button>
            </AlertDialog.Actions>
          </AlertDialog.Popup>
        </AlertDialog.Backdrop>
      </AlertDialog.Root>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Review deletion' }));
    expect(screen.getByRole('alertdialog')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Delete forever' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm on confirm and not on cancel, focusing Cancel when destructive', async () => {
    const onConfirm = vi.fn();
    wrap(
      <Confirm
        triggerLabel="Open delete"
        title="Delete item?"
        description="This cannot be undone."
        destructive
        confirmLabel="Delete"
        onConfirm={onConfirm}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open delete' }));
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancel' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onConfirm).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).toBeNull();
    });
    await userEvent.click(screen.getByRole('button', { name: 'Open delete' }));
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('does not call onConfirm when dismissed via Escape', async () => {
    const onConfirm = vi.fn();
    wrap(
      <Confirm
        triggerLabel="Open delete"
        title="Delete item?"
        description="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={onConfirm}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open delete' }));
    expect(screen.getByRole('alertdialog')).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    expect(onConfirm).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).toBeNull();
    });
  });

  it('uses accent tone for confirm when not destructive', async () => {
    wrap(
      <Confirm
        triggerLabel="Open archive"
        title="Archive item?"
        description="You can restore it later."
        confirmLabel="Archive"
        onConfirm={() => {}}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open archive' }));
    const confirmButton = screen.getByRole('button', { name: 'Archive' });
    expect(document.activeElement).not.toBe(screen.getByRole('button', { name: 'Cancel' }));
    expect(confirmButton.className).not.toContain('danger');
  });

  it('supports controlled isOpen/onOpenChange without a trigger', async () => {
    const onOpenChange = vi.fn();
    wrap(
      <Confirm
        open
        onOpenChange={onOpenChange}
        title="Delete item?"
        description="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {}}
      />,
    );
    expect(screen.getByRole('alertdialog')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ reason: expect.any(String) }),
    );
  });

  it('is not dismissed by a backdrop click by default but still closes on Escape', async () => {
    const onOpenChange = vi.fn();
    wrap(
      <Confirm
        triggerLabel="Open"
        title="Delete?"
        description="Sure?"
        onConfirm={() => {}}
        onOpenChange={onOpenChange}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('alertdialog');
    const describedBy = dialog.getAttribute('aria-describedby');
    expect(document.getElementById(describedBy as string)?.textContent).toBe('Sure?');
    onOpenChange.mockClear();
    await userEvent.click(document.querySelector('.var-ui-dialog__overlay') as Element);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole('alertdialog')).toBeTruthy();
    act(() => screen.getByRole('alertdialog').focus());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything()));
  });

  it('opens initially with defaultOpen', () => {
    wrap(
      <Confirm
        defaultOpen
        title="Delete item?"
        description="This cannot be undone."
        onConfirm={() => {}}
      />,
    );
    expect(screen.getByRole('alertdialog')).toBeTruthy();
  });
});
