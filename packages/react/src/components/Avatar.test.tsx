import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarGroup } from './Avatar';

describe('Avatar', () => {
  it('renders an image when src is provided', () => {
    render(<Avatar src="https://example.com/a.png" alt="Ada Lovelace" />);
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toBeTruthy();
  });

  it('falls back to initials derived from name', () => {
    render(<Avatar name="Ada Lovelace" />);
    expect(screen.getByText('AL')).toBeTruthy();
  });

  it('shows a status dot when status is set', () => {
    const { container } = render(<Avatar name="Ada" status="success" />);
    expect(container.querySelector('.var-ui-status-dot')).toBeTruthy();
  });
});

describe('AvatarGroup', () => {
  it('clamps to max and renders an overflow chip', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="Ada Lovelace" />
        <Avatar name="Grace Hopper" />
        <Avatar name="Alan Turing" />
        <Avatar name="Edsger Dijkstra" />
      </AvatarGroup>,
    );
    expect(screen.getByText('AL')).toBeTruthy();
    expect(screen.getByText('GH')).toBeTruthy();
    expect(screen.queryByText('AT')).toBeNull();
    expect(screen.getByText('+2')).toBeTruthy();
  });
});
