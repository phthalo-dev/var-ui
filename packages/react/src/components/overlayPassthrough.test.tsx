import { createRef, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import { CommandPalette } from './CommandPalette';
import { stubNativeDialog } from '../test/nativeOverlayStubs';
import { Dialog } from './Dialog';
import { Drawer } from './Drawer';
import { Hidden } from './Hidden';
import { HoverCard } from './HoverCard';
import { LoadingOverlay } from './LoadingOverlay';
import { Menu } from './Menu';
import { MobileNav, MobileNavToggle } from './MobileNav';
import { Popover } from './Popover';
import { Toast, ToastProvider, ToastQueue, ToastRegion, useToast } from './Toast';
import { Tooltip } from './Tooltip';

function wrap(ui: ReactNode) {
  return render(
    <IconProvider icons={{}}>
      <LayerProvider>{ui}</LayerProvider>
    </IconProvider>,
  );
}

describe('Dialog passthrough', () => {
  stubNativeDialog();

  it('forwards native props, merges className and wires refs on every part', async () => {
    const onClick = vi.fn();
    const popupRef = createRef<HTMLDialogElement>();
    const closeRef = createRef<HTMLButtonElement>();
    const titleRef = createRef<HTMLHeadingElement>();
    wrap(
      <Dialog.Root defaultOpen>
        <Dialog.Popup
          data-testid="popup"
          className="my-popup"
          aria-label="Settings dialog"
          ref={popupRef}
          onClick={onClick}
        >
          <Dialog.Header data-testid="header" className="my-header">
            <Dialog.Title id="ttl" data-testid="title" className="my-title" ref={titleRef}>
              Title
            </Dialog.Title>
            <Dialog.Close data-testid="close" className="my-close" ref={closeRef} />
          </Dialog.Header>
          <Dialog.Description id="desc" data-testid="desc" className="my-desc">
            About
          </Dialog.Description>
          <Dialog.Actions data-testid="actions" className="my-actions" />
        </Dialog.Popup>
      </Dialog.Root>,
    );
    expect(screen.getByTestId('popup').tagName).toBe('DIALOG');
    expect(screen.getByTestId('popup').className).toContain('my-popup');
    expect(popupRef.current).toBe(screen.getByTestId('popup'));
    const dialog = screen.getByRole('dialog', { name: 'Settings dialog' });
    expect(dialog.getAttribute('aria-describedby')).toBe('desc');
    expect(screen.getByTestId('header').className).toContain('my-header');
    expect(screen.getByTestId('title').id).toBe('ttl');
    expect(screen.getByTestId('title').className).toContain('my-title');
    expect(titleRef.current).toBe(screen.getByTestId('title'));
    expect(screen.getByTestId('desc').className).toContain('my-desc');
    expect(screen.getByTestId('actions').className).toContain('my-actions');
    expect(closeRef.current).toBe(screen.getByTestId('close'));
    expect(screen.getByTestId('close').className).toContain('my-close');
    await userEvent.click(screen.getByTestId('popup'));
    expect(onClick).toHaveBeenCalled();
  });

  it('runs a Close onClick handler and still closes', async () => {
    const onClick = vi.fn();
    wrap(
      <Dialog.Root defaultOpen>
        <Dialog.Popup aria-label="x">
          <Dialog.Close data-testid="close" onClick={onClick} />
        </Dialog.Popup>
      </Dialog.Root>,
    );
    await userEvent.click(screen.getByTestId('close'));
    expect(onClick).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('forwards Trigger native props to its child', async () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLElement>();
    wrap(
      <Dialog.Root>
        <Dialog.Trigger data-testid="trigger" className="my-trigger" onClick={onClick} ref={ref}>
          <button type="button">Open</button>
        </Dialog.Trigger>
        <Dialog.Popup aria-label="x">x</Dialog.Popup>
      </Dialog.Root>,
    );
    const trigger = screen.getByTestId('trigger');
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger.className).toContain('my-trigger');
    expect(ref.current).toBe(trigger);
    await userEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Popover passthrough', () => {
  it('forwards native props on parts and honors aria-label', () => {
    const popupRef = createRef<HTMLDivElement>();
    const onClick = vi.fn();
    wrap(
      <Popover.Root defaultOpen>
        <Popover.Trigger>
          <button type="button" data-testid="trigger">
            Open
          </button>
        </Popover.Trigger>
        <Popover.Popup
          data-testid="popup"
          className="my-popup"
          aria-label="Filters"
          ref={popupRef}
          onClick={onClick}
        >
          <Popover.Arrow data-testid="arrow" className="my-arrow" />
          <Popover.Content data-testid="content" className="my-content">
            body
          </Popover.Content>
        </Popover.Popup>
      </Popover.Root>,
    );
    expect(screen.getByTestId('popup').className).toContain('my-popup');
    expect(popupRef.current).toBe(screen.getByTestId('popup'));
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeTruthy();
    expect(screen.getByTestId('content').className).toContain('my-content');
    screen.getByTestId('popup').click();
    expect(onClick).toHaveBeenCalled();
  });

  it('names the dialog from Popover.Title and forwards Title props', () => {
    wrap(
      <Popover.Root defaultOpen>
        <Popover.Trigger>
          <button type="button">Open</button>
        </Popover.Trigger>
        <Popover.Popup>
          <Popover.Title data-testid="title" className="my-title">
            Filter results
          </Popover.Title>
        </Popover.Popup>
      </Popover.Root>,
    );
    expect(screen.getByRole('dialog', { name: 'Filter results' })).toBeTruthy();
    expect(screen.getByTestId('title').className).toContain('my-title');
  });
});

describe('Tooltip passthrough', () => {
  it('forwards native props and ref on Popup', () => {
    const ref = createRef<HTMLDivElement>();
    wrap(
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger>
          <button type="button">Info</button>
        </Tooltip.Trigger>
        <Tooltip.Popup data-testid="tip" className="my-tip" ref={ref}>
          More
        </Tooltip.Popup>
      </Tooltip.Root>,
    );
    const tip = screen.getByTestId('tip');
    expect(tip.className).toContain('my-tip');
    expect(ref.current).toBe(tip);
    expect(tip.getAttribute('role')).toBe('tooltip');
  });
});

describe('HoverCard passthrough', () => {
  it('forwards native props, supports aria-label and Title naming', () => {
    const ref = createRef<HTMLDivElement>();
    wrap(
      <HoverCard.Root defaultOpen>
        <HoverCard.Trigger>
          <a href="#x">@user</a>
        </HoverCard.Trigger>
        <HoverCard.Popup data-testid="card" className="my-card" aria-label="User card" ref={ref}>
          <HoverCard.Content data-testid="content" className="my-content">
            hi
          </HoverCard.Content>
        </HoverCard.Popup>
      </HoverCard.Root>,
    );
    expect(screen.getByTestId('card').className).toContain('my-card');
    expect(ref.current).toBe(screen.getByTestId('card'));
    expect(screen.getByRole('dialog', { name: 'User card' })).toBeTruthy();
    expect(screen.getByTestId('content').className).toContain('my-content');
  });

  it('names the dialog from HoverCard.Title', () => {
    wrap(
      <HoverCard.Root defaultOpen>
        <HoverCard.Trigger>
          <a href="#x">@user</a>
        </HoverCard.Trigger>
        <HoverCard.Popup>
          <HoverCard.Title data-testid="title">Profile</HoverCard.Title>
        </HoverCard.Popup>
      </HoverCard.Root>,
    );
    expect(screen.getByRole('dialog', { name: 'Profile' })).toBeTruthy();
    expect(screen.getByTestId('title')).toBeTruthy();
  });
});

describe('Drawer passthrough', () => {
  stubNativeDialog();

  it('forwards native props on parts and honors aria-label on the popup (the dialog)', async () => {
    const panelRef = createRef<HTMLDialogElement>();
    const closeRef = createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    wrap(
      <Drawer.Root defaultOpen>
        <Drawer.Popup
          data-testid="panel"
          className="my-panel"
          aria-label="Filters"
          ref={panelRef}
          onClick={onClick}
        >
          <Drawer.Header data-testid="header" className="my-header">
            <Drawer.Title data-testid="title" className="my-title">
              Title
            </Drawer.Title>
            <Drawer.Close data-testid="close" className="my-close" ref={closeRef} />
          </Drawer.Header>
          <Drawer.Body data-testid="body" className="my-body">
            body
          </Drawer.Body>
        </Drawer.Popup>
      </Drawer.Root>,
    );
    expect(screen.getByTestId('panel').tagName).toBe('DIALOG');
    expect(screen.getByTestId('panel').className).toContain('my-panel');
    expect(panelRef.current).toBe(screen.getByTestId('panel'));
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeTruthy();
    expect(screen.getByTestId('header').className).toContain('my-header');
    expect(screen.getByTestId('title').className).toContain('my-title');
    expect(screen.getByTestId('body').className).toContain('my-body');
    expect(closeRef.current).toBe(screen.getByTestId('close'));
    await userEvent.click(screen.getByTestId('panel'));
    expect(onClick).toHaveBeenCalled();
  });

  it('lets Drawer.Title name the dialog when no label is set', () => {
    wrap(
      <Drawer.Root defaultOpen>
        <Drawer.Popup>
          <Drawer.Title>Settings</Drawer.Title>
        </Drawer.Popup>
      </Drawer.Root>,
    );
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeTruthy();
  });
});

describe('Menu passthrough and fixes', () => {
  async function openMenu(trigger = 'Actions') {
    await userEvent.click(screen.getByRole('button', { name: trigger }));
    return screen.findByRole('menu');
  }

  it('forwards native props on Popup, Item, Separator and Section', async () => {
    const popupRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLDivElement>();
    const onClick = vi.fn();
    wrap(
      <Menu.Root>
        <Menu.Trigger data-testid="trigger">
          <button type="button">Actions</button>
        </Menu.Trigger>
        <Menu.Popup
          data-testid="popup"
          className="my-popup"
          aria-label="Song actions"
          ref={popupRef}
        >
          <Menu.Item id="a" data-testid="item" className="my-item" ref={itemRef} onClick={onClick}>
            Alpha
          </Menu.Item>
          <Menu.Separator data-testid="sep" className="my-sep" />
          <Menu.Section title="Danger" data-testid="section" className="my-section">
            <Menu.Item id="b">Beta</Menu.Item>
          </Menu.Section>
        </Menu.Popup>
      </Menu.Root>,
    );
    expect(screen.getByTestId('trigger').tagName).toBe('BUTTON');
    await openMenu();
    expect(screen.getByTestId('popup').className).toContain('my-popup');
    expect(popupRef.current).toBe(screen.getByTestId('popup'));
    expect(screen.getByRole('menu').getAttribute('aria-label')).toBe('Song actions');
    expect(screen.getByTestId('item').className).toContain('my-item');
    expect(itemRef.current).toBe(screen.getByTestId('item'));
    expect(screen.getByTestId('sep').className).toContain('my-sep');
    expect(screen.getByTestId('section').className).toContain('my-section');
    await userEvent.click(screen.getByTestId('item'));
    expect(onClick).toHaveBeenCalled();
  });

  it('passes placement to the popover', async () => {
    wrap(
      <Menu.Root>
        <Menu.Trigger>
          <button type="button">Actions</button>
        </Menu.Trigger>
        <Menu.Popup data-testid="popup" placement="top">
          <Menu.Item id="a">Alpha</Menu.Item>
        </Menu.Popup>
      </Menu.Root>,
    );
    await openMenu();
    expect(screen.getByTestId('popup').getAttribute('data-placement')).toBe('top');
  });

  it('forwards textValue for typeahead', async () => {
    wrap(
      <Menu.Root>
        <Menu.Trigger>
          <button type="button">Actions</button>
        </Menu.Trigger>
        <Menu.Popup>
          <Menu.Item id="a" textValue="Alpha">
            <b>Alpha</b>
          </Menu.Item>
          <Menu.Item id="z" textValue="Zulu" data-testid="zulu">
            <i>Z</i>
          </Menu.Item>
        </Menu.Popup>
      </Menu.Root>,
    );
    await openMenu();
    await userEvent.keyboard('z');
    await waitFor(() => expect(document.activeElement).toBe(screen.getByTestId('zulu')));
  });

  it('renders a single menu when Menu.Content is used inside Menu.Popup', async () => {
    wrap(
      <Menu.Root>
        <Menu.Trigger>
          <button type="button">Actions</button>
        </Menu.Trigger>
        <Menu.Popup aria-label="Actions">
          <Menu.Content sections={[{ items: [{ id: 'copy', label: 'Copy' }] }]} />
        </Menu.Popup>
      </Menu.Root>,
    );
    await openMenu();
    expect(screen.getAllByRole('menu')).toHaveLength(1);
    expect(screen.getByRole('menuitem', { name: /Copy/ })).toBeTruthy();
  });

  it('FromSections gets presence attrs, layer z-index, popup passthrough and placement', async () => {
    const onOpenChange = vi.fn();
    wrap(
      <Menu.FromSections
        trigger={<button type="button">Actions</button>}
        sections={[{ items: [{ id: 'copy', label: 'Copy' }] }]}
        onOpenChange={onOpenChange}
        data-testid="popup"
        className="my-popup"
        aria-label="Edit actions"
        placement="top"
      />,
    );
    await openMenu();
    expect(screen.getAllByRole('menu')).toHaveLength(1);
    const popup = screen.getByTestId('popup');
    expect(popup.className).toContain('my-popup');
    expect(popup.style.zIndex).not.toBe('');
    expect(popup.getAttribute('data-placement')).toBe('top');
    expect(popup.hasAttribute('data-open')).toBe(true);
    expect(screen.getByRole('menu').getAttribute('aria-label')).toBe('Edit actions');
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(true);
    expect(onOpenChange.mock.calls[0]?.[1].reason).toBe('trigger-press');
  });

  it('FromSections portals into portalContainer', async () => {
    const host = document.createElement('div');
    host.setAttribute('data-testid', 'host');
    document.body.appendChild(host);
    wrap(
      <Menu.FromSections
        trigger={<button type="button">Actions</button>}
        sections={[{ items: [{ id: 'copy', label: 'Copy' }] }]}
        portalContainer={host}
      />,
    );
    await openMenu();
    expect(host.querySelector('[role="menu"]')).not.toBeNull();
    host.remove();
  });

  it('Overflow keeps aria-label and ref on the trigger', async () => {
    const ref = createRef<HTMLButtonElement>();
    wrap(
      <Menu.Overflow
        aria-label="More"
        ref={ref}
        sections={[{ items: [{ id: 'copy', label: 'Copy' }] }]}
      />,
    );
    const trigger = screen.getByRole('button', { name: 'More' });
    expect(ref.current).toBe(trigger);
    await userEvent.click(trigger);
    expect(await screen.findAllByRole('menu')).toHaveLength(1);
  });
});

describe('Toast passthrough', () => {
  it('forwards native props to a standalone toast', () => {
    const ref = createRef<HTMLDivElement>();
    const onClick = vi.fn();
    wrap(
      <Toast
        title="Saved"
        data-testid="toast"
        className="my-toast"
        id="t1"
        ref={ref}
        onClick={onClick}
        onDismiss={() => {}}
        dismissLabel="Fermer"
      />,
    );
    const el = screen.getByTestId('toast');
    expect(el.className).toContain('my-toast');
    expect(el.id).toBe('t1');
    expect(ref.current).toBe(el);
    expect(el.getAttribute('role')).toBe('status');
    el.click();
    expect(onClick).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeTruthy();
  });

  it('forwards native props to ToastRegion and makes the dismiss label overridable', async () => {
    const queue = new ToastQueue();
    const ref = createRef<HTMLDivElement>();
    wrap(
      <ToastRegion
        queue={queue}
        data-testid="region"
        className="my-region"
        ref={ref}
        dismissLabel="Close toast"
      />,
    );
    queue.add({ title: 'Hello', tone: 'info' }, { timeout: 0 });
    expect(await screen.findByRole('button', { name: 'Close toast' })).toBeTruthy();
    expect(screen.getByTestId('region').className).toContain('my-region');
    expect(ref.current).toBe(screen.getByTestId('region'));
  });

  it('ToastProvider forwards dismissLabel to its region', async () => {
    function Notify() {
      const t = useToast();
      return (
        <button type="button" onClick={() => t.add({ title: 'Hi', durationMs: 0 })}>
          Notify
        </button>
      );
    }
    wrap(
      <ToastProvider dismissLabel="Dismiss it">
        <Notify />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Notify' }));
    expect(await screen.findByRole('button', { name: 'Dismiss it' })).toBeTruthy();
  });
});

describe('CommandPalette passthrough', () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
      this.open = true;
    };
    HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
      this.open = false;
      this.dispatchEvent(new Event('close'));
    };
  });

  it('forwards native props and ref to the dialog', () => {
    const ref = createRef<HTMLDialogElement>();
    const onClick = vi.fn();
    wrap(
      <CommandPalette
        open
        hotkey={false}
        items={[{ id: 'a', title: 'Open settings' }]}
        data-testid="palette"
        className="my-palette"
        id="cmd"
        aria-label="Commands"
        ref={ref}
        onClick={onClick}
      />,
    );
    const dialog = document.querySelector('[data-testid="palette"]') as HTMLDialogElement;
    expect(dialog.tagName).toBe('DIALOG');
    expect(dialog.className).toContain('my-palette');
    expect(dialog.id).toBe('cmd');
    expect(dialog.getAttribute('aria-label')).toBe('Commands');
    expect(ref.current).toBe(dialog);
    dialog.click();
    expect(onClick).toHaveBeenCalled();
  });
});

describe('MobileNav passthrough', () => {
  stubNativeDialog();

  it('forwards native props, className and ref to the <dialog>, aria-label names it', () => {
    const ref = createRef<HTMLDialogElement>();
    wrap(
      <MobileNav open data-testid="popup" className="my-panel" aria-label="Site nav" ref={ref}>
        <p>content</p>
      </MobileNav>,
    );
    const popup = screen.getByTestId('popup');
    expect(popup.tagName).toBe('DIALOG');
    expect(ref.current).toBe(popup);
    expect(popup.className).toContain('my-panel');
    expect(screen.getByRole('dialog', { name: 'Site nav' })).toBe(popup);
  });

  it('forwards native props to the toggle button', async () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    wrap(
      <MobileNavToggle data-testid="toggle" className="my-toggle" onClick={onClick} ref={ref} />,
    );
    const toggle = screen.getByTestId('toggle');
    expect(toggle.className).toContain('my-toggle');
    expect(ref.current).toBe(toggle);
    await userEvent.click(toggle);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('LoadingOverlay and Hidden passthrough', () => {
  it('LoadingOverlay spreads native props and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    const onClick = vi.fn();
    render(
      <LoadingOverlay data-testid="lo" id="lo1" className="mine" ref={ref} onClick={onClick}>
        body
      </LoadingOverlay>,
    );
    const el = screen.getByTestId('lo');
    expect(el.id).toBe('lo1');
    expect(el.className).toContain('mine');
    expect(ref.current).toBe(el);
    el.click();
    expect(onClick).toHaveBeenCalled();
  });

  it('Hidden spreads native props and merges className', () => {
    const ref = createRef<HTMLElement>();
    const onClick = vi.fn();
    render(
      <Hidden data-testid="h" aria-label="x" className="mine" hide ref={ref} onClick={onClick}>
        body
      </Hidden>,
    );
    const el = screen.getByTestId('h');
    expect(el.getAttribute('aria-label')).toBe('x');
    expect(el.className).toContain('mine');
    expect(el.className).toContain('hidden-always');
    expect(ref.current).toBe(el);
    el.click();
    expect(onClick).toHaveBeenCalled();
  });
});
