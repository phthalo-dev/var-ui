import { forestTheme } from '@/themes';
import { defaultIcons } from '@var-ui/icons';
import { DesignSystemProvider, IconProvider, LayerProvider } from '@var-ui/react';
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
        <LayerProvider>
          <BentoShowcase themeId={themeId} />
        </LayerProvider>
      </IconProvider>
    </DesignSystemProvider>,
  );
}

describe('BentoShowcase', () => {
  it('renders all 9 tiles', () => {
    renderShowcase('default');
    expect(screen.getByText('Invite a teammate')).toBeTruthy();
    expect(screen.getByText('Deploy queued')).toBeTruthy();
    expect(screen.getByText('Notification preferences')).toBeTruthy();
    expect(screen.getByText('Verification code')).toBeTruthy();
    expect(screen.getByText('No projects yet')).toBeTruthy();
    expect(screen.getByText('Release notes')).toBeTruthy();
    expect(screen.getByText('Design team')).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Product tour' })).toBeTruthy();
    expect(screen.getByText('Layout preview')).toBeTruthy();
    expect(screen.getByText("You're on the Free plan")).toBeTruthy();
  });

  it('renders markup tiles for the html framework', () => {
    renderShowcase('default');
    const reactShowcase = screen.getByTestId('bento-showcase');
    expect(reactShowcase.getAttribute('data-framework')).toBe('react');

    renderShowcase('default');
    render(
      <DesignSystemProvider defaultColorMode="light">
        <IconProvider icons={defaultIcons}>
          <LayerProvider>
            <BentoShowcase framework="html" themeId="default" />
          </LayerProvider>
        </IconProvider>
      </DesignSystemProvider>,
    );

    const htmlShowcases = screen.getAllByTestId('bento-showcase');
    const htmlShowcase = htmlShowcases[htmlShowcases.length - 1];
    expect(htmlShowcase.getAttribute('data-framework')).toBe('html');
    expect(htmlShowcase.querySelector('.var-ui-alert')).toBeTruthy();
    expect(htmlShowcase.textContent).toContain('Invite a teammate');
  });

  it('applies the selected theme class and inherits color-scheme from the docs site', () => {
    renderShowcase('forest');
    const container = screen.getByTestId('bento-showcase') as HTMLElement;
    expect(container.className).toContain(forestTheme.className);
    expect(container.getAttribute('data-color-mode')).toBeNull();
    expect(container.style.colorScheme).toBe('inherit');
  });
});
