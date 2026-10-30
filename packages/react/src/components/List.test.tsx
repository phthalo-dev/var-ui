import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { List } from './List';

describe('List', () => {
  it('renders compound items', () => {
    render(
      <List header="Members">
        <List.Item label="Ada" description="Admin" />
      </List>,
    );
    expect(screen.getByText('Members')).toBeTruthy();
    expect(screen.getByText('Ada')).toBeTruthy();
    expect(screen.getByText('Admin')).toBeTruthy();
  });

  it('renders items-array mode', () => {
    render(<List items={[{ id: 'a', label: 'Ada' }]} />);
    expect(screen.getByText('Ada')).toBeTruthy();
  });

  it('renders href items as links', () => {
    render(<List items={[{ id: 'a', label: 'Ada', href: '/u/ada' }]} />);
    expect(screen.getByRole('link', { name: 'Ada' })).toBeTruthy();
  });

  it('marks disabled items with data-disabled', () => {
    const { container } = render(
      <List items={[{ id: 'a', label: 'Ada', href: '/u/ada', disabled: true }]} />,
    );
    const item = container.querySelector('[data-disabled]');
    expect(item).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'Ada' })).toBeNull();
  });

  it('uses ol when listStyle is decimal', () => {
    const { container } = render(
      <List listStyle="decimal" items={[{ id: '1', label: 'First' }]} />,
    );
    expect(container.querySelector('ol')).toBeTruthy();
    expect(container.querySelector('ul')).toBeNull();
  });

  it('calls onAction for items without href', async () => {
    const onAction = vi.fn();
    render(<List items={[{ id: 'a', label: 'Ada' }]} onAction={onAction} />);
    await userEvent.click(screen.getByRole('button', { name: 'Ada' }));
    expect(onAction).toHaveBeenCalledWith('a');
  });

  it('names interactive overlay via aria-labelledby for JSX labels', () => {
    render(
      <List
        items={[
          {
            id: 'a',
            label: (
              <span data-testid="label-content">
                Ada <strong>Lovelace</strong>
              </span>
            ),
            href: '/u/ada',
          },
        ]}
      />,
    );
    const link = screen.getByRole('link', { name: /Ada Lovelace/i });
    const labelledBy = link.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    expect(labelledBy).toMatch(/-a-label$/);
    const labelHost = document.getElementById(labelledBy!);
    expect(labelHost).toBeTruthy();
    expect(labelHost!.contains(screen.getByTestId('label-content'))).toBe(true);
  });
});
