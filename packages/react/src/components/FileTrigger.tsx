import {
  cloneElement,
  isValidElement,
  useRef,
  type ChangeEvent,
  type ComponentPropsWithRef,
  type JSX,
  type MouseEvent,
  type ReactElement,
} from 'react';
import { visuallyHidden } from '@var-ui/core/components/visuallyHidden';
import { mergeProps } from 'typestyles';
import { useMergedRef } from '../overlays/useMergedRef';

export type FileTriggerProps = Omit<
  ComponentPropsWithRef<'input'>,
  'children' | 'type' | 'onSelect' | 'onChange' | 'accept' | 'multiple' | 'disabled'
> & {
  /** Button that opens the file picker. Must be a single element. */
  children: ReactElement;
  /** Native `accept` filter, for example `image/*`. */
  accept?: string;
  /** Allow choosing more than one file. */
  multiple?: boolean;
  /** Called with the chosen files. An empty selection is ignored. */
  onSelect: (files: File[]) => void;
  /** Disables the child when it accepts `disabled`, and does not open the picker. */
  disabled?: boolean;
};

// Not replaced with RAC's FileTrigger: it wraps children in a PressResponder (the
// child must be a RAC pressable, so a plain <button> would never open the picker),
// reports a FileList|null instead of File[], and has no equivalent of this
// component's disabled-child handling for arbitrary elements.

const disabledTags = new Set([
  'button',
  'fieldset',
  'input',
  'optgroup',
  'option',
  'select',
  'textarea',
]);

type TriggerChildProps = {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
};

function childAcceptsDisabled(child: ReactElement): boolean {
  if (typeof child.type !== 'string') return true;
  return disabledTags.has(child.type);
}

/**
 * Opens a file picker from an existing button. Unlike `FileInput`, this does
 * not render a label, filename, or dropzone, and it does not validate size.
 *
 * ```tsx
 * <FileTrigger accept="image/*" multiple onSelect={(files) => upload(files)}>
 *   <Button>Choose images</Button>
 * </FileTrigger>
 * ```
 */
export function FileTrigger({
  children,
  accept,
  multiple = false,
  onSelect,
  disabled = false,
  className,
  ref,
  ...rest
}: FileTriggerProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRef(inputRef, ref);

  if (!isValidElement(children)) {
    throw new Error('FileTrigger requires a single React element child');
  }

  const childProps = children.props as TriggerChildProps;

  function handleClick(event: MouseEvent<HTMLElement>) {
    childProps.onClick?.(event);
    if (disabled || event.defaultPrevented) return;
    inputRef.current?.click();
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.currentTarget.files ? Array.from(event.currentTarget.files) : [];
    // Clearing lets the same file be chosen again. Read the list first.
    event.currentTarget.value = '';
    if (files.length === 0) return;
    onSelect(files);
  }

  const triggerProps: TriggerChildProps & { onClick: (event: MouseEvent<HTMLElement>) => void } = {
    onClick: handleClick,
  };
  if (disabled && childAcceptsDisabled(children)) {
    triggerProps.disabled = true;
  }

  return (
    <>
      {cloneElement(children, triggerProps)}
      <input
        {...rest}
        ref={mergedRef}
        type="file"
        tabIndex={-1}
        aria-hidden="true"
        accept={accept}
        multiple={multiple}
        disabled={disabled || undefined}
        onChange={handleChange}
        // `hidden` is display:none, which blocks the file dialog in some browsers.
        {...mergeProps(visuallyHidden(), className)}
      />
    </>
  );
}
