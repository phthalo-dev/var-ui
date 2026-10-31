import { useState, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { stubNativeDialog } from '../test/nativeOverlayStubs';
import { MobileNav, MobileNavProvider } from './MobileNav';

// jsdom has no top layer: API-shape tests only. Escape, backdrop, focus, scroll lock and the
// slide animation are covered in MobileNav.browser.test.tsx.
stubNativeDialog();

function wrap(ui: ReactNode) {
  return render(<IconProvider icons={{}}>{ui}</IconProvider>);
}

describe('MobileNav', () => {
  it('renders nothing when closed, and its children when open is true', () => {
    const { rerender } = wrap(
      <MobileNav open={false}>
        <p>Drawer content</p>
      </MobileNav>,
    );
    expect(screen.queryByText('Drawer content')).toBeNull();

    rerender(
      <IconProvider icons={{}}>
        <MobileNav open>
          <p>Drawer content</p>
        </MobileNav>
      </IconProvider>,
    );
    expect(screen.getByText('Drawer content')).toBeTruthy();
  });

  it('renders header content and children together', () => {
    wrap(
      <MobileNav open header="Menu">
        <p>Dashboard link</p>
      </MobileNav>,
    );
    expect(screen.getByText('Menu')).toBeTruthy();
    expect(screen.getByText('Dashboard link')).toBeTruthy();
  });

  it('calls onOpenChange(false) when the close button is pressed', async () => {
    const onOpenChange = vi.fn();
    wrap(
      <MobileNav open onOpenChange={onOpenChange} closeLabel="Close nav">
        <p>Drawer content</p>
      </MobileNav>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Close nav' }));
    expect(onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ reason: 'close-press' }),
    );
  });

  it('positions the panel via data-side, defaulting "auto" to "start"', () => {
    wrap(
      <MobileNav open>
        <p>Drawer content</p>
      </MobileNav>,
    );
    const panel = screen.getByRole('dialog');
    expect(panel.getAttribute('data-side')).toBe('start');
  });

  it('supports the "end" side', () => {
    wrap(
      <MobileNav open side="end">
        <p>Drawer content</p>
      </MobileNav>,
    );
    const panel = screen.getByRole('dialog');
    expect(panel.getAttribute('data-side')).toBe('end');
  });

  describe('MobileNav.Toggle', () => {
    it('calls an explicit onClick handler and reflects open via aria-expanded', async () => {
      function Demo() {
        const [isOpen, setIsOpen] = useState(false);
        return (
          <>
            <MobileNav.Toggle open={isOpen} onClick={() => setIsOpen(true)} />
            <MobileNav open={isOpen} onOpenChange={setIsOpen}>
              <p>Drawer content</p>
            </MobileNav>
          </>
        );
      }
      wrap(<Demo />);
      const toggle = screen.getByRole('button', { name: 'Open navigation' });
      expect(toggle.getAttribute('aria-expanded')).toBe('false');
      expect(screen.queryByText('Drawer content')).toBeNull();

      await userEvent.click(toggle);
      expect(screen.getByText('Drawer content')).toBeTruthy();
    });

    it('opens the drawer through a shared MobileNavProvider with no explicit handlers', async () => {
      wrap(
        <MobileNavProvider>
          <MobileNav.Toggle />
          <MobileNav>
            <p>Drawer content</p>
          </MobileNav>
        </MobileNavProvider>,
      );
      expect(screen.queryByText('Drawer content')).toBeNull();

      await userEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
      expect(screen.getByText('Drawer content')).toBeTruthy();
    });
  });

  it('MobileNavProvider honors defaultOpen', () => {
    wrap(
      <MobileNavProvider defaultOpen>
        <MobileNav>
          <p>Drawer content</p>
        </MobileNav>
      </MobileNavProvider>,
    );
    expect(screen.getByText('Drawer content')).toBeTruthy();
  });

  it('Toggle forwards a native onClick event', async () => {
    const onClick = vi.fn();
    wrap(<MobileNav.Toggle onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0]?.[0]).toHaveProperty('nativeEvent');
  });

  it('MobileNav defaultOpen opens uncontrolled and details.cancel() vetoes a close press', async () => {
    const onOpenChange = vi.fn((_open: boolean, details: { cancel: () => void }) =>
      details.cancel(),
    );
    wrap(
      <MobileNav defaultOpen onOpenChange={onOpenChange}>
        <p>Drawer content</p>
      </MobileNav>,
    );
    expect(screen.getByText('Drawer content')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Close navigation' }));
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Drawer content')).toBeTruthy();
  });

  it('MobileNav uncontrolled closes itself from its close button', async () => {
    wrap(
      <MobileNav defaultOpen>
        <p>Drawer content</p>
      </MobileNav>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Close navigation' }));
    expect(document.querySelector('dialog')?.hasAttribute('open')).toBe(false);
  });

  it('MobileNavProvider reports trigger-press from the toggle and close-press from the nav', async () => {
    const onOpenChange = vi.fn();
    wrap(
      <MobileNavProvider onOpenChange={onOpenChange}>
        <MobileNav.Toggle />
        <MobileNav closeLabel="Close nav">
          <p>Drawer content</p>
        </MobileNav>
      </MobileNavProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(
      true,
      expect.objectContaining({ reason: 'trigger-press' }),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Close nav' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'close-press' }),
    );
    expect(onOpenChange).toHaveBeenCalledTimes(2);
  });

  it('renders the popup on the mobile-nav recipe class with no wrapper', () => {
    const { container } = wrap(
      <MobileNav open>
        <p>Drawer content</p>
      </MobileNav>,
    );
    expect(container.querySelector('dialog.var-ui-mobile-nav__popup')).toBeTruthy();
    expect(container.querySelector('[style*="display: contents"]')).toBeNull();
  });
});
