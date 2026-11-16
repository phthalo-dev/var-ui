import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { render, screen } from '@testing-library/react';
import { ChatMessageContext } from './ChatContext';
import { ChatMessageBubble } from './ChatMessageBubble';

describe('ChatMessageBubble', () => {
  it('renders children', () => {
    render(<ChatMessageBubble>Hello there</ChatMessageBubble>);
    expect(screen.getByText('Hello there')).toBeTruthy();
  });

  it('applies the sender attr from context', () => {
    const { container } = render(
      <ChatMessageContext.Provider value={{ sender: 'user', density: 'balanced' }}>
        <ChatMessageBubble>Hi</ChatMessageBubble>
      </ChatMessageContext.Provider>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute('data-sender')).toBe('user');
  });

  it('defaults to assistant sender outside context', () => {
    const { container } = render(<ChatMessageBubble>Hi</ChatMessageBubble>);
    expect((container.firstElementChild as HTMLElement).getAttribute('data-sender')).toBe(
      'assistant',
    );
  });

  it('maps group to the "none" default when omitted', () => {
    const { container } = render(<ChatMessageBubble>Hi</ChatMessageBubble>);
    expect((container.firstElementChild as HTMLElement).getAttribute('data-group')).toBe('none');
  });

  it('variant="subtle" drops the solid accent fill for user bubbles', () => {
    const { container } = render(
      <ChatMessageContext.Provider value={{ sender: 'user', density: 'balanced' }}>
        <ChatMessageBubble variant="subtle">Hi</ChatMessageBubble>
      </ChatMessageContext.Provider>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute('data-variant')).toBe('subtle');
    const css = getRegisteredCss();
    const subtleRule = css
      .split('}')
      .find(
        (block) => block.includes('chat-message-bubble') && block.includes('data-variant="subtle"'),
      );
    expect(subtleRule).toContain('--var-ui-chat-message-bubble-senderbackground');
    expect(subtleRule).toContain('--var-ui-chat-message-bubble-sendertext');
  });
});
