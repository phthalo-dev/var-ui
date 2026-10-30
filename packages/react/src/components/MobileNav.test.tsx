import { useState, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import { MobileNav, MobileNavProvider } from './MobileNav';

function wrap(ui: ReactNode) {
  return render(
    <IconProvider icons={{}}>
      <LayerProvider>{ui}</LayerProvider>
    </IconProvider>,
  );
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
        <LayerProvider>
          <MobileNav open>
            <p>Drawer content</p>
          </MobileNav>
        </LayerProvider>
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

  it('calls onOpenChange(false) on Escape', async () => {
    const onOpenChange = vi.fn();
    wrap(
      <MobileNav open onOpenChange={onOpenChange}>
        <p>Drawer content</p>
      </MobileNav>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ reason: 'escape-key' }),
    );
  });

  it('calls onOpenChange(false) on backdrop click', async () => {
    const onOpenChange = vi.fn();
    wrap(
      <MobileNav open onOpenChange={onOpenChange}>
        <p>Drawer content</p>
      </MobileNav>,
    );
    const dialog = screen.getByRole('dialog');
    // The backdrop is the ModalOverlay's own underlay element, an ancestor of the dialog panel.
    const backdrop = dialog.parentElement?.parentElement;
    expect(backdrop).toBeTruthy();
    await userEvent.click(backdrop as Element);
    expect(onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ reason: 'outside-press' }),
    );
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
    const panel = screen.getByRole('dialog').parentElement;
    expect(panel?.getAttribute('data-side')).toBe('start');
  });

  it('supports the "end" side', () => {
    wrap(
      <MobileNav open side="end">
        <p>Drawer content</p>
      </MobileNav>,
    );
    const panel = screen.getByRole('dialog').parentElement;
    expect(panel?.getAttribute('data-side')).toBe('end');
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

  it('MobileNav defaultOpen opens uncontrolled and details.cancel() vetoes a close', async () => {
    const onOpenChange = vi.fn((_open: boolean, details: { cancel: () => void }) =>
      details.cancel(),
    );
    wrap(
      <MobileNav defaultOpen onOpenChange={onOpenChange}>
        <p>Drawer content</p>
      </MobileNav>,
    );
    expect(screen.getByText('Drawer content')).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Drawer content')).toBeTruthy();
  });

  it('MobileNav uncontrolled closes itself', async () => {
    wrap(
      <MobileNav defaultOpen>
        <p>Drawer content</p>
      </MobileNav>,
    );
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByText('Drawer content')).toBeNull());
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

  it('renders no display:contents wrapper', () => {
    const { container } = wrap(
      <MobileNav open>
        <p>Drawer content</p>
      </MobileNav>,
    );
    expect(container.querySelector('[style*="display: contents"]')).toBeNull();
  });
});
