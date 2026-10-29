import { useState } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import type { OverlayOpenChangeHandler } from '../overlays';
import { Button } from './Button';
import { Menu } from './Menu';

function wrap(ui: React.ReactNode) {
  return render(
    <IconProvider icons={{}}>
      <LayerProvider>{ui}</LayerProvider>
    </IconProvider>,
  );
}

function renderCompound(onOpenChange?: OverlayOpenChangeHandler, onAction = vi.fn()) {
  return {
    onAction,
    ...wrap(
      <Menu.Root onOpenChange={onOpenChange}>
        <Menu.Trigger>
          <button type="button">Song</button>
        </Menu.Trigger>
        <Menu.Popup>
          <Menu.Item id="lib" onAction={onAction}>
            Add to Library
          </Menu.Item>
          <Menu.Separator />
          <Menu.Section title="Danger">
            <Menu.Item id="delete" onAction={vi.fn()}>
              Delete
            </Menu.Item>
          </Menu.Section>
        </Menu.Popup>
      </Menu.Root>,
    ),
  };
}

describe('Menu', () => {
  it('invokes onAction when an item is selected', async () => {
    const onAction = vi.fn();
    wrap(
      <Menu.Root>
        <Menu.Trigger>
          <Button>Song</Button>
        </Menu.Trigger>
        <Menu.Popup>
          <Menu.Item id="lib" onAction={onAction}>
            Add to Library
          </Menu.Item>
          <Menu.Separator />
          <Menu.Section title="Danger">
            <Menu.Item id="delete" onAction={vi.fn()}>
              Delete
            </Menu.Item>
          </Menu.Section>
        </Menu.Popup>
      </Menu.Root>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Song' }));
    expect(await screen.findByRole('menuitem', { name: 'Add to Library' })).toBeTruthy();
    expect(screen.getByRole('separator')).toBeTruthy();
    expect(screen.getByText('Danger')).toBeTruthy();
    await userEvent.click(screen.getByRole('menuitem', { name: 'Add to Library' }));
    expect(onAction).toHaveBeenCalled();
  });

  it('reports trigger-press when opened from the trigger', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    renderCompound(onOpenChange);
    await userEvent.click(screen.getByRole('button', { name: 'Song' }));
    expect(await screen.findByRole('menu')).toBeTruthy();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(true);
    expect(onOpenChange.mock.calls[0]?.[1].reason).toBe('trigger-press');
  });

  it('reports outside-press when dismissed via the overlay', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    renderCompound(onOpenChange);
    await userEvent.click(screen.getByRole('button', { name: 'Song' }));
    expect(await screen.findByRole('menu')).toBeTruthy();
    onOpenChange.mockClear();

    const underlay = document.querySelector('[data-testid="underlay"]');
    expect(underlay).toBeTruthy();
    await userEvent.click(underlay!);

    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(false);
    expect(onOpenChange.mock.calls[0]?.[1].reason).toBe('outside-press');
  });

  it('reports escape-key when dismissed with Escape', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    renderCompound(onOpenChange);
    await userEvent.click(screen.getByRole('button', { name: 'Song' }));
    expect(await screen.findByRole('menu')).toBeTruthy();
    onOpenChange.mockClear();

    await userEvent.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(false);
    expect(onOpenChange.mock.calls[0]?.[1].reason).toBe('escape-key');
  });

  it('sets positioner transform-origin on the popup', async () => {
    renderCompound();
    await userEvent.click(screen.getByRole('button', { name: 'Song' }));
    expect(await screen.findByRole('menu')).toBeTruthy();
    const popover = document.querySelector('.var-ui-menu__popover');
    expect(popover).toBeTruthy();
    expect((popover as HTMLElement).style.getPropertyValue('--var-ui-transform-origin')).toBe(
      'top center',
    );
  });

  it('keeps the menu open when cancel() is called while uncontrolled', async () => {
    const onOpenChange: OverlayOpenChangeHandler = (_next, details) => {
      details.cancel();
    };
    wrap(
      <Menu.Root defaultOpen onOpenChange={onOpenChange}>
        <Menu.Trigger>
          <button type="button">Song</button>
        </Menu.Trigger>
        <Menu.Popup>
          <Menu.Item id="lib" onAction={vi.fn()}>
            Add to Library
          </Menu.Item>
        </Menu.Popup>
      </Menu.Root>,
    );
    expect(await screen.findByRole('menuitem', { name: 'Add to Library' })).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('menuitem', { name: 'Add to Library' })).toBeTruthy();
  });

  it('opens items from Menu.FromSections', async () => {
    const onAction = vi.fn();
    wrap(
      <Menu.FromSections
        trigger={<Button>Actions</Button>}
        sections={[{ items: [{ id: 'edit', label: 'Edit', onAction }] }]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(await screen.findByRole('menuitem', { name: 'Edit' })).toBeTruthy();
  });

  it('opens Menu.ContextMenu on contextmenu only', async () => {
    wrap(
      <Menu.ContextMenu sections={[{ items: [{ id: 'copy', label: 'Copy' }] }]}>
        <div>Right-click me</div>
      </Menu.ContextMenu>,
    );
    const host = screen.getByText('Right-click me');
    await userEvent.click(host);
    expect(screen.queryByRole('menuitem', { name: 'Copy' })).toBeNull();

    fireEvent.contextMenu(host, { clientX: 120, clientY: 240 });
    expect(await screen.findByRole('menuitem', { name: 'Copy' })).toBeTruthy();
    const anchor = document.querySelector('[data-context-menu-anchor]') as HTMLElement | null;
    expect(anchor).toBeTruthy();
    expect(anchor?.style.left).toBe('120px');
    expect(anchor?.style.top).toBe('240px');
  });

  it('composes Menu.ContextMenu onContextMenu with the host handler', async () => {
    const hostHandler = vi.fn();
    wrap(
      <Menu.ContextMenu sections={[{ items: [{ id: 'copy', label: 'Copy' }] }]}>
        <div onContextMenu={hostHandler}>Right-click me</div>
      </Menu.ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText('Right-click me'), { clientX: 0, clientY: 0 });
    expect(hostHandler).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole('menuitem', { name: 'Copy' })).toBeTruthy();
  });

  it('supports controlled isOpen', () => {
    function Controlled() {
      const [open] = useState(true);
      return (
        <Menu.Root isOpen={open}>
          <Menu.Popup>
            <Menu.Item id="lib" onAction={vi.fn()}>
              Pinned
            </Menu.Item>
          </Menu.Popup>
        </Menu.Root>
      );
    }
    wrap(<Controlled />);
    expect(screen.getByRole('menuitem', { name: 'Pinned' })).toBeTruthy();
  });

  it('anchors a keyboard-invoked context menu to the target instead of 0,0', async () => {
    render(
      <Menu.ContextMenu sections={[{ items: [{ id: 'copy', label: 'Copy' }] }]}>
        <div tabIndex={0} data-testid="surface">
          Surface
        </div>
      </Menu.ContextMenu>,
    );
    const surface = screen.getByTestId('surface');
    surface.getBoundingClientRect = () =>
      ({
        left: 40,
        bottom: 90,
        top: 50,
        right: 140,
        width: 100,
        height: 40,
        x: 40,
        y: 50,
      }) as DOMRect;
    fireEvent.contextMenu(surface, { clientX: 0, clientY: 0 });
    const anchor = await waitFor(() => {
      const el = document.querySelector('[data-context-menu-anchor]') as HTMLElement;
      expect(el).toBeTruthy();
      return el;
    });
    expect(anchor.style.left).toBe('40px');
    expect(anchor.style.top).toBe('90px');
  });
});
