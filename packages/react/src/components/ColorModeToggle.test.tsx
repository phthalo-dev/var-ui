import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import { ColorModeToggle } from './ColorModeToggle';

const icons = {
  colorModeLight: <span data-testid="icon-light" />,
  colorModeDark: <span data-testid="icon-dark" />,
  colorModeSystem: <span data-testid="icon-system" />,
};

function wrap(ui: ReactNode, defaultColorMode: 'light' | 'dark' | 'system' = 'light') {
  return render(
    <DesignSystemProvider defaultColorMode={defaultColorMode}>
      <IconProvider icons={icons}>{ui}</IconProvider>
    </DesignSystemProvider>,
  );
}

describe('ColorModeToggle', () => {
  it('renders light and dark segments by default', () => {
    wrap(<ColorModeToggle />);
    expect(screen.getByRole('radiogroup', { name: 'Color mode' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Light' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Dark' })).toBeTruthy();
    expect(screen.queryByRole('radio', { name: 'System' })).toBeNull();
  });

  it('includes system when includeSystem is set', () => {
    wrap(<ColorModeToggle includeSystem />);
    expect(screen.getByRole('radio', { name: 'System' })).toBeTruthy();
  });

  it('marks the current color mode as selected', () => {
    wrap(<ColorModeToggle />, 'dark');
    expect((screen.getByRole('radio', { name: 'Dark' }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByRole('radio', { name: 'Light' }) as HTMLInputElement).checked).toBe(false);
  });

  it('updates color mode when a segment is pressed', async () => {
    const user = userEvent.setup();
    wrap(<ColorModeToggle />);
    await user.click(screen.getByRole('radio', { name: 'Dark' }));
    expect((screen.getByRole('radio', { name: 'Dark' }) as HTMLInputElement).checked).toBe(true);
  });

  it('renders text labels when appearance is labels', () => {
    wrap(<ColorModeToggle appearance="labels" />);
    expect(screen.getByText('Light')).toBeTruthy();
    expect(screen.queryByTestId('icon-light')).toBeNull();
  });

  it('supports controlled mode without a provider', async () => {
    const user = userEvent.setup();
    const onColorModeChange = vi.fn();
    render(
      <IconProvider icons={icons}>
        <ColorModeToggle colorMode="light" onColorModeChange={onColorModeChange} />
      </IconProvider>,
    );
    await user.click(screen.getByRole('radio', { name: 'Dark' }));
    expect(onColorModeChange).toHaveBeenCalledWith('dark');
  });

  it('maps system preference to resolved light/dark when system is omitted', () => {
    wrap(<ColorModeToggle resolvedColorMode="dark" />, 'system');
    // defaultColorMode is system but includeSystem is false — selection follows resolved
    expect((screen.getByRole('radio', { name: 'Dark' }) as HTMLInputElement).checked).toBe(true);
  });

  it('selects the stored preference rather than defaultColorMode when storageKey is set', () => {
    localStorage.setItem('test-color-mode', 'dark');
    render(
      <DesignSystemProvider defaultColorMode="system" storageKey="test-color-mode">
        <IconProvider icons={icons}>
          <ColorModeToggle includeSystem />
        </IconProvider>
      </DesignSystemProvider>,
    );
    expect((screen.getByRole('radio', { name: 'Dark' }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByRole('radio', { name: 'System' }) as HTMLInputElement).checked).toBe(false);
    localStorage.clear();
  });
});
