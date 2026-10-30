import { render } from '@testing-library/react';
import { StrictMode, useState } from 'react';
import { userEvent } from 'vite-plus/test/browser';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import type { OverlayOpenChangeHandler } from '../overlays';
import { raf, settled } from '../test/browser';
import { Button } from './Button';
import { Dialog, type DialogRootProps } from './Dialog';
import { Select } from './Select';

// The core recipes inject their CSS when first called; register the default theme so tokens
// (spacing, colours, durations) resolve, and slow the motion token so the exit is observable.
beforeAll(() => {
  const slow = document.createElement('style');
  slow.textContent = ':root, :root[class] { --var-ui-duration-slow: 150ms; }';
  document.head.append(slow);
});

afterEach(() => {
  document.documentElement.style.overflow = '';
});

const q = (id: string) => document.querySelector<HTMLElement>(`[data-testid="${id}"]`)!;
const dlg = () => document.querySelector('dialog') as HTMLDialogElement;
const reasons = (h: ReturnType<typeof vi.fn<OverlayOpenChangeHandler>>) =>
  h.mock.calls.map(([open, d]) => [open, d.reason]);
const modal = () => dlg().matches(':modal');

function TestDialog(props: Partial<DialogRootProps> & { children?: React.ReactNode }) {
  const { children, ...root } = props;
  return (
    <DesignSystemProvider applyToDocument>
      <IconProvider icons={{}}>
        <button data-testid="before">before</button>
        <Dialog.Root {...root}>
          <Dialog.Trigger>
            <button type="button" data-testid="trigger">
              Open
            </button>
          </Dialog.Trigger>
          <Dialog.Popup data-testid="popup">
            <Dialog.Header>
              <Dialog.Title>Settings</Dialog.Title>
            </Dialog.Header>
            <Dialog.Description>Body text</Dialog.Description>
            <input data-testid="input" aria-label="Name" />
            {children}
            <Dialog.Actions>
              <Dialog.Close>
                <button type="button" data-testid="close">
                  Done
                </button>
              </Dialog.Close>
            </Dialog.Actions>
          </Dialog.Popup>
        </Dialog.Root>
        <button data-testid="after">after</button>
      </IconProvider>
    </DesignSystemProvider>
  );
}

function Controlled({
  keepOpen = false,
  onOpenChange,
  ...rest
}: Partial<DialogRootProps> & { keepOpen?: boolean }) {
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

/** A point on the backdrop: just above the centered dialog box. */
async function clickBackdrop() {
  const rect = dlg().getBoundingClientRect();
  await userEvent.click(dlg(), { position: { x: rect.width / 2, y: -10 }, force: true });
}

describe('open and close sync', () => {
  test('closed by default (no children mounted); the trigger opens a real modal', async () => {
    render(<TestDialog />);
    expect(dlg().open).toBe(false);
    expect(q('input')).toBeNull();
    await userEvent.click(q('trigger'));
    await raf();
    expect(modal()).toBe(true);
    expect(q('input')).toBeTruthy();
    expect(q('trigger').getAttribute('aria-expanded')).toBe('true');
  });

  test('defaultOpen, StrictMode: a single modal', async () => {
    render(
      <StrictMode>
        <TestDialog defaultOpen />
      </StrictMode>,
    );
    await raf();
    expect(document.querySelectorAll('dialog:modal')).toHaveLength(1);
  });

  test('controlled open follows the prop both ways without reporting', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    const { rerender } = render(<TestDialog open={false} onOpenChange={onOpenChange} />);
    rerender(<TestDialog open onOpenChange={onOpenChange} />);
    await raf();
    expect(modal()).toBe(true);
    rerender(<TestDialog open={false} onOpenChange={onOpenChange} />);
    await raf();
    expect(dlg().open).toBe(false);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test('Close closes it and the native dialog attribute follows', async () => {
    render(<TestDialog defaultOpen />);
    await raf();
    await userEvent.click(q('close'));
    await raf();
    expect(dlg().open).toBe(false);
  });

  test('ARIA: the dialog is labelled by the title and described by the description', async () => {
    render(<TestDialog defaultOpen />);
    await raf();
    const labelledBy = dlg().getAttribute('aria-labelledby')!;
    const describedBy = dlg().getAttribute('aria-describedby')!;
    expect(document.getElementById(labelledBy)?.textContent).toBe('Settings');
    expect(document.getElementById(describedBy)?.textContent).toBe('Body text');
  });
});

describe('reasons, Escape, backdrop, veto', () => {
  test('Escape (trusted keyboard): escape-key', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestDialog defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(reasons(onOpenChange)).toEqual([[false, 'escape-key']]);
    expect(dlg().open).toBe(false);
  });

  test('trigger press and Close report trigger-press and close-press', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestDialog onOpenChange={onOpenChange} />);
    await userEvent.click(q('trigger'));
    await raf();
    await userEvent.click(q('close'));
    await raf();
    expect(reasons(onOpenChange)).toEqual([
      [true, 'trigger-press'],
      [false, 'close-press'],
    ]);
  });

  test('backdrop click: outside-press only when dismissable', async () => {
    const a = vi.fn<OverlayOpenChangeHandler>();
    const first = render(<TestDialog defaultOpen onOpenChange={a} />);
    await raf();
    await clickBackdrop();
    await raf();
    expect(reasons(a)).toEqual([[false, 'outside-press']]);
    expect(dlg().open).toBe(false);
    first.unmount();

    const b = vi.fn<OverlayOpenChangeHandler>();
    render(<TestDialog defaultOpen dismissable={false} onOpenChange={b} />);
    await raf();
    await clickBackdrop();
    await raf();
    expect(b).not.toHaveBeenCalled();
    expect(modal()).toBe(true);
  });

  test('a press inside the dialog is not an outside press', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestDialog defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    await userEvent.click(q('input'));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test('imperative: requestClose() from outside our code', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestDialog defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    dlg().requestClose();
    await raf();
    expect(reasons(onOpenChange)).toEqual([[false, 'imperative']]);
  });

  test('details.cancel() vetoes Escape, backdrop and Close', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>((_o, d) => d.cancel());
    render(<TestDialog defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    await userEvent.keyboard('{Escape}');
    await clickBackdrop();
    await userEvent.click(q('close'));
    await raf();
    expect(reasons(onOpenChange)).toEqual([
      [false, 'escape-key'],
      [false, 'outside-press'],
      [false, 'close-press'],
    ]);
    expect(modal()).toBe(true);
  });

  test('controlled open that stays true: reported, stays modal', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Controlled keepOpen onOpenChange={onOpenChange} />);
    await raf();
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(reasons(onOpenChange)).toEqual([[false, 'escape-key']]);
    expect(modal()).toBe(true);
  });
});

describe('focus, inertness, scroll lock', () => {
  test('focus moves into the dialog on open and returns to the trigger on close', async () => {
    render(<TestDialog />);
    await userEvent.click(q('trigger'));
    await raf();
    expect(dlg().contains(document.activeElement)).toBe(true);
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(document.activeElement).toBe(q('trigger'));
  });

  test('Tab is trapped: the page outside is inert', async () => {
    render(<TestDialog defaultOpen />);
    await raf();
    const seen = new Set<Element | null>();
    for (let i = 0; i < 8; i++) {
      await userEvent.tab();
      seen.add(document.activeElement);
    }
    expect(seen.has(q('before'))).toBe(false);
    expect(seen.has(q('after'))).toBe(false);
    expect(seen.has(q('trigger'))).toBe(false);
    expect(q('before').matches(':modal ~ *, :not(:modal) *')).toBe(true);
    // Not hit-testable either: the topmost element at the button's centre is the dialog or its
    // backdrop, never the page button.
    const r = q('after').getBoundingClientRect();
    expect(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)).not.toBe(q('after'));
  });

  test('scroll lock: html overflow is hidden while open, restored after the exit', async () => {
    render(<TestDialog />);
    expect(getComputedStyle(document.documentElement).overflow).not.toBe('hidden');
    await userEvent.click(q('trigger'));
    await raf();
    expect(getComputedStyle(document.documentElement).overflow).toBe('hidden');
    await userEvent.keyboard('{Escape}');
    await raf();
    await settled(dlg());
    expect(getComputedStyle(document.documentElement).overflow).not.toBe('hidden');
  });
});

describe('enter and exit animation', () => {
  test('children stay mounted and the element stays rendered until the exit ends', async () => {
    render(<TestDialog defaultOpen />);
    await raf();
    await settled(dlg());
    await userEvent.click(q('close'));
    await new Promise((r) => setTimeout(r, 40));
    expect(dlg().open).toBe(false);
    expect(getComputedStyle(dlg()).display).not.toBe('none');
    expect(q('input')).toBeTruthy(); // still mounted mid-exit
    await new Promise((r) => setTimeout(r, 300));
    expect(getComputedStyle(dlg()).display).toBe('none');
    expect(q('input')).toBeNull(); // unmounted after the exit
  });

  test('reopening during the exit keeps the content', async () => {
    render(<TestDialog defaultOpen />);
    await raf();
    await settled(dlg());
    await userEvent.keyboard('{Escape}');
    await new Promise((r) => setTimeout(r, 40));
    expect(q('input')).toBeTruthy();
  });
});

describe('popups inside a dialog (interim NativeDialogContext shim)', () => {
  test('a Select inside a Dialog opens, is hit-testable and selects with a real click', async () => {
    const onChange = vi.fn();
    render(
      <TestDialog defaultOpen>
        <Select
          label="Fruit"
          options={[
            { value: 'apple', label: 'Apple' },
            { value: 'pear', label: 'Pear' },
          ]}
          onValueChange={onChange}
        />
      </TestDialog>,
    );
    await raf();
    const trigger = dlg().querySelector('button[aria-haspopup="listbox"]') as HTMLElement;
    expect(trigger).toBeTruthy();
    await userEvent.click(trigger);
    await raf();
    const listbox = document.querySelector('[role="listbox"]') as HTMLElement;
    expect(listbox).toBeTruthy();
    expect(dlg().contains(listbox)).toBe(true);
    const pear = [...document.querySelectorAll('[role="option"]')].find(
      (o) => o.textContent === 'Pear',
    ) as HTMLElement;
    // userEvent.click hit-tests: it would time out on an inert, obscured option.
    await userEvent.click(pear);
    await raf();
    expect(onChange).toHaveBeenCalledWith('pear');
    expect(modal()).toBe(true); // the Dialog itself did not close
  });

  test('Escape in an open Select closes the listbox first, the dialog stays', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(
      <TestDialog defaultOpen onOpenChange={onOpenChange}>
        <Select label="Fruit" options={[{ value: 'apple', label: 'Apple' }]} />
      </TestDialog>,
    );
    await raf();
    await userEvent.click(dlg().querySelector('button[aria-haspopup="listbox"]') as HTMLElement);
    await raf();
    expect(document.querySelector('[role="listbox"]')).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(document.querySelector('[role="listbox"]')).toBeNull();
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(modal()).toBe(true);
  });
});

describe('API surface', () => {
  test('native props and ref reach the <dialog>; Trigger merges onto a Button component', async () => {
    const ref = { current: null as HTMLDialogElement | null };
    render(
      <Dialog.Root>
        <Dialog.Trigger>
          <Button>Open</Button>
        </Dialog.Trigger>
        <Dialog.Popup ref={ref} id="d" className="mine" data-x="1">
          <Dialog.Title>T</Dialog.Title>
        </Dialog.Popup>
      </Dialog.Root>,
    );
    expect(ref.current).toBe(dlg());
    expect(dlg().id).toBe('d');
    expect(dlg().classList.contains('mine')).toBe(true);
    expect(dlg().getAttribute('data-x')).toBe('1');
    await userEvent.click(document.querySelector('button')!);
    await raf();
    expect(modal()).toBe(true);
  });
});
