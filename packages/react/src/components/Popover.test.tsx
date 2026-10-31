import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { IconProvider } from '../icons';
import { stubNativePopover } from '../test/nativeOverlayStubs';
import { Popover } from './Popover';

// jsdom has no popover; behaviour that needs the platform lives in Popover.browser.test.tsx.
describe('Popover (API shape)', () => {
  stubNativePopover();

  function ui(popup: React.ReactNode, open = true) {
    return render(
      <IconProvider icons={{}}>
        <Popover.Root defaultOpen={open}>
          <Popover.Trigger>
            <button type="button">Filters</button>
          </Popover.Trigger>
          {popup}
        </Popover.Root>
      </IconProvider>,
    );
  }

  it('renders an in-place popover="auto" popup that the trigger targets', () => {
    ui(
      <Popover.Popup data-testid="popup">
        <Popover.Title>Filters</Popover.Title>
        <Popover.Content>Body</Popover.Content>
      </Popover.Popup>,
    );
    const popup = screen.getByTestId('popup');
    expect(popup.getAttribute('popover')).toBe('auto');
    const trigger = screen.getByRole('button', { name: 'Filters' });
    expect(trigger.getAttribute('popovertarget')).toBe(popup.id);
    expect(trigger.getAttribute('popovertargetaction')).toBe('toggle');
    expect(popup.getAttribute('data-placement')).toBe('bottom');
  });

  it('is a named dialog only with a Title or an aria-label', () => {
    ui(
      <Popover.Popup data-testid="popup">
        <Popover.Title>Filters</Popover.Title>
      </Popover.Popup>,
    );
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBe(screen.getByTestId('popup'));
  });

  it('has no dialog role without a name', () => {
    ui(<Popover.Popup data-testid="popup">Body</Popover.Popup>);
    expect(screen.getByTestId('popup').getAttribute('role')).toBeNull();
  });

  it('maps placement and offset onto the popup', () => {
    ui(
      <Popover.Popup data-testid="popup" placement="top end" offset={12}>
        Body
      </Popover.Popup>,
    );
    const popup = screen.getByTestId('popup');
    expect(popup.getAttribute('data-placement')).toBe('top end');
    expect(popup.style.getPropertyValue('--var-ui-popup-offset')).toBe('12px');
  });

  it('mounts children only while open', () => {
    ui(<Popover.Popup data-testid="popup">Body</Popover.Popup>, false);
    expect(screen.queryByText('Body')).toBeNull();
    expect(screen.getByTestId('popup').getAttribute('popover')).toBe('auto');
  });
});
