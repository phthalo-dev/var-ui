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
import { Select } from './Select';

beforeAll(() => {
  const style = document.createElement('style');
  style.textContent = `:root, :root[class] { --var-ui-duration-slow: 150ms; }
    .pin { position: fixed; left: 40px; width: 220px; }`;
  document.head.append(style);
});

const OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
];

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <StrictMode>
      <DesignSystemProvider applyToDocument>
        <IconProvider icons={{}}>{children}</IconProvider>
      </DesignSystemProvider>
    </StrictMode>
  );
}

const trigger = () => document.querySelector<HTMLElement>('button[aria-haspopup="listbox"]')!;
const popup = () => document.querySelector<HTMLElement>('[popover]')!;
const listbox = () => document.querySelector<HTMLElement>('[role="listbox"]');
const option = (label: string) =>
  [...document.querySelectorAll<HTMLElement>('[role="option"]')].find(
    (o) => o.textContent === label,
  )!;
const isOpen = () => popup().matches(':popover-open');

/** Waits for the exit transition to end and the children to unmount. */
async function closed() {
  await raf();
  await finishAll(popup());
  await raf();
}

function Basic(props: Partial<React.ComponentProps<typeof Select>> = {}) {
  return (
    <Wrap>
      <Select label="Fruit" options={OPTIONS} {...(props as object)} />
    </Wrap>
  );
}

describe('Select on a native popover', () => {
  test('opens by click, in the top layer, and renders in place (no portal)', async () => {
    const { container } = render(<Basic />);
    expect(listbox()).toBeNull();
    await userEvent.click(trigger());
    await raf();
    expect(isOpen()).toBe(true);
    expect(popup().getAttribute('popover')).toBe('manual');
    expect(container.contains(popup())).toBe(true);
    expect(container.contains(listbox())).toBe(true);
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
  });

  test.each([['{ArrowDown}'], ['{Enter}'], [' ']])('opens by keyboard (%s)', async (key) => {
    render(<Basic />);
    trigger().focus();
    await userEvent.keyboard(key);
    await raf();
    expect(isOpen()).toBe(true);
    expect(listbox()).toBeTruthy();
    // The listbox (not the popup shell) holds focus, so arrows work immediately.
    expect(listbox()!.contains(document.activeElement)).toBe(true);
  });

  test('selecting an option closes the list and returns focus to the trigger', async () => {
    const onValueChange = vi.fn();
    render(<Basic onValueChange={onValueChange} />);
    await userEvent.click(trigger());
    await raf();
    await userEvent.click(option('Banana'));
    expect(onValueChange).toHaveBeenCalledWith('banana');
    await closed();
    expect(isOpen()).toBe(false);
    expect(listbox()).toBeNull();
    expect(document.activeElement).toBe(trigger());
    expect(trigger().textContent).toContain('Banana');
  });

  test('keyboard: arrows and Enter select', async () => {
    const onValueChange = vi.fn();
    render(<Basic onValueChange={onValueChange} />);
    trigger().focus();
    await userEvent.keyboard('{ArrowDown}');
    await raf();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await closed();
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(trigger());
  });

  test('Escape closes the list and focus returns to the trigger', async () => {
    render(<Basic />);
    await userEvent.click(trigger());
    await raf();
    await userEvent.keyboard('{Escape}');
    await closed();
    expect(isOpen()).toBe(false);
    expect(listbox()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  test('an outside click closes it (and the click lands on the target)', async () => {
    const onClick = vi.fn();
    render(
      <Wrap>
        <button type="button" data-testid="outside" onClick={onClick}>
          outside
        </button>
        <Select label="Fruit" options={OPTIONS} />
      </Wrap>,
    );
    await userEvent.click(trigger());
    await raf();
    await userEvent.click(document.querySelector('[data-testid="outside"]')!);
    await closed();
    expect(isOpen()).toBe(false);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('clicking the trigger again closes it', async () => {
    render(<Basic />);
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
        <Select label="Fruit" options={OPTIONS} />
        <button type="button">next</button>
      </Wrap>,
    );
    await userEvent.click(trigger());
    await raf();
    await userEvent.tab();
    await closed();
    expect(isOpen()).toBe(false);
  });

  test('typeahead on the open list moves focus to the matching option', async () => {
    render(<Basic />);
    await userEvent.click(trigger());
    await raf();
    await userEvent.keyboard('ch');
    await raf();
    expect(document.activeElement).toBe(option('Cherry'));
  });

  test('typeahead on the closed trigger changes the value', async () => {
    const onValueChange = vi.fn();
    render(<Basic onValueChange={onValueChange} />);
    trigger().focus();
    await userEvent.keyboard('d');
    await raf();
    expect(onValueChange).toHaveBeenCalledWith('date');
    expect(isOpen()).toBe(false);
  });

  test('the list is as wide as the trigger (anchor-size)', async () => {
    render(
      <Wrap>
        <div className="pin" style={{ top: 40 }}>
          <Select label="Fruit" options={OPTIONS} />
        </div>
      </Wrap>,
    );
    await userEvent.click(trigger());
    await settled(popup());
    expect(Math.round(popup().getBoundingClientRect().width)).toBe(
      Math.round(trigger().getBoundingClientRect().width),
    );
    // Below the trigger, aligned at its start.
    expect(popup().getBoundingClientRect().top).toBeGreaterThanOrEqual(
      trigger().getBoundingClientRect().bottom - 1,
    );
    expect(Math.round(popup().getBoundingClientRect().left)).toBe(
      Math.round(trigger().getBoundingClientRect().left),
    );
  });

  test('flips above the trigger near the bottom of the viewport', async () => {
    render(
      <Wrap>
        <div className="pin" style={{ top: window.innerHeight - 80 }}>
          <Select label="Fruit" options={OPTIONS} />
        </div>
      </Wrap>,
    );
    await userEvent.click(trigger());
    await settled(popup());
    expect(popup().getBoundingClientRect().bottom).toBeLessThanOrEqual(
      trigger().getBoundingClientRect().top + 1,
    );
  });

  test('enter and exit animate; the list stays mounted until the exit ends', async () => {
    render(<Basic />);
    await userEvent.click(trigger());
    await raf();
    expect(popup().getAnimations({ subtree: true }).length).toBeGreaterThan(0);
    await settled(popup());
    expect(Number(getComputedStyle(popup()).opacity)).toBe(1);

    await userEvent.keyboard('{Escape}');
    await raf();
    // Closing started: native state is closed, but the element and content are still there.
    expect(isOpen()).toBe(false);
    expect(freezeAt(popup(), 0.5)).toBeGreaterThan(0);
    expect(listbox()).toBeTruthy();
    expect(Number(getComputedStyle(popup()).opacity)).toBeLessThan(1);
    await finishAll(popup());
    await raf();
    expect(listbox()).toBeNull();
    expect(getComputedStyle(popup()).display).toBe('none');
  });

  test('controlled open: the list follows `open` and reports changes', async () => {
    const onOpenChange = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Wrap>
          <button type="button" data-testid="ext" onClick={() => setOpen(true)}>
            ext
          </button>
          <Select
            label="Fruit"
            options={OPTIONS}
            open={open}
            onOpenChange={(next) => {
              onOpenChange(next);
              setOpen(next);
            }}
          />
        </Wrap>
      );
    }
    render(<Controlled />);
    await userEvent.click(document.querySelector('[data-testid="ext"]')!);
    await raf();
    expect(isOpen()).toBe(true);
    await userEvent.keyboard('{Escape}');
    await closed();
    expect(isOpen()).toBe(false);
    expect(onOpenChange.mock.calls.map((c) => c[0])).toEqual([false]);
  });

  test('multiple selection stays open and reports every toggle', async () => {
    const onValueChange = vi.fn();
    render(<Basic multiple defaultValue={[]} onValueChange={onValueChange} />);
    await userEvent.click(trigger());
    await raf();
    await userEvent.click(option('Apple'));
    await userEvent.click(option('Cherry'));
    await raf();
    expect(isOpen()).toBe(true);
    expect(onValueChange).toHaveBeenLastCalledWith(['apple', 'cherry']);
    expect(option('Apple').getAttribute('aria-selected')).toBe('true');
    await userEvent.keyboard('{Escape}');
    await closed();
    expect(isOpen()).toBe(false);
  });

  test('inside a <form> the value still submits (hidden select)', async () => {
    let submitted: FormData | null = null;
    render(
      <Wrap>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitted = new FormData(e.currentTarget);
          }}
        >
          <Select label="Fruit" name="fruit" options={OPTIONS} />
          <button type="submit" data-testid="submit">
            go
          </button>
        </form>
      </Wrap>,
    );
    await userEvent.click(trigger());
    await raf();
    await userEvent.click(option('Cherry'));
    await closed();
    await userEvent.click(document.querySelector('[data-testid="submit"]')!);
    expect(submitted).not.toBeNull();
    expect((submitted as unknown as FormData).get('fruit')).toBe('cherry');
  });

  test('opening the list does not submit the surrounding form', async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <Wrap>
        <form onSubmit={onSubmit}>
          <Select label="Fruit" name="fruit" options={OPTIONS} />
        </form>
      </Wrap>,
    );
    await userEvent.click(trigger());
    await raf();
    await userEvent.click(option('Apple'));
    await closed();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('themed ancestors reach the list without a portal (custom properties inherit)', async () => {
    render(
      <Wrap>
        <div style={{ '--probe': 'rgb(1, 2, 3)' } as React.CSSProperties} data-testid="scope">
          <Select label="Fruit" options={OPTIONS} />
        </div>
      </Wrap>,
    );
    await userEvent.click(trigger());
    await raf();
    expect(getComputedStyle(listbox()!).getPropertyValue('--probe').trim()).toBe('rgb(1, 2, 3)');
  });
});

describe('Select inside a modal Dialog (no shim)', () => {
  function InDialog({ onValueChange }: { onValueChange?: (v: string | null) => void }) {
    return (
      <Wrap>
        <Dialog.Root defaultOpen>
          <Dialog.Popup data-testid="dialog">
            <Dialog.Title>Pick</Dialog.Title>
            <Select label="Fruit" options={OPTIONS} onValueChange={onValueChange} />
            <Dialog.Close>
              <button type="button">Done</button>
            </Dialog.Close>
          </Dialog.Popup>
        </Dialog.Root>
      </Wrap>
    );
  }
  const dialog = () => document.querySelector<HTMLDialogElement>('dialog')!;

  test('the list opens inside the dialog, is hit-testable and a trusted click selects', async () => {
    const onValueChange = vi.fn();
    render(<InDialog onValueChange={onValueChange} />);
    await settled(dialog());
    await userEvent.click(trigger());
    await raf();
    expect(isOpen()).toBe(true);
    expect(dialog().contains(popup())).toBe(true);
    const rect = option('Cherry').getBoundingClientRect();
    const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    expect(option('Cherry').contains(hit)).toBe(true);
    // userEvent.click hit-tests: it fails on an inert or covered option.
    await userEvent.click(option('Cherry'));
    expect(onValueChange).toHaveBeenCalledWith('cherry');
    await closed();
    expect(dialog().matches(':modal')).toBe(true);
    expect(document.activeElement).toBe(trigger());
  });

  test('Escape closes the list first; the dialog stays open, a second Escape closes it', async () => {
    render(<InDialog />);
    await settled(dialog());
    await userEvent.click(trigger());
    await raf();
    await userEvent.keyboard('{Escape}');
    await closed();
    expect(isOpen()).toBe(false);
    expect(dialog().matches(':modal')).toBe(true);
    trigger().focus();
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(dialog().open).toBe(false);
  });

  test('an outside click on the dialog body closes the list, not the dialog', async () => {
    render(<InDialog />);
    await settled(dialog());
    await userEvent.click(trigger());
    await raf();
    await userEvent.click(document.querySelector('dialog h2, dialog [id]')!);
    await closed();
    expect(isOpen()).toBe(false);
    expect(dialog().matches(':modal')).toBe(true);
  });
});
