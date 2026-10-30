import { createRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../../icons';
import { ChatComposer } from './ChatComposer';
import { ChatComposerInput } from './ChatComposerInput';
import { ChatLayout } from './ChatLayout';
import { ChatMessage } from './ChatMessage';
import { ChatMessageBubble } from './ChatMessageBubble';
import { ChatMessageList } from './ChatMessageList';
import { ChatMessageMetadata } from './ChatMessageMetadata';
import { ChatSendButton } from './ChatSendButton';
import { ChatSystemMessage } from './ChatSystemMessage';
import { ChatToolCalls } from './ChatToolCalls';

function wrap(ui: ReactNode) {
  return render(<IconProvider icons={{}}>{ui}</IconProvider>);
}

describe('chat passthrough (native props, className merge, ref)', () => {
  const cases: Array<[string, (props: Record<string, unknown>) => ReactNode]> = [
    ['ChatComposer', (p) => <ChatComposer {...p}>body</ChatComposer>],
    [
      'ChatLayout',
      (p) => (
        <ChatLayout composer={null} {...p}>
          msgs
        </ChatLayout>
      ),
    ],
    [
      'ChatMessage',
      (p) => (
        <ChatMessage sender="user" {...p}>
          hi
        </ChatMessage>
      ),
    ],
    ['ChatMessageBubble', (p) => <ChatMessageBubble {...p}>hi</ChatMessageBubble>],
    ['ChatMessageList', (p) => <ChatMessageList {...p}>hi</ChatMessageList>],
    ['ChatSystemMessage', (p) => <ChatSystemMessage {...p}>hi</ChatSystemMessage>],
    [
      'ChatToolCalls',
      (p) => <ChatToolCalls calls={[{ name: 'search' }, { name: 'read' }]} {...p} />,
    ],
    ['ChatMessageMetadata', (p) => <ChatMessageMetadata date={new Date(0)} {...p} />],
  ];

  it.each(cases)('%s forwards native props, merges className and sets the ref', (_name, make) => {
    const ref = createRef<HTMLDivElement>();
    const onClick = vi.fn();
    wrap(
      make({
        'data-testid': 'root',
        id: 'my-id',
        title: 'tip',
        className: 'my-class',
        onClick,
        ref,
      }),
    );
    const root = screen.getByTestId('root');
    expect(ref.current).toBe(root);
    expect(root.id).toBe('my-id');
    expect(root.getAttribute('title')).toBe('tip');
    expect(root.className).toContain('my-class');
    expect(root.className.split(' ').length).toBeGreaterThan(1);
  });

  it('ChatMessageList lets native role/aria override defaults', () => {
    wrap(
      <ChatMessageList data-testid="root" role="feed" aria-live="off">
        hi
      </ChatMessageList>,
    );
    expect(screen.getByTestId('root').getAttribute('role')).toBe('feed');
    expect(screen.getByTestId('root').getAttribute('aria-live')).toBe('off');
  });

  it('ChatSendButton forwards native props and ref to the button', async () => {
    const ref = createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    wrap(
      <ChatSendButton
        ref={ref}
        data-testid="send"
        className="my-class"
        name="send"
        type="submit"
        aria-label="Post it"
        onClick={onClick}
      />,
    );
    const button = screen.getByTestId('send');
    expect(ref.current).toBe(button);
    expect(button.className).toContain('my-class');
    expect(button.getAttribute('name')).toBe('send');
    expect(button.getAttribute('type')).toBe('submit');
    expect(button.getAttribute('aria-label')).toBe('Post it');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('ChatComposerInput forwards native props, ref and native onChange to the textarea', async () => {
    const ref = createRef<HTMLTextAreaElement>();
    const onChange = vi.fn();
    const onValueChange = vi.fn();
    wrap(
      <ChatComposerInput
        ref={ref}
        value=""
        data-testid="input"
        className="my-class"
        name="message"
        maxLength={50}
        onChange={onChange}
        onValueChange={onValueChange}
        onSubmit={vi.fn()}
      />,
    );
    const textarea = screen.getByTestId('input') as HTMLTextAreaElement;
    expect(ref.current).toBe(textarea);
    expect(textarea.className).toContain('my-class');
    expect(textarea.getAttribute('name')).toBe('message');
    expect(textarea.getAttribute('maxlength')).toBe('50');
    await userEvent.type(textarea, 'h');
    expect(onValueChange).toHaveBeenCalledWith('h');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]![0].target).toBe(textarea);
  });

  it('ChatComposerInput runs a user onKeyDown first and respects preventDefault', async () => {
    const onSubmit = vi.fn();
    const onKeyDown = vi.fn((e: { preventDefault: () => void }) => e.preventDefault());
    wrap(
      <ChatComposerInput
        value="hello"
        onValueChange={vi.fn()}
        onSubmit={onSubmit}
        onKeyDown={onKeyDown}
      />,
    );
    screen.getByRole('textbox').focus();
    await userEvent.keyboard('{Enter}');
    expect(onKeyDown).toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
