import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { ChatMessageList } from './ChatMessageList';

describe('ChatMessageList', () => {
  it('renders as a live log region', () => {
    render(<ChatMessageList>content</ChatMessageList>);
    const log = screen.getByRole('log');
    expect(log.getAttribute('aria-live')).toBe('polite');
    expect(log.hasAttribute('aria-busy')).toBe(false);
  });

  it('sets aria-busy while streaming', () => {
    render(<ChatMessageList streaming>content</ChatMessageList>);
    expect(screen.getByRole('log').getAttribute('aria-busy')).toBe('true');
  });

  it('renders emptyState when there are no children', () => {
    render(<ChatMessageList emptyState={<span>No messages yet</span>}>{null}</ChatMessageList>);
    expect(screen.getByText('No messages yet')).toBeTruthy();
  });
});
