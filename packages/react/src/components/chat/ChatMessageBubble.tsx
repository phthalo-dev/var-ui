import type { ComponentPropsWithRef, JSX, ReactNode, Ref } from 'react';
import { chatMessageBubble } from '@var-ui/core/components/chat/chatMessageBubble';
import type { ChatMessageBubbleVariantProps } from '@var-ui/core';
import { useChatMessageContext } from './ChatContext';
import { mergeProps } from 'typestyles';

export type ChatMessageBubbleProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'className' | 'ref'
> & {
  /** Bubble content — plain text or a consumer-rendered markdown tree. */
  children: ReactNode;
  /**
   * `solid` fills the bubble with the sender colour; `subtle` tints user bubbles instead of the
   * solid accent fill; `ghost` drops the background but keeps padding for alignment.
   * @default solid
   */
  appearance?: NonNullable<ChatMessageBubbleVariantProps['appearance']>;
  /** Position within a multi-bubble group from the same sender — tightens corners. */
  group?: NonNullable<ChatMessageBubbleVariantProps['group']>;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** Ref to the underlying root `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * The chat "bubble." Reads `sender` from an ancestor `ChatMessage` to
 * auto-style background/text color; defaults to `assistant` outside one.
 *
 * ```tsx
 * <ChatMessage sender="assistant">
 *   <ChatMessageBubble>Hello!</ChatMessageBubble>
 * </ChatMessage>
 * ```
 */
export function ChatMessageBubble({
  children,
  appearance = 'solid',
  group,
  className,
  ref,
  ...rest
}: ChatMessageBubbleProps): JSX.Element {
  const context = useChatMessageContext();
  const sender = context?.sender ?? 'assistant';
  const b = chatMessageBubble({ sender, appearance, group: group ?? 'none' });
  return (
    <div {...rest} {...mergeProps(b.root, className)} ref={ref}>
      {children}
    </div>
  );
}
