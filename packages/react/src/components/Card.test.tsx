import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';
import { Card } from './Card';

describe('Badge', () => {
  it('applies the tone attr', () => {
    render(<Badge tone="success">Active</Badge>);
    const badge = screen.getByText('Active');
    expect(badge.className).toContain('var-ui-badge');
    expect(badge.getAttribute('data-tone')).toBe('success');
  });
});

describe('Card', () => {
  it('renders title and body content', () => {
    render(<Card title="Usage">Details</Card>);
    expect(screen.getByText('Usage').className).toContain('var-ui-card__title');
    expect(screen.getByText('Details')).toBeTruthy();
  });
});

describe('Card with href', () => {
  it('renders the whole card as a link with title, description, children and hint', () => {
    render(
      <Card href="/docs" title="Docs" description="Read them" hint="5 min" data-testid="c">
        <span>Extra</span>
      </Card>,
    );
    const link = screen.getByRole('link', { name: /Docs/ });
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/docs');
    expect(link.getAttribute('data-testid')).toBe('c');
    expect(link.className).toContain('var-ui-card__linkRoot');
    expect(link.textContent).toBe('DocsRead themExtra5 min');
  });

  it('stays a div with no link role without href', () => {
    render(<Card title="Usage">1.2M</Card>);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Usage', level: 3 })).toBeTruthy();
  });
});
