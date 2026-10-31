import { render } from '@testing-library/react';
import { StrictMode, useState, type ReactNode } from 'react';
import {
  Button,
  ComboBox,
  Dialog as RacDialog,
  DialogTrigger,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Menu,
  MenuItem,
  MenuTrigger,
  Select,
  SelectValue,
} from 'react-aria-components';
import { userEvent } from 'vite-plus/test/browser';
import { beforeAll, describe, expect, test, vi } from 'vite-plus/test';
import { finishAll, raf, settled } from '../test/browser';
import { NativePopover, toAnchorPlacement } from './NativePopover';

// Bare positioning (no design system): the contract under test is the adapter, not the recipe.
beforeAll(() => {
  const style = document.createElement('style');
  style.textContent = `
    .np { position: fixed; inset: auto; margin: 0; padding: 0; border: 1px solid; background: Canvas;
      position-area: block-end span-inline-end; position-try-fallbacks: flip-block;
      transition: opacity 120ms, overlay 120ms allow-discrete, display 120ms allow-discrete; opacity: 1; }
    .np[data-placement="top"] { position-area: block-start; }
    @starting-style { .np:popover-open { opacity: 0; } }
    .np:not(:popover-open) { opacity: 0; }
    .pin { position: fixed; top: 60px; left: 40px; width: 200px; }
    .low { position: fixed; left: 40px; width: 200px; }
  `;
  document.head.append(style);
});

const popup = () => document.querySelector<HTMLElement>('[popover]')!;
const isOpen = () => popup().matches(':popover-open');
const item = (label: string) =>
  [...document.querySelectorAll<HTMLElement>('[role="option"], [role="menuitem"]')].find(
    (o) => o.textContent === label,
  )!;
async function closed() {
  await raf();
  await finishAll(popup());
  await raf();
}

const FruitSelect = ({ children }: { children?: ReactNode }) => (
  <Select aria-label="Fruit" data-testid="root">
    <Button data-testid="trigger">
      <SelectValue />
    </Button>
    <NativePopover className="np" data-testid="shell">
      <ListBox>
        <ListBoxItem id="a">Apple</ListBoxItem>
        <ListBoxItem id="b">Banana</ListBoxItem>
      </ListBox>
    </NativePopover>
    {children}
  </Select>
);
const trigger = () => document.querySelector<HTMLElement>('[data-testid="trigger"]')!;

describe('toAnchorPlacement', () => {
  test('maps RAC placements to the platform vocabulary', () => {
    expect(toAnchorPlacement('bottom start')).toBe('bottom start');
    expect(toAnchorPlacement('end top')).toBe('end start');
    expect(toAnchorPlacement('left')).toBe('start');
    expect(toAnchorPlacement('right bottom')).toBe('end end');
    expect(toAnchorPlacement('top')).toBe('top');
    expect(toAnchorPlacement(undefined)).toBe('bottom start');
    expect(toAnchorPlacement('nonsense')).toBe('bottom start');
  });
});

describe('outside a RAC trigger, and RAC hidden collection pass', () => {
  test('renders children unchanged (no shell) with no RAC context', () => {
    const { container } = render(
      <NativePopover className="np">
        <span data-testid="kid">kid</span>
      </NativePopover>,
    );
    expect(container.querySelector('[popover]')).toBeNull();
    expect(container.querySelector('[data-testid="kid"]')).toBeTruthy();
  });

  test('the collection is built (value text resolves) while the shell stays closed and empty', async () => {
    render(
      <Select aria-label="Fruit" defaultValue="b">
        <Button data-testid="trigger">
          <SelectValue />
        </Button>
        <NativePopover className="np">
          <ListBox>
            <ListBoxItem id="a">Apple</ListBoxItem>
            <ListBoxItem id="b">Banana</ListBoxItem>
          </ListBox>
        </NativePopover>
      </Select>,
    );
    await raf();
    // The selected item's text came from the hidden pass, although nothing is open.
    expect(trigger().textContent).toContain('Banana');
    expect(popup().matches(':popover-open')).toBe(false);
    expect(popup().childElementCount).toBe(0);
    expect(document.querySelectorAll('[popover]')).toHaveLength(1); // exactly one shell
  });
});

describe('shell contract (Select)', () => {
  test('is a manual popover in place, labelled, with role=dialog and RAC data attributes', async () => {
    const { container } = render(
      <Select aria-label="Fruit">
        <Button data-testid="trigger">
          <SelectValue />
        </Button>
        <NativePopover className="np">
          <ListBox>
            <ListBoxItem id="a">Apple</ListBoxItem>
          </ListBox>
        </NativePopover>
      </Select>,
    );
    expect(popup().getAttribute('popover')).toBe('manual');
    expect(popup().hasAttribute('data-closed')).toBe(true);
    await userEvent.click(trigger());
    await raf();
    expect(container.contains(popup())).toBe(true);
    expect(popup().getAttribute('role')).toBe('dialog');
    expect(popup().getAttribute('data-trigger')).toBe('Select');
    expect(popup().getAttribute('data-placement')).toBe('bottom start');
    expect(popup().hasAttribute('data-open')).toBe(true);
    expect(popup().id).toBeTruthy();
    expect(trigger().style.getPropertyValue('anchor-name')).toMatch(/^--var-ui-/);
    expect(popup().style.getPropertyValue('position-anchor')).toBe(
      trigger().style.getPropertyValue('anchor-name'),
    );
  });

  test('the popup is positioned under the trigger (anchored to RAC triggerRef)', async () => {
    render(
      <div className="pin">
        <FruitSelect />
      </div>,
    );
    await userEvent.click(trigger());
    await settled(popup());
    const t = trigger().getBoundingClientRect();
    const p = popup().getBoundingClientRect();
    expect(Math.round(p.left)).toBe(Math.round(t.left));
    expect(p.top).toBeGreaterThanOrEqual(t.bottom - 1);
  });

  test('flips above near the viewport bottom', async () => {
    render(
      <div className="low" style={{ top: window.innerHeight - 30 }}>
        <FruitSelect />
      </div>,
    );
    await userEvent.click(trigger());
    await settled(popup());
    expect(popup().getBoundingClientRect().bottom).toBeLessThanOrEqual(
      trigger().getBoundingClientRect().top + 1,
    );
  });

  test('placement and matchWidth props', async () => {
    render(
      <div className="low" style={{ top: 300 }}>
        <Select aria-label="Fruit">
          <Button data-testid="trigger">
            <SelectValue />
          </Button>
          <NativePopover className="np" placement="top" matchWidth offset={12}>
            <ListBox>
              <ListBoxItem id="a">A</ListBoxItem>
            </ListBox>
          </NativePopover>
        </Select>
      </div>,
    );
    await userEvent.click(trigger());
    await settled(popup());
    expect(popup().getAttribute('data-placement')).toBe('top');
    expect(popup().style.getPropertyValue('--var-ui-popup-offset')).toBe('12px');
    expect(popup().getBoundingClientRect().bottom).toBeLessThanOrEqual(
      trigger().getBoundingClientRect().top + 1,
    );
    expect(Math.round(popup().getBoundingClientRect().width)).toBe(
      Math.round(trigger().getBoundingClientRect().width),
    );
  });

  test('children mount only while open and through the exit', async () => {
    render(<FruitSelect />);
    expect(popup().childElementCount).toBe(0);
    await userEvent.click(trigger());
    await raf();
    expect(item('Apple')).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(isOpen()).toBe(false);
    expect(item('Apple')).toBeTruthy(); // still exiting
    expect(Number(getComputedStyle(popup()).opacity)).toBeLessThan(1);
    await finishAll(popup());
    await raf();
    expect(popup().childElementCount).toBe(0);
  });

  test('props pass through: className, style, aria-label, ref, onKeyDown', async () => {
    const ref = { current: null as HTMLDivElement | null };
    const onKeyDown = vi.fn();
    render(
      <Select aria-label="Fruit">
        <Button data-testid="trigger">
          <SelectValue />
        </Button>
        <NativePopover
          className="np extra"
          style={{ minWidth: 123 }}
          aria-label="Choices"
          ref={ref}
          onKeyDown={onKeyDown}
          data-x="1"
        >
          <ListBox>
            <ListBoxItem id="a">Apple</ListBoxItem>
          </ListBox>
        </NativePopover>
      </Select>,
    );
    expect(ref.current).toBe(popup());
    expect(popup().classList.contains('extra')).toBe(true);
    expect(popup().style.minWidth).toBe('123px');
    expect(popup().getAttribute('aria-label')).toBe('Choices');
    expect(popup().getAttribute('data-x')).toBe('1');
    await userEvent.click(trigger());
    await raf();
    await userEvent.keyboard('{ArrowDown}');
    expect(onKeyDown).toHaveBeenCalled();
  });

  test('the popup state follows RAC state under StrictMode, controlled and uncontrolled', async () => {
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <StrictMode>
          <button type="button" data-testid="ext" onClick={() => setOpen(true)}>
            ext
          </button>
          <Select aria-label="Fruit" isOpen={open} onOpenChange={setOpen}>
            <Button data-testid="trigger">
              <SelectValue />
            </Button>
            <NativePopover className="np">
              <ListBox>
                <ListBoxItem id="a">Apple</ListBoxItem>
              </ListBox>
            </NativePopover>
          </Select>
        </StrictMode>
      );
    }
    render(<Controlled />);
    await userEvent.click(document.querySelector('[data-testid="ext"]')!);
    await raf();
    expect(isOpen()).toBe(true);
    await userEvent.keyboard('{Escape}');
    await closed();
    expect(isOpen()).toBe(false);
  });
});

describe('dismissal', () => {
  test('outside pointerdown closes (and the target still receives the click)', async () => {
    const onClick = vi.fn();
    render(
      <>
        <button type="button" data-testid="out" onClick={onClick}>
          out
        </button>
        <FruitSelect />
      </>,
    );
    await userEvent.click(trigger());
    await raf();
    await userEvent.click(document.querySelector('[data-testid="out"]')!);
    await closed();
    expect(isOpen()).toBe(false);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('pressing the trigger again toggles it closed', async () => {
    render(<FruitSelect />);
    await userEvent.click(trigger());
    await raf();
    await userEvent.click(trigger());
    await closed();
    expect(isOpen()).toBe(false);
  });

  test('Escape closes and does not leak to an enclosing native dialog', async () => {
    const dialog = document.createElement('dialog');
    document.body.append(dialog);
    const host = document.createElement('div');
    dialog.append(host);
    render(<FruitSelect />, { container: host });
    dialog.showModal();
    await userEvent.click(trigger());
    await raf();
    expect(dialog.contains(popup())).toBe(true);
    await userEvent.keyboard('{Escape}');
    await closed();
    expect(isOpen()).toBe(false);
    expect(dialog.open).toBe(true);
    dialog.close();
  });

  test('focus returns to the trigger after selecting, and is left alone after an outside press on a button', async () => {
    render(
      <>
        <button type="button" data-testid="out">
          out
        </button>
        <FruitSelect />
      </>,
    );
    await userEvent.click(trigger());
    await raf();
    await userEvent.click(item('Apple'));
    await closed();
    expect(document.activeElement).toBe(trigger());

    await userEvent.click(trigger());
    await raf();
    await userEvent.click(document.querySelector('[data-testid="out"]')!);
    await closed();
    expect(document.activeElement).toBe(document.querySelector('[data-testid="out"]'));
  });
});

describe('MenuTrigger', () => {
  const MenuDemo = () => (
    <MenuTrigger>
      <Button data-testid="trigger">Menu</Button>
      <NativePopover className="np">
        <Menu aria-label="Actions" onAction={() => {}}>
          <MenuItem id="x">Alpha</MenuItem>
          <MenuItem id="y">Beta</MenuItem>
        </Menu>
      </NativePopover>
    </MenuTrigger>
  );

  test('ArrowDown opens with the FIRST item focused (children mount at open)', async () => {
    render(<MenuDemo />);
    trigger().focus();
    await userEvent.keyboard('{ArrowDown}');
    await raf();
    expect(isOpen()).toBe(true);
    expect(document.activeElement).toBe(item('Alpha'));
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(item('Beta'));
  });

  test('Escape closes the menu and focus returns to the trigger', async () => {
    render(<MenuDemo />);
    trigger().focus();
    await userEvent.keyboard('{ArrowDown}');
    await raf();
    await userEvent.keyboard('{Escape}');
    await closed();
    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(trigger());
  });

  test('activating an item closes the menu, focus returns to the trigger', async () => {
    render(<MenuDemo />);
    await userEvent.click(trigger());
    await raf();
    await userEvent.click(item('Beta'));
    await closed();
    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(trigger());
  });

  test('click open, click away closes', async () => {
    render(<MenuDemo />);
    await userEvent.click(trigger());
    await raf();
    expect(isOpen()).toBe(true);
    await userEvent.click(document.body, { position: { x: 400, y: 400 } });
    await closed();
    expect(isOpen()).toBe(false);
  });
});

describe('ComboBox (non-modal: focus stays in the input)', () => {
  const Combo = () => (
    <ComboBox aria-label="Fruit">
      <Label>Fruit</Label>
      <div data-testid="group" className="pin">
        <Input data-testid="input" />
        <Button data-testid="toggle">v</Button>
      </div>
      <NativePopover className="np">
        <ListBox>
          <ListBoxItem id="a">Apple</ListBoxItem>
          <ListBoxItem id="b">Banana</ListBoxItem>
        </ListBox>
      </NativePopover>
    </ComboBox>
  );

  test('typing opens the list; the input keeps focus; the popup is not a dialog', async () => {
    render(<Combo />);
    const input = document.querySelector<HTMLInputElement>('[data-testid="input"]')!;
    await userEvent.click(input);
    await userEvent.keyboard('a');
    await raf();
    expect(isOpen()).toBe(true);
    expect(document.activeElement).toBe(input);
    expect(popup().getAttribute('role')).toBeNull();
    expect(popup().getAttribute('data-trigger')).toBe('ComboBox');
    // Anchored to the group (RAC's triggerRef), not just the input.
    const group = document.querySelector('[data-testid="group"]')!.getBoundingClientRect();
    expect(Math.round(popup().getBoundingClientRect().left)).toBe(Math.round(group.left));
  });

  test('clicking inside the input while open does not close it; selecting does', async () => {
    render(<Combo />);
    const input = document.querySelector<HTMLInputElement>('[data-testid="input"]')!;
    await userEvent.click(input);
    await userEvent.keyboard('a');
    await raf();
    await userEvent.click(input);
    await raf();
    expect(isOpen()).toBe(true);
    await userEvent.click(item('Banana'));
    await closed();
    expect(isOpen()).toBe(false);
    expect(input.value).toBe('Banana');
  });
});

describe('inside a native modal dialog', () => {
  test('a Menu popup is hit-testable and a trusted click activates an item', async () => {
    const onAction = vi.fn();
    const dialog = document.createElement('dialog');
    document.body.append(dialog);
    const host = document.createElement('div');
    dialog.append(host);
    render(
      <MenuTrigger>
        <Button data-testid="trigger">Menu</Button>
        <NativePopover className="np">
          <Menu aria-label="Actions" onAction={onAction}>
            <MenuItem id="x">Alpha</MenuItem>
            <MenuItem id="y">Beta</MenuItem>
          </Menu>
        </NativePopover>
      </MenuTrigger>,
      { container: host },
    );
    dialog.showModal();
    await settled(dialog);
    await userEvent.click(trigger());
    await raf();
    await userEvent.click(item('Beta'));
    expect(onAction.mock.calls[0]?.[0]).toBe('y');
    dialog.close();
  });

  test('RAC contexts are cleared for the content (clearContexts): no Button context leak', async () => {
    // Select clears the trigger's Button/Label/Text contexts; a Button inside the popup must be a
    // plain button, not the Select trigger (no aria-haspopup, not pressed state).
    render(
      <Select aria-label="Fruit">
        <Button data-testid="trigger">
          <SelectValue />
        </Button>
        <NativePopover className="np">
          <Button data-testid="inner">inner</Button>
          <ListBox>
            <ListBoxItem id="a">Apple</ListBoxItem>
          </ListBox>
        </NativePopover>
      </Select>,
    );
    await userEvent.click(trigger());
    await raf();
    const inner = document.querySelector<HTMLElement>('[data-testid="inner"]')!;
    expect(inner.getAttribute('aria-haspopup')).toBeNull();
  });

  test('a RAC DatePicker-style DialogTrigger content keeps its own dialog role', async () => {
    render(
      <DialogTrigger>
        <Button data-testid="trigger">Open</Button>
        <NativePopover className="np">
          <RacDialog aria-label="Inner">content</RacDialog>
        </NativePopover>
      </DialogTrigger>,
    );
    await userEvent.click(trigger());
    await raf();
    expect(isOpen()).toBe(true);
    // The shell is not a second dialog around the content's own dialog.
    expect(popup().getAttribute('role')).toBeNull();
    expect(popup().querySelectorAll('[role="dialog"]')).toHaveLength(1);
  });
});
