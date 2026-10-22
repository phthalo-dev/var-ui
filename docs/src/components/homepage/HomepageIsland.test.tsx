import { describe, expect, it, beforeEach } from 'vite-plus/test';
import { act, render, screen, waitFor } from '@testing-library/react';
import HomepageIsland from './HomepageIsland';

describe('HomepageIsland', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-color-mode');
    document.documentElement.removeAttribute('data-framework');
  });

  it('renders bento tiles for the selected docs framework', () => {
    document.documentElement.dataset.framework = 'html';
    render(<HomepageIsland framework="html" />);

    const showcase = screen.getByTestId('bento-showcase');
    expect(showcase.getAttribute('data-framework')).toBe('html');
    expect(showcase.querySelector('.var-ui-alert')).toBeTruthy();
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
    expect(showcase.style.colorScheme).toBe('inherit');
  });

  it('inherits color-scheme from the docs site on load and after toggle updates', async () => {
    localStorage.setItem('theme-mode', 'light');
    document.documentElement.setAttribute('data-color-mode', 'light');
    document.documentElement.style.colorScheme = 'light';
    render(<HomepageIsland />);

    const container = screen.getByTestId('bento-showcase') as HTMLElement;
    expect(container.style.colorScheme).toBe('inherit');
    expect(container.getAttribute('data-color-mode')).toBeNull();

    await act(async () => {
      localStorage.setItem('theme-mode', 'dark');
      document.documentElement.setAttribute('data-color-mode', 'dark');
      document.documentElement.style.colorScheme = 'dark';
    });

    await waitFor(() => {
      expect(container.style.colorScheme).toBe('inherit');
      expect(container.getAttribute('data-color-mode')).toBeNull();
    });
  });

  it('keeps inheriting color-scheme when storage changes in other tabs', async () => {
    localStorage.setItem('theme-mode', 'light');
    document.documentElement.setAttribute('data-color-mode', 'light');
    render(<HomepageIsland />);

    const container = screen.getByTestId('bento-showcase') as HTMLElement;
    expect(container.style.colorScheme).toBe('inherit');

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
      expect(container.style.colorScheme).toBe('inherit');
    });
  });
});
