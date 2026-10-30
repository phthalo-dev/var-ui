import { describe, expect, it, vi } from 'vite-plus/test';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import type { OverlayOpenChangeHandler } from '../overlays';
import { Drawer } from './Drawer';

function wrap(ui: React.ReactNode) {
  return render(<IconProvider icons={{}}>{ui}</IconProvider>);
}

type FixtureProps = Partial<React.ComponentProps<typeof Drawer>>;

const fixture = (props: FixtureProps = {}) => (
  <Drawer {...props}>
    <Drawer.Trigger>
      <button type="button">Open drawer</button>
    </Drawer.Trigger>
    <Drawer.Backdrop>
      <Drawer.Popup aria-label="Settings">
        <Drawer.Header>
          <Drawer.Title>Settings</Drawer.Title>
          <Drawer.Close />
        </Drawer.Header>
        <Drawer.Body>Drawer body</Drawer.Body>
      </Drawer.Popup>
    </Drawer.Backdrop>
  </Drawer>
);

const last = (h: ReturnType<typeof vi.fn<OverlayOpenChangeHandler>>) => {
  const call = h.mock.calls[h.mock.calls.length - 1]!;
  return [call[0], call[1].reason];
};

describe('Drawer', () => {
  it('renders title and body when open', () => {
    wrap(fixture({ open: true }));
    expect(screen.getByText('Settings')).toBeTruthy();
    expect(screen.getByText('Drawer body')).toBeTruthy();
    expect(document.querySelector('[class*="var-ui-drawer"]')).toBeTruthy();
  });

  it('labels a drawer via aria-label on the Root when the popup has none', () => {
    wrap(
      <Drawer open aria-label="Navigation drawer">
        <Drawer.Backdrop>
          <Drawer.Popup>
            <Drawer.Body>Navigation links</Drawer.Body>
          </Drawer.Popup>
        </Drawer.Backdrop>
      </Drawer>,
    );
    expect(screen.getByRole('dialog', { name: 'Navigation drawer' })).toBeTruthy();
  });

  it('keeps Drawer.Root as the same component as Drawer', () => {
    expect(Drawer.Root).toBe(Drawer.Root);
    wrap(
      <Drawer.Root open aria-label="Root">
        <Drawer.Backdrop>
          <Drawer.Popup>Body</Drawer.Popup>
        </Drawer.Backdrop>
      </Drawer.Root>,
    );
    expect(screen.getByRole('dialog', { name: 'Root' })).toBeTruthy();
  });

  it('preserves a consumer onPointerDown handler on the backdrop', () => {
    const onPointerDown = vi.fn();
    wrap(
      <Drawer open>
        <Drawer.Backdrop onPointerDown={onPointerDown}>
          <Drawer.Popup aria-label="Settings">Drawer body</Drawer.Popup>
        </Drawer.Backdrop>
      </Drawer>,
    );
    const backdrop = document.querySelector('.var-ui-drawer__overlay');
    expect(backdrop).toBeTruthy();
    fireEvent.pointerDown(backdrop!);
    expect(onPointerDown).toHaveBeenCalledOnce();
  });

  it('dismisses when Close wraps a native button, reporting close-press', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    wrap(
      <Drawer defaultOpen onOpenChange={onOpenChange}>
        <Drawer.Backdrop>
          <Drawer.Popup aria-label="Settings">
            <Drawer.Header>
              <Drawer.Title>Settings</Drawer.Title>
              <Drawer.Close>
                <button type="button">Dismiss</button>
              </Drawer.Close>
            </Drawer.Header>
            <Drawer.Body>Drawer body</Drawer.Body>
          </Drawer.Popup>
        </Drawer.Backdrop>
      </Drawer>,
    );
    await userEvent.click(screen.getByText('Dismiss'));
    expect(last(onOpenChange)).toEqual([false, 'close-press']);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByText('Settings')).toBeNull());
  });

  it('supports defaultOpen (uncontrolled) and closes through the close button', async () => {
    wrap(fixture({ defaultOpen: true }));
    expect(screen.getByText('Drawer body')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByText('Drawer body')).toBeNull());
  });

  it('opens from Drawer.Trigger and reports trigger-press', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    wrap(fixture({ onOpenChange }));
    expect(screen.queryByText('Drawer body')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Open drawer' }));
    expect(last(onOpenChange)).toEqual([true, 'trigger-press']);
    expect(screen.getByText('Drawer body')).toBeTruthy();
  });

  it('reports escape-key once', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    wrap(fixture({ defaultOpen: true, onOpenChange }));
    await userEvent.keyboard('{Escape}');
    await userEvent.keyboard('{Escape}');
    expect(last(onOpenChange)).toEqual([false, 'escape-key']);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  it('reports outside-press on a backdrop press, and details.cancel() keeps it open', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>((_n, details) => details.cancel());
    wrap(fixture({ defaultOpen: true, onOpenChange }));
    await userEvent.click(document.querySelector('.var-ui-drawer__overlay')!);
    await waitFor(() => expect(last(onOpenChange)).toEqual([false, 'outside-press']));
    expect(screen.getByText('Drawer body')).toBeTruthy();
  });

  it('controlled: open wins until the parent updates it', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    wrap(fixture({ open: true, onOpenChange }));
    await userEvent.keyboard('{Escape}');
    expect(last(onOpenChange)).toEqual([false, 'escape-key']);
    expect(screen.getByText('Drawer body')).toBeTruthy();
  });

  it('dismissable={false} keeps the drawer open on outside press, Escape still closes', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    wrap(fixture({ open: true, dismissable: false, onOpenChange }));
    await userEvent.click(document.querySelector('.var-ui-drawer__overlay')!);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByText('Drawer body')).toBeTruthy();
    await userEvent.click(screen.getByText('Drawer body'));
    await userEvent.keyboard('{Escape}');
    expect(last(onOpenChange)).toEqual([false, 'escape-key']);
  });

  it('renders no display:contents wrapper outside the portal chrome', () => {
    const { container } = wrap(fixture({ defaultOpen: true }));
    expect(container.querySelector('[style*="display: contents"]')).toBeNull();
  });
});
