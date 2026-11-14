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

  it('renders the loading row below the messages', () => {
    render(
      <ChatMessageList loading={<span data-testid="pending">Sending…</span>}>
        content
      </ChatMessageList>,
    );
    expect(screen.getByText('content')).toBeTruthy();
    expect(screen.getByTestId('pending')).toBeTruthy();
    const row = screen.getByTestId('pending').parentElement as HTMLElement;
    expect(row.className).toContain('var-ui-chat-message-list__loading');
  });

  it('omits the loading row when no loading node is given', () => {
    const { container } = render(<ChatMessageList>content</ChatMessageList>);
    expect(container.querySelector('[class*="chat-message-list__loading"]')).toBeNull();
  });
});
