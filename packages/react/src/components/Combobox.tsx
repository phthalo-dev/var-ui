import { useContext, type JSX, type ReactNode } from 'react';
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
import { mergeProps } from './utils';

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
};

/** Alias for docs and consumers referring to the root combobox props. */
export type ComboboxProps<T extends ComboboxOption = ComboboxOption> = ComboboxRootProps<T>;

function ComboboxRoot<T extends ComboboxOption>({
  children,
  className,
  size,
  ...props
}: ComboboxRootProps<T>): JSX.Element {
  const styles = combobox({ size });
  return (
    <ControlSizeContext.Provider value={size}>
      <AriaComboBox {...props} {...mergeProps(styles.root, className)}>
        {children}
      </AriaComboBox>
    </ControlSizeContext.Provider>
  );
}

export type ComboboxLabelProps = { children: ReactNode; className?: string };

function ComboboxLabel({ children, className }: ComboboxLabelProps): JSX.Element {
  const styles = useComboboxStyles();
  return <Label {...mergeProps(styles.label, className)}>{children}</Label>;
}

export type ComboboxInputProps = {
  placeholder?: string;
  className?: string;
  clearable?: boolean;
};

function ComboboxInput({
  placeholder,
  className,
  clearable = false,
}: ComboboxInputProps): JSX.Element {
  const styles = useComboboxStyles();
  return (
    <Group {...mergeProps(styles.inputWrapper, className)}>
      <Input {...mergeProps(styles.input)} placeholder={placeholder} />
      {clearable ? <ComboboxClearButton /> : null}
    </Group>
  );
}

function ComboboxClearButton(): JSX.Element {
  const state = useContext(ComboBoxStateContext);
  const styles = useComboboxStyles();
  const isEmpty = !state?.selectedKey && !state?.inputValue;
  return (
    <Button
      className={styles.clearButton.className}
      slot={null}
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

export type ComboboxDescriptionProps = { children: ReactNode; className?: string };

function ComboboxDescription({ children, className }: ComboboxDescriptionProps): JSX.Element {
  const styles = useComboboxStyles();
  return (
    <Text slot="description" {...mergeProps(styles.description, className)}>
      {children}
    </Text>
  );
}

export type ComboboxErrorProps = { children?: ReactNode; className?: string };

function ComboboxError({ children, className }: ComboboxErrorProps): JSX.Element {
  const styles = useComboboxStyles();
  return <FieldError {...mergeProps(styles.error, className)}>{children ?? ''}</FieldError>;
}

export type ComboboxPopoverProps = PopoverProps & { className?: string };

function ComboboxPopover({ children, className, ...props }: ComboboxPopoverProps): JSX.Element {
  const styles = useComboboxStyles();
  return (
    <Popover {...props} {...mergeProps(styles.popover, className)}>
      {children}
    </Popover>
  );
}

export type ComboboxListBoxProps<T extends ComboboxOption = ComboboxOption> = {
  items: Iterable<T>;
  children: (item: T) => ReactNode;
  emptyContent?: ReactNode;
};

function ComboboxListBox<T extends ComboboxOption>({
  items,
  children,
  emptyContent = 'No results',
}: ComboboxListBoxProps<T>): JSX.Element {
  const styles = useComboboxStyles();
  return (
    <ListBox
      {...mergeProps(styles.listbox)}
      items={items}
      renderEmptyState={() => <div {...mergeProps(styles.empty)}>{emptyContent}</div>}
    >
      {children}
    </ListBox>
  );
}

export type ComboboxItemProps = ListBoxItemProps & { className?: string };

function ComboboxItem({ children, className, ...props }: ComboboxItemProps): JSX.Element {
  const styles = useComboboxStyles();
  return (
    <ListBoxItem {...props} {...mergeProps(styles.item, className)}>
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
