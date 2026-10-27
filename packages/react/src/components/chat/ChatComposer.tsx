import type { JSX, ReactNode, Ref } from 'react';
import { chatComposer } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type ChatComposerProps = {
  /** Composer input — typically `ChatComposerInput`. */
  children: ReactNode;
  /** Trailing actions — typically `ChatSendButton`. */
  actions?: ReactNode;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** Ref to the underlying root `<div>` element. */
  ref?: Ref<HTMLDivElement>;
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
export function ChatComposer({
  children,
  actions,
  className,
  ref,
}: ChatComposerProps): JSX.Element {
  const c = chatComposer();
  return (
    <div {...mergeProps(c.root, className)} ref={ref}>
      {children}
      {actions ? <div {...mergeProps(c.actions)}>{actions}</div> : null}
    </div>
  );
}
