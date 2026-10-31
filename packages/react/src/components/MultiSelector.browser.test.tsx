import { render } from '@testing-library/react';
import { StrictMode, useState } from 'react';
import { userEvent } from 'vite-plus/test/browser';
import { beforeAll, describe, expect, test, vi } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import { finishAll, freezeAt, raf, settled } from '../test/browser';
import { Dialog } from './Dialog';
import { MultiSelector } from './MultiSelector';

beforeAll(() => {
  const style = document.createElement('style');
  style.textContent = `:root, :root[class] { --var-ui-duration-slow: 150ms; }
    .pin { position: fixed; left: 40px; width: 240px; }`;
  document.head.append(style);
});

const OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date', disabled: true },
];

function Wrap({ children, dir }: { children: React.ReactNode; dir?: 'rtl' }) {
  return (
    <StrictMode>
      <DesignSystemProvider applyToDocument>
        <IconProvider icons={{}}>
          <div dir={dir}>{children}</div>
        </IconProvider>
      </DesignSystemProvider>
    </StrictMode>
  );
}

function Controlled({
  onValueChange,
  name,
}: {
  onValueChange?: (v: string[]) => void;
  name?: string;
}) {
  const [value, setValue] = useState<string[]>([]);
  return (
    <MultiSelector
      label="Fruit"
      name={name}
      options={OPTIONS}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange?.(next);
      }}
    />
  );
}

const trigger = () => document.querySelector<HTMLElement>('button[aria-label], button')!;
const popup = () => document.querySelector<HTMLElement>('[popover]')!;
const listbox = () => document.querySelector<HTMLElement>('[role="listbox"]');
const option = (label: string) =>
  [...document.querySelectorAll<HTMLElement>('[role="option"]')].find((o) =>
    o.textContent?.includes(label),
  )!;
const isOpen = () => popup().matches(':popover-open');

async function closed() {
  await raf();
  await finishAll(popup());
  await raf();
}

describe('MultiSelector on a native popover', () => {
  test('opens by click in the top layer, in place; options toggle and the list stays open', async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Wrap>
        <Controlled onValueChange={onValueChange} />
      </Wrap>,
    );
    expect(listbox()).toBeNull();
    await userEvent.click(trigger());
    await raf();
    expect(isOpen()).toBe(true);
    expect(popup().getAttribute('popover')).toBe('manual');
    expect(container.contains(listbox())).toBe(true);
    await userEvent.click(option('Apple'));
    await userEvent.click(option('Cherry'));
    expect(onValueChange).toHaveBeenLastCalledWith(['apple', 'cherry']);
    expect(isOpen()).toBe(true);
    await userEvent.click(option('Apple'));
    expect(onValueChange).toHaveBeenLastCalledWith(['cherry']);
  });

  test.each([['{Enter}'], [' ']])('opens by keyboard (%s)', async (key) => {
    render(
      <Wrap>
        <Controlled />
      </Wrap>,
    );
    trigger().focus();
    await userEvent.keyboard(key);
    await raf();
    expect(isOpen()).toBe(true);
    expect(listbox()!.contains(document.activeElement)).toBe(true);
  });

  test('Escape closes and focus returns to the trigger', async () => {
    render(
      <Wrap>
        <Controlled />
      </Wrap>,
    );
    await userEvent.click(trigger());
    await raf();
    await userEvent.keyboard('{Escape}');
    await closed();
    expect(isOpen()).toBe(false);
    expect(listbox()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  test('an outside click closes it and lands on the target', async () => {
    const onClick = vi.fn();
    render(
      <Wrap>
        <button type="button" data-testid="outside" onClick={onClick}>
          outside
        </button>
        <Controlled />
      </Wrap>,
    );
    await userEvent.click(document.querySelectorAll<HTMLElement>('button')[1]);
    await raf();
    expect(isOpen()).toBe(true);
    await userEvent.click(document.querySelector('[data-testid="outside"]')!);
    await closed();
    expect(isOpen()).toBe(false);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('clicking the trigger again closes it (toggle, no close-then-reopen)', async () => {
    render(
      <Wrap>
        <Controlled />
      </Wrap>,
    );
    await userEvent.click(trigger());
    await raf();
    expect(isOpen()).toBe(true);
    await userEvent.click(trigger());
    await closed();
    expect(isOpen()).toBe(false);
  });

  test('Tab moves focus away and closes it', async () => {
    render(
      <Wrap>
        <Controlled />
        <button type="button">next</button>
      </Wrap>,
    );
    await userEvent.click(trigger());
    await raf();
    await userEvent.tab();
    await closed();
    expect(isOpen()).toBe(false);
  });

  test('the list is as wide as the trigger, below it and aligned at the start', async () => {
    render(
      <Wrap>
        <div className="pin" style={{ top: 40 }}>
          <Controlled />
        </div>
      </Wrap>,
    );
    await userEvent.click(trigger());
    await settled(popup());
    const p = popup().getBoundingClientRect();
    const t = trigger().getBoundingClientRect();
    expect(Math.round(p.width)).toBe(Math.round(t.width));
    expect(p.top).toBeGreaterThanOrEqual(t.bottom - 1);
    expect(Math.round(p.left)).toBe(Math.round(t.left));
  });

  test('flips above the trigger near the bottom of the viewport', async () => {
    render(
      <Wrap>
        <div className="pin" style={{ top: window.innerHeight - 80 }}>
          <Controlled />
        </div>
      </Wrap>,
    );
    await userEvent.click(trigger());
    await settled(popup());
    expect(popup().getBoundingClientRect().bottom).toBeLessThanOrEqual(
      trigger().getBoundingClientRect().top + 1,
    );
  });

  test('RTL: aligns to the right (start) edge of the trigger', async () => {
    render(
      <Wrap dir="rtl">
        <div className="pin" style={{ top: 40, left: 'auto', right: 40 }}>
          <Controlled />
        </div>
      </Wrap>,
    );
    await userEvent.click(trigger());
    await settled(popup());
    expect(Math.round(popup().getBoundingClientRect().right)).toBe(
      Math.round(trigger().getBoundingClientRect().right),
    );
  });

  test('enter and exit animate; the list stays mounted until the exit ends', async () => {
    render(
      <Wrap>
        <Controlled />
      </Wrap>,
    );
    await userEvent.click(trigger());
    await raf();
    expect(popup().getAnimations({ subtree: true }).length).toBeGreaterThan(0);
    await settled(popup());
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(isOpen()).toBe(false);
    expect(freezeAt(popup(), 0.5)).toBeGreaterThan(0);
    expect(listbox()).toBeTruthy();
    await finishAll(popup());
    await raf();
    expect(listbox()).toBeNull();
  });

  test('inside a <form> every selected value submits; opening does not submit', async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    const { container } = render(
      <Wrap>
        <form onSubmit={onSubmit}>
          <Controlled name="fruit" />
        </form>
      </Wrap>,
    );
    await userEvent.click(trigger());
    await raf();
    await userEvent.click(option('Apple'));
    await userEvent.click(option('Banana'));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(new FormData(container.querySelector('form')!).getAll('fruit')).toEqual([
      'apple',
      'banana',
    ]);
  });
});

describe('MultiSelector inside a modal Dialog (no shim)', () => {
  const dialog = () => document.querySelector<HTMLDialogElement>('dialog')!;
  const inDialog = (
    <Wrap>
      <Dialog.Root defaultOpen>
        <Dialog.Popup>
          <Dialog.Title>Pick</Dialog.Title>
          <Controlled />
        </Dialog.Popup>
      </Dialog.Root>
    </Wrap>
  );

  test('opens inside the dialog, is hit-testable and a trusted click selects', async () => {
    render(inDialog);
    await settled(dialog());
    await userEvent.click(dialog().querySelector('button')!);
    await raf();
    expect(dialog().contains(popup())).toBe(true);
    await userEvent.click(option('Banana'));
    expect(option('Banana').getAttribute('aria-selected')).toBe('true');
    expect(dialog().matches(':modal')).toBe(true);
  });

  test('Escape closes the list first; the dialog stays open', async () => {
    render(inDialog);
    await settled(dialog());
    await userEvent.click(dialog().querySelector('button')!);
    await raf();
    await userEvent.keyboard('{Escape}');
    await closed();
    expect(isOpen()).toBe(false);
    expect(dialog().matches(':modal')).toBe(true);
  });
});
