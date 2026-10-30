import { render } from '@testing-library/react';
import { StrictMode, useState } from 'react';
import { userEvent } from 'vite-plus/test/browser';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vite-plus/test';
import { raf, settled } from '../test/browser';
import type { OverlayOpenChangeHandler } from './changeEvent';
import { useDialogElement, type UseDialogElementOptions } from './useDialogElement';
import { useOverlayRoot } from './useOverlayRoot';

// Stand-ins for what core emits: the global scroll lock rule and a dialog enter/exit transition.
beforeAll(() => {
  const style = document.createElement('style');
  style.textContent = `
    html:has(dialog:modal){overflow:hidden}
    dialog.fx{padding:0;opacity:0;transition:opacity 120ms,overlay 120ms allow-discrete,display 120ms allow-discrete}
    dialog.fx[open]{opacity:1}
    @starting-style{dialog.fx[open]{opacity:0}}
    dialog.nofx{padding:0}
  `;
  document.head.append(style);
});

type Props = UseDialogElementOptions & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OverlayOpenChangeHandler;
  fx?: boolean;
};

function TestDialog({ open, defaultOpen, onOpenChange, dismissable, fx = false }: Props) {
  const root = useOverlayRoot({ native: true, open, defaultOpen, onOpenChange });
  const dialog = useDialogElement(root, { dismissable });
  return (
    <>
      <button data-testid="trigger" onClick={root.triggerPress}>
        open
      </button>
      <dialog
        ref={dialog.ref}
        data-testid="dialog"
        className={fx ? 'fx' : 'nofx'}
        style={{ width: 200, height: 100 }}
      >
        {dialog.mounted ? (
          <div data-testid="body" style={{ padding: 8 }}>
            <input data-testid="input" />
            <button data-testid="close" onClick={() => root.close({ reason: 'close-press' })}>
              close
            </button>
          </div>
        ) : null}
      </dialog>
    </>
  );
}

/** Controlled wrapper whose parent mirrors `onOpenChange` unless told to keep the dialog open. */
function Controlled({ keepOpen = false, onOpenChange, ...rest }: Props & { keepOpen?: boolean }) {
  const [open, setOpen] = useState(true);
  return (
    <TestDialog
      {...rest}
      open={open}
      onOpenChange={(next, details) => {
        onOpenChange?.(next, details);
        if (!keepOpen) setOpen(next);
      }}
    />
  );
}

const q = (id: string) => document.querySelector<HTMLElement>(`[data-testid="${id}"]`)!;
const dialogEl = () => q('dialog') as HTMLDialogElement;
const reasons = (h: ReturnType<typeof vi.fn<OverlayOpenChangeHandler>>) =>
  h.mock.calls.map(([open, d]) => [open, d.reason]);

/** A point on the backdrop: outside the 200x100 centered dialog box. */
async function clickBackdrop() {
  const rect = dialogEl().getBoundingClientRect();
  await userEvent.click(dialogEl(), { position: { x: -20, y: rect.height / 2 }, force: true });
}

afterEach(() => {
  document.documentElement.style.overflow = '';
});

describe('open sync', () => {
  test('defaultOpen shows a real modal and mounts the body', async () => {
    render(<TestDialog defaultOpen />);
    await raf();
    expect(dialogEl().matches(':modal')).toBe(true);
    expect(q('body')).toBeTruthy();
  });

  test('closed by default: no body; trigger opens as trigger-press and focuses inside', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestDialog onOpenChange={onOpenChange} />);
    expect(dialogEl().open).toBe(false);
    expect(q('body')).toBeNull();
    await userEvent.click(q('trigger'));
    await raf();
    expect(dialogEl().matches(':modal')).toBe(true);
    expect(reasons(onOpenChange)).toEqual([[true, 'trigger-press']]);
    expect(dialogEl().contains(document.activeElement)).toBe(true);
  });

  test('controlled open follows the prop both ways without reporting', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    const { rerender } = render(<TestDialog open={false} onOpenChange={onOpenChange} />);
    rerender(<TestDialog open onOpenChange={onOpenChange} />);
    await raf();
    expect(dialogEl().matches(':modal')).toBe(true);
    rerender(<TestDialog open={false} onOpenChange={onOpenChange} />);
    await raf();
    expect(dialogEl().open).toBe(false);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test('StrictMode double effects leave a single open modal', async () => {
    render(
      <StrictMode>
        <TestDialog defaultOpen />
      </StrictMode>,
    );
    await raf();
    expect(dialogEl().matches(':modal')).toBe(true);
    expect(document.querySelectorAll('dialog:modal')).toHaveLength(1);
  });
});

describe('reason matrix', () => {
  test('Escape (trusted keyboard): escape-key, uncontrolled and controlled', async () => {
    const a = vi.fn<OverlayOpenChangeHandler>();
    const first = render(<TestDialog defaultOpen onOpenChange={a} />);
    await raf();
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(reasons(a)).toEqual([[false, 'escape-key']]);
    expect(a.mock.calls[0]![1].event?.type).toBe('keydown');
    expect(dialogEl().open).toBe(false);
    first.unmount();

    const b = vi.fn<OverlayOpenChangeHandler>();
    render(<Controlled onOpenChange={b} />);
    await raf();
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(reasons(b)).toEqual([[false, 'escape-key']]);
    expect(dialogEl().open).toBe(false);
  });

  test('backdrop click: outside-press when dismissable, nothing when not', async () => {
    const a = vi.fn<OverlayOpenChangeHandler>();
    const first = render(<TestDialog defaultOpen onOpenChange={a} />);
    await raf();
    await clickBackdrop();
    await raf();
    expect(reasons(a)).toEqual([[false, 'outside-press']]);
    expect(a.mock.calls[0]![1].event?.type).toBe('click');
    expect(dialogEl().open).toBe(false);
    first.unmount();

    const b = vi.fn<OverlayOpenChangeHandler>();
    render(<TestDialog defaultOpen dismissable={false} onOpenChange={b} />);
    await raf();
    await clickBackdrop();
    await raf();
    expect(b).not.toHaveBeenCalled();
    expect(dialogEl().matches(':modal')).toBe(true);
  });

  test('a press inside the content is not an outside press', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestDialog defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    await userEvent.click(q('body'));
    await userEvent.click(q('input'));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test('close button: close-press (explicit reason through root.close)', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestDialog defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    await userEvent.click(q('close'));
    await raf();
    expect(reasons(onOpenChange)).toEqual([[false, 'close-press']]);
    expect(dialogEl().open).toBe(false);
  });

  test('requestClose() from outside the hook is imperative', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestDialog defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    dialogEl().requestClose();
    await raf();
    expect(reasons(onOpenChange)).toEqual([[false, 'imperative']]);
  });

  test('a native form method=dialog submit is close-press', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestDialog defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    const form = document.createElement('form');
    form.method = 'dialog';
    const submit = document.createElement('button');
    form.append(submit);
    dialogEl().append(form);
    await userEvent.click(submit);
    await raf();
    expect(reasons(onOpenChange)).toEqual([[false, 'close-press']]);
    expect(dialogEl().open).toBe(false);
  });
});

describe('veto and dedupe', () => {
  test('details.cancel() on Escape keeps the dialog open (first Escape per activation)', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>((_o, d) => d.cancel());
    render(<TestDialog defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(dialogEl().matches(':modal')).toBe(true);
  });

  test('details.cancel() on backdrop click and on close button keeps it open', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>((_o, d) => d.cancel());
    render(<TestDialog defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    await clickBackdrop();
    await userEvent.click(q('close'));
    await raf();
    expect(reasons(onOpenChange)).toEqual([
      [false, 'outside-press'],
      [false, 'close-press'],
    ]);
    expect(dialogEl().matches(':modal')).toBe(true);
  });

  test('controlled open stays true: Escape is reported and the dialog stays modal', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Controlled keepOpen onOpenChange={onOpenChange} />);
    await raf();
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(reasons(onOpenChange)).toEqual([[false, 'escape-key']]);
    expect(dialogEl().matches(':modal')).toBe(true);
  });

  test('repeated Escapes beyond the native veto limit re-show the dialog when open stays true', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Controlled keepOpen onOpenChange={onOpenChange} />);
    await raf();
    for (let i = 0; i < 3; i++) {
      await userEvent.keyboard('{Escape}');
      await raf();
      await raf();
    }
    // Every Escape is reported once, and the dialog is modal again afterwards, even when Chromium
    // closed it natively on the non-cancelable ones.
    expect(onOpenChange.mock.calls.length).toBeGreaterThanOrEqual(3);
    expect(onOpenChange.mock.calls.every(([next]) => next === false)).toBe(true);
    expect(dialogEl().matches(':modal')).toBe(true);
  });

  test('a close that follows our own reported request reports once', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Controlled onOpenChange={onOpenChange} />);
    await raf();
    await userEvent.keyboard('{Escape}');
    await raf();
    await raf();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });
});

describe('focus and scroll lock', () => {
  test('focus returns to the trigger that opened the dialog', async () => {
    render(<TestDialog />);
    await userEvent.click(q('trigger'));
    await raf();
    expect(document.activeElement).not.toBe(q('trigger'));
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(document.activeElement).toBe(q('trigger'));
  });

  test('autofocus child gets initial focus', async () => {
    function Auto() {
      const root = useOverlayRoot({ native: true, defaultOpen: true });
      const dialog = useDialogElement(root);
      return (
        <dialog ref={dialog.ref}>
          {dialog.mounted ? (
            <>
              <button>first</button>
              {/* React's `autoFocus` focuses at mount, before the dialog is shown; the native
                  attribute is what `showModal()` honors. */}
              <button ref={(el) => el?.setAttribute('autofocus', '')} data-testid="auto">
                auto
              </button>
            </>
          ) : null}
        </dialog>
      );
    }
    render(<Auto />);
    await raf();
    expect(document.activeElement).toBe(q('auto'));
  });

  test('the global scroll-lock rule applies while a modal is open and lifts on close', async () => {
    const { rerender } = render(<TestDialog open={false} />);
    const overflow = () => getComputedStyle(document.documentElement).overflow;
    expect(overflow()).toBe('visible');
    rerender(<TestDialog open />);
    await raf();
    expect(overflow()).toBe('hidden');
    rerender(<TestDialog open={false} />);
    await raf();
    expect(overflow()).toBe('visible');
  });
});

describe('exit mounting', () => {
  test('children stay mounted through the exit transition, then unmount', async () => {
    const { rerender } = render(<TestDialog fx open />);
    await settled(dialogEl());
    expect(q('body')).toBeTruthy();
    rerender(<TestDialog fx open={false} />);
    // Right after close the dialog is not :modal anymore, but still displayed and animating.
    expect(dialogEl().open).toBe(false);
    expect(q('body')).toBeTruthy();
    expect(dialogEl().getAnimations({ subtree: true }).length).toBeGreaterThan(0);
    await vi.waitFor(() => expect(q('body')).toBeNull(), { timeout: 2000 });
  });

  test('reopening during the exit keeps the body mounted', async () => {
    const { rerender } = render(<TestDialog fx open />);
    await settled(dialogEl());
    rerender(<TestDialog fx open={false} />);
    rerender(<TestDialog fx open />);
    await settled(dialogEl());
    await raf();
    expect(q('body')).toBeTruthy();
    expect(dialogEl().matches(':modal')).toBe(true);
  });

  test('without a transition the body unmounts immediately', async () => {
    const { rerender } = render(<TestDialog open />);
    await raf();
    rerender(<TestDialog open={false} />);
    expect(q('body')).toBeNull();
  });
});
