import { render } from '@testing-library/react';
import { StrictMode } from 'react';
import { userEvent } from 'vite-plus/test/browser';
import { beforeAll, describe, expect, test, vi } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import { finishAll, raf } from '../test/browser';
import { Menu } from './Menu';
import { Menubar } from './Menubar';

beforeAll(() => {
  const style = document.createElement('style');
  style.textContent = `:root, :root[class] { --var-ui-duration-slow: 150ms; }
    .pin { position: fixed; left: 40px; top: 40px; }
    .pin-rtl { position: fixed; right: 40px; top: 40px; }`;
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

type BarProps = {
  onAction?: (id: string) => void;
  onOpenChange?: (menu: string, open: boolean, reason: string) => void;
  direction?: 'rtl' | 'ltr';
};

function Bar({ onAction = () => {}, onOpenChange = () => {}, direction }: BarProps) {
  const change = (menu: string) => (open: boolean, details: { reason: string }) =>
    onOpenChange(menu, open, details.reason);
  return (
    <Wrap direction={direction}>
      <button type="button">before</button>
      <Menubar aria-label="Application">
        <Menubar.Menu label="File" onOpenChange={change('file')}>
          <Menu.Item id="new" onAction={() => onAction('new')}>
            New
          </Menu.Item>
          <Menu.Item id="open" onAction={() => onAction('open')}>
            Open
          </Menu.Item>
          <Menu.Item id="save" disabled>
            Save
          </Menu.Item>
          <Menu.Separator />
          <Menu.Section title="Recent">
            <Menu.Item id="recent" onAction={() => onAction('recent')}>
              Recent file
            </Menu.Item>
          </Menu.Section>
        </Menubar.Menu>
        <Menubar.Menu label="Edit" onOpenChange={change('edit')}>
          <Menu.Item id="undo" onAction={() => onAction('undo')}>
            Undo
          </Menu.Item>
          <Menu.Item id="redo" onAction={() => onAction('redo')}>
            Redo
          </Menu.Item>
        </Menubar.Menu>
        <Menubar.Menu label="View" onOpenChange={change('view')}>
          <Menu.Item id="zoom" onAction={() => onAction('zoom')}>
            Zoom
          </Menu.Item>
        </Menubar.Menu>
        <Menubar.Menu label="Window" disabled>
          <Menu.Item id="min">Minimize</Menu.Item>
        </Menubar.Menu>
        <Menubar.Menu label="Help" onOpenChange={change('help')}>
          <Menu.Item id="about" onAction={() => onAction('about')}>
            About
          </Menu.Item>
        </Menubar.Menu>
      </Menubar>
      <button type="button">after</button>
    </Wrap>
  );
}

const top = (name: string) =>
  [...document.querySelectorAll<HTMLElement>('[role="menubar"] > button[role="menuitem"]')].find(
    (b) => b.textContent === name,
  )!;
const openMenus = () => [...document.querySelectorAll<HTMLElement>('[popover]:popover-open')];
const item = (label: string) =>
  [...document.querySelectorAll<HTMLElement>('[popover] [role="menuitem"]')].find(
    (o) => o.textContent === label,
  )!;
const outside = (name: string) =>
  [...document.querySelectorAll('button')].find((b) => b.textContent === name)!;

describe('Menubar (real browser)', () => {
  test('roles, aria wiring and a single Tab stop', async () => {
    render(<Bar />);
    const bar = document.querySelector('[role="menubar"]')!;
    expect(bar.getAttribute('aria-label')).toBe('Application');
    for (const name of ['File', 'Edit', 'View', 'Help']) {
      const b = top(name);
      expect(b.getAttribute('role')).toBe('menuitem');
      expect(b.getAttribute('aria-haspopup')).toBe('menu');
      expect(b.getAttribute('aria-expanded')).toBe('false');
    }
    expect(top('File').tabIndex).toBe(0);
    expect(top('Edit').tabIndex).toBe(-1);
    await userEvent.tab();
    expect(document.activeElement).toBe(outside('before'));
    await userEvent.tab();
    expect(document.activeElement).toBe(top('File'));
    await userEvent.tab();
    expect(document.activeElement).toBe(outside('after'));
    await userEvent.tab({ shift: true });
    expect(document.activeElement).toBe(top('File'));
  });

  test('Left/Right move between items, wrap and skip the disabled one; Home/End', async () => {
    render(<Bar />);
    top('File').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(top('Edit'));
    expect(top('Edit').tabIndex).toBe(0);
    expect(top('File').tabIndex).toBe(-1);
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    expect(document.activeElement).toBe(top('Help'));
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(top('File'));
    await userEvent.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(top('Help'));
    await userEvent.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(top('View'));
    await userEvent.keyboard('{Home}');
    expect(document.activeElement).toBe(top('File'));
    await userEvent.keyboard('{End}');
    expect(document.activeElement).toBe(top('Help'));
    expect(openMenus()).toHaveLength(0);
  });

  test.each([['{ArrowDown}'], ['{Enter}'], [' ']])(
    '%s opens the menu and focuses the first item',
    async (key) => {
      render(<Bar />);
      top('Edit').focus();
      await userEvent.keyboard(key);
      await raf();
      expect(openMenus()).toHaveLength(1);
      expect(top('Edit').getAttribute('aria-expanded')).toBe('true');
      expect(top('Edit').hasAttribute('data-open')).toBe(true);
      expect(document.activeElement).toBe(item('Undo'));
    },
  );

  test('ArrowUp opens the menu and focuses the last item', async () => {
    render(<Bar />);
    top('File').focus();
    await userEvent.keyboard('{ArrowUp}');
    await raf();
    expect(document.activeElement).toBe(item('Recent file'));
  });

  test('the open menu is named by its trigger and sits below it', async () => {
    render(<Bar />);
    await userEvent.click(top('File'));
    await raf();
    const menu = document.querySelector<HTMLElement>('[role="menu"]')!;
    const name = menu.getAttribute('aria-label') ?? menu.getAttribute('aria-labelledby');
    expect(name).toBeTruthy();
    const t = top('File').getBoundingClientRect();
    const p = openMenus()[0]!.getBoundingClientRect();
    expect(p.top).toBeGreaterThanOrEqual(t.bottom - 1);
    expect(Math.round(p.left)).toBe(Math.round(t.left));
  });

  test('Left/Right in an open menu switch to the adjacent menu, first item focused', async () => {
    const onOpenChange = vi.fn();
    render(<Bar onOpenChange={onOpenChange} />);
    top('File').focus();
    await userEvent.keyboard('{ArrowDown}');
    await raf();
    await userEvent.keyboard('{ArrowDown}'); // Open
    await userEvent.keyboard('{ArrowRight}');
    await raf();
    expect(openMenus()).toHaveLength(1);
    expect(top('File').getAttribute('aria-expanded')).toBe('false');
    expect(top('Edit').getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(item('Undo'));
    expect(onOpenChange).toHaveBeenCalledWith('file', false, 'imperative');
    expect(onOpenChange).toHaveBeenLastCalledWith('edit', true, 'imperative');
    // Skips the disabled Window menu and wraps at the ends.
    await userEvent.keyboard('{ArrowRight}');
    await raf();
    expect(document.activeElement).toBe(item('Zoom'));
    await userEvent.keyboard('{ArrowRight}');
    await raf();
    expect(document.activeElement).toBe(item('About'));
    await userEvent.keyboard('{ArrowRight}');
    await raf();
    expect(document.activeElement).toBe(item('New'));
    await userEvent.keyboard('{ArrowLeft}');
    await raf();
    expect(document.activeElement).toBe(item('About'));
    expect(openMenus()).toHaveLength(1);
  });

  test('Escape closes the menu and focus returns to its top-level item', async () => {
    const onOpenChange = vi.fn();
    render(<Bar onOpenChange={onOpenChange} />);
    top('View').focus();
    await userEvent.keyboard('{Enter}');
    await raf();
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(onOpenChange).toHaveBeenLastCalledWith('view', false, 'escape-key');
    expect(top('View').getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(top('View'));
    expect(top('View').tabIndex).toBe(0);
  });

  test('Escape after switching returns focus to the new top-level item', async () => {
    render(<Bar />);
    top('File').focus();
    await userEvent.keyboard('{Enter}');
    await raf();
    await userEvent.keyboard('{ArrowRight}');
    await raf();
    await userEvent.keyboard('{Escape}');
    await raf();
    await finishAll(document.body);
    expect(document.activeElement).toBe(top('Edit'));
    expect(top('Edit').tabIndex).toBe(0);
  });

  test('hovering another top-level item while a menu is open switches to it', async () => {
    const onOpenChange = vi.fn();
    render(<Bar onOpenChange={onOpenChange} />);
    await userEvent.hover(top('File'));
    expect(openMenus()).toHaveLength(0); // hover alone does not open
    await userEvent.click(top('File'));
    await raf();
    expect(openMenus()).toHaveLength(1);
    await userEvent.hover(top('Edit'));
    await raf();
    expect(openMenus()).toHaveLength(1);
    expect(top('File').getAttribute('aria-expanded')).toBe('false');
    expect(top('Edit').getAttribute('aria-expanded')).toBe('true');
    expect(
      document.activeElement === top('Edit') || openMenus()[0]!.contains(document.activeElement),
    ).toBe(true);
    expect(onOpenChange).toHaveBeenLastCalledWith('edit', true, 'hover');
    expect(onOpenChange).toHaveBeenCalledWith('file', false, 'hover');
  });

  test('only one menu is open at a time, whichever way the menus change', async () => {
    render(<Bar />);
    top('File').focus();
    await userEvent.keyboard('{Enter}');
    await raf();
    for (const name of ['Edit', 'View', 'Help']) {
      await userEvent.keyboard('{ArrowRight}');
      await raf();
      expect(openMenus()).toHaveLength(1);
      expect(top(name).getAttribute('aria-expanded')).toBe('true');
    }
    expect(document.querySelectorAll('[role="menubar"] [aria-expanded="true"]')).toHaveLength(1);
  });

  test('clicking the open trigger closes it; outside press closes with its reason', async () => {
    const onOpenChange = vi.fn();
    render(<Bar onOpenChange={onOpenChange} />);
    await userEvent.click(top('File'));
    await raf();
    await userEvent.click(top('File'));
    await raf();
    expect(top('File').getAttribute('aria-expanded')).toBe('false');
    // Let the exit finish: reopening a native popover mid-exit is flaky in plain `Menu` too.
    await finishAll(document.body);
    await userEvent.click(top('File'));
    await raf();
    await userEvent.click(outside('after'));
    await raf();
    expect(onOpenChange).toHaveBeenLastCalledWith('file', false, 'outside-press');
    expect(top('File').getAttribute('aria-expanded')).toBe('false');
  });

  test('activating an item runs onAction, closes the menu and returns focus', async () => {
    const onAction = vi.fn();
    render(<Bar onAction={onAction} />);
    top('File').focus();
    await userEvent.keyboard('{Enter}');
    await raf();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await raf();
    expect(onAction).toHaveBeenCalledWith('open');
    expect(top('File').getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(top('File'));
  });

  test('disabled menu items are skipped inside the menu', async () => {
    render(<Bar />);
    top('File').focus();
    await userEvent.keyboard('{Enter}{ArrowDown}{ArrowDown}');
    expect(document.activeElement).toBe(item('Recent file'));
  });

  test('with a menu open, a click-opened menu moves with Left/Right from the trigger', async () => {
    render(<Bar />);
    await userEvent.click(top('File'));
    await raf();
    top('File').focus();
    await userEvent.keyboard('{ArrowRight}');
    await raf();
    expect(top('Edit').getAttribute('aria-expanded')).toBe('true');
    expect(top('File').getAttribute('aria-expanded')).toBe('false');
    expect(openMenus()).toHaveLength(1);
  });

  test('RTL mirrors the arrow keys and the placement', async () => {
    render(<Bar direction="rtl" />);
    // First item sits at the inline start, the right edge.
    expect(top('File').getBoundingClientRect().left).toBeGreaterThan(
      top('Help').getBoundingClientRect().left,
    );
    top('File').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(top('Edit'));
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(top('File'));
    await userEvent.keyboard('{Enter}');
    await raf();
    expect(document.activeElement).toBe(item('New'));
    await userEvent.keyboard('{ArrowLeft}');
    await raf();
    expect(top('Edit').getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(item('Undo'));
    await userEvent.keyboard('{ArrowRight}');
    await raf();
    expect(top('File').getAttribute('aria-expanded')).toBe('true');
  });

  test('a veto from onOpenChange keeps the menu closed', async () => {
    render(
      <Wrap>
        <Menubar aria-label="Veto">
          <Menubar.Menu label="File" onOpenChange={(_, d) => d.cancel()}>
            <Menu.Item id="a">A</Menu.Item>
          </Menubar.Menu>
        </Menubar>
      </Wrap>,
    );
    await userEvent.click(top('File'));
    await raf();
    expect(openMenus()).toHaveLength(0);
    expect(top('File').getAttribute('aria-expanded')).toBe('false');
  });

  test('open and focused triggers are visibly distinct', async () => {
    render(<Bar />);
    const rest = getComputedStyle(top('Edit')).backgroundColor;
    await userEvent.click(top('File'));
    await raf();
    expect(getComputedStyle(top('File')).backgroundColor).not.toBe(rest);
  });
});
