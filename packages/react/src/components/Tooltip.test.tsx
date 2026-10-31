import { useState } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import type { OverlayOpenChangeHandler } from '../overlays';
import { stubNativePopover } from '../test/nativeOverlayStubs';
import { Tooltip } from './Tooltip';

// API-shape tests. Hover, focus-visible, Escape, warm-up and the popover top layer are covered
// in Tooltip.browser.test.tsx.
stubNativePopover();

function wrap(ui: React.ReactNode) {
  return render(<IconProvider icons={{}}>{ui}</IconProvider>);
}

describe('Tooltip', () => {
  it('renders a role=tooltip popover and wires aria-describedby while open', () => {
    wrap(
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger>
          <button type="button">Info</button>
        </Tooltip.Trigger>
        <Tooltip.Popup placement="bottom">More about this field</Tooltip.Popup>
      </Tooltip.Root>,
    );
    const tip = screen.getByRole('tooltip');
    expect(tip.textContent).toBe('More about this field');
    expect(tip.getAttribute('popover')).toBe('manual');
    expect(screen.getByRole('button', { name: 'Info' }).getAttribute('aria-describedby')).toBe(
      tip.id,
    );
  });

  it('renders no children and no describedby while closed', () => {
    wrap(
      <Tooltip.Root>
        <Tooltip.Trigger>
          <button type="button">Info</button>
        </Tooltip.Trigger>
        <Tooltip.Popup>Hidden</Tooltip.Popup>
      </Tooltip.Root>,
    );
    expect(screen.getByRole('tooltip', { hidden: true }).textContent).toBe('');
    expect(screen.getByRole('button').hasAttribute('aria-describedby')).toBe(false);
  });

  it('supports controlled open', () => {
    function Controlled() {
      const [open] = useState(true);
      return (
        <Tooltip.Root open={open}>
          <Tooltip.Trigger>
            <button type="button">Info</button>
          </Tooltip.Trigger>
          <Tooltip.Popup>Pinned</Tooltip.Popup>
        </Tooltip.Root>
      );
    }
    wrap(<Controlled />);
    expect(screen.getByRole('tooltip').textContent).toBe('Pinned');
  });

  it('does not report a hover open when disabled', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    wrap(
      <Tooltip.Root openDelay={0} disabled onOpenChange={onOpenChange}>
        <Tooltip.Trigger>
          <button type="button">Info</button>
        </Tooltip.Trigger>
        <Tooltip.Popup>Tip</Tooltip.Popup>
      </Tooltip.Root>,
    );
    await userEvent.hover(screen.getByRole('button'));
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
