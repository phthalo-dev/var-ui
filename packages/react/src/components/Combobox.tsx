import {
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
  Popover,
  Text,
  type ComboBoxProps as RACComboBoxProps,
  type ListBoxItemProps,
  type PopoverProps,
} from 'react-aria-components';
import { combobox } from '@var-ui/core/components/combobox';
import type { ComboboxVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { ControlSizeContext, useControlSize } from '../internal/controlSizeContext';
import { pickRacDroppedDomProps, racRenderWithExtras } from '../internal/racDomProps';
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
  const contextSize = useControlSize();
  const resolvedSize = size ?? contextSize;
  const styles = combobox({ size: resolvedSize });
  return (
    <ControlSizeContext.Provider value={resolvedSize}>
      <AriaComboBox {...props} {...mergeProps(styles.root, className)} ref={ref}>
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

export type ComboboxListBoxProps<T extends ComboboxOption = ComboboxOption> = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'className' | 'onSelect'
> & {
  className?: string;
  items: Iterable<T>;
  children: (item: T) => ReactNode;
  /** Shown when no option matches. @default No results */
  emptyContent?: ReactNode;
};

function ComboboxListBox<T extends ComboboxOption>({
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
