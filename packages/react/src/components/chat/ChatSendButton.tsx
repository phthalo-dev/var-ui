import type { ComponentPropsWithRef, JSX, MouseEvent, Ref } from 'react';
import { spinner } from '@var-ui/core/components/spinner';
import { recipeVars, styleVars } from '@var-ui/core/components/styleVars';
import { Button } from '../Button';
import { Spinner } from '../Spinner';
import { Icon } from '../../icons';

const spinnerVars = recipeVars(spinner);

export type ChatSendButtonProps = Omit<
  ComponentPropsWithRef<'button'>,
  'children' | 'className' | 'ref' | 'disabled' | 'onClick'
> & {
  /** Whether an assistant reply is currently streaming — swaps send → stop. @default false */
  streaming?: boolean;
  /** Shows a spinner and ignores presses while a send is in flight. @default false */
  loading?: boolean;
  /** Disables the button. Ignored while streaming (stop stays pressable). @default false */
  disabled?: boolean;
  /** Called on click when not streaming or loading. */
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
 * <ChatSendButton streaming={isStreaming} loading={isSending} onClick={send} onStop={cancel} />
 * ```
 */
export function ChatSendButton({
  streaming = false,
  loading = false,
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
      disabled={streaming ? false : disabled || loading}
      onClick={streaming ? () => onStop?.() : loading ? undefined : onClick}
    >
      {streaming ? (
        <Icon name="stop" size="sm" />
      ) : loading ? (
        <Spinner
          size="sm"
          label="Sending"
          style={styleVars([
            [spinnerVars.indicatorColor, 'currentColor'],
            [spinnerVars.trackColor, 'transparent'],
          ])}
        />
      ) : (
        <Icon name="arrowUp" size="sm" />
      )}
    </Button>
  );
}
