import { useState } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import type { OverlayOpenChangeHandler } from '../overlays';
import { Button } from './Button';
import { Tooltip } from './Tooltip';

function wrap(ui: React.ReactNode) {
  return render(
    <IconProvider icons={{}}>
      <LayerProvider>{ui}</LayerProvider>
    </IconProvider>,
  );
}

/**
 * RAC useTooltipTrigger ignores hover unless the last interaction modality is pointer.
 * This jsdom has no PointerEvent, so RAC listens for mousemove instead of pointermove.
 */
function setPointerModality() {
  document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, cancelable: true }));
}

function renderCompound(onOpenChange?: OverlayOpenChangeHandler) {
  return wrap(
    <Tooltip.Root delay={0} onOpenChange={onOpenChange}>
      <Tooltip.Trigger>
        <button type="button">Info</button>
      </Tooltip.Trigger>
      <Tooltip.Popup placement="top">More about this field</Tooltip.Popup>
    </Tooltip.Root>,
  );
}

describe('Tooltip', () => {
  it('shows tooltip content on hover', async () => {
    renderCompound();
    setPointerModality();
    await userEvent.hover(screen.getByRole('button', { name: 'Info' }));
    expect((await screen.findByRole('tooltip')).textContent).toBe('More about this field');
  });

  it('shows tooltip content on focus', async () => {
    wrap(
      <Tooltip.Root delay={0}>
        <Tooltip.Trigger>
          <button type="button">Info</button>
        </Tooltip.Trigger>
        <Tooltip.Popup>More about this field</Tooltip.Popup>
      </Tooltip.Root>,
    );
    await userEvent.tab();
    expect((await screen.findByRole('tooltip')).textContent).toBe('More about this field');
  });

  it('supports controlled isOpen', () => {
    function Controlled() {
      const [open] = useState(true);
      return (
        <Tooltip.Root open={open} delay={0}>
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

  it('invokes onOpenChange once per transition and honors cancel()', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>((_next, details) => {
      details.cancel();
    });
    renderCompound(onOpenChange);
    setPointerModality();
    await userEvent.hover(screen.getByRole('button', { name: 'Info' }));
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(true);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});

describe('Tooltip with a Button trigger', () => {
  it('shows the popup content on focus', async () => {
    wrap(
      <Tooltip.Root delay={0}>
        <Tooltip.Trigger>
          <Button>Hover me</Button>
        </Tooltip.Trigger>
        <Tooltip.Popup>More info</Tooltip.Popup>
      </Tooltip.Root>,
    );
    await userEvent.tab();
    expect((await screen.findByRole('tooltip')).textContent).toBe('More info');
  });
});
