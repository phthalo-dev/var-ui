import { useLayoutEffect, useRef, type JSX, type KeyboardEvent, type Ref } from 'react';
import { TextArea, TextField as AriaTextField } from 'react-aria-components';
import { chatComposer } from '@var-ui/core/components/chat/chatComposer';
import { mergeProps } from 'typestyles';

export type ChatComposerInputProps = {
  /** Controlled value. */
  value: string;
  /** Change handler. */
  onChange: (value: string) => void;
  /** Submit handler — called with the trimmed value on Enter (without Shift). */
  onSubmit: (value: string) => void;
  /** Placeholder text. @default 'Type a message…' */
  placeholder?: string;
  /** Max rows before the textarea scrolls instead of growing. @default 8 */
  maxRows?: number;
  /** Disabled state. @default false */
  isDisabled?: boolean;
  /** Additional CSS class names merged onto the textarea. */
  className?: string;
  /** Ref to the underlying root `<div>` element (the textarea's field wrapper). */
  ref?: Ref<HTMLDivElement>;
};

const LINE_HEIGHT_PX = 22;

/**
 * Auto-resizing message textarea. Enter submits (trimmed, non-empty only);
 * Shift+Enter inserts a newline.
 *
 * ```tsx
 * <ChatComposerInput value={value} onChange={setValue} onSubmit={sendMessage} />
 * ```
 */
export function ChatComposerInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Type a message…',
  maxRows = 8,
  isDisabled = false,
  className,
  ref,
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
      onChange={onChange}
      isDisabled={isDisabled}
      aria-label="Message"
      {...mergeProps(c.inputRow)}
      ref={ref}
    >
      <TextArea
        ref={textAreaRef}
        {...mergeProps(c.input, className)}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        rows={1}
      />
    </AriaTextField>
  );
}
