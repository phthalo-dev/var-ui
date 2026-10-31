import { render } from '@testing-library/react';
import { StrictMode, useState } from 'react';
import { Menu as AriaMenu, SubmenuTrigger } from 'react-aria-components';
import { userEvent } from 'vite-plus/test/browser';
import { beforeAll, describe, expect, test, vi } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import { NativePopover } from '../internal/NativePopover';
import { finishAll, freezeAt, raf, settled } from '../test/browser';
import { Dialog } from './Dialog';
import { Menu } from './Menu';

beforeAll(() => {
  const style = document.createElement('style');
  style.textContent = `:root, :root[class] { --var-ui-duration-slow: 150ms; }
    .pin { position: fixed; left: 40px; }
    .surface { position: fixed; left: 100px; top: 100px; width: 300px; height: 200px; background: #ddd; }`;
  document.head.append(style);
});

function Wrap({ children, direction }: { children: React.ReactNode; direction?: 'rtl' | 'ltr' }) {
  return (
    <StrictMode>
      <DesignSystemProvider applyToDocument direction={direction}>
        <IconProvider icons={{}}>{children}</IconProvider>
      </DesignSystemProvider>
    </StrictMode>
  );
}

const trigger = () => document.querySelector<HTMLElement>('button[aria-haspopup]')!;
/** The outermost menu popover. */
const popup = () => document.querySelector<HTMLElement>('[popover]')!;
const menuEl = () => document.querySelector<HTMLElement>('[role="menu"]');
const item = (label: string) =>
  [...document.querySelectorAll<HTMLElement>('[role="menuitem"]')].find((o) =>
    o.textContent?.includes(label),
  )!;
const isOpen = () => popup().matches(':popover-open');

/** Waits for the exit transition to end and the children to unmount. */
async function closed() {
  await raf();
  await finishAll(popup());
  await raf();
}

function Basic({
  onAction = () => {},
  onOpenChange,
  placement,
  top = 40,
  direction,
}: {
  direction?: 'rtl' | 'ltr';
  onAction?: (id: string) => void;
  onOpenChange?: React.ComponentProps<typeof Menu.Root>['onOpenChange'];
  placement?: React.ComponentProps<typeof Menu.Popup>['placement'];
  top?: number;
}) {
  return (
    <Wrap direction={direction}>
      <div className="pin" style={{ top, left: direction === 'rtl' ? 400 : undefined }}>
        <Menu.Root onOpenChange={onOpenChange}>
          <Menu.Trigger>
            <button type="button">Song</button>
          </Menu.Trigger>
          <Menu.Popup aria-label="Song actions" placement={placement}>
            <Menu.Item id="lib" onAction={() => onAction('lib')}>
              Add to Library
            </Menu.Item>
            <Menu.Item id="queue" onAction={() => onAction('queue')}>
              Add to Queue
            </Menu.Item>
            <Menu.Item id="disabled" disabled onAction={() => onAction('disabled')}>
              Share
            </Menu.Item>
            <Menu.Separator />
            <Menu.Section title="Danger">
              <Menu.Item id="delete" onAction={() => onAction('delete')}>
                Delete
              </Menu.Item>
            </Menu.Section>
          </Menu.Popup>
        </Menu.Root>
      </div>
    </Wrap>
  );
}

describe('Menu on a native popover', () => {
  test('opens by click, in the top layer, in place (no portal)', async () => {
    const { container } = render(<Basic />);
    expect(menuEl()).toBeNull();
    await userEvent.click(trigger());
    await raf();
    expect(isOpen()).toBe(true);
    expect(popup().getAttribute('popover')).toBe('manual');
    expect(container.contains(popup())).toBe(true);
    expect(container.contains(menuEl())).toBe(true);
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(trigger().getAttribute('aria-haspopup')).toBeTruthy();
    // Opens below the trigger, aligned at its start.
    const t = trigger().getBoundingClientRect();
    const p = popup().getBoundingClientRect();
    expect(p.top).toBeGreaterThanOrEqual(t.bottom - 1);
    expect(Math.round(p.left)).toBe(Math.round(t.left));
  });

  test.each([['{Enter}'], [' '], ['{ArrowDown}']])('opens by keyboard (%s)', async (key) => {
    render(<Basic />);
    trigger().focus();
    await userEvent.keyboard(key);
    await raf();
    expect(isOpen()).toBe(true);
    expect(item('Add to Library')).toBe(document.activeElement);
  });

  test('ArrowUp on the trigger opens with the last item focused', async () => {
    render(<Basic />);
    trigger().focus();
    await userEvent.keyboard('{ArrowUp}');
    await raf();
    expect(isOpen()).toBe(true);
    expect(item('Delete')).toBe(document.activeElement);
  });

  test('arrow keys rove focus, skipping disabled items; Home/End jump', async () => {
    render(<Basic />);
    trigger().focus();
    await userEvent.keyboard('{ArrowDown}');
    await raf();
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(item('Add to Queue'));
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(item('Delete'));
    await userEvent.keyboard('{Home}');
    expect(document.activeElement).toBe(item('Add to Library'));
    await userEvent.keyboard('{End}');
    expect(document.activeElement).toBe(item('Delete'));
    // The menu stays open and focus never left it.
    expect(isOpen()).toBe(true);
    expect(popup().contains(document.activeElement)).toBe(true);
  });

  test('typeahead moves focus to the matching item', async () => {
    render(<Basic />);
    await userEvent.click(trigger());
    await raf();
    await userEvent.keyboard('del');
    await raf();
    expect(document.activeElement).toBe(item('Delete'));
  });

  test('clicking an item runs onAction and closes; focus returns to the trigger', async () => {
    const onAction = vi.fn();
    render(<Basic onAction={onAction} />);
    await userEvent.click(trigger());
    await raf();
    await userEvent.click(item('Add to Queue'));
    expect(onAction).toHaveBeenCalledExactlyOnceWith('queue');
    await closed();
    expect(isOpen()).toBe(false);
    expect(menuEl()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  test('Enter on an item runs onAction and closes', async () => {
    const onAction = vi.fn();
    render(<Basic onAction={onAction} />);
    trigger().focus();
    await userEvent.keyboard('{ArrowDown}');
    await raf();
    await userEvent.keyboard('{Enter}');
    expect(onAction).toHaveBeenCalledExactlyOnceWith('lib');
    await closed();
    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(trigger());
  });

  test('a disabled item is aria-disabled, never acts and does not close the menu', async () => {
    const onAction = vi.fn();
    render(<Basic onAction={onAction} />);
    await userEvent.click(trigger());
    await raf();
    expect(item('Share').getAttribute('aria-disabled')).toBe('true');
    await userEvent.click(item('Share'), { force: true });
    await raf();
    expect(onAction).not.toHaveBeenCalled();
    expect(isOpen()).toBe(true);
  });

  test('sections and separators render with their roles', async () => {
    render(<Basic />);
    await userEvent.click(trigger());
    await raf();
    expect(menuEl()!.getAttribute('aria-label')).toBe('Song actions');
    expect(document.querySelectorAll('[role="separator"]').length).toBeGreaterThan(0);
    const group = document.querySelector('[role="group"]')!;
    expect(group.textContent).toContain('Danger');
    expect(group.querySelector('[role="menuitem"]')?.textContent).toBe('Delete');
  });

  test('Escape closes the menu and focus returns to the trigger', async () => {
    const onOpenChange = vi.fn();
    render(<Basic onOpenChange={onOpenChange} />);
    await userEvent.click(trigger());
    await raf();
    await userEvent.keyboard('{Escape}');
    await closed();
    expect(isOpen()).toBe(false);
    expect(menuEl()).toBeNull();
    expect(document.activeElement).toBe(trigger());
    expect(onOpenChange.mock.calls.map((c) => [c[0], c[1].reason])).toEqual([
      [true, 'trigger-press'],
      [false, 'escape-key'],
    ]);
  });

  test('an outside click closes it, the click lands on its target, reason outside-press', async () => {
    const onOpenChange = vi.fn();
    const onClick = vi.fn();
    render(
      <Wrap>
        <button type="button" data-testid="outside" onClick={onClick}>
          outside
        </button>
        <Menu.Root onOpenChange={onOpenChange}>
          <Menu.Trigger>
            <button type="button">Song</button>
          </Menu.Trigger>
          <Menu.Popup>
            <Menu.Item id="a">Alpha</Menu.Item>
          </Menu.Popup>
        </Menu.Root>
      </Wrap>,
    );
    await userEvent.click(trigger());
    await raf();
    await userEvent.click(document.querySelector('[data-testid="outside"]')!);
    await closed();
    expect(isOpen()).toBe(false);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[onOpenChange.mock.calls.length - 1]?.[1].reason).toBe(
      'outside-press',
    );
  });

  test('clicking the trigger again closes it', async () => {
    const onOpenChange = vi.fn();
    render(<Basic onOpenChange={onOpenChange} />);
    await userEvent.click(trigger());
    await raf();
    expect(isOpen()).toBe(true);
    await userEvent.click(trigger());
    await closed();
    expect(isOpen()).toBe(false);
    expect(onOpenChange.mock.calls.map((c) => c[0])).toEqual([true, false]);
  });

  test('Tab moves focus away and closes it', async () => {
    render(
      <Wrap>
        <Menu.Root>
          <Menu.Trigger>
            <button type="button">Song</button>
          </Menu.Trigger>
          <Menu.Popup>
            <Menu.Item id="a">Alpha</Menu.Item>
          </Menu.Popup>
        </Menu.Root>
        <button type="button">next</button>
      </Wrap>,
    );
    await userEvent.click(trigger());
    await raf();
    await userEvent.tab();
    await closed();
    expect(isOpen()).toBe(false);
  });

  test('details.cancel() vetoes closing', async () => {
    render(
      <Wrap>
        <Menu.Root defaultOpen onOpenChange={(_next, details) => details.cancel()}>
          <Menu.Trigger>
            <button type="button">Song</button>
          </Menu.Trigger>
          <Menu.Popup>
            <Menu.Item id="a">Alpha</Menu.Item>
          </Menu.Popup>
        </Menu.Root>
      </Wrap>,
    );
    await raf();
    expect(isOpen()).toBe(true);
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(isOpen()).toBe(true);
    expect(menuEl()).toBeTruthy();
  });

  test('controlled open follows `open`', async () => {
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Wrap>
          <button type="button" data-testid="ext" onClick={() => setOpen(true)}>
            ext
          </button>
          <Menu.Root open={open} onOpenChange={setOpen}>
            <Menu.Trigger>
              <button type="button">Song</button>
            </Menu.Trigger>
            <Menu.Popup>
              <Menu.Item id="a">Alpha</Menu.Item>
            </Menu.Popup>
          </Menu.Root>
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
  });

  test('flips above the trigger near the bottom of the viewport', async () => {
    render(<Basic top={window.innerHeight - 60} />);
    await userEvent.click(trigger());
    await settled(popup());
    expect(popup().getBoundingClientRect().bottom).toBeLessThanOrEqual(
      trigger().getBoundingClientRect().top + 1,
    );
  });

  test.each([
    ['top', 'above'],
    ['end', 'inline-end'],
  ] as const)('placement=%s positions the popup %s the trigger', async (placement, where) => {
    render(<Basic placement={placement} top={window.innerHeight / 2} />);
    await userEvent.click(trigger());
    await settled(popup());
    const t = trigger().getBoundingClientRect();
    const p = popup().getBoundingClientRect();
    expect(popup().getAttribute('data-placement')).toBe(placement);
    if (where === 'above') expect(p.bottom).toBeLessThanOrEqual(t.top + 1);
    else expect(p.left).toBeGreaterThanOrEqual(t.right - 1);
  });

  test('in an RTL document, `bottom start` aligns the popup to the trigger right edge', async () => {
    render(<Basic direction="rtl" />);
    await userEvent.click(trigger());
    await settled(popup());
    const t = trigger().getBoundingClientRect();
    const p = popup().getBoundingClientRect();
    expect(Math.round(p.right)).toBe(Math.round(t.right));
  });

  test('enter and exit animate; the menu stays mounted until the exit ends', async () => {
    render(<Basic />);
    await userEvent.click(trigger());
    await raf();
    expect(popup().getAnimations({ subtree: true }).length).toBeGreaterThan(0);
    await settled(popup());
    expect(Number(getComputedStyle(popup()).opacity)).toBe(1);
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(isOpen()).toBe(false);
    expect(freezeAt(popup(), 0.5)).toBeGreaterThan(0);
    expect(menuEl()).toBeTruthy();
    expect(Number(getComputedStyle(popup()).opacity)).toBeLessThan(1);
    await finishAll(popup());
    await raf();
    expect(menuEl()).toBeNull();
    expect(getComputedStyle(popup()).display).toBe('none');
  });

  test('passes native props and ref through to the popover element', async () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <Wrap>
        <Menu.Root>
          <Menu.Trigger>
            <button type="button">Song</button>
          </Menu.Trigger>
          <Menu.Popup data-testid="popup" className="mine" ref={ref}>
            <Menu.Item id="a">Alpha</Menu.Item>
          </Menu.Popup>
        </Menu.Root>
      </Wrap>,
    );
    expect(ref.current).toBe(popup());
    expect(popup().getAttribute('data-testid')).toBe('popup');
    expect(popup().classList.contains('mine')).toBe(true);
  });
});

describe('Menu presets on a native popover', () => {
  test('FromSections opens, runs onAction (with danger/shortcut content) and closes', async () => {
    const onAction = vi.fn();
    render(
      <Wrap>
        <Menu.FromSections
          trigger={<button type="button">Actions</button>}
          sections={[
            { items: [{ id: 'edit', label: 'Edit', shortcut: 'E', onAction }] },
            { label: 'More', items: [{ id: 'rm', label: 'Remove', danger: true }] },
          ]}
        />
      </Wrap>,
    );
    await userEvent.click(trigger());
    await raf();
    expect(item('Edit').textContent).toContain('E');
    await userEvent.click(item('Edit'));
    expect(onAction).toHaveBeenCalledTimes(1);
    await closed();
    expect(isOpen()).toBe(false);
  });

  test('Overflow opens from its icon button', async () => {
    render(
      <Wrap>
        <Menu.Overflow sections={[{ items: [{ id: 'a', label: 'Alpha' }] }]} />
      </Wrap>,
    );
    await userEvent.click(document.querySelector('button[aria-label="More options"]')!);
    await raf();
    expect(isOpen()).toBe(true);
    expect(item('Alpha')).toBeTruthy();
  });
});

describe('Menu.ContextMenu anchoring', () => {
  function Ctx({
    onOpenChange,
  }: {
    onOpenChange?: React.ComponentProps<typeof Menu.Root>['onOpenChange'];
  }) {
    return (
      <Wrap>
        <Menu.ContextMenu
          onOpenChange={onOpenChange}
          sections={[
            {
              items: [
                { id: 'copy', label: 'Copy' },
                { id: 'paste', label: 'Paste' },
              ],
            },
          ]}
        >
          <div className="surface" tabIndex={0} data-testid="surface">
            Right-click me
          </div>
        </Menu.ContextMenu>
      </Wrap>
    );
  }
  const surface = () => document.querySelector<HTMLElement>('[data-testid="surface"]')!;

  test('opens at the pointer, and only on contextmenu', async () => {
    render(<Ctx />);
    await userEvent.click(surface());
    await raf();
    expect(menuEl()).toBeNull();
    await userEvent.click(surface(), { button: 'right', position: { x: 50, y: 60 } });
    await settled(popup());
    expect(isOpen()).toBe(true);
    const p = popup().getBoundingClientRect();
    // Surface is at 100,100: pointer is at 150,160. `bottom start` opens down from the point.
    expect(Math.round(p.left)).toBe(150);
    expect(p.top).toBeGreaterThanOrEqual(160 - 1);
    expect(p.top).toBeLessThan(160 + 20);
    const anchor = document.querySelector<HTMLElement>('[data-context-menu-anchor]')!;
    expect(anchor.style.left).toBe('150px');
    expect(anchor.style.top).toBe('160px');
    // The menu itself holds focus (opened without a focus strategy); arrows reach the items.
    expect(menuEl()!.contains(document.activeElement)).toBe(true);
    await userEvent.keyboard('{ArrowDown}');
    expect(item('Copy')).toBe(document.activeElement);
    await userEvent.keyboard('{Escape}');
    await closed();
    expect(isOpen()).toBe(false);
  });

  test('a second right-click moves the anchor and the menu', async () => {
    render(<Ctx />);
    await userEvent.click(surface(), { button: 'right', position: { x: 20, y: 20 } });
    await settled(popup());
    await userEvent.keyboard('{Escape}');
    await closed();
    await userEvent.click(surface(), { button: 'right', position: { x: 120, y: 90 } });
    await settled(popup());
    expect(Math.round(popup().getBoundingClientRect().left)).toBe(220);
  });

  test('keyboard invocation (ContextMenu key) anchors to the focused target bottom-start', async () => {
    render(<Ctx />);
    surface().focus();
    // Chromium reports clientX/Y 0,0 for keyboard-invoked contextmenu events.
    surface().dispatchEvent(
      new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 0, clientY: 0 }),
    );
    await settled(popup());
    const s = surface().getBoundingClientRect();
    const p = popup().getBoundingClientRect();
    expect(isOpen()).toBe(true);
    expect(Math.round(p.left)).toBe(Math.round(s.left));
    expect(p.top).toBeGreaterThanOrEqual(s.bottom - 1);
  });

  test('an outside click closes it', async () => {
    const onOpenChange = vi.fn();
    render(<Ctx onOpenChange={onOpenChange} />);
    await userEvent.click(surface(), { button: 'right', position: { x: 20, y: 20 } });
    await settled(popup());
    await userEvent.click(document.body, { position: { x: 5, y: 5 } });
    await closed();
    expect(isOpen()).toBe(false);
    expect(onOpenChange.mock.calls[onOpenChange.mock.calls.length - 1]?.[1].reason).toBe(
      'outside-press',
    );
  });
});

describe('Menu submenus (RAC SubmenuTrigger + NativePopover)', () => {
  function Submenus({ onAction }: { onAction?: (id: string) => void }) {
    return (
      <Wrap>
        <div className="pin" style={{ top: 40 }}>
          <Menu.Root>
            <Menu.Trigger>
              <button type="button">File</button>
            </Menu.Trigger>
            <Menu.Popup aria-label="File">
              <Menu.Item id="new" onAction={() => onAction?.('new')}>
                New
              </Menu.Item>
              <SubmenuTrigger>
                <Menu.Item id="export">Export</Menu.Item>
                <NativePopover className="sub">
                  <AriaMenu aria-label="Export" onAction={(key) => onAction?.(String(key))}>
                    <Menu.Item id="pdf">PDF</Menu.Item>
                    <Menu.Item id="png">PNG</Menu.Item>
                  </AriaMenu>
                </NativePopover>
              </SubmenuTrigger>
            </Menu.Popup>
          </Menu.Root>
        </div>
      </Wrap>
    );
  }

  test('ArrowRight opens the submenu, an item acts and closes the whole tree', async () => {
    const onAction = vi.fn();
    render(<Submenus onAction={onAction} />);
    trigger().focus();
    await userEvent.keyboard('{ArrowDown}');
    await raf();
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(item('Export'));
    await userEvent.keyboard('{ArrowRight}');
    await raf();
    const subs = document.querySelectorAll<HTMLElement>('[popover]');
    expect(subs).toHaveLength(2);
    expect(subs[1]!.matches(':popover-open')).toBe(true);
    expect(subs[0]!.contains(subs[1]!)).toBe(true);
    expect(document.activeElement).toBe(item('PDF'));
    await userEvent.keyboard('{Enter}');
    expect(onAction).toHaveBeenCalledWith('pdf');
    await raf();
    await finishAll(popup());
    await raf();
    expect(isOpen()).toBe(false);
  });

  test('ArrowLeft and Escape close the submenu, leaving the parent open', async () => {
    render(<Submenus />);
    trigger().focus();
    await userEvent.keyboard('{ArrowDown}');
    await raf();
    await userEvent.keyboard('{ArrowDown}{ArrowRight}');
    await raf();
    const sub = () => document.querySelectorAll<HTMLElement>('[popover]')[1]!;
    expect(sub().matches(':popover-open')).toBe(true);
    await userEvent.keyboard('{ArrowLeft}');
    await raf();
    await finishAll(sub());
    expect(sub().matches(':popover-open')).toBe(false);
    expect(isOpen()).toBe(true);
    expect(document.activeElement).toBe(item('Export'));
  });

  test('clicking an item in the submenu does not count as an outside press', async () => {
    const onAction = vi.fn();
    render(<Submenus onAction={onAction} />);
    await userEvent.click(trigger());
    await raf();
    await userEvent.hover(item('Export'));
    await userEvent.keyboard('{ArrowRight}');
    await raf();
    await userEvent.click(item('PNG'));
    expect(onAction).toHaveBeenCalledWith('png');
  });
});

describe('Menu inside a modal Dialog (no shim)', () => {
  function InDialog({ onAction }: { onAction?: () => void }) {
    return (
      <Wrap>
        <Dialog.Root defaultOpen>
          <Dialog.Popup data-testid="dialog">
            <Dialog.Title>Pick</Dialog.Title>
            <Menu.Root>
              <Menu.Trigger>
                <button type="button">Song</button>
              </Menu.Trigger>
              <Menu.Popup>
                <Menu.Item id="a" onAction={onAction}>
                  Alpha
                </Menu.Item>
                <Menu.Item id="b">Beta</Menu.Item>
              </Menu.Popup>
            </Menu.Root>
          </Dialog.Popup>
        </Dialog.Root>
      </Wrap>
    );
  }
  const dialog = () => document.querySelector<HTMLDialogElement>('dialog')!;

  test('opens inside the dialog, is hit-testable and a trusted click acts', async () => {
    const onAction = vi.fn();
    render(<InDialog onAction={onAction} />);
    await settled(dialog());
    await userEvent.click(trigger());
    await raf();
    expect(isOpen()).toBe(true);
    expect(dialog().contains(popup())).toBe(true);
    const rect = item('Beta').getBoundingClientRect();
    const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    expect(item('Beta').contains(hit)).toBe(true);
    await userEvent.click(item('Alpha'));
    expect(onAction).toHaveBeenCalledTimes(1);
    await closed();
    expect(dialog().matches(':modal')).toBe(true);
    expect(document.activeElement).toBe(trigger());
  });

  test('Escape closes the menu first; the dialog stays open', async () => {
    render(<InDialog />);
    await settled(dialog());
    await userEvent.click(trigger());
    await raf();
    await userEvent.keyboard('{Escape}');
    await closed();
    expect(isOpen()).toBe(false);
    expect(dialog().matches(':modal')).toBe(true);
  });

  test('an outside click on the dialog body closes the menu, not the dialog', async () => {
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
