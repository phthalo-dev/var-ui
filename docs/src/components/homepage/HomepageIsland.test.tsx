import { describe, expect, it, beforeEach } from 'vite-plus/test';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import HomepageIsland from './HomepageIsland';

describe('HomepageIsland', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-color-mode');
    document.documentElement.removeAttribute('data-framework');
  });

  it('renders the theme picker above the live showcase', () => {
    render(<HomepageIsland />);

    expect(screen.getByRole('radiogroup', { name: 'Preview theme' })).toBeTruthy();
    const showcase = screen.getByTestId('bento-showcase');
    expect(showcase.querySelector('.var-ui-calendar')).toBeTruthy();
  });

  it('pins the stored mode after hydration so themed picker options follow the page', async () => {
    localStorage.setItem('theme-mode', 'light');
    render(<HomepageIsland />);

    const picker = screen.getByRole('radiogroup', { name: 'Preview theme' });
    await waitFor(() => {
      expect(picker.closest('[data-color-mode]')?.getAttribute('data-color-mode')).toBe('light');
    });
    for (const option of within(picker).getAllByRole('radio')) {
      expect(option.style.colorScheme).toBe('inherit');
    }
  });

  it('does not isolate color-scheme from the docs site before storage hydrates', () => {
    document.documentElement.setAttribute('data-color-mode', 'light');
    document.documentElement.style.colorScheme = 'light';
    render(<HomepageIsland />);

    const showcase = screen.getByTestId('bento-showcase') as HTMLElement;
    let wrapper: HTMLElement | null = showcase.parentElement;
    while (wrapper && wrapper.style.display !== 'contents') {
      wrapper = wrapper.parentElement;
    }
    expect(wrapper).toBeTruthy();
    expect(wrapper!.hasAttribute('data-color-mode')).toBe(false);
    expect(wrapper!.style.colorScheme).toBe('');
    expect(showcase.style.colorScheme).toBe('');
  });

  it('inherits color-scheme from the docs site on load and after toggle updates', async () => {
    localStorage.setItem('theme-mode', 'light');
    document.documentElement.setAttribute('data-color-mode', 'light');
    document.documentElement.style.colorScheme = 'light';
    render(<HomepageIsland />);

    const container = screen.getByTestId('bento-showcase') as HTMLElement;
    expect(container.style.colorScheme).toBe('');
    expect(container.getAttribute('data-color-mode')).toBeNull();

    await act(async () => {
      localStorage.setItem('theme-mode', 'dark');
      document.documentElement.setAttribute('data-color-mode', 'dark');
      document.documentElement.style.colorScheme = 'dark';
    });

    await waitFor(() => {
      expect(container.style.colorScheme).toBe('');
      expect(container.getAttribute('data-color-mode')).toBeNull();
    });
  });

  it('keeps inheriting color-scheme when storage changes in other tabs', async () => {
    localStorage.setItem('theme-mode', 'light');
    document.documentElement.setAttribute('data-color-mode', 'light');
    render(<HomepageIsland />);

    const container = screen.getByTestId('bento-showcase') as HTMLElement;
    expect(container.style.colorScheme).toBe('');

    await act(async () => {
      localStorage.setItem('theme-mode', 'system');
      document.documentElement.removeAttribute('data-color-mode');
      document.documentElement.style.colorScheme = '';
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'theme-mode',
          newValue: 'system',
          storageArea: localStorage,
        }),
      );
    });

    await waitFor(() => {
      expect(container.style.colorScheme).toBe('');
    });
  });
});
