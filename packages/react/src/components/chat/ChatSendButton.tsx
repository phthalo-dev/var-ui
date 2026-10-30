import type { ComponentPropsWithRef, JSX, MouseEvent, Ref } from 'react';
import { Button } from '../Button';
import { Icon } from '../../icons';

export type ChatSendButtonProps = Omit<
  ComponentPropsWithRef<'button'>,
  'children' | 'className' | 'ref' | 'disabled' | 'onClick'
> & {
  /** Whether an assistant reply is currently streaming — swaps send → stop. @default false */
  streaming?: boolean;
  /** Disables the button. Ignored while streaming (stop stays pressable). @default false */
  disabled?: boolean;
  /** Called on click when not streaming. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Called on click while streaming (cancel). */
  onStop?: () => void;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** Ref to the underlying `<button>` element. */
  ref?: Ref<HTMLButtonElement>;
};

/**
 * Send/stop button for a chat composer. Reuses the existing `Button` +
 * `Icon` rather than a dedicated recipe.
 *
 * ```tsx
 * <ChatSendButton streaming={isStreaming} onClick={send} onStop={cancel} />
 * ```
 */
export function ChatSendButton({
  streaming = false,
  disabled = false,
  onClick,
  onStop,
  className,
  ref,
  ...rest
}: ChatSendButtonProps): JSX.Element {
  return (
    <Button
      aria-label={streaming ? 'Stop generating' : 'Send message'}
      {...rest}
      tone="accent"
      appearance="filled"
      className={className}
      ref={ref}
      disabled={streaming ? false : disabled}
      onClick={streaming ? () => onStop?.() : onClick}
    >
      <Icon name={streaming ? 'stop' : 'arrowUp'} size="sm" />
    </Button>
  );
}
