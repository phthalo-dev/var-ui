import { useContext, type JSX, type ReactNode, type Ref } from 'react';
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
  Popover,
  Text,
  type ComboBoxProps as RACComboBoxProps,
  type ListBoxItemProps,
  type PopoverProps,
} from 'react-aria-components';
import { combobox, type ComboboxVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { ControlSizeContext, useControlSize } from './controlSizeContext';
import { mergeProps } from 'typestyles';

/** Shared across every part so `size` set on `Combobox.Root` reaches the input shell. */
function useComboboxStyles(): ReturnType<typeof combobox> {
  return combobox({ size: useControlSize() });
}

export type ComboboxOption = {
  id: string;
  label: string;
};

export type ComboboxRootProps<T extends ComboboxOption = ComboboxOption> = Omit<
  RACComboBoxProps<T>,
  'children'
> & {
  children: ReactNode;
  className?: string;
  /** Control density. @default md */
  size?: NonNullable<ComboboxVariantProps['size']>;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

/** Alias for docs and consumers referring to the root combobox props. */
export type ComboboxProps<T extends ComboboxOption = ComboboxOption> = ComboboxRootProps<T>;

function ComboboxRoot<T extends ComboboxOption>({
  children,
  className,
  size,
  ref,
  ...props
}: ComboboxRootProps<T>): JSX.Element {
  const styles = combobox({ size });
  return (
    <ControlSizeContext.Provider value={size}>
      <AriaComboBox {...props} {...mergeProps(styles.root, className)} ref={ref}>
        {children}
      </AriaComboBox>
    </ControlSizeContext.Provider>
  );
}

export type ComboboxLabelProps = {
  children: ReactNode;
  className?: string;
  /** Ref to the underlying `<label>` element. */
  ref?: Ref<HTMLLabelElement>;
};

function ComboboxLabel({ children, className, ref }: ComboboxLabelProps): JSX.Element {
  const styles = useComboboxStyles();
  return (
    <Label {...mergeProps(styles.label, className)} ref={ref}>
      {children}
    </Label>
  );
}

export type ComboboxInputProps = {
  placeholder?: string;
  className?: string;
  clearable?: boolean;
  /** Ref to the underlying `<div>` element wrapping the input. */
  ref?: Ref<HTMLDivElement>;
};

function ComboboxInput({
  placeholder,
  className,
  clearable = false,
  ref,
}: ComboboxInputProps): JSX.Element {
  const styles = useComboboxStyles();
  return (
    <Group {...mergeProps(styles.inputWrapper, className)} ref={ref}>
      <Input {...mergeProps(styles.input)} placeholder={placeholder} />
      {clearable ? <ComboboxClearButton /> : null}
    </Group>
  );
}

export type ComboboxClearButtonProps = {
  /** Ref to the underlying `<button>` element. */
  ref?: Ref<HTMLButtonElement>;
};

function ComboboxClearButton({ ref }: ComboboxClearButtonProps): JSX.Element {
  const state = useContext(ComboBoxStateContext);
  const styles = useComboboxStyles();
  const isEmpty = !state?.selectedKey && !state?.inputValue;
  return (
    <Button
      className={styles.clearButton.className}
      slot={null}
      ref={ref}
      excludeFromTabOrder
      aria-label="Clear"
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

export type ComboboxDescriptionProps = {
  children: ReactNode;
  className?: string;
  /** Ref to the underlying `<span>` element. */
  ref?: Ref<HTMLElement>;
};

function ComboboxDescription({ children, className, ref }: ComboboxDescriptionProps): JSX.Element {
  const styles = useComboboxStyles();
  return (
    <Text slot="description" {...mergeProps(styles.description, className)} ref={ref}>
      {children}
    </Text>
  );
}

export type ComboboxErrorProps = {
  children?: ReactNode;
  className?: string;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLElement>;
};

function ComboboxError({ children, className, ref }: ComboboxErrorProps): JSX.Element {
  const styles = useComboboxStyles();
  return (
    <FieldError {...mergeProps(styles.error, className)} ref={ref}>
      {children ?? ''}
    </FieldError>
  );
}

export type ComboboxPopoverProps = PopoverProps & {
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

export type ComboboxListBoxProps<T extends ComboboxOption = ComboboxOption> = {
  items: Iterable<T>;
  children: (item: T) => ReactNode;
  emptyContent?: ReactNode;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

function ComboboxListBox<T extends ComboboxOption>({
  items,
  children,
  emptyContent = 'No results',
  ref,
}: ComboboxListBoxProps<T>): JSX.Element {
  const styles = useComboboxStyles();
  return (
    <ListBox
      {...mergeProps(styles.listbox)}
      ref={ref}
      items={items}
      renderEmptyState={() => <div {...mergeProps(styles.empty)}>{emptyContent}</div>}
    >
      {children}
    </ListBox>
  );
}

export type ComboboxItemProps = ListBoxItemProps & {
  className?: string;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

function ComboboxItem({ children, className, ref, ...props }: ComboboxItemProps): JSX.Element {
  const styles = useComboboxStyles();
  return (
    <ListBoxItem {...props} {...mergeProps(styles.item, className)} ref={ref}>
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
