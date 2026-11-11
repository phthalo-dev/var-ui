import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Toc } from './Toc';

describe('Toc', () => {
  it('renders manual items', () => {
    render(
      <Toc title="On this page">
        <Toc.Item label="Examples" href="#examples" selected />
        <Toc.Item label="Default" href="#default" nested />
      </Toc>,
    );

    const nav = screen.getByRole('navigation', { name: 'On this page' });
    expect(nav).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Examples' }).getAttribute('aria-current')).toBe(
      'location',
    );
    expect(screen.getByRole('link', { name: 'Default' })).toBeTruthy();
  });

  it('applies stickyTop through the recipe CSS variable', () => {
    render(
      <Toc title="On this page" stickyTop="5rem">
        <Toc.Item label="Examples" href="#examples" />
      </Toc>,
    );

    const nav = screen.getByRole('navigation', { name: 'On this page' });
    expect(nav.style.getPropertyValue('--var-ui-toc-stickytop')).toBe('5rem');
  });
});

describe('Toc items', () => {
  const items = [
    { id: 'intro', text: 'Intro', level: 2 as const },
    { id: 'sub', text: 'Sub', level: 3 as const },
  ];

  it('renders items, nests level 3, and marks activeId selected', () => {
    render(<Toc items={items} activeId="sub" />);
    const sub = screen.getByRole('link', { name: 'Sub' });
    expect(sub.getAttribute('href')).toBe('#sub');
    expect(sub.getAttribute('aria-current')).toBe('location');
    expect(sub.closest('li')?.hasAttribute('data-nested')).toBe(true);
    expect(screen.getByRole('link', { name: 'Intro' }).getAttribute('aria-current')).toBeNull();
  });

  it('prefers items over children', () => {
    render(
      <Toc items={items}>
        <Toc.Item label="Ignored" href="#x" />
      </Toc>,
    );
    expect(screen.queryByRole('link', { name: 'Ignored' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Intro' })).toBeTruthy();
  });
});
