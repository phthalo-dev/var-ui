import type { JSX, ReactNode } from 'react';
import { chatSystemMessage, type ChatSystemMessageVariantProps } from '@var-ui/core';
import { mergeProps } from '../utils';

export type ChatSystemMessageProps = {
  /** Semantic tone. @default neutral */
  tone?: NonNullable<ChatSystemMessageVariantProps['tone']>;
  /** Optional leading icon — pass an `<Icon name="…" />`. */
  icon?: ReactNode;
  /** Message text. */
  children: ReactNode;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
};

/**
 * Centered inline system message — presence updates, mode switches, etc.
 *
 * ```tsx
 * <ChatSystemMessage tone="info">Model switched to GPT-5</ChatSystemMessage>
 * ```
 */
export function ChatSystemMessage({
  tone = 'neutral',
  icon,
  children,
  className,
}: ChatSystemMessageProps): JSX.Element {
  const s = chatSystemMessage({ tone });
  return (
    <div {...mergeProps(s.root, className)} role="status">
      {icon ? <span {...mergeProps(s.icon)}>{icon}</span> : null}
      <span {...mergeProps(s.text)}>{children}</span>
    </div>
  );
}
