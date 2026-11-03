import { render } from '@testing-library/react';
import { StrictMode } from 'react';
import { userEvent } from 'vite-plus/test/browser';
import { beforeAll, describe, expect, test, vi } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import { finishAll, raf } from '../test/browser';
import { Dialog } from './Dialog';
import { Menu } from './Menu';
import { Menubar } from './Menubar';

beforeAll(() => {
  const style = document.createElement('style');
  style.textContent = `:root, :root[class] { --var-ui-duration-slow: 150ms; }
    /* The test viewport is narrow: keep room for a menu and its submenu side by side. */
    .pin { position: fixed; left: 8px; top: 40px; }
    .pin-rtl { position: fixed; right: 8px; top: 40px; }`;
  document.head.append(style);
});

function Wrap({ children, direction }: { children: React.ReactNode; direction?: 'rtl' | 'ltr' }) {
  return (
    <StrictMode>
      <DesignSystemProvider applyToDocument direction={direction}>
        <IconProvider icons={{}}>
          <div className={direction === 'rtl' ? 'pin-rtl' : 'pin'}>{children}</div>
        </IconProvider>
      </DesignSystemProvider>
    </StrictMode>
  );
}

const trigger = () => document.querySelector<HTMLElement>('button[aria-haspopup]')!;
const popovers = () => [...document.querySelectorAll<HTMLElement>('[popover]')];
const openPopovers = () => popovers().filter((p) => p.matches(':popover-open'));
const item = (label: string) =>
  [...document.querySelectorAll<HTMLElement>('[role="menuitem"]')].find(
    (o) => o.textContent === label,
  )!;
const settleClosed = async () => {
  await raf();
  for (const p of popovers()) await finishAll(p);
  await raf();
};

type Props = {
  onAction?: (id: string) => void;
  direction?: 'rtl' | 'ltr';
};

function Fixture({ onAction = () => {}, direction }: Props) {
  return (
    <Wrap direction={direction}>
      <Menu.Root>
        <Menu.Trigger>
          <button type="button">File</button>
        </Menu.Trigger>
        <Menu.Popup aria-label="File">
          <Menu.Item id="new" onAction={() => onAction('new')}>
            New
          </Menu.Item>
          <Menu.Submenu label="Export" icon="copy">
            <Menu.Item id="pdf" onAction={() => onAction('pdf')}>
              PDF
            </Menu.Item>
            <Menu.Item id="svg" disabled>
              SVG
            </Menu.Item>
            <Menu.Submenu label="Image">
              <Menu.Item id="png" onAction={() => onAction('png')}>
                PNG
              </Menu.Item>
              <Menu.Item id="jpg" onAction={() => onAction('jpg')}>
                JPG
              </Menu.Item>
            </Menu.Submenu>
          </Menu.Submenu>
          <Menu.Submenu label="Locked" disabled>
            <Menu.Item id="never">Never</Menu.Item>
          </Menu.Submenu>
          <Menu.Item id="quit" onAction={() => onAction('quit')}>
            Quit
          </Menu.Item>
        </Menu.Popup>
      </Menu.Root>
    </Wrap>
  );
}

async function openMenuWithKeyboard() {
  trigger().focus();
  await userEvent.keyboard('{ArrowDown}');
  await raf();
}

describe('Menu.Submenu', () => {
  test('the trigger item announces the submenu and the child menu is named by it', async () => {
    render(<Fixture />);
    await openMenuWithKeyboard();
    const exportItem = item('Export');
    expect(exportItem.getAttribute('aria-haspopup')).toBeTruthy();
    expect(exportItem.getAttribute('aria-expanded')).toBe('false');
    await userEvent.keyboard('{ArrowDown}{ArrowRight}');
    await raf();
    expect(exportItem.getAttribute('aria-expanded')).toBe('true');
    expect(exportItem.hasAttribute('data-open')).toBe(true);
    const menus = document.querySelectorAll<HTMLElement>('[role="menu"]');
    expect(menus).toHaveLength(2);
    expect(menus[1]!.getAttribute('aria-labelledby')).toBeTruthy();
    expect(document.getElementById(menus[1]!.getAttribute('aria-labelledby')!)).toBe(exportItem);
  });

  test('ArrowRight opens, first item focused, arrows move, ArrowLeft closes and returns focus', async () => {
    render(<Fixture />);
    await openMenuWithKeyboard();
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(item('Export'));
    await userEvent.keyboard('{ArrowRight}');
    await raf();
    expect(openPopovers()).toHaveLength(2);
    expect(document.activeElement).toBe(item('PDF'));
    await userEvent.keyboard('{ArrowDown}');
    // SVG is disabled: skipped.
    expect(document.activeElement).toBe(item('Image'));
    await userEvent.keyboard('{ArrowUp}');
    expect(document.activeElement).toBe(item('PDF'));
    await userEvent.keyboard('{ArrowLeft}');
    await settleClosed();
    expect(openPopovers()).toHaveLength(1);
    expect(document.activeElement).toBe(item('Export'));
  });

  test('Enter and Space on the trigger item open it', async () => {
    render(<Fixture />);
    await openMenuWithKeyboard();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await raf();
    expect(openPopovers()).toHaveLength(2);
    expect(document.activeElement).toBe(item('PDF'));
    await userEvent.keyboard('{ArrowLeft}');
    await settleClosed();
    await userEvent.keyboard(' ');
    await raf();
    expect(openPopovers()).toHaveLength(2);
  });

  test('Escape closes only the submenu and focuses the parent item', async () => {
    render(<Fixture />);
    await openMenuWithKeyboard();
    await userEvent.keyboard('{ArrowDown}{ArrowRight}');
    await raf();
    await userEvent.keyboard('{Escape}');
    await settleClosed();
    expect(openPopovers()).toHaveLength(1);
    expect(document.activeElement).toBe(item('Export'));
  });

  test('hover opens after a short delay, and moving to a sibling item closes it', async () => {
    render(<Fixture />);
    await userEvent.click(trigger());
    await raf();
    await userEvent.hover(item('Export'));
    await vi.waitFor(() => expect(openPopovers()).toHaveLength(2));
    // The parent stays open while the pointer is over the submenu.
    await userEvent.hover(item('PDF'));
    await raf();
    expect(openPopovers()).toHaveLength(2);
    await userEvent.hover(item('New'));
    await vi.waitFor(() => expect(openPopovers()).toHaveLength(1));
  });

  test('a disabled submenu does not open', async () => {
    render(<Fixture />);
    await openMenuWithKeyboard();
    const locked = item('Locked');
    expect(locked.getAttribute('aria-disabled')).toBe('true');
    await userEvent.hover(locked);
    await raf();
    expect(openPopovers()).toHaveLength(1);
  });

  test('the submenu sits beside the item with its first item level with it', async () => {
    render(<Fixture />);
    await openMenuWithKeyboard();
    await userEvent.keyboard('{ArrowDown}{ArrowRight}');
    await raf();
    const [parent, sub] = openPopovers();
    await finishAll(parent!);
    await finishAll(sub!);
    await raf();
    const owner = item('Export').getBoundingClientRect();
    const subRect = sub!.getBoundingClientRect();
    expect(parent!.contains(item('Export'))).toBe(true);
    expect(Math.abs(subRect.left - owner.right)).toBeLessThan(2);
    const first = item('PDF').getBoundingClientRect();
    expect(Math.abs(first.top - owner.top)).toBeLessThan(2);
  });

  test('two levels: the nested item acts once and the whole chain closes', async () => {
    const onAction = vi.fn();
    render(<Fixture onAction={onAction} />);
    await openMenuWithKeyboard();
    await userEvent.keyboard('{ArrowDown}{ArrowRight}{ArrowDown}{ArrowRight}');
    await raf();
    expect(openPopovers()).toHaveLength(3);
    expect(document.activeElement).toBe(item('PNG'));
    await userEvent.keyboard('{Enter}');
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith('png');
    await settleClosed();
    expect(openPopovers()).toHaveLength(0);
    expect(document.activeElement).toBe(trigger());
  });

  test('clicking a submenu item acts once and closes every menu', async () => {
    const onAction = vi.fn();
    render(<Fixture onAction={onAction} />);
    await userEvent.click(trigger());
    await raf();
    await userEvent.hover(item('Export'));
    await vi.waitFor(() => expect(openPopovers()).toHaveLength(2));
    await userEvent.click(item('PDF'));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith('pdf');
    await settleClosed();
    expect(openPopovers()).toHaveLength(0);
  });

  test('Escape at level two then level one closes step by step', async () => {
    render(<Fixture />);
    await openMenuWithKeyboard();
    await userEvent.keyboard('{ArrowDown}{ArrowRight}{ArrowDown}{ArrowRight}');
    await raf();
    await userEvent.keyboard('{Escape}');
    await settleClosed();
    expect(openPopovers()).toHaveLength(2);
    expect(document.activeElement).toBe(item('Image'));
    await userEvent.keyboard('{Escape}');
    await settleClosed();
    expect(openPopovers()).toHaveLength(1);
  });

  test('RTL: the submenu opens to the inline end (left) with ArrowLeft, ArrowRight closes it', async () => {
    render(<Fixture direction="rtl" />);
    await openMenuWithKeyboard();
    await userEvent.keyboard('{ArrowDown}{ArrowLeft}');
    await raf();
    const [parent, sub] = openPopovers();
    await finishAll(parent!);
    await finishAll(sub!);
    await raf();
    expect(openPopovers()).toHaveLength(2);
    expect(parent!.contains(item('Export'))).toBe(true);
    expect(
      Math.abs(sub!.getBoundingClientRect().right - item('Export').getBoundingClientRect().left),
    ).toBeLessThan(2);
    expect(document.activeElement).toBe(item('PDF'));
    const chevron = item('Export').querySelector<HTMLElement>('[class*="submenuChevron"]');
    expect(getComputedStyle(chevron!).transform).not.toBe('none');
    await userEvent.keyboard('{ArrowRight}');
    await settleClosed();
    expect(openPopovers()).toHaveLength(1);
    expect(document.activeElement).toBe(item('Export'));
  });

  test('works inside a modal Dialog with trusted clicks', async () => {
    const onAction = vi.fn();
    render(
      <Wrap>
        <Dialog.Root defaultOpen>
          <Dialog.Popup>
            <Dialog.Title>Pick</Dialog.Title>
            <Menu.Root>
              <Menu.Trigger>
                <button type="button">File</button>
              </Menu.Trigger>
              <Menu.Popup aria-label="File">
                <Menu.Submenu label="Export">
                  <Menu.Item id="pdf" onAction={onAction}>
                    PDF
                  </Menu.Item>
                </Menu.Submenu>
              </Menu.Popup>
            </Menu.Root>
          </Dialog.Popup>
        </Dialog.Root>
      </Wrap>,
    );
    await raf();
    await userEvent.click(trigger());
    await raf();
    await userEvent.hover(item('Export'));
    await vi.waitFor(() => expect(openPopovers()).toHaveLength(2));
    await userEvent.click(item('PDF'));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(document.querySelector('dialog')!.open).toBe(true);
  });

  test('presets: an item with `items` renders a submenu', async () => {
    const onAction = vi.fn();
    render(
      <Wrap>
        <Menu.FromSections
          trigger={<button type="button">Actions</button>}
          sections={[
            {
              items: [
                { id: 'a', label: 'Alpha' },
                {
                  id: 'share',
                  label: 'Share',
                  items: [{ id: 'link', label: 'Copy link', onAction }],
                },
              ],
            },
          ]}
        />
      </Wrap>,
    );
    await userEvent.click(trigger());
    await raf();
    await userEvent.hover(item('Share'));
    await vi.waitFor(() => expect(openPopovers()).toHaveLength(2));
    await userEvent.click(item('Copy link'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});

describe('Menu.Submenu inside Menubar', () => {
  function Bar({ onAction = () => {}, direction }: Props) {
    return (
      <Wrap direction={direction}>
        <Menubar aria-label="Application">
          <Menubar.Menu label="File">
            <Menu.Item id="new">New</Menu.Item>
            <Menu.Submenu label="Export">
              <Menu.Item id="pdf" onAction={() => onAction('pdf')}>
                PDF
              </Menu.Item>
              <Menu.Item id="png" onAction={() => onAction('png')}>
                PNG
              </Menu.Item>
            </Menu.Submenu>
          </Menubar.Menu>
          <Menubar.Menu label="Edit">
            <Menu.Item id="undo">Undo</Menu.Item>
          </Menubar.Menu>
        </Menubar>
      </Wrap>
    );
  }
  const barTrigger = (label: string) =>
    [...document.querySelectorAll<HTMLElement>('[data-menubar-trigger]')].find(
      (b) => b.textContent === label,
    )!;

  async function openExport(direction?: 'rtl') {
    barTrigger('File').focus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await userEvent.keyboard(direction ? '{ArrowLeft}' : '{ArrowRight}');
    await raf();
    expect(openPopovers()).toHaveLength(2);
    expect(document.activeElement).toBe(item('PDF'));
  }

  test('Right on a submenu trigger opens it; Left inside closes the submenu first', async () => {
    render(<Bar />);
    await openExport();
    await userEvent.keyboard('{ArrowLeft}');
    await settleClosed();
    expect(openPopovers()).toHaveLength(1);
    expect(document.activeElement).toBe(item('Export'));
    expect(barTrigger('File').getAttribute('aria-expanded')).toBe('true');
  });

  test('Right on a plain item inside the submenu moves to the next top-level menu', async () => {
    render(<Bar />);
    await openExport();
    await userEvent.keyboard('{ArrowRight}');
    await settleClosed();
    expect(barTrigger('Edit').getAttribute('aria-expanded')).toBe('true');
    expect(barTrigger('File').getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(item('Undo'));
  });

  test('an item in the submenu acts once and closes the menu, focus on the top-level item', async () => {
    const onAction = vi.fn();
    render(<Bar onAction={onAction} />);
    await openExport();
    await userEvent.keyboard('{Enter}');
    expect(onAction).toHaveBeenCalledTimes(1);
    await settleClosed();
    expect(openPopovers()).toHaveLength(0);
    expect(document.activeElement).toBe(barTrigger('File'));
  });

  test('RTL: Left opens the submenu, Right closes it', async () => {
    render(<Bar direction="rtl" />);
    await openExport('rtl');
    await userEvent.keyboard('{ArrowRight}');
    await settleClosed();
    expect(openPopovers()).toHaveLength(1);
    expect(document.activeElement).toBe(item('Export'));
  });
});
