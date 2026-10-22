import { describe, expect, it, beforeEach } from 'vite-plus/test';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlaygroundEditorSidebar from './PlaygroundEditorSidebar';
import ThemePlayground from './ThemePlayground';
import {
  getThemePlaygroundState,
  resetThemePlaygroundStore,
  setThemePlaygroundState,
} from './themePlaygroundStore';

describe('ThemePlayground', () => {
  beforeEach(() => {
    resetThemePlaygroundStore();
    localStorage.clear();
    document.documentElement.removeAttribute('data-color-mode');
  });

  it('renders bento showcase with default theme class', () => {
    render(<ThemePlayground />);
    const showcase = screen.getByTestId('bento-showcase');
    expect(showcase.className).toContain('theme-var-ui-default');
  });

  it('updates preview theme class when preset changes via store', async () => {
    setThemePlaygroundState({ presetId: 'forest' });
    render(<ThemePlayground />);
    const showcase = screen.getByTestId('bento-showcase');
    await waitFor(() => {
      expect(showcase.className).toContain('theme-var-ui-forest');
    });
  });

  it('inherits color-scheme from docs site', () => {
    localStorage.setItem('theme-mode', 'dark');
    document.documentElement.setAttribute('data-color-mode', 'dark');
    render(<ThemePlayground />);
    const showcase = screen.getByTestId('bento-showcase');
    expect(showcase.style.colorScheme).toBe('inherit');
  });

  it('applies color overrides as CSS variables on preview', () => {
    setThemePlaygroundState({ colors: { 'color.tone.accent.foreground': '#3b82f6' } });
    render(<ThemePlayground />);
    const showcase = screen.getByTestId('bento-showcase');
    expect(showcase.style.getPropertyValue('--var-ui-color-tone-accent-foreground')).toBe(
      '#3b82f6',
    );
  });
});

describe('PlaygroundEditorSidebar', () => {
  beforeEach(() => {
    resetThemePlaygroundStore();
    localStorage.clear();
    document.documentElement.removeAttribute('data-color-mode');
  });

  it('shows editor tabs and preset controls', () => {
    render(<PlaygroundEditorSidebar />);
    expect(screen.getByRole('tab', { name: 'Base Styles' })).toBeTruthy();
    expect(screen.getByLabelText('Heading font')).toBeTruthy();
    expect(screen.getByLabelText('Spacing preset')).toBeTruthy();
    expect(screen.getByLabelText('Theme preset')).toBeTruthy();
  });

  it('updates store when accent color is edited', async () => {
    const user = userEvent.setup();
    render(<PlaygroundEditorSidebar />);

    const accentField = screen.getByRole('textbox', { name: 'Accent' });
    await user.clear(accentField);
    await user.type(accentField, '#3b82f6');

    await waitFor(() => {
      expect(getThemePlaygroundState().colors['color.tone.accent.foreground']).toBe('#3b82f6');
    });
  });
});
