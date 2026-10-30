import {
  useLayoutEffect,
  useRef,
  type ComponentPropsWithRef,
  type CSSProperties,
  type JSX,
  type KeyboardEvent,
} from 'react';
import { TextArea, TextField as AriaTextField } from 'react-aria-components';
import { chatComposer } from '@var-ui/core/components/chat/chatComposer';
import { mergeProps } from 'typestyles';
import { mergeRefs } from '../../internal/mergeRefs';

export type ChatComposerInputProps = Omit<
  ComponentPropsWithRef<'textarea'>,
  'value' | 'defaultValue' | 'disabled' | 'className' | 'style' | 'children' | 'rows' | 'onSubmit'
> & {
  /** Controlled value. */
  value: string;
  /** Fires with the new text on every edit. The native `onChange` event also reaches the `<textarea>`. */
  onValueChange: (value: string) => void;
  /** Submit handler — called with the trimmed value on Enter (without Shift). */
  onSubmit: (value: string) => void;
  /** Placeholder text. @default 'Type a message…' */
  placeholder?: string;
  /** Max rows before the textarea scrolls instead of growing. @default 8 */
  maxRows?: number;
  /** Disabled state. @default false */
  disabled?: boolean;
  /** Additional CSS class names merged onto the textarea. */
  className?: string;
  /** Inline style for the textarea. */
  style?: CSSProperties;
};

const LINE_HEIGHT_PX = 22;

/**
 * Auto-resizing message textarea. Enter submits (trimmed, non-empty only);
 * Shift+Enter inserts a newline. `ref` and native attributes reach the
 * `<textarea>`.
 *
 * ```tsx
 * <ChatComposerInput value={value} onValueChange={setValue} onSubmit={sendMessage} />
 * ```
 */
export function ChatComposerInput({
  value,
  onValueChange,
  onSubmit,
  placeholder = 'Type a message…',
  maxRows = 8,
  disabled = false,
  className,
  onKeyDown,
  'aria-label': ariaLabel = 'Message',
  ref,
  ...rest
}: ChatComposerInputProps): JSX.Element {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const c = chatComposer();

  useLayoutEffect(() => {
    const el = textAreaRef.current;
    if (!el) {
      return;
    }
    el.style.height = 'auto';
    const maxHeight = maxRows * LINE_HEIGHT_PX;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, [value, maxRows]);

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) {
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const trimmed = value.trim();
      if (trimmed) {
        onSubmit(trimmed);
      }
    }
  }

  return (
    <AriaTextField
      value={value}
      onChange={onValueChange}
      isDisabled={disabled}
      aria-label={ariaLabel}
      {...mergeProps(c.inputRow)}
    >
      <TextArea
        {...rest}
        ref={mergeRefs(textAreaRef, ref)}
        {...mergeProps(c.input, className)}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        rows={1}
      />
    </AriaTextField>
  );
}
