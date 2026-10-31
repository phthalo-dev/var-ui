import { render } from '@testing-library/react';
import { StrictMode, useState } from 'react';
import { page, userEvent } from 'vite-plus/test/browser';
import { beforeAll, describe, expect, test, vi } from 'vite-plus/test';
import { commandPalette } from '@var-ui/core/components/commandPalette';
import '../../../core/src/theme/base-styles';
import { defaultTheme } from '../../../core/src/theme/register-default';
import { raf, settled, clickBackdrop } from '../test/browser';
import { CommandPalette } from './CommandPalette';
import { createCommandPalette } from '../internal/commandPaletteController';

// The real default theme supplies every token the recipe reads (the recipe CSS itself is
// registered by calling it).
beforeAll(() => {
  commandPalette();
  document.documentElement.classList.add(defaultTheme.className);
});

const items = [
  { id: 'settings', title: 'Open settings', keywords: ['prefs'] },
  { id: 'profile', title: 'Edit profile' },
  { id: 'out', title: 'Sign out' },
];

const apple = /mac|iphone|ipad/i.test(navigator.platform);
const pressCtrlK = () =>
  window.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'k', metaKey: apple, ctrlKey: !apple, cancelable: true }),
  );
const dlg = () => document.querySelector('dialog')!;
const input = () => document.querySelector<HTMLInputElement>('input')!;
const closeCalls = (fn: ReturnType<typeof vi.fn>) => fn.mock.calls.filter(([n]) => n === false);
const lastReason = (fn: ReturnType<typeof vi.fn>) =>
  fn.mock.calls[fn.mock.calls.length - 1]![1].reason;

function Controlled({
  onOpenChange,
  initial = true,
}: {
  onOpenChange?: (open: boolean, details: unknown) => void;
  initial?: boolean;
}) {
  const [open, setOpen] = useState(initial);
  return (
    <>
      <button data-testid="trigger" onClick={() => setOpen(true)}>
        open
      </button>
      <CommandPalette
        open={open}
        items={items}
        onAction={() => {}}
        onOpenChange={(next, details) => {
          onOpenChange?.(next, details);
          setOpen(next);
        }}
      />
    </>
  );
}

describe('CommandPalette (browser)', () => {
  test('opens and toggles via the hotkey', async () => {
    const onOpenChange = vi.fn();
    render(
      <StrictMode>
        <CommandPalette items={items} onOpenChange={onOpenChange} />
      </StrictMode>,
    );
    expect(dlg().open).toBe(false);
    pressCtrlK();
    await raf();
    expect(dlg().matches(':modal')).toBe(true);
    expect(document.activeElement).toBe(input());
    expect(onOpenChange).toHaveBeenLastCalledWith(
      true,
      expect.objectContaining({ reason: 'imperative' }),
    );
    pressCtrlK();
    await settled(dlg());
    expect(dlg().open).toBe(false);
  });

  test('opens from a controller and closes it on Escape', async () => {
    const controller = createCommandPalette();
    render(<CommandPalette controller={controller} hotkey={false} items={items} />);
    controller.open();
    await raf();
    expect(dlg().open).toBe(true);
    await userEvent.keyboard('{Escape}');
    await settled(dlg());
    expect(controller.getSnapshot()).toBe(false);
    expect(dlg().open).toBe(false);
  });

  test('Escape reports escape-key once and focus returns to the trigger', async () => {
    const onOpenChange = vi.fn();
    render(<Controlled onOpenChange={onOpenChange} initial={false} />);
    const trigger = document.querySelector<HTMLButtonElement>('[data-testid=trigger]')!;
    trigger.focus();
    await userEvent.click(trigger);
    await raf();
    expect(dlg().open).toBe(true);
    await userEvent.keyboard('{Escape}');
    await settled(dlg());
    expect(closeCalls(onOpenChange)).toHaveLength(1);
    expect(lastReason(onOpenChange)).toBe('escape-key');
    expect(dlg().open).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  test('details.cancel() keeps it open on Escape and stays controlled', async () => {
    const onOpenChange = vi.fn((_n: boolean, d: { cancel: () => void }) => d.cancel());
    render(<CommandPalette open hotkey={false} items={items} onOpenChange={onOpenChange} />);
    await raf();
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(lastReason(onOpenChange)).toBe('escape-key');
    expect(dlg().open).toBe(true);
  });

  test('a backdrop click closes with outside-press', async () => {
    const onOpenChange = vi.fn();
    render(<Controlled onOpenChange={onOpenChange} />);
    await raf();
    const rect = dlg().getBoundingClientRect();
    await clickBackdrop(dlg());
    await settled(dlg());
    expect(closeCalls(onOpenChange)).toHaveLength(1);
    expect(lastReason(onOpenChange)).toBe('outside-press');
    expect(dlg().open).toBe(false);
  });

  test('choosing an item reports trigger-press, calls onAction and closes once', async () => {
    const onOpenChange = vi.fn();
    const onAction = vi.fn();
    function Harness() {
      const [open, setOpen] = useState(true);
      return (
        <CommandPalette
          open={open}
          items={items}
          onAction={onAction}
          onOpenChange={(next, d) => {
            onOpenChange(next, d);
            setOpen(next);
          }}
        />
      );
    }
    render(<Harness />);
    await settled(dlg());
    await userEvent.click(page.getByText('Edit profile'));
    await settled(dlg());
    expect(onAction).toHaveBeenCalledWith('profile');
    expect(closeCalls(onOpenChange)).toHaveLength(1);
    expect(lastReason(onOpenChange)).toBe('trigger-press');
    expect(dlg().open).toBe(false);
  });

  test('typing filters and arrow keys move the highlight', async () => {
    render(<CommandPalette open hotkey={false} items={items} onOpenChange={() => {}} />);
    await raf();
    expect(document.querySelectorAll('[role=option]')).toHaveLength(3);
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    const focused = () => document.querySelector('[role=option][data-focused]');
    expect(focused()?.textContent).toContain('Edit profile');
    await userEvent.keyboard('{ArrowUp}');
    expect(focused()?.textContent).toContain('Open settings');
    await userEvent.type(input(), 'prefs');
    await raf();
    const opts = [...document.querySelectorAll('[role=option]')];
    expect(opts).toHaveLength(1);
    expect(opts[0]!.textContent).toContain('Open settings');
  });

  test('keeps the element through the exit animation, then unmounts the contents', async () => {
    const { rerender } = render(
      <CommandPalette open hotkey={false} items={items} onOpenChange={() => {}} />,
    );
    await settled(dlg());
    expect(getComputedStyle(dlg()).opacity).toBe('1');
    rerender(<CommandPalette open={false} hotkey={false} items={items} onOpenChange={() => {}} />);
    await raf();
    // Mid-exit: closed but still rendered with its contents.
    expect(dlg().open).toBe(false);
    expect(getComputedStyle(dlg()).display).not.toBe('none');
    expect(input()).toBeTruthy();
    await settled(dlg());
    await raf();
    expect(document.querySelector('input')).toBeNull();
    expect(getComputedStyle(dlg()).display).toBe('none');
  });
});
