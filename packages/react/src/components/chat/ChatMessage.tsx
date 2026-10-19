import type { JSX, ReactNode } from 'react';
import { chatMessage, type ChatMessageVariantProps } from '@var-ui/core';
import { ChatMessageContext, useChatListContext } from './ChatContext';
import { mergeProps } from '../utils';

export type ChatMessageProps = {
  /** Who sent this message — drives alignment and the default bubble color. */
  sender: NonNullable<ChatMessageVariantProps['sender']>;
  /** Sender name shown above the content. */
  name?: ReactNode;
  /** Avatar element — typically an existing `<Avatar>`. */
  avatar?: ReactNode;
  /** Metadata (timestamp, status) shown below the content. */
  metadata?: ReactNode;
  /** Message content — typically one or more `ChatMessageBubble`. */
  children: ReactNode;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
};

/**
 * A message row. Provides `sender` + `density` to descendants via
 * `ChatMessageContext` so `ChatMessageBubble` doesn't need every prop
 * repeated.
 *
 * ```tsx
 * <ChatMessage sender="assistant" name="Navi" avatar={<Avatar name="Navi" />}>
 *   <ChatMessageBubble>Hello!</ChatMessageBubble>
 * </ChatMessage>
 * ```
 */
export function ChatMessage({
  sender,
  name,
  avatar,
  metadata,
  children,
  className,
}: ChatMessageProps): JSX.Element {
  const listContext = useChatListContext();
  const density = listContext?.density ?? 'balanced';
  const m = chatMessage({ sender });
  return (
    <ChatMessageContext.Provider value={{ sender, density }}>
      <div {...mergeProps(m.root, className)}>
        {avatar ? <div {...mergeProps(m.avatar)}>{avatar}</div> : null}
        <div {...mergeProps(m.content)}>
          {name ? (
            <div {...mergeProps(m.header)}>
              <span {...mergeProps(m.name)}>{name}</span>
            </div>
          ) : null}
          {children}
          {metadata ? <div {...mergeProps(m.metadata)}>{metadata}</div> : null}
        </div>
      </div>
    </ChatMessageContext.Provider>
  );
}
