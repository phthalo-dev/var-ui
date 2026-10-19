import type { JSX } from 'react';
import { Button } from '../Button';
import { Icon } from '../../icons';

export type ChatSendButtonProps = {
  /** Whether an assistant reply is currently streaming — swaps send → stop. @default false */
  isStreaming?: boolean;
  /** Disables the button. Ignored while streaming (stop stays pressable). @default false */
  isDisabled?: boolean;
  /** Called on press when not streaming. */
  onPress?: () => void;
  /** Called on press while streaming (cancel). */
  onStop?: () => void;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
};

/**
 * Send/stop button for a chat composer. Reuses the existing `Button` +
 * `Icon` rather than a dedicated recipe.
 *
 * ```tsx
 * <ChatSendButton isStreaming={isStreaming} onPress={send} onStop={cancel} />
 * ```
 */
export function ChatSendButton({
  isStreaming = false,
  isDisabled = false,
  onPress,
  onStop,
  className,
}: ChatSendButtonProps): JSX.Element {
  return (
    <Button
      tone="accent"
      appearance="filled"
      className={className}
      isDisabled={isStreaming ? false : isDisabled}
      aria-label={isStreaming ? 'Stop generating' : 'Send message'}
      onPress={isStreaming ? onStop : onPress}
    >
      <Icon name={isStreaming ? 'stop' : 'arrowUp'} size="sm" />
    </Button>
  );
}
