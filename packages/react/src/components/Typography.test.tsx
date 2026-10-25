import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Heading, Text } from './Typography';

describe('Typography', () => {
  it('Heading renders the requested level with a size attr', () => {
    render(
      <Heading level={3} size="lg">
        Title
      </Heading>,
    );
    const h = screen.getByRole('heading', { level: 3, name: 'Title' });
    expect(h.className).toContain('var-ui-heading');
    expect(h.getAttribute('data-size')).toBe('lg');
  });

  it('Text renders the requested element with tone attr', () => {
    render(
      <Text as="span" tone="secondary">
        hint
      </Text>,
    );
    const el = screen.getByText('hint');
    expect(el.tagName).toBe('SPAN');
    expect(el.getAttribute('data-tone')).toBe('secondary');
  });

  it.each(['accent', 'success', 'warning', 'danger', 'info'] as const)(
    'Text supports the %s tone',
    (tone) => {
      render(<Text tone={tone}>message</Text>);
      expect(screen.getByText('message').getAttribute('data-tone')).toBe(tone);
    },
  );

  it('Text supports xs size and lineClamp', () => {
    render(
      <Text size="xs" lineClamp={2}>
        clamped
      </Text>,
    );
    const el = screen.getByText('clamped');
    expect(el.getAttribute('data-size')).toBe('xs');
    expect(el.getAttribute('data-line-clamp')).toBe('2');
  });
});
