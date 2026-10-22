import type { JSX, ReactNode } from 'react';
import { chatComposer } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type ChatComposerProps = {
  /** Composer input — typically `ChatComposerInput`. */
  children: ReactNode;
  /** Trailing actions — typically `ChatSendButton`. */
  actions?: ReactNode;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
};

/**
 * Bordered composer chrome around the message input and trailing actions.
 *
 * ```tsx
 * <ChatComposer actions={<ChatSendButton onPress={send} />}>
 *   <ChatComposerInput value={value} onChange={setValue} onSubmit={send} />
 * </ChatComposer>
 * ```
 */
export function ChatComposer({ children, actions, className }: ChatComposerProps): JSX.Element {
  const c = chatComposer();
  return (
    <div {...mergeProps(c.root, className)}>
      {children}
      {actions ? <div {...mergeProps(c.actions)}>{actions}</div> : null}
    </div>
  );
}
