import type { JSX, ReactNode } from 'react';
import { chatMessageList, type ChatMessageListVariantProps } from '@var-ui/core';
import { ChatListContext } from './ChatContext';
import { mergeProps } from 'typestyles';

export type ChatMessageListProps = {
  /** Message elements — typically `ChatMessage`. */
  children: ReactNode;
  /** Content shown when `children` is empty. */
  emptyState?: ReactNode;
  /**
   * Whether an assistant message is actively streaming. Sets `aria-busy` on
   * the `role="log"` region so screen readers announce the completed
   * message once, instead of re-announcing every streamed token.
   * @default false
   */
  isStreaming?: boolean;
  /** Visual density — flows to child messages via context. @default balanced */
  density?: NonNullable<ChatMessageListVariantProps['density']>;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
};

function hasVisibleContent(children: ReactNode): boolean {
  if (children == null || children === false) {
    return false;
  }
  return !(Array.isArray(children) && children.length === 0);
}

/**
 * Presentational container for chat messages — `role="log"` /
 * `aria-live="polite"` region with density-based spacing.
 *
 * ```tsx
 * <ChatMessageList isStreaming={isStreaming}>
 *   {messages.map((m) => <ChatMessage key={m.id} sender={m.sender}>…</ChatMessage>)}
 * </ChatMessageList>
 * ```
 */
export function ChatMessageList({
  children,
  emptyState,
  isStreaming = false,
  density = 'balanced',
  className,
}: ChatMessageListProps): JSX.Element {
  const l = chatMessageList({ density });
  return (
    <ChatListContext.Provider value={{ density }}>
      <div
        role="log"
        aria-live="polite"
        aria-busy={isStreaming || undefined}
        {...mergeProps(l.root, className)}
      >
        <div {...mergeProps(l.inner)}>
          {hasVisibleContent(children) ? (
            children
          ) : emptyState ? (
            <div {...mergeProps(l.emptyState)}>{emptyState}</div>
          ) : null}
        </div>
      </div>
    </ChatListContext.Provider>
  );
}
