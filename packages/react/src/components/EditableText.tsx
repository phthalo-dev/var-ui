import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithRef,
  type MouseEvent,
  type FocusEvent,
  type JSX,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { editableText } from '@var-ui/core/components/editableText';
import { mergeProps } from 'typestyles';

export type EditableTextActivation = 'click' | 'doubleClick' | 'focus';

export type EditableTextProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'className' | 'ref' | 'role' | 'tabIndex'
> & {
  /** Display element (for example a `Heading`). Its typography is inherited by the input. */
  children: ReactNode;
  /** Current committed text. */
  value: string;
  /** Called with the new text on Enter or blur, when it differs from `value`. */
  onCommit: (value: string) => void;
  /** Called when editing is abandoned with Escape. */
  onCancel?: () => void;
  /** Called with the draft text on every keystroke while editing. */
  onValueChange?: (value: string) => void;
  /**
   * What starts editing with the pointer. Enter and F2 always start editing from the keyboard.
   * @default doubleClick
   */
  activation?: EditableTextActivation;
  /** Prevents editing. */
  disabled?: boolean;
  /** Shows the text without allowing it to be edited. */
  readOnly?: boolean;
  /** Accessible name for the input. Defaults to the current value, or `emptyLabel` when that is empty. */
  'aria-label'?: string;
  /**
   * Accessible name of the input when there is neither `aria-label` nor a value.
   * @default 'Edit text'
   */
  emptyLabel?: string;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /**
   * Ref to the root `<div>`: the focusable element that starts editing. The `<input>` only
   * exists while editing, so it cannot own a stable ref.
   */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Text that turns into an input on demand, keeping the typography of its display element.
 *
 * ```tsx
 * <EditableText value={name} onCommit={rename}>
 *   <Heading level={1}>{name}</Heading>
 * </EditableText>
 * ```
 */
export function EditableText({
  children,
  value,
  onCommit,
  onCancel,
  onValueChange,
  activation = 'doubleClick',
  disabled = false,
  readOnly = false,
  'aria-label': ariaLabel,
  emptyLabel = 'Edit text',
  className,
  ref,
  onClick,
  onDoubleClick,
  onKeyDown,
  onFocus,
  ...rest
}: EditableTextProps): JSX.Element {
  const et = editableText();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Set once Enter/Escape finishes an edit, so the blur caused by unmounting the input is ignored.
  const isSettledRef = useRef(false);
  const restoreFocusRef = useRef(false);
  const canEdit = !disabled && !readOnly;
  const isActive = isEditing && canEdit;

  // Losing the ability to edit mid-edit discards the draft, so it can't commit later.
  useEffect(() => {
    if (!canEdit) {
      isSettledRef.current = true;
      setIsEditing(false);
    }
  }, [canEdit]);

  useEffect(() => {
    if (isActive) {
      inputRef.current?.focus();
      inputRef.current?.select();
    } else if (restoreFocusRef.current) {
      restoreFocusRef.current = false;
      rootRef.current?.focus();
    }
  }, [isActive]);

  const startEditing = () => {
    if (!canEdit || isActive) return;
    isSettledRef.current = false;
    setDraft(value);
    setIsEditing(true);
  };

  const finish = (shouldCommit: boolean, restoreFocus: boolean) => {
    if (isSettledRef.current) return;
    isSettledRef.current = true;
    // Returning focus to the root would immediately re-enter edit mode when activation is "focus".
    restoreFocusRef.current = restoreFocus && activation !== 'focus';
    setIsEditing(false);
    if (shouldCommit) {
      if (draft !== value) onCommit(draft);
    } else {
      onCancel?.();
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      finish(true, true);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      // Keep ancestors (menus, popovers) from also dismissing on this Escape.
      event.stopPropagation();
      finish(false, true);
    }
  };

  const handleRootKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (isActive || event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === 'F2') {
      event.preventDefault();
      startEditing();
    }
  };

  const handleRootFocus = (event: FocusEvent<HTMLDivElement>) => {
    onFocus?.(event);
    if (activation === 'focus' && event.target === event.currentTarget) startEditing();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraft(event.target.value);
    onValueChange?.(event.target.value);
  };

  const input = (
    <input
      {...mergeProps(et.input)}
      ref={inputRef}
      type="text"
      value={draft}
      aria-label={ariaLabel || value || emptyLabel}
      onChange={handleChange}
      onKeyDown={handleInputKeyDown}
      onBlur={() => finish(true, false)}
    />
  );

  let content: ReactNode = children;
  if (isActive) {
    content = isValidElement(children)
      ? cloneElement(children as ReactElement<{ children?: ReactNode }>, { children: input })
      : input;
  }

  return (
    <div
      {...rest}
      {...mergeProps(et.root, className)}
      ref={(node) => {
        rootRef.current = node;
        if (typeof ref === 'function') return ref(node);
        if (ref) ref.current = node;
      }}
      role={canEdit ? 'group' : undefined}
      aria-label={canEdit && !isActive ? ariaLabel : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={canEdit && !isActive ? 0 : undefined}
      onClick={(event: MouseEvent<HTMLDivElement>) => {
        onClick?.(event);
        if (canEdit && activation === 'click') startEditing();
      }}
      onDoubleClick={(event: MouseEvent<HTMLDivElement>) => {
        onDoubleClick?.(event);
        if (canEdit && activation === 'doubleClick') startEditing();
      }}
      onKeyDown={handleRootKeyDown}
      onFocus={handleRootFocus}
    >
      {content}
    </div>
  );
}
