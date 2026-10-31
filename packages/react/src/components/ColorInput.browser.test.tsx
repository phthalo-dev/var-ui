import { render } from '@testing-library/react';
import { StrictMode, useState } from 'react';
import { userEvent } from 'vite-plus/test/browser';
import { beforeAll, describe, expect, test, vi } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import { finishAll, raf, settled } from '../test/browser';
import { ColorInput } from './ColorInput';
import { Dialog } from './Dialog';

beforeAll(() => {
  const style = document.createElement('style');
  style.textContent = `:root, :root[class] { --var-ui-duration-slow: 150ms; }
    .pin { position: fixed; left: 40px; width: 300px; }`;
  document.head.append(style);
});

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

function Picker({ name, onValueChange }: { name?: string; onValueChange?: (v: string) => void }) {
  const [value, setValue] = useState('#ff00aa');
  return (
    <ColorInput
      label="Brand"
      name={name}
      swatches={['#ff0000', '#00ff00']}
      value={value}
      onValueChange={(v) => {
        setValue(v);
        onValueChange?.(v);
      }}
    />
  );
}

const trigger = () =>
  document.querySelector<HTMLElement>('button[aria-label="Open color picker"]')!;
const popup = () => document.querySelector<HTMLElement>('[popover]')!;
const hue = () => document.querySelector<HTMLElement>('[role="slider"]');
const isOpen = () => popup().matches(':popover-open');
const hex = () => document.querySelector<HTMLInputElement>('input[type="text"]')!;

async function closed() {
  await raf();
  await finishAll(popup());
  await raf();
}

describe('ColorInput on a native popover', () => {
  test('opens by click, in place and in the top layer; focus moves into the picker dialog', async () => {
    const { container } = render(
      <Wrap>
        <Picker />
      </Wrap>,
    );
    expect(hue()).toBeNull();
    await userEvent.click(trigger());
    await raf();
    expect(isOpen()).toBe(true);
    expect(popup().getAttribute('popover')).toBe('manual');
    expect(container.contains(popup())).toBe(true);
    expect(hue()).toBeTruthy();
    expect(popup().contains(document.activeElement)).toBe(true);
    expect(popup().querySelector('[role="dialog"]') ?? popup().getAttribute('role')).toBeTruthy();
  });

  test('opens by keyboard; Escape closes and focus returns to the swatch button', async () => {
    render(
      <Wrap>
        <Picker />
      </Wrap>,
    );
    trigger().focus();
    await userEvent.keyboard('{Enter}');
    await raf();
    expect(isOpen()).toBe(true);
    await userEvent.keyboard('{Escape}');
    await closed();
    expect(isOpen()).toBe(false);
    expect(hue()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  test('an outside click closes it and lands on the target', async () => {
    const onClick = vi.fn();
    render(
      <Wrap>
        <button type="button" data-testid="outside" onClick={onClick}>
          outside
        </button>
        <Picker />
      </Wrap>,
    );
    await userEvent.click(trigger());
    await raf();
    await userEvent.click(document.querySelector('[data-testid="outside"]')!);
    await closed();
    expect(isOpen()).toBe(false);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('pressing the swatch button again closes it', async () => {
    render(
      <Wrap>
        <Picker />
      </Wrap>,
    );
    await userEvent.click(trigger());
    await raf();
    await userEvent.click(trigger());
    await closed();
    expect(isOpen()).toBe(false);
  });

  test('picking a swatch updates the value, the hex input and the form value; popup stays open', async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Wrap>
        <form>
          <Picker name="brand" onValueChange={onValueChange} />
        </form>
      </Wrap>,
    );
    await userEvent.click(trigger());
    await raf();
    const swatch = popup().querySelector<HTMLElement>(
      '[role="radio"], [role="option"], button[aria-label*="#ff0000" i], [aria-label*="red" i]',
    );
    expect(swatch).toBeTruthy();
    await userEvent.click(swatch!);
    await raf();
    expect(onValueChange).toHaveBeenCalled();
    expect(isOpen()).toBe(true);
    expect(hex().value.toLowerCase()).toBe('#ff0000');
    expect(new FormData(container.querySelector('form')!).get('brand')).toBe('#ff0000');
  });

  test('anchored below the swatch, not matched to its width; flips near the viewport bottom', async () => {
    render(
      <Wrap>
        <div className="pin" style={{ top: 40 }}>
          <Picker />
        </div>
      </Wrap>,
    );
    await userEvent.click(trigger());
    await settled(popup());
    expect(popup().getBoundingClientRect().top).toBeGreaterThanOrEqual(
      trigger().getBoundingClientRect().bottom - 1,
    );
    expect(popup().getBoundingClientRect().width).toBeGreaterThan(
      trigger().getBoundingClientRect().width * 2,
    );
  });

  test('flips above near the bottom of the viewport', async () => {
    render(
      <Wrap>
        <div className="pin" style={{ top: window.innerHeight - 60 }}>
          <Picker />
        </div>
      </Wrap>,
    );
    await userEvent.click(trigger());
    await settled(popup());
    expect(popup().getBoundingClientRect().bottom).toBeLessThanOrEqual(
      trigger().getBoundingClientRect().top + 1,
    );
  });

  test('RTL: opens aligned to the right (start) edge of the swatch', async () => {
    render(
      <Wrap dir="rtl">
        <div className="pin" style={{ top: 40, left: 'auto', right: 40 }}>
          <Picker />
        </div>
      </Wrap>,
    );
    await userEvent.click(trigger());
    await settled(popup());
    expect(Math.round(popup().getBoundingClientRect().right)).toBe(
      Math.round(trigger().getBoundingClientRect().right),
    );
  });

  test('exit keeps the picker mounted until the animation ends', async () => {
    render(
      <Wrap>
        <Picker />
      </Wrap>,
    );
    await userEvent.click(trigger());
    await settled(popup());
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(isOpen()).toBe(false);
    expect(hue()).toBeTruthy();
    await finishAll(popup());
    await raf();
    expect(hue()).toBeNull();
  });
});

describe('ColorInput inside a modal Dialog (no shim)', () => {
  const dialog = () => document.querySelector<HTMLDialogElement>('dialog')!;
  const inDialog = (
    <Wrap>
      <Dialog.Root defaultOpen>
        <Dialog.Popup>
          <Dialog.Title>Pick</Dialog.Title>
          <Picker />
        </Dialog.Popup>
      </Dialog.Root>
    </Wrap>
  );

  test('opens inside the dialog and its controls are hit-testable', async () => {
    render(inDialog);
    await settled(dialog());
    await userEvent.click(trigger());
    await raf();
    expect(dialog().contains(popup())).toBe(true);
    const s = hue()!.getBoundingClientRect();
    const hit = document.elementFromPoint(s.x + s.width / 2, s.y + s.height / 2);
    expect(popup().contains(hit)).toBe(true);
    expect(dialog().matches(':modal')).toBe(true);
  });

  test('Escape closes the picker first; the dialog stays open', async () => {
    render(inDialog);
    await settled(dialog());
    await userEvent.click(trigger());
    await raf();
    await userEvent.keyboard('{Escape}');
    await closed();
    expect(isOpen()).toBe(false);
    expect(dialog().matches(':modal')).toBe(true);
  });
});
