import { render } from '@testing-library/react';
import { StrictMode } from 'react';
import { userEvent } from 'vite-plus/test/browser';
import { beforeAll, describe, expect, test, vi } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import { finishAll, raf, settled } from '../test/browser';
import { Combobox } from './Combobox';
import { Dialog } from './Dialog';

beforeAll(() => {
  const style = document.createElement('style');
  style.textContent = `:root, :root[class] { --var-ui-duration-slow: 150ms; }
    .pin { position: fixed; left: 40px; width: 260px; }`;
  document.head.append(style);
});

const OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
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

function Box(props: Partial<React.ComponentProps<typeof Combobox.Root>> = {}) {
  return (
    <Combobox.Root aria-label="Fruit" {...props}>
      <Combobox.Input placeholder="Fruit" />
      <Combobox.Popover>
        <Combobox.ListBox items={OPTIONS}>
          {(o) => <Combobox.Item value={o.value}>{o.label}</Combobox.Item>}
        </Combobox.ListBox>
      </Combobox.Popover>
    </Combobox.Root>
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
const wrapper = () => input().parentElement!;

async function closed() {
  await raf();
  await finishAll(popup());
  await raf();
}

describe('Combobox on a native popover', () => {
  test('typing opens the list in place; the input keeps focus and the shell takes none', async () => {
    const { container } = render(
      <Wrap>
        <Box />
      </Wrap>,
    );
    expect(listbox()).toBeNull();
    await userEvent.click(input());
    await userEvent.keyboard('a');
    await raf();
    expect(isOpen()).toBe(true);
    expect(popup().getAttribute('popover')).toBe('manual');
    expect(container.contains(popup())).toBe(true);
    expect(popup().getAttribute('role')).toBeNull();
    expect(document.activeElement).toBe(input());
    expect(input().getAttribute('aria-expanded')).toBe('true');
  });

  test('arrows move aria-activedescendant while the input keeps focus; Enter selects and closes', async () => {
    const onValueChange = vi.fn();
    render(
      <Wrap>
        <Box onValueChange={onValueChange} />
      </Wrap>,
    );
    await userEvent.click(input());
    await userEvent.keyboard('{ArrowDown}');
    await raf();
    expect(isOpen()).toBe(true);
    await userEvent.keyboard('{ArrowDown}');
    await raf();
    expect(document.activeElement).toBe(input());
    const active = input().getAttribute('aria-activedescendant');
    expect(active).toBeTruthy();
    expect(document.getElementById(active!)?.getAttribute('role')).toBe('option');
    await userEvent.keyboard('{Enter}');
    await closed();
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(isOpen()).toBe(false);
    expect(listbox()).toBeNull();
    expect(document.activeElement).toBe(input());
  });

  test('clicking an option selects it, sets the input text and keeps focus on the input', async () => {
    const onValueChange = vi.fn();
    render(
      <Wrap>
        <Box onValueChange={onValueChange} />
      </Wrap>,
    );
    await userEvent.click(input());
    await userEvent.keyboard('a');
    await raf();
    await userEvent.click(option('Apricot'));
    await closed();
    expect(onValueChange).toHaveBeenCalledWith('apricot');
    expect(input().value).toBe('Apricot');
    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(input());
  });

  test('clicking inside the input while open does not close it', async () => {
    render(
      <Wrap>
        <Box />
      </Wrap>,
    );
    await userEvent.click(input());
    await userEvent.keyboard('a');
    await raf();
    await userEvent.click(input());
    await raf();
    expect(isOpen()).toBe(true);
  });

  test('Escape closes the list; focus stays in the input', async () => {
    render(
      <Wrap>
        <Box />
      </Wrap>,
    );
    await userEvent.click(input());
    await userEvent.keyboard('a');
    await raf();
    await userEvent.keyboard('{Escape}');
    await closed();
    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(input());
  });

  test('an outside click closes it and the click lands on the target', async () => {
    const onClick = vi.fn();
    render(
      <Wrap>
        <button type="button" data-testid="outside" onClick={onClick}>
          outside
        </button>
        <Box />
      </Wrap>,
    );
    await userEvent.click(input());
    await userEvent.keyboard('a');
    await raf();
    await userEvent.click(document.querySelector('[data-testid="outside"]')!);
    await closed();
    expect(isOpen()).toBe(false);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('Tab moves focus away and closes it', async () => {
    render(
      <Wrap>
        <Box />
        <button type="button">next</button>
      </Wrap>,
    );
    await userEvent.click(input());
    await userEvent.keyboard('a');
    await raf();
    await userEvent.tab();
    await closed();
    expect(isOpen()).toBe(false);
  });

  test('the list is as wide as the field and sits below it, aligned at the start', async () => {
    render(
      <Wrap>
        <div className="pin" style={{ top: 40 }}>
          <Box />
        </div>
      </Wrap>,
    );
    await userEvent.click(input());
    await userEvent.keyboard('a');
    await settled(popup());
    const p = popup().getBoundingClientRect();
    const w = wrapper().getBoundingClientRect();
    expect(Math.round(p.width)).toBe(Math.round(w.width));
    expect(p.top).toBeGreaterThanOrEqual(w.bottom - 1);
    expect(Math.round(p.left)).toBe(Math.round(w.left));
  });

  test('flips above the field near the bottom of the viewport', async () => {
    render(
      <Wrap>
        <div className="pin" style={{ top: window.innerHeight - 70 }}>
          <Box />
        </div>
      </Wrap>,
    );
    await userEvent.click(input());
    await userEvent.keyboard('a');
    await settled(popup());
    expect(popup().getBoundingClientRect().bottom).toBeLessThanOrEqual(
      wrapper().getBoundingClientRect().top + 1,
    );
  });

  test('RTL: the list aligns to the start (right) edge of the field', async () => {
    render(
      <Wrap dir="rtl">
        <div className="pin" style={{ top: 40, left: 'auto', right: 40 }}>
          <Box />
        </div>
      </Wrap>,
    );
    await userEvent.click(input());
    await userEvent.keyboard('a');
    await settled(popup());
    expect(Math.round(popup().getBoundingClientRect().right)).toBe(
      Math.round(wrapper().getBoundingClientRect().right),
    );
  });

  test('exit keeps the list mounted until the animation ends', async () => {
    render(
      <Wrap>
        <Box />
      </Wrap>,
    );
    await userEvent.click(input());
    await userEvent.keyboard('a');
    await settled(popup());
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(isOpen()).toBe(false);
    expect(listbox()).toBeTruthy();
    await finishAll(popup());
    await raf();
    expect(listbox()).toBeNull();
  });

  test('inside a <form> the selected value submits and opening does not submit', async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    const { container } = render(
      <Wrap>
        <form onSubmit={onSubmit}>
          <Box name="fruit" />
        </form>
      </Wrap>,
    );
    await userEvent.click(input());
    await userEvent.keyboard('b');
    await raf();
    expect(onSubmit).not.toHaveBeenCalled();
    await userEvent.click(option('Banana'));
    await closed();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(new FormData(container.querySelector('form')!).get('fruit')).toBe('banana');
  });
});

describe('Combobox inside a modal Dialog (no shim)', () => {
  const dialog = () => document.querySelector<HTMLDialogElement>('dialog')!;

  test('opens inside the dialog, is hit-testable, a trusted click selects, dialog stays modal', async () => {
    const onValueChange = vi.fn();
    render(
      <Wrap>
        <Dialog.Root defaultOpen>
          <Dialog.Popup>
            <Dialog.Title>Pick</Dialog.Title>
            <Box onValueChange={onValueChange} />
          </Dialog.Popup>
        </Dialog.Root>
      </Wrap>,
    );
    await settled(dialog());
    await userEvent.click(input());
    await userEvent.keyboard('c');
    await raf();
    expect(dialog().contains(popup())).toBe(true);
    await userEvent.click(option('Cherry'));
    await closed();
    expect(onValueChange).toHaveBeenCalledWith('cherry');
    expect(dialog().matches(':modal')).toBe(true);
  });

  test('Escape closes the list first, the dialog stays open', async () => {
    render(
      <Wrap>
        <Dialog.Root defaultOpen>
          <Dialog.Popup>
            <Dialog.Title>Pick</Dialog.Title>
            <Box />
          </Dialog.Popup>
        </Dialog.Root>
      </Wrap>,
    );
    await settled(dialog());
    await userEvent.click(input());
    await userEvent.keyboard('a');
    await raf();
    await userEvent.keyboard('{Escape}');
    await closed();
    expect(isOpen()).toBe(false);
    expect(dialog().matches(':modal')).toBe(true);
  });
});
