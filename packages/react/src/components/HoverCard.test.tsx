import { useState } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import type { OverlayOpenChangeHandler } from '../overlays';
import { Link } from './Link';
import { HoverCard } from './HoverCard';

function wrap(ui: React.ReactNode) {
  return render(
    <IconProvider icons={{}}>
      <LayerProvider>{ui}</LayerProvider>
    </IconProvider>,
  );
}

describe('HoverCard', () => {
  it('shows content on hover after openDelay', async () => {
    wrap(
      <HoverCard.Root openDelay={10} closeDelay={10}>
        <HoverCard.Trigger>
          <Link href="#profile">@user</Link>
        </HoverCard.Trigger>
        <HoverCard.Popup>
          <HoverCard.Title>User</HoverCard.Title>
          <HoverCard.Content>
            Rich preview content with a <Link href="#more">link</Link>.
          </HoverCard.Content>
        </HoverCard.Popup>
      </HoverCard.Root>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    await userEvent.hover(screen.getByRole('link', { name: '@user' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeTruthy());
    expect(screen.getByText('User')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'link' })).toBeTruthy();
  });

  it('closes after closeDelay once the pointer leaves the trigger', async () => {
    wrap(
      <HoverCard.Root openDelay={10} closeDelay={10}>
        <HoverCard.Trigger>
          <Link href="#profile">@user</Link>
        </HoverCard.Trigger>
        <HoverCard.Popup>
          <HoverCard.Content>Preview content.</HoverCard.Content>
        </HoverCard.Popup>
      </HoverCard.Root>,
    );
    const trigger = screen.getByRole('link', { name: '@user' });
    await userEvent.hover(trigger);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeTruthy());
    await userEvent.unhover(trigger);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('stays open when the pointer moves from the trigger into the card', async () => {
    wrap(
      <HoverCard.Root openDelay={10} closeDelay={10}>
        <HoverCard.Trigger>
          <Link href="#profile">@user</Link>
        </HoverCard.Trigger>
        <HoverCard.Popup>
          <HoverCard.Content>
            Preview with a <Link href="#more">nested link</Link>.
          </HoverCard.Content>
        </HoverCard.Popup>
      </HoverCard.Root>,
    );
    const trigger = screen.getByRole('link', { name: '@user' });
    await userEvent.hover(trigger);
    const dialog = await waitFor(() => screen.getByRole('dialog'));
    // Synchronous pointer events avoid a race between closeDelay and userEvent's async hover.
    fireEvent.mouseLeave(trigger);
    fireEvent.mouseEnter(dialog);
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.mouseLeave(dialog);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('shows title from compound parts on hover', async () => {
    wrap(
      <HoverCard.Root openDelay={0} closeDelay={10}>
        <HoverCard.Trigger>
          <Link href="#profile">@user</Link>
        </HoverCard.Trigger>
        <HoverCard.Popup>
          <HoverCard.Title>User</HoverCard.Title>
          <HoverCard.Content>Preview</HoverCard.Content>
        </HoverCard.Popup>
      </HoverCard.Root>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    await userEvent.hover(screen.getByRole('link', { name: '@user' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeTruthy());
    expect(screen.getByText('User')).toBeTruthy();
  });

  it('supports controlled isOpen', () => {
    function Controlled() {
      const [open] = useState(true);
      return (
        <HoverCard.Root open={open}>
          <HoverCard.Popup>
            <HoverCard.Content>Pinned</HoverCard.Content>
          </HoverCard.Popup>
        </HoverCard.Root>
      );
    }
    wrap(<Controlled />);
    expect(screen.getByText('Pinned')).toBeTruthy();
  });

  it('invokes onOpenChange once per transition and honors cancel()', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>((_next, details) => {
      details.cancel();
    });
    wrap(
      <HoverCard.Root openDelay={0} closeDelay={10} onOpenChange={onOpenChange}>
        <HoverCard.Trigger>
          <Link href="#profile">@user</Link>
        </HoverCard.Trigger>
        <HoverCard.Popup>
          <HoverCard.Content>Preview</HoverCard.Content>
        </HoverCard.Popup>
      </HoverCard.Root>,
    );
    await userEvent.hover(screen.getByRole('link', { name: '@user' }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalled());
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(true);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens and closes via keyboard focus for non-pointer users', async () => {
    wrap(
      <HoverCard.Root openDelay={10} closeDelay={10}>
        <HoverCard.Trigger>
          <Link href="#profile">@user</Link>
        </HoverCard.Trigger>
        <HoverCard.Popup>
          <HoverCard.Content>Preview content.</HoverCard.Content>
        </HoverCard.Popup>
      </HoverCard.Root>,
    );
    await userEvent.tab();
    await waitFor(() => expect(screen.getByRole('dialog')).toBeTruthy());
    await userEvent.tab();
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('reports hover when opened from pointer hover', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    wrap(
      <HoverCard.Root openDelay={0} closeDelay={10} onOpenChange={onOpenChange}>
        <HoverCard.Trigger>
          <Link href="#profile">@user</Link>
        </HoverCard.Trigger>
        <HoverCard.Popup>
          <HoverCard.Content>Preview</HoverCard.Content>
        </HoverCard.Popup>
      </HoverCard.Root>,
    );
    await userEvent.hover(screen.getByRole('link', { name: '@user' }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalled());
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(true);
    expect(onOpenChange.mock.calls[0]?.[1].reason).toBe('hover');
  });

  it('reports focus when opened from keyboard focus', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    wrap(
      <HoverCard.Root openDelay={0} closeDelay={10} onOpenChange={onOpenChange}>
        <HoverCard.Trigger>
          <a href="#profile">@user</a>
        </HoverCard.Trigger>
        <HoverCard.Popup>
          <HoverCard.Content>Preview</HoverCard.Content>
        </HoverCard.Popup>
      </HoverCard.Root>,
    );
    fireEvent.focus(screen.getByRole('link', { name: '@user' }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalled());
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(true);
    expect(onOpenChange.mock.calls[0]?.[1].reason).toBe('focus');
  });

  it('does not invoke onOpenChange after unmount while a hover timer is pending', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    const { unmount } = wrap(
      <HoverCard.Root openDelay={50} closeDelay={50} onOpenChange={onOpenChange}>
        <HoverCard.Trigger>
          <Link href="#profile">@user</Link>
        </HoverCard.Trigger>
        <HoverCard.Popup>
          <HoverCard.Content>Preview</HoverCard.Content>
        </HoverCard.Popup>
      </HoverCard.Root>,
    );
    fireEvent.mouseEnter(screen.getByRole('link', { name: '@user' }));
    unmount();
    await new Promise((resolve) => {
      setTimeout(resolve, 80);
    });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  const fixture = (props: Omit<React.ComponentProps<typeof HoverCard.Root>, 'children'>) => (
    <HoverCard.Root openDelay={0} closeDelay={0} {...props}>
      <HoverCard.Trigger>
        <Link href="#profile">@user</Link>
      </HoverCard.Trigger>
      <HoverCard.Popup>
        <HoverCard.Content>Preview</HoverCard.Content>
      </HoverCard.Popup>
    </HoverCard.Root>
  );
  const last = (h: ReturnType<typeof vi.fn<OverlayOpenChangeHandler>>) => {
    const call = h.mock.calls[h.mock.calls.length - 1]!;
    return [call[0], call[1].reason];
  };

  it('honors defaultOpen and lets details.cancel() keep it open', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>((_next, details) => details.cancel());
    wrap(fixture({ defaultOpen: true, onOpenChange }));
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    await waitFor(() => expect(last(onOpenChange)).toEqual([false, 'escape-key']));
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('reports escape-key when Escape is pressed inside the card', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    wrap(fixture({ defaultOpen: true, onOpenChange }));
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    await waitFor(() => expect(last(onOpenChange)).toEqual([false, 'escape-key']));
  });

  it('reports hover when the pointer leaves the trigger', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    wrap(fixture({ onOpenChange }));
    const trigger = screen.getByRole('link', { name: '@user' });
    await userEvent.hover(trigger);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeTruthy());
    await userEvent.unhover(trigger);
    await waitFor(() => expect(last(onOpenChange)).toEqual([false, 'hover']));
  });

  it('works controlled: the open prop wins until the parent updates it', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    wrap(fixture({ open: false, onOpenChange }));
    await userEvent.hover(screen.getByRole('link', { name: '@user' }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalled());
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders no display:contents wrapper', () => {
    const { container } = wrap(fixture({ defaultOpen: true }));
    expect(container.querySelector('[style*="display: contents"]')).toBeNull();
  });
});
