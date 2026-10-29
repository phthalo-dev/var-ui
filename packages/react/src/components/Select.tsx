import { type ComponentPropsWithRef, type JSX, type ReactNode, type Ref } from 'react';
import {
  Button as AriaButton,
  FieldError,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
  Text,
  type ListBoxItemProps,
  type PopoverProps,
  type SelectProps as RACSelectProps,
  type SelectValueProps as RACSelectValueProps,
} from 'react-aria-components';
import { select } from '@var-ui/core/components/select';
import type { SelectVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { ControlSizeContext, useControlSize } from '../internal/controlSizeContext';
import type { FieldMeta } from './Field';
import { RacFieldFrame, racInvalid } from './FieldFrame';
import { pickRacDroppedDomProps, racRenderWithExtras } from '../internal/racDomProps';
import { splitRacFieldProps } from '../internal/racFieldProps';
import { mergeProps } from 'typestyles';

/** Shared across every part so `size` set on `Select.Root` reaches the trigger. */
function useSelectStyles(): ReturnType<typeof select> {
  return select({ size: useControlSize() });
}

export type SelectOption = {
  /** Unique option identifier passed to the select value. */
  id: string;
  /** Visible label in the trigger and listbox. */
  label: string;
};

export type SelectRootProps<T extends object = SelectOption> = Omit<
  RACSelectProps<T>,
  'children' | 'className'
> & {
  children: ReactNode;
  className?: string;
  /** Control density. @default md */
  size?: NonNullable<SelectVariantProps['size']>;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

function SelectRoot<T extends object>({
  children,
  className,
  size,
  ref,
  ...props
}: SelectRootProps<T>): JSX.Element {
  const contextSize = useControlSize();
  const resolvedSize = size ?? contextSize;
  const s = select({ size: resolvedSize });
  return (
    <ControlSizeContext.Provider value={resolvedSize}>
      <AriaSelect {...props} {...mergeProps(s.root, className)} ref={ref}>
        {children}
      </AriaSelect>
    </ControlSizeContext.Provider>
  );
}

export type SelectLabelProps = Omit<ComponentPropsWithRef<'label'>, 'children' | 'className'> & {
  children: ReactNode;
  className?: string;
};

function SelectLabel({ children, className, ref, ...rest }: SelectLabelProps): JSX.Element {
  const s = useSelectStyles();
  return (
    <Label {...rest} {...mergeProps(s.label, className)} ref={ref}>
      {children}
    </Label>
  );
}

export type SelectValueProps<T extends object = SelectOption> = Omit<
  ComponentPropsWithRef<'span'>,
  'children' | 'className'
> & {
  /** Placeholder when no value is selected. @default Select… */
  placeholder?: string;
  className?: string;
  /** Custom closed-trigger content. Receives RAC `SelectValue` render props. */
  children?: RACSelectValueProps<T>['children'];
};

function SelectValue<T extends object = SelectOption>({
  placeholder = 'Select…',
  className,
  children,
  ref,
  ...rest
}: SelectValueProps<T>): JSX.Element {
  const s = useSelectStyles();
  return (
    <AriaSelectValue {...(rest as object)} {...mergeProps(s.selectValue, className)} ref={ref}>
      {children ??
        (({ defaultChildren, isPlaceholder }) => (isPlaceholder ? placeholder : defaultChildren))}
    </AriaSelectValue>
  );
}

export type SelectTriggerProps = Omit<ComponentPropsWithRef<'button'>, 'children' | 'className'> & {
  /** Placeholder when no value is selected. Ignored when `children` is set. @default Select… */
  placeholder?: string;
  className?: string;
  /** Replace the default `Select.Value`. Compose `Select.Value` for a custom closed value. */
  children?: ReactNode;
};

function SelectTrigger({
  placeholder = 'Select…',
  className,
  children,
  ref,
  ...rest
}: SelectTriggerProps): JSX.Element {
  const s = useSelectStyles();
  return (
    <AriaButton
      {...(rest as object)}
      {...mergeProps(s.trigger, className)}
      render={racRenderWithExtras('button', pickRacDroppedDomProps(rest)) as never}
      ref={ref}
    >
      {children ?? <SelectValue placeholder={placeholder} />}
      <span {...mergeProps(s.triggerIcon)} aria-hidden>
        <Icon name="chevronDown" size="sm" />
      </span>
    </AriaButton>
  );
}

export type SelectDescriptionProps = Omit<
  ComponentPropsWithRef<'span'>,
  'children' | 'className'
> & {
  children: ReactNode;
  className?: string;
};

function SelectDescription({
  children,
  className,
  ref,
  ...rest
}: SelectDescriptionProps): JSX.Element {
  const s = useSelectStyles();
  return (
    <Text
      {...(rest as object)}
      slot="description"
      {...mergeProps(s.description, className)}
      ref={ref}
    >
      {children}
    </Text>
  );
}

export type SelectErrorProps = Omit<ComponentPropsWithRef<'span'>, 'children' | 'className'> & {
  children?: ReactNode;
  className?: string;
};

function SelectError({ children, className, ref, ...rest }: SelectErrorProps): JSX.Element {
  const s = useSelectStyles();
  return (
    <FieldError {...(rest as object)} {...mergeProps(s.error, className)} ref={ref}>
      {children ?? ''}
    </FieldError>
  );
}

export type SelectPopoverProps = PopoverProps & {
  className?: string;
  /**
   * Element the dropdown listbox portals into instead of `document.body`. Needed when a
   * subtree renders under a different theme than the page ambient (the theme's CSS custom
   * properties only cascade to descendants of the themed element).
   */
  portalContainer?: Element;
  /** Ref to the underlying popover `<div>` element. */
  ref?: Ref<HTMLElement>;
};

function SelectPopover({
  children,
  className,
  portalContainer,
  ref,
  ...props
}: SelectPopoverProps): JSX.Element {
  const s = useSelectStyles();
  return (
    <Popover
      {...props}
      {...mergeProps(s.popover, className)}
      ref={ref}
      UNSTABLE_portalContainer={portalContainer}
    >
      {children}
    </Popover>
  );
}

type SelectListBoxBaseProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'className' | 'onSelect'
> & {
  className?: string;
};

export type SelectListBoxProps<T extends object = SelectOption> =
  | (SelectListBoxBaseProps & {
      items: Iterable<T>;
      children: (item: T) => ReactNode;
    })
  | (SelectListBoxBaseProps & {
      items?: never;
      children: ReactNode;
    });

function SelectListBox<T extends object>({
  items,
  children,
  className,
  ref,
  ...rest
}: SelectListBoxProps<T>): JSX.Element {
  const s = useSelectStyles();
  const listBoxProps = { ...rest, ...mergeProps(s.listbox, className) } as object;
  if (items != null) {
    return (
      <ListBox {...listBoxProps} items={items} ref={ref}>
        {children as (item: T) => ReactNode}
      </ListBox>
    );
  }
  return (
    <ListBox {...listBoxProps} ref={ref}>
      {children as ReactNode}
    </ListBox>
  );
}

export type SelectItemProps = ListBoxItemProps & {
  className?: string;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

function SelectItem({ children, className, ref, ...props }: SelectItemProps): JSX.Element {
  const s = useSelectStyles();
  return (
    <ListBoxItem {...props} {...mergeProps(s.item, className)} ref={ref}>
      {children}
    </ListBoxItem>
  );
}

/**
 * RAC-owned `Select` root props (state, validation, labelling). They keep their RAC names until
 * the vocabulary PR. Every other attribute on the assembled `Select` lands on the trigger button.
 */
const SELECT_ROOT_KEYS = [
  'selectedKey',
  'defaultSelectedKey',
  'onSelectionChange',
  'selectionMode',
  'isOpen',
  'defaultOpen',
  'onOpenChange',
  'disabledKeys',
  'name',
  'form',
  'autoComplete',
  'autoFocus',
  'onFocus',
  'onBlur',
  'onFocusChange',
  'onKeyDown',
  'onKeyUp',
  'style',
  'slot',
  'excludeFromTabOrder',
] as const satisfies readonly (keyof RACSelectProps<SelectOption>)[];

type SelectRootKey =
  | (typeof SELECT_ROOT_KEYS)[number]
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'isDisabled'
  | 'isRequired'
  | 'isInvalid'
  | 'validate'
  | 'validationBehavior'
  | 'id'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-describedby'
  | 'aria-details';

export type SelectProps = Pick<RACSelectProps<SelectOption>, SelectRootKey> &
  Omit<
    ComponentPropsWithRef<'button'>,
    SelectRootKey | 'children' | 'className' | 'ref' | 'type' | 'disabled' | 'placeholder'
  > &
  FieldMeta & {
    /** Options shown in the dropdown listbox. */
    options: SelectOption[];
    /** Placeholder text when no value is selected. @default Select… */
    placeholder?: string;
    /**
     * Element the dropdown listbox portals into instead of `document.body`. Needed when a
     * subtree renders under a different theme than the page ambient (the theme's CSS custom
     * properties only cascade to descendants of the themed element).
     */
    portalContainer?: Element;
    /** Additional CSS class names merged onto the root. */
    className?: string;
    /** Control density. Falls back to the surrounding control size, then `md`. */
    size?: NonNullable<SelectVariantProps['size']>;
    /** Ref to the trigger `<button>` element. */
    ref?: Ref<HTMLButtonElement>;
  };

/**
 * Dropdown single-select. `Select` with `options` is the assembled preset. `className` and
 * `style` style the root; `ref` and native attributes (`data-*`, `title`, `onClick`, ...) reach
 * the trigger `<button>`. Compose `Root`, `Trigger`, `Value`, `Popover`, `ListBox`, and `Item`
 * for custom rows.
 */
function Select({
  label,
  description,
  errorMessage,
  options,
  placeholder = 'Select…',
  portalContainer,
  className,
  size,
  ref,
  ...props
}: SelectProps): JSX.Element {
  const contextSize = useControlSize();
  const resolvedSize = size ?? contextSize;
  const s = select({ size: resolvedSize });
  const [rootProps, triggerProps] = splitRacFieldProps(props, SELECT_ROOT_KEYS);
  return (
    <SelectRoot
      {...(rootProps as object)}
      className={className}
      size={resolvedSize}
      isInvalid={racInvalid(rootProps.isInvalid, errorMessage)}
    >
      <RacFieldFrame slots={s} label={label} description={description} errorMessage={errorMessage}>
        <SelectTrigger {...(triggerProps as object)} placeholder={placeholder} ref={ref} />
      </RacFieldFrame>
      <SelectPopover portalContainer={portalContainer}>
        <SelectListBox>
          {options.map((option) => (
            <SelectItem key={option.id} id={option.id} textValue={option.label}>
              {option.label}
            </SelectItem>
          ))}
        </SelectListBox>
      </SelectPopover>
    </SelectRoot>
  );
}

export const SelectNamespace = Object.assign(Select, {
  Root: SelectRoot,
  Label: SelectLabel,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Description: SelectDescription,
  Error: SelectError,
  Popover: SelectPopover,
  ListBox: SelectListBox,
  Item: SelectItem,
});

export { SelectNamespace as Select };
