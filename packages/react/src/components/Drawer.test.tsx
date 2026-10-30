import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import type { OverlayOpenChangeHandler } from '../overlays';
import { stubNativeDialog } from '../test/nativeOverlayStubs';
import { Drawer } from './Drawer';

// jsdom has no top layer: these are API-shape tests. Escape, backdrop, focus, scroll lock and
// the slide animation are covered in Drawer.browser.test.tsx.
stubNativeDialog();

function wrap(ui: React.ReactNode) {
  return render(<IconProvider icons={{}}>{ui}</IconProvider>);
}

type FixtureProps = Partial<React.ComponentProps<typeof Drawer>>;

const fixture = (props: FixtureProps = {}) => (
  <Drawer {...props}>
    <Drawer.Trigger>
      <button type="button">Open drawer</button>
    </Drawer.Trigger>
    <Drawer.Popup aria-label="Settings">
      <Drawer.Header>
        <Drawer.Title>Settings</Drawer.Title>
        <Drawer.Close />
      </Drawer.Header>
      <Drawer.Body>Drawer body</Drawer.Body>
    </Drawer.Popup>
  </Drawer>
);

const last = (h: ReturnType<typeof vi.fn<OverlayOpenChangeHandler>>) => {
  const call = h.mock.calls[h.mock.calls.length - 1]!;
  return [call[0], call[1].reason];
};

describe('Drawer', () => {
  it('renders title and body when open, on the drawer popup class', () => {
    wrap(fixture({ open: true }));
    expect(screen.getByText('Settings')).toBeTruthy();
    expect(screen.getByText('Drawer body')).toBeTruthy();
    expect(document.querySelector('dialog.var-ui-drawer__popup')).toBeTruthy();
  });

  it('renders no children while closed', () => {
    wrap(fixture());
    expect(screen.queryByText('Drawer body')).toBeNull();
  });

  it('placement defaults to end and sets data-placement', () => {
    const { unmount } = wrap(fixture({ open: true }));
    expect(document.querySelector('dialog')?.getAttribute('data-placement')).toBe('end');
    unmount();
    wrap(
      <Drawer open>
        <Drawer.Popup placement="start" aria-label="Nav">
          x
        </Drawer.Popup>
      </Drawer>,
    );
    expect(document.querySelector('dialog')?.getAttribute('data-placement')).toBe('start');
  });

  it('labels a drawer via aria-label on the Root when the popup has none', () => {
    wrap(
      <Drawer open aria-label="Navigation drawer">
        <Drawer.Popup>
          <Drawer.Body>Navigation links</Drawer.Body>
        </Drawer.Popup>
      </Drawer>,
    );
    expect(screen.getByRole('dialog', { name: 'Navigation drawer' })).toBeTruthy();
  });

  it('lets Drawer.Title name the dialog when no label is set', () => {
    wrap(
      <Drawer open>
        <Drawer.Popup>
          <Drawer.Title>Filters</Drawer.Title>
        </Drawer.Popup>
      </Drawer>,
    );
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeTruthy();
  });

  it('keeps Drawer.Root as the same component as Drawer', () => {
    expect(Drawer.Root).toBe(Drawer.Root);
    wrap(
      <Drawer.Root open aria-label="Root">
        <Drawer.Popup>Body</Drawer.Popup>
      </Drawer.Root>,
    );
    expect(screen.getByRole('dialog', { name: 'Root' })).toBeTruthy();
  });

  it('has no Backdrop part', () => {
    expect('Backdrop' in Drawer).toBe(false);
  });

  it('Close wrapping a native button reports close-press', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    wrap(
      <Drawer defaultOpen onOpenChange={onOpenChange}>
        <Drawer.Popup aria-label="Settings">
          <Drawer.Close>
            <button type="button">Dismiss</button>
          </Drawer.Close>
          <Drawer.Body>Drawer body</Drawer.Body>
        </Drawer.Popup>
      </Drawer>,
    );
    await userEvent.click(screen.getByText('Dismiss'));
    expect(last(onOpenChange)).toEqual([false, 'close-press']);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  it('opens from Drawer.Trigger and reports trigger-press', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    wrap(fixture({ onOpenChange }));
    const trigger = screen.getByRole('button', { name: 'Open drawer' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    await userEvent.click(trigger);
    expect(last(onOpenChange)).toEqual([true, 'trigger-press']);
    expect(screen.getByText('Drawer body')).toBeTruthy();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('the default Close button closes an uncontrolled drawer', async () => {
    wrap(fixture({ defaultOpen: true }));
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(document.querySelector('dialog')?.hasAttribute('open')).toBe(false);
  });

  it('controlled: open wins until the parent updates it', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    wrap(fixture({ open: true, onOpenChange }));
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(last(onOpenChange)).toEqual([false, 'close-press']);
    expect(screen.getByText('Drawer body')).toBeTruthy();
  });
});
