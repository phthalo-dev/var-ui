import { render } from '@testing-library/react';
import { userEvent } from 'vite-plus/test/browser';
import { describe, expect, test, vi } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import type { OverlayOpenChangeHandler } from '../overlays';
import { raf, clickBackdrop as sharedClickBackdrop } from '../test/browser';
import { AlertDialog, type AlertDialogRootProps } from './AlertDialog';
import { Button } from './Button';

const q = (id: string) => document.querySelector<HTMLElement>(`[data-testid="${id}"]`)!;
const dlg = () => document.querySelector('dialog') as HTMLDialogElement;
const reasons = (h: ReturnType<typeof vi.fn<OverlayOpenChangeHandler>>) =>
  h.mock.calls.map(([open, d]) => [open, d.reason]);

/** The documented confirm recipe. */
function Confirm({
  destructive = false,
  onConfirm = () => {},
  ...root
}: Partial<AlertDialogRootProps> & { destructive?: boolean; onConfirm?: () => void }) {
  return (
    <DesignSystemProvider applyToDocument>
      <AlertDialog {...root}>
        <AlertDialog.Trigger>
          <Button data-testid="trigger">Delete</Button>
        </AlertDialog.Trigger>
        <AlertDialog.Popup>
          <AlertDialog.Header>
            <AlertDialog.Title>Delete item?</AlertDialog.Title>
          </AlertDialog.Header>
          <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
          <AlertDialog.Actions>
            <AlertDialog.Close>
              <Button data-testid="cancel" autoFocus={destructive}>
                Cancel
              </Button>
            </AlertDialog.Close>
            <AlertDialog.Close>
              <Button
                data-testid="confirm"
                tone={destructive ? 'danger' : 'accent'}
                appearance="filled"
                onClick={onConfirm}
              >
                Delete
              </Button>
            </AlertDialog.Close>
          </AlertDialog.Actions>
        </AlertDialog.Popup>
      </AlertDialog>
    </DesignSystemProvider>
  );
}

const clickBackdrop = () => sharedClickBackdrop(dlg());

describe('AlertDialog (real Chromium)', () => {
  test('is a native modal dialog with role=alertdialog, labelled and described', async () => {
    render(<Confirm />);
    await userEvent.click(q('trigger'));
    await raf();
    expect(dlg().matches(':modal')).toBe(true);
    expect(dlg().getAttribute('role')).toBe('alertdialog');
    expect(document.getElementById(dlg().getAttribute('aria-labelledby')!)?.textContent).toBe(
      'Delete item?',
    );
    expect(document.getElementById(dlg().getAttribute('aria-describedby')!)?.textContent).toBe(
      'This cannot be undone.',
    );
  });

  test('a backdrop click does not dismiss by default; dismissable opts in', async () => {
    const a = vi.fn<OverlayOpenChangeHandler>();
    const first = render(<Confirm defaultOpen onOpenChange={a} />);
    await raf();
    await clickBackdrop();
    await raf();
    expect(a).not.toHaveBeenCalled();
    expect(dlg().matches(':modal')).toBe(true);
    first.unmount();

    const b = vi.fn<OverlayOpenChangeHandler>();
    render(<Confirm defaultOpen dismissable onOpenChange={b} />);
    await raf();
    await clickBackdrop();
    await raf();
    expect(reasons(b)).toEqual([[false, 'outside-press']]);
  });

  test('Escape still closes (escape-key) and never confirms', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    const onConfirm = vi.fn();
    render(<Confirm defaultOpen onOpenChange={onOpenChange} onConfirm={onConfirm} />);
    await raf();
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(reasons(onOpenChange)).toEqual([[false, 'escape-key']]);
    expect(onConfirm).not.toHaveBeenCalled();
    expect(dlg().open).toBe(false);
  });

  test('destructive: Cancel has focus on open; the trigger gets it back on close', async () => {
    render(<Confirm destructive />);
    await userEvent.click(q('trigger'));
    await raf();
    expect(document.activeElement).toBe(q('cancel'));
    await userEvent.click(q('cancel'));
    await raf();
    expect(dlg().open).toBe(false);
    expect(document.activeElement).toBe(q('trigger'));
  });

  test('not destructive: focus does not land on Cancel unless asked', async () => {
    render(<Confirm />);
    await userEvent.click(q('trigger'));
    await raf();
    expect(dlg().contains(document.activeElement)).toBe(true);
  });

  test('confirm runs once and closes with close-press', async () => {
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Confirm destructive onConfirm={onConfirm} onOpenChange={onOpenChange} />);
    await userEvent.click(q('trigger'));
    await raf();
    await userEvent.click(q('confirm'));
    await raf();
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(reasons(onOpenChange)).toEqual([
      [true, 'trigger-press'],
      [false, 'close-press'],
    ]);
  });
});

describe('autofocus on a plain button', () => {
  // React's `autoFocus` calls `focus()` while the dialog is still closed, so it does nothing on a
  // host element; the native `autofocus` attribute (read by showModal()) is what works.
  test('the native autofocus attribute wins the initial focus', async () => {
    render(
      <DesignSystemProvider applyToDocument>
        <AlertDialog defaultOpen>
          <AlertDialog.Popup>
            <AlertDialog.Title>T</AlertDialog.Title>
            <button type="button" data-testid="first">
              first
            </button>
            <button
              type="button"
              data-testid="safe"
              ref={(el) => el?.setAttribute('autofocus', '')}
            >
              safe
            </button>
          </AlertDialog.Popup>
        </AlertDialog>
      </DesignSystemProvider>,
    );
    await raf();
    expect(document.activeElement).toBe(q('safe'));
  });
});
