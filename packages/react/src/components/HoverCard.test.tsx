import { useState } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import type { OverlayOpenChangeHandler } from '../overlays';
import { stubNativePopover } from '../test/nativeOverlayStubs';
import { Link } from './Link';
import { HoverCard } from './HoverCard';

// API-shape tests. Hover, focus, Escape, hoverable popup and the top layer are covered in
// HoverCard.browser.test.tsx.
stubNativePopover();

function wrap(ui: React.ReactNode) {
  return render(<IconProvider icons={{}}>{ui}</IconProvider>);
}

const fixture = (props: Omit<React.ComponentProps<typeof HoverCard.Root>, 'children'> = {}) => (
  <HoverCard.Root openDelay={0} closeDelay={0} {...props}>
    <HoverCard.Trigger>
      <Link href="#profile">@user</Link>
    </HoverCard.Trigger>
    <HoverCard.Popup>
      <HoverCard.Title>User</HoverCard.Title>
      <HoverCard.Content>Preview</HoverCard.Content>
    </HoverCard.Popup>
  </HoverCard.Root>
);

describe('HoverCard', () => {
  it('names the dialog with the Title and points the trigger at it with aria-details', () => {
    wrap(fixture({ defaultOpen: true }));
    const card = screen.getByRole('dialog', { name: 'User' });
    expect(card.getAttribute('popover')).toBe('manual');
    expect(screen.getByRole('link', { name: '@user' }).getAttribute('aria-details')).toBe(card.id);
  });

  it('supports controlled open', () => {
    function Controlled() {
      const [open] = useState(true);
      return fixture({ open });
    }
    wrap(<Controlled />);
    expect(screen.getByText('Preview')).toBeTruthy();
  });

  it('hover reports hover; details.cancel() keeps it closed', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>((_n, d) => d.cancel());
    wrap(fixture({ onOpenChange }));
    await userEvent.hover(screen.getByRole('link', { name: '@user' }));
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(true);
    expect(onOpenChange.mock.calls[0]?.[1].reason).toBe('hover');
    expect(screen.queryByText('Preview')).toBeNull();
  });

  it('does not open when disabled', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    wrap(fixture({ disabled: true, onOpenChange }));
    await userEvent.hover(screen.getByRole('link', { name: '@user' }));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('does not report after unmount while a hover timer is pending', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    const { unmount } = wrap(fixture({ openDelay: 50, onOpenChange }));
    fireEvent.pointerEnter(screen.getByRole('link', { name: '@user' }));
    unmount();
    await new Promise((resolve) => setTimeout(resolve, 80));
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
