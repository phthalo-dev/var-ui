import { useState } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import type { OverlayOpenChangeHandler } from '../overlays';
import { Button } from './Button';
import { Popover } from './Popover';

function wrap(ui: React.ReactNode) {
  return render(
    <IconProvider icons={{}}>
      <LayerProvider>{ui}</LayerProvider>
    </IconProvider>,
  );
}

function renderCompound(onOpenChange?: OverlayOpenChangeHandler) {
  return wrap(
    <Popover.Root onOpenChange={onOpenChange}>
      <Popover.Trigger>
        <button type="button">Filters</button>
      </Popover.Trigger>
      <Popover.Popup>
        <Popover.Arrow />
        <Popover.Title>Filters</Popover.Title>
        <Popover.Content>Panel body</Popover.Content>
      </Popover.Popup>
    </Popover.Root>,
  );
}

describe('Popover', () => {
  it('opens from a custom trigger and shows the panel', async () => {
    wrap(
      <Popover.Root>
        <Popover.Trigger>
          <button type="button">Filters</button>
        </Popover.Trigger>
        <Popover.Popup>
          <Popover.Title>Filters</Popover.Title>
          <Popover.Content>Panel body</Popover.Content>
        </Popover.Popup>
      </Popover.Root>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Filters' }));
    expect(await screen.findByRole('dialog')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Filters' })).toBeTruthy();
    expect(screen.getByText('Panel body')).toBeTruthy();
  });

  it('renders Arrow with the public arrow class', async () => {
    renderCompound();
    await userEvent.click(screen.getByRole('button', { name: 'Filters' }));
    expect(await screen.findByRole('dialog')).toBeTruthy();
    expect(document.querySelector('.var-ui-popover__arrow')).toBeTruthy();
  });

  it('reports trigger-press when opened from the trigger', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    renderCompound(onOpenChange);
    await userEvent.click(screen.getByRole('button', { name: 'Filters' }));
    expect(await screen.findByRole('dialog')).toBeTruthy();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(true);
    expect(onOpenChange.mock.calls[0]?.[1].reason).toBe('trigger-press');
  });

  it('reports outside-press when dismissed via the overlay', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    renderCompound(onOpenChange);
    await userEvent.click(screen.getByRole('button', { name: 'Filters' }));
    expect(await screen.findByRole('dialog')).toBeTruthy();
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
    await userEvent.click(screen.getByRole('button', { name: 'Filters' }));
    expect(await screen.findByRole('dialog')).toBeTruthy();
    onOpenChange.mockClear();

    await userEvent.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(false);
    expect(onOpenChange.mock.calls[0]?.[1].reason).toBe('escape-key');
  });

  it('keeps the panel open when cancel() is called while uncontrolled', async () => {
    const onOpenChange: OverlayOpenChangeHandler = (_next, details) => {
      details.cancel();
    };
    wrap(
      <Popover.Root defaultOpen onOpenChange={onOpenChange}>
        <Popover.Trigger>
          <button type="button">Filters</button>
        </Popover.Trigger>
        <Popover.Popup>
          <Popover.Content>Pinned</Popover.Content>
        </Popover.Popup>
      </Popover.Root>,
    );
    expect(await screen.findByText('Pinned')).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    expect(screen.getByText('Pinned')).toBeTruthy();
  });

  it('supports controlled isOpen', () => {
    function Controlled() {
      const [open] = useState(true);
      return (
        <Popover.Root open={open}>
          <Popover.Popup>
            <Popover.Content>Pinned</Popover.Content>
          </Popover.Popup>
        </Popover.Root>
      );
    }
    wrap(<Controlled />);
    expect(screen.getByText('Pinned')).toBeTruthy();
  });
});

describe('Popover with a Button trigger', () => {
  it('opens on trigger click and shows dialog content', async () => {
    wrap(
      <Popover.Root>
        <Popover.Trigger>
          <Button>Open</Button>
        </Popover.Trigger>
        <Popover.Popup>
          <Popover.Title>Details</Popover.Title>
          <Popover.Content>Popover body</Popover.Content>
        </Popover.Popup>
      </Popover.Root>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(await screen.findByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Details')).toBeTruthy();
    expect(screen.getByText('Popover body')).toBeTruthy();
  });

  it('closes on Escape', async () => {
    wrap(
      <Popover.Root>
        <Popover.Trigger>
          <Button>Open</Button>
        </Popover.Trigger>
        <Popover.Popup>
          <Popover.Title>Details</Popover.Title>
          <Popover.Content>Popover body</Popover.Content>
        </Popover.Popup>
      </Popover.Root>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(await screen.findByRole('dialog')).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });
});
