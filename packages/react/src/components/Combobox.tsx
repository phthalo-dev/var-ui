import {
  Fragment,
  useContext,
  type ComponentPropsWithRef,
  type CSSProperties,
  type JSX,
  type ReactNode,
  type Ref,
} from 'react';
import {
  Button,
  ComboBox as AriaComboBox,
  ComboBoxStateContext,
  FieldError,
  Group,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Text,
  type ComboBoxProps as RACComboBoxProps,
  type Key,
  type PopoverProps,
} from 'react-aria-components';
import { Popover } from '../internal/nativeDialogShim';
import { combobox } from '@var-ui/core/components/combobox';
import type { ComboboxVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { ControlSizeContext, useControlSize } from '../internal/controlSizeContext';
import { pickRacDroppedDomProps, racRenderWithExtras } from '../internal/racDomProps';
import {
  keyToValueOrNull,
  racItemProps,
  selectedKeyProps,
  toRacProps,
  type Option,
} from '../internal/racProps';
import { mergeProps } from 'typestyles';

/** Shared across every part so `size` set on `Combobox.Root` reaches the input shell. */
function useComboboxStyles(): ReturnType<typeof combobox> {
  return combobox({ size: useControlSize() });
}

/** `{ value, label, disabled? }`, the option shape shared by every VarUI collection. */
export type ComboboxOption = Option;

export type ComboboxRootProps = {
  children: ReactNode;
  /** Controlled selected option value. `null` means controlled-empty. */
  value?: string | null;
  /** Initially selected option value when uncontrolled. */
  defaultValue?: string | null;
  /** Called with the selected option value, or `null` when the selection is cleared. */
  onValueChange?: (value: string | null) => void;
  /** Controlled text in the input. */
  inputValue?: string;
  /** Initial text in the input when uncontrolled. */
  defaultInputValue?: string;
  /** Called when the input text changes. */
  onInputChange?: (value: string) => void;
  /** Called when the listbox opens or closes. */
  onOpenChange?: (open: boolean, trigger?: 'focus' | 'input' | 'manual') => void;
  /** Filter deciding whether an option's text matches the input. Defaults to a locale-aware "contains". */
  defaultFilter?: (textValue: string, inputValue: string) => boolean;
  /** Whether the option value or the input text is submitted with a form. @default 'key' */
  formValue?: 'text' | 'key';
  /** Allow values that are not in the list. */
  allowsCustomValue?: boolean;
  /** Keep the popover open when no option matches. */
  allowsEmptyCollection?: boolean;
  /** When the listbox opens. @default 'input' */
  menuTrigger?: 'focus' | 'input' | 'manual';
  /** Wrap keyboard focus from the last option to the first. */
  shouldFocusWrap?: boolean;
  /** Disables the combobox. */
  disabled?: boolean;
  /** Makes the combobox read-only. */
  readOnly?: boolean;
  /** Marks the combobox required for form validation. */
  required?: boolean;
  /** Shows the error state. */
  invalid?: boolean;
  /** Custom validation; return a message (or messages) to mark the field invalid. */
  validate?: (state: {
    /** Text currently in the input. */
    inputValue: string;
    /** Selected option value, or `null` when nothing is selected. */
    value: string | null;
  }) => string | string[] | true | null | undefined;
  /** `native` uses browser constraint validation; `aria` validates on the fly. @default native */
  validationBehavior?: 'native' | 'aria';
  /** Name submitted with a form. */
  name?: string;
  /** Id of the form the combobox belongs to. */
  form?: string;
  autoFocus?: boolean;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-details'?: string;
  onFocus?: RACComboBoxProps<ComboboxOption>['onFocus'];
  onBlur?: RACComboBoxProps<ComboboxOption>['onBlur'];
  onFocusChange?: RACComboBoxProps<ComboboxOption>['onFocusChange'];
  onKeyDown?: RACComboBoxProps<ComboboxOption>['onKeyDown'];
  onKeyUp?: RACComboBoxProps<ComboboxOption>['onKeyUp'];
  className?: string;
  style?: CSSProperties;
  /** Control density. @default md */
  size?: NonNullable<ComboboxVariantProps['size']>;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

/** Alias for docs and consumers referring to the root combobox props. */
export type ComboboxProps = ComboboxRootProps;

/**
 * Converts VarUI combobox props to RAC `ComboBox` props. `value` is the selected option value
 * (RAC `selectedKey`).
 */
function racComboboxProps({
  value,
  defaultValue,
  onValueChange,
  disabled,
  readOnly,
  required,
  invalid,
  validate,
  ...rest
}: Omit<
  ComboboxRootProps,
  'children' | 'className' | 'size' | 'ref'
>): RACComboBoxProps<ComboboxOption> {
  return {
    ...rest,
    ...selectedKeyProps({ value, defaultValue, onValueChange }),
    ...toRacProps({ disabled, readOnly, required, invalid }),
    ...(validate
      ? {
          validate: ({
            inputValue,
            selectedKey,
          }: {
            inputValue: string;
            selectedKey: Key | null;
          }) => validate({ inputValue, value: keyToValueOrNull(selectedKey) }),
        }
      : {}),
  } as RACComboBoxProps<ComboboxOption>;
}

function ComboboxRoot({
  children,
  className,
  size,
  ref,
  ...props
}: ComboboxRootProps): JSX.Element {
  const contextSize = useControlSize();
  const resolvedSize = size ?? contextSize;
  const styles = combobox({ size: resolvedSize });
  return (
    <ControlSizeContext.Provider value={resolvedSize}>
      <AriaComboBox {...racComboboxProps(props)} {...mergeProps(styles.root, className)} ref={ref}>
        {children}
      </AriaComboBox>
    </ControlSizeContext.Provider>
  );
}

export type ComboboxLabelProps = Omit<ComponentPropsWithRef<'label'>, 'children' | 'className'> & {
  children: ReactNode;
  className?: string;
};

function ComboboxLabel({ children, className, ref, ...rest }: ComboboxLabelProps): JSX.Element {
  const styles = useComboboxStyles();
  return (
    <Label {...rest} {...mergeProps(styles.label, className)} ref={ref}>
      {children}
    </Label>
  );
}

export type ComboboxInputProps = Omit<
  ComponentPropsWithRef<'input'>,
  'className' | 'style' | 'children' | 'size' | 'value' | 'defaultValue' | 'onChange'
> & {
  /** Merged onto the wrapper that holds the input and the clear button. */
  className?: string;
  /** Applied to the wrapper that holds the input and the clear button. */
  style?: CSSProperties;
  clearable?: boolean;
  /** Accessible name for the clear button. @default Clear */
  clearLabel?: string;
};

/**
 * Text input with an optional clear button. `className`/`style` style the wrapper;
 * `ref` and every other attribute reach the `<input>`.
 */
function ComboboxInput({
  className,
  style,
  clearable = false,
  clearLabel = 'Clear',
  ref,
  ...rest
}: ComboboxInputProps): JSX.Element {
  const styles = useComboboxStyles();
  return (
    <Group {...mergeProps(styles.inputWrapper, className)} style={style}>
      <Input {...rest} {...mergeProps(styles.input)} ref={ref} />
      {clearable ? <ComboboxClearButton aria-label={clearLabel} /> : null}
    </Group>
  );
}

export type ComboboxClearButtonProps = Omit<
  ComponentPropsWithRef<'button'>,
  'className' | 'children'
> & {
  className?: string;
};

function ComboboxClearButton({ className, ref, ...rest }: ComboboxClearButtonProps): JSX.Element {
  const state = useContext(ComboBoxStateContext);
  const styles = useComboboxStyles();
  const isEmpty = !state?.selectedKey && !state?.inputValue;
  return (
    <Button
      aria-label="Clear"
      {...(rest as object)}
      {...mergeProps(styles.clearButton, className)}
      render={racRenderWithExtras('button', pickRacDroppedDomProps(rest)) as never}
      slot={null}
      ref={ref}
      excludeFromTabOrder
      isDisabled={isEmpty}
      onPress={() => {
        state?.setSelectedKey(null);
        state?.setInputValue('');
      }}
    >
      <Icon name="close" size="sm" />
    </Button>
  );
}

export type ComboboxDescriptionProps = Omit<
  ComponentPropsWithRef<'span'>,
  'children' | 'className'
> & {
  children: ReactNode;
  className?: string;
};

function ComboboxDescription({
  children,
  className,
  ref,
  ...rest
}: ComboboxDescriptionProps): JSX.Element {
  const styles = useComboboxStyles();
  return (
    <Text
      {...(rest as object)}
      slot="description"
      {...mergeProps(styles.description, className)}
      ref={ref}
    >
      {children}
    </Text>
  );
}

export type ComboboxErrorProps = Omit<ComponentPropsWithRef<'span'>, 'children' | 'className'> & {
  children?: ReactNode;
  className?: string;
};

function ComboboxError({ children, className, ref, ...rest }: ComboboxErrorProps): JSX.Element {
  const styles = useComboboxStyles();
  return (
    <FieldError {...(rest as object)} {...mergeProps(styles.error, className)} ref={ref}>
      {children ?? ''}
    </FieldError>
  );
}

/**
 * Placement/behaviour props of the popover. Open state is owned by the combobox, and RAC's
 * `is*` state props are not part of the public API.
 */
export type ComboboxPopoverProps = Omit<
  PopoverProps,
  | 'className'
  | 'isOpen'
  | 'defaultOpen'
  | 'onOpenChange'
  | 'isEntering'
  | 'isExiting'
  | 'isKeyboardDismissDisabled'
  | 'isNonModal'
> & {
  className?: string;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLElement>;
};

function ComboboxPopover({
  children,
  className,
  ref,
  ...props
}: ComboboxPopoverProps): JSX.Element {
  const styles = useComboboxStyles();
  return (
    <Popover {...props} {...mergeProps(styles.popover, className)} ref={ref}>
      {children}
    </Popover>
  );
}

export type ComboboxListBoxProps<T extends { value: string; label: ReactNode } = ComboboxOption> =
  Omit<ComponentPropsWithRef<'div'>, 'children' | 'className' | 'onSelect'> & {
    className?: string;
    /** Options to render; map each to a `Combobox.Item` in `children`. */
    items: Iterable<T>;
    children: (item: T) => ReactNode;
    /** Shown when no option matches. @default No results */
    emptyContent?: ReactNode;
  };

function ComboboxListBox<T extends { value: string; label: ReactNode }>({
  items,
  children,
  className,
  emptyContent = 'No results',
  ref,
  ...rest
}: ComboboxListBoxProps<T>): JSX.Element {
  const styles = useComboboxStyles();
  return (
    <ListBox
      {...(rest as object)}
      {...mergeProps(styles.listbox, className)}
      ref={ref}
      renderEmptyState={() => <div {...mergeProps(styles.empty)}>{emptyContent}</div>}
    >
      {/* Static rows, keyed by `value`: RAC's dynamic `items` mode would inject its own `value` prop (the item object) into `Combobox.Item`. */}
      {Array.from(items, (item) => (
        <Fragment key={item.value}>{children(item)}</Fragment>
      ))}
    </ListBox>
  );
}

export type ComboboxItemProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'className' | 'id' | 'value'
> & {
  /** Option value; this is what `value` / `onValueChange` carry. */
  value: string;
  /** Prevents selecting this option. */
  disabled?: boolean;
  /** Plain-text form of the row for filtering and typeahead. Defaults to the text of `children`, else `value`. */
  textValue?: string;
  children: ReactNode;
  className?: string;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

function ComboboxItem({
  children,
  className,
  value,
  disabled,
  textValue,
  ref,
  ...rest
}: ComboboxItemProps): JSX.Element {
  const styles = useComboboxStyles();
  return (
    <ListBoxItem
      {...(rest as object)}
      {...racItemProps({
        value,
        label: textValue ?? (typeof children === 'string' ? children : value),
        disabled,
      })}
      {...mergeProps(styles.item, className)}
      ref={ref}
    >
      {children}
    </ListBoxItem>
  );
}

/**
 * Headless combobox primitive for search-as-you-type inputs, autocompletes, and
 * custom select variants. Compose `Root`, `Label`, `Input`, `Popover`, `ListBox`, and `Item`.
 */
export const Combobox = Object.assign(ComboboxRoot, {
  Root: ComboboxRoot,
  Label: ComboboxLabel,
  Input: ComboboxInput,
  ClearButton: ComboboxClearButton,
  Description: ComboboxDescription,
  Error: ComboboxError,
  Popover: ComboboxPopover,
  ListBox: ComboboxListBox,
  Item: ComboboxItem,
});
