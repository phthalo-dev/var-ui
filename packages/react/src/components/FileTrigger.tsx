import {
  cloneElement,
  isValidElement,
  useRef,
  type ChangeEvent,
  type JSX,
  type MouseEvent,
  type ReactElement,
} from 'react';

export type FileTriggerProps = {
  /** Button that opens the file picker. Must be a single element. */
  children: ReactElement;
  /** Native `accept` filter, for example `image/*`. */
  accept?: string;
  /** Allow choosing more than one file. */
  multiple?: boolean;
  /** Called with the chosen files. An empty selection is ignored. */
  onSelect: (files: File[]) => void;
  /** Disables the child when it accepts `disabled`, and does not open the picker. */
  isDisabled?: boolean;
};

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
  isDisabled?: boolean;
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
  isDisabled = false,
}: FileTriggerProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isValidElement(children)) {
    throw new Error('FileTrigger requires a single React element child');
  }

  const childProps = children.props as TriggerChildProps;

  function handleClick(event: MouseEvent<HTMLElement>) {
    childProps.onClick?.(event);
    if (isDisabled || event.defaultPrevented) return;
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
  if (isDisabled && childAcceptsDisabled(children)) {
    triggerProps.disabled = true;
    if (typeof children.type !== 'string') {
      triggerProps.isDisabled = true;
    }
  }

  return (
    <>
      {cloneElement(children, triggerProps)}
      <input
        ref={inputRef}
        type="file"
        tabIndex={-1}
        aria-hidden="true"
        accept={accept}
        multiple={multiple}
        disabled={isDisabled || undefined}
        onChange={handleChange}
        // `hidden` is display:none, which blocks the file dialog in some browsers.
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          margin: -1,
          padding: 0,
          border: 0,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
        }}
      />
    </>
  );
}
