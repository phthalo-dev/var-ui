import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement, ReactNode } from 'react';
import type { OverlayOpenChangeHandler } from '../overlays';
import { Button } from './Button';
import { stubNativeDialog } from '../test/nativeOverlayStubs';
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
    </AlertDialog>
  );
}

// API-shape tests. Focus, Escape, backdrop and inertness are covered in AlertDialog.browser.test.tsx.
stubNativeDialog();

function wrap(children: ReactElement) {
  return render(children);
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
    const dialog = screen.getByRole('alertdialog');
    expect(dialog.tagName).toBe('DIALOG');
    expect(dialog.getAttribute('aria-labelledby')).toBeTruthy();
    expect(dialog.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('supports a custom trigger and confirm action through compound parts', async () => {
    const onConfirm = vi.fn();
    wrap(
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <button type="button">Review deletion</button>
        </AlertDialog.Trigger>
        <AlertDialog.Popup>
          <AlertDialog.Title>Delete custom item?</AlertDialog.Title>
          <AlertDialog.Actions>
            <button type="button" onClick={onConfirm}>
              Delete forever
            </button>
          </AlertDialog.Actions>
        </AlertDialog.Popup>
      </AlertDialog.Root>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Review deletion' }));
    expect(screen.getByRole('alertdialog')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Delete forever' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('supports controlled open/onOpenChange without a trigger', async () => {
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

  it('confirm runs once and closes; cancel does not confirm', async () => {
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
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onConfirm).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    await userEvent.click(screen.getByRole('button', { name: 'Open delete' }));
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('has no Backdrop part', () => {
    expect((AlertDialog as unknown as Record<string, unknown>).Backdrop).toBeUndefined();
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
