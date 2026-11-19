import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

describe('Card (#143)', () => {
  it('div cards take a description and a titleEnd beside the title', () => {
    render(
      <Card title="Workstream" titleEnd={<span>Active</span>} description="Ships Friday">
        Body
      </Card>,
    );
    const heading = screen.getByRole('heading', { name: 'Workstream' });
    expect(heading.parentElement!.textContent).toContain('Active');
    expect(screen.getByText('Ships Friday').tagName).toBe('P');
  });

  it('onClick makes the card pressable: a button named by the title', async () => {
    const onClick = vi.fn();
    const { container } = render(
      <Card title="Memory" onClick={onClick}>
        Saved on Tuesday
      </Card>,
    );
    const button = screen.getByRole('button', { name: 'Memory' });
    expect(container.firstElementChild!.hasAttribute('data-pressable')).toBe(true);
    button.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('link cards take a node title and titleEnd', () => {
    render(<Card href="/w" title={<em>Docs</em>} titleEnd={<span>New</span>} />);
    const link = screen.getByRole('link');
    expect(link.querySelector('em')!.textContent).toBe('Docs');
    expect(link.textContent).toContain('New');
  });
});
