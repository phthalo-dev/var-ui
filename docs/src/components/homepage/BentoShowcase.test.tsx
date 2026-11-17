import { forestTheme } from '@/themes';
import { defaultIcons } from '@var-ui/icons';
import { DesignSystemProvider, IconProvider } from '@var-ui/react';
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { BentoShowcase } from './BentoShowcase';

function renderShowcase(
  themeId: Parameters<typeof BentoShowcase>[0]['themeId'],
  defaultColorMode: 'light' | 'dark' | 'system' = 'light',
) {
  return render(
    <DesignSystemProvider defaultColorMode={defaultColorMode}>
      <IconProvider icons={defaultIcons}>
        <>
          <BentoShowcase themeId={themeId} />
        </>
      </IconProvider>
    </DesignSystemProvider>,
  );
}

describe('BentoShowcase', () => {
  it('renders the product tiles', () => {
    renderShowcase('default');
    expect(screen.getByRole('region', { name: 'Monthly revenue' })).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Team kudos' })).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Launch schedule' })).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Preferences' })).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Agent chat' })).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Team members' })).toBeTruthy();
  });

  it('applies the selected theme class and inherits color-scheme from the docs site', () => {
    renderShowcase('forest');
    const container = screen.getByTestId('bento-showcase') as HTMLElement;
    expect(container.className).toContain(forestTheme.className);
    expect(container.getAttribute('data-color-mode')).toBeNull();
    expect(container.style.colorScheme).toBe('inherit');
  });
});
