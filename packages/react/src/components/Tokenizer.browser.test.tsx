import { render } from '@testing-library/react';
import { StrictMode, useState } from 'react';
import { userEvent } from 'vite-plus/test/browser';
import { beforeAll, describe, expect, test, vi } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import { finishAll, raf, settled } from '../test/browser';
import { Dialog } from './Dialog';
import { Tokenizer } from './Tokenizer';

beforeAll(() => {
  const style = document.createElement('style');
  style.textContent = `:root, :root[class] { --var-ui-duration-slow: 150ms; }
    .pin { position: fixed; left: 40px; width: 300px; }`;
  document.head.append(style);
});

const OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'plum', label: 'Plum' },
  { value: 'pear', label: 'Pear' },
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
  initial = [],
}: {
  onValueChange?: (v: string[]) => void;
  name?: string;
  initial?: string[];
}) {
  const [value, setValue] = useState<string[]>(initial);
  return (
    <Tokenizer
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

const input = () => document.querySelector<HTMLInputElement>('input[role="combobox"]')!;
const popup = () => document.querySelector<HTMLElement>('[popover]')!;
const listbox = () => document.querySelector<HTMLElement>('[role="listbox"]');
const option = (label: string) =>
  [...document.querySelectorAll<HTMLElement>('[role="option"]')].find(
    (o) => o.textContent === label,
  )!;
const isOpen = () => popup().matches(':popover-open');

async function closed() {
  await raf();
  await finishAll(popup());
  await raf();
}

async function openByTyping(text = 'p') {
  await userEvent.click(input());
  await userEvent.keyboard(text);
  await raf();
}

describe('Tokenizer on a native popover', () => {
  test('typing opens the list in place; the input keeps focus', async () => {
    const { container } = render(
      <Wrap>
        <Controlled />
      </Wrap>,
    );
    expect(listbox()).toBeNull();
    await openByTyping('ap');
    expect(isOpen()).toBe(true);
    expect(popup().getAttribute('popover')).toBe('manual');
    expect(container.contains(popup())).toBe(true);
    expect(document.activeElement).toBe(input());
    expect([...document.querySelectorAll('[role="option"]')].map((o) => o.textContent)).toEqual([
      'Apple',
      'Apricot',
    ]);
  });

  test('clicking an option adds a token, closes the list and keeps focus in the input', async () => {
    const onValueChange = vi.fn();
    render(
      <Wrap>
        <Controlled onValueChange={onValueChange} />
      </Wrap>,
    );
    await openByTyping('pl');
    await userEvent.click(option('Plum'));
    await closed();
    expect(onValueChange).toHaveBeenCalledWith(['plum']);
    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(input());
  });

  test('arrows + Enter add a token while the input keeps focus (aria-activedescendant)', async () => {
    const onValueChange = vi.fn();
    render(
      <Wrap>
        <Controlled onValueChange={onValueChange} />
      </Wrap>,
    );
    await openByTyping('ap');
    await userEvent.keyboard('{ArrowDown}');
    await raf();
    expect(document.activeElement).toBe(input());
    expect(input().getAttribute('aria-activedescendant')).toBeTruthy();
    await userEvent.keyboard('{Enter}');
    await closed();
    expect(onValueChange).toHaveBeenCalledWith(['apple']);
  });

  test('Escape closes the list; focus stays in the input', async () => {
    render(
      <Wrap>
        <Controlled />
      </Wrap>,
    );
    await openByTyping();
    await userEvent.keyboard('{Escape}');
    await closed();
    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(input());
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
    await openByTyping();
    await userEvent.click(document.querySelector('[data-testid="outside"]')!);
    await closed();
    expect(isOpen()).toBe(false);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('the list is at least as wide as the input and sits below it', async () => {
    render(
      <Wrap>
        <div className="pin" style={{ top: 40 }}>
          <Controlled />
        </div>
      </Wrap>,
    );
    await openByTyping();
    await settled(popup());
    const p = popup().getBoundingClientRect();
    const i = input().getBoundingClientRect();
    expect(p.width).toBeGreaterThanOrEqual(i.width - 1);
    expect(p.top).toBeGreaterThanOrEqual(i.bottom - 1);
  });

  test('flips above near the bottom of the viewport', async () => {
    render(
      <Wrap>
        <div className="pin" style={{ top: window.innerHeight - 70 }}>
          <Controlled />
        </div>
      </Wrap>,
    );
    await openByTyping();
    await settled(popup());
    expect(popup().getBoundingClientRect().bottom).toBeLessThanOrEqual(
      input().getBoundingClientRect().top + 1,
    );
  });

  test('RTL: the list aligns to the right (start) edge of the input', async () => {
    render(
      <Wrap dir="rtl">
        <div className="pin" style={{ top: 40, left: 'auto', right: 40 }}>
          <Controlled />
        </div>
      </Wrap>,
    );
    await openByTyping();
    await settled(popup());
    expect(Math.round(popup().getBoundingClientRect().right)).toBe(
      Math.round(input().getBoundingClientRect().right),
    );
  });

  test('exit keeps the list mounted until the animation ends', async () => {
    render(
      <Wrap>
        <Controlled />
      </Wrap>,
    );
    await openByTyping();
    await settled(popup());
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(isOpen()).toBe(false);
    expect(listbox()).toBeTruthy();
    await finishAll(popup());
    await raf();
    expect(listbox()).toBeNull();
  });

  test('inside a <form> every token submits; opening does not submit', async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    const { container } = render(
      <Wrap>
        <form onSubmit={onSubmit}>
          <Controlled name="fruit" initial={['apple']} />
        </form>
      </Wrap>,
    );
    await openByTyping('pl');
    await userEvent.click(option('Plum'));
    await closed();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(new FormData(container.querySelector('form')!).getAll('fruit')).toEqual([
      'apple',
      'plum',
    ]);
  });
});

describe('Tokenizer inside a modal Dialog (no shim)', () => {
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

  test('opens inside the dialog and a trusted click adds a token', async () => {
    const onChange = vi.fn();
    render(
      <Wrap>
        <Dialog.Root defaultOpen>
          <Dialog.Popup>
            <Dialog.Title>Pick</Dialog.Title>
            <Controlled onValueChange={onChange} />
          </Dialog.Popup>
        </Dialog.Root>
      </Wrap>,
    );
    await settled(dialog());
    await openByTyping('pe');
    expect(dialog().contains(popup())).toBe(true);
    await userEvent.click(option('Pear'));
    await closed();
    expect(onChange).toHaveBeenCalledWith(['pear']);
    expect(dialog().matches(':modal')).toBe(true);
  });

  test('Escape closes the list first; the dialog stays open', async () => {
    render(inDialog);
    await settled(dialog());
    await openByTyping();
    await userEvent.keyboard('{Escape}');
    await closed();
    expect(isOpen()).toBe(false);
    expect(dialog().matches(':modal')).toBe(true);
  });
});
