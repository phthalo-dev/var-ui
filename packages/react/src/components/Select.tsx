import {
  type ComponentProps,
  type ComponentPropsWithRef,
  type CSSProperties,
  type JSX,
  type ReactNode,
  type Ref,
} from 'react';
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
  type SelectProps as RACSelectProps,
} from 'react-aria-components';
import { select } from '@var-ui/core/components/select';
import type { SelectVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { ControlSizeContext, useControlSize } from '../internal/controlSizeContext';
import type { FieldMeta } from './Field';
import { RacFieldFrame, racInvalid } from './FieldFrame';
import { pickRacDroppedDomProps, racRenderWithExtras } from '../internal/racDomProps';
import {
  multiValueProps,
  optionTextValue,
  racItemProps,
  singleValueProps,
  toRacProps,
  type Option,
} from '../internal/racProps';
import { mergeProps } from 'typestyles';

/** Shared across every part so `size` set on `Select.Root` reaches the trigger. */
function useSelectStyles(): ReturnType<typeof select> {
  return select({ size: useControlSize() });
}

/** `{ value, label, disabled? }`, the option shape shared by every VarUI collection. */
export type SelectOption = Option;

/** Single-selection value props (default). `null` means nothing is selected. */
type SelectSingleProps = {
  /** Allow several options. @default false */
  multiple?: false;
  /** Controlled selected value. */
  value?: string | null;
  /** Initially selected value when uncontrolled. */
  defaultValue?: string | null;
  /** Called with the selected option value. */
  onValueChange?: (value: string | null) => void;
};

/** Multiple-selection value props. */
type SelectMultipleProps = {
  /** Allow several options. */
  multiple: true;
  /** Controlled selected values. */
  value?: string[];
  /** Initially selected values when uncontrolled. */
  defaultValue?: string[];
  /** Called with the selected option values. */
  onValueChange?: (value: string[]) => void;
};

/** `value` / `defaultValue` / `onValueChange`: `string` for single, `string[]` when `multiple`. */
export type SelectSelectionProps = SelectSingleProps | SelectMultipleProps;

/** State props shared by `Select` and `Select.Root`. */
type SelectStateProps = {
  /** Disables the select. */
  disabled?: boolean;
  /** Marks the select required for form validation. */
  required?: boolean;
  /** Shows the error state. On `Select` it defaults to `Boolean(errorMessage)`. */
  invalid?: boolean;
  /** Controlled open state of the listbox. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the listbox opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Custom validation of the selected value(s); return a message to mark it invalid. */
  validate?: (value: string | string[] | null) => string | string[] | true | null | undefined;
  /** `native` uses browser constraint validation; `aria` validates on the fly. @default native */
  validationBehavior?: 'native' | 'aria';
};

export type SelectRootProps = SelectStateProps &
  SelectSelectionProps & {
    children: ReactNode;
    /** Classes for the root element. */
    className?: string;
    /** Inline style for the root element. */
    style?: CSSProperties;
    /** Control density. @default md */
    size?: NonNullable<SelectVariantProps['size']>;
    /** Name submitted with a form. */
    name?: string;
    /** Id of the form the select belongs to. */
    form?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    id?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    /** Ref to the underlying `<div>` element. */
    ref?: Ref<HTMLDivElement>;
  };

/** Converts VarUI select state + selection props to the RAC root's props. */
function racSelectRootProps({
  multiple,
  value,
  defaultValue,
  onValueChange,
  disabled,
  required,
  invalid,
  open,
  validate,
  ...rest
}: SelectStateProps & SelectSelectionProps) {
  const selection = multiple
    ? multiValueProps({
        value: value as string[] | undefined,
        defaultValue: defaultValue as string[] | undefined,
        onValueChange: onValueChange as ((value: string[]) => void) | undefined,
      })
    : singleValueProps({
        value: value as string | null | undefined,
        defaultValue: defaultValue as string | null | undefined,
        onValueChange: onValueChange as ((value: string | null) => void) | undefined,
      });
  return {
    ...toRacProps({ disabled, required, invalid, open, validate }),
    ...rest,
    ...selection,
    selectionMode: multiple ? ('multiple' as const) : ('single' as const),
  };
}

function SelectRoot({ children, className, size, ref, ...props }: SelectRootProps): JSX.Element {
  const contextSize = useControlSize();
  const resolvedSize = size ?? contextSize;
  const s = select({ size: resolvedSize });
  return (
    <ControlSizeContext.Provider value={resolvedSize}>
      <AriaSelect
        {...(racSelectRootProps(props) as RACSelectProps<object, 'single'>)}
        {...mergeProps(s.root, className)}
        ref={ref}
      >
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

export type SelectValueProps = Omit<ComponentPropsWithRef<'span'>, 'children' | 'className'> & {
  /** Placeholder when no value is selected. @default Select… */
  placeholder?: string;
  className?: string;
  /** Custom closed-trigger content, or a function of the default content and placeholder state. */
  children?:
    | ReactNode
    | ((state: {
        defaultChildren: ReactNode;
        isPlaceholder: boolean;
        selectedText: string;
      }) => ReactNode);
};

function SelectValue({
  placeholder = 'Select…',
  className,
  children,
  ref,
  ...rest
}: SelectValueProps): JSX.Element {
  const s = useSelectStyles();
  return (
    <AriaSelectValue {...(rest as object)} {...mergeProps(s.selectValue, className)} ref={ref}>
      {typeof children === 'function'
        ? (state) =>
            children({
              defaultChildren: state.defaultChildren,
              isPlaceholder: state.isPlaceholder,
              selectedText: state.selectedText,
            })
        : (children ??
          (({ defaultChildren, isPlaceholder }) =>
            isPlaceholder ? placeholder : defaultChildren))}
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

export type SelectPopoverProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'className' | 'style'
> & {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Side and alignment of the listbox relative to the trigger. @default 'bottom start' */
  placement?: ComponentProps<typeof Popover>['placement'];
  /** Gap between trigger and listbox in px. */
  offset?: number;
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
      {...(props as object)}
      {...mergeProps(s.popover, className)}
      ref={ref}
      UNSTABLE_portalContainer={portalContainer}
    >
      {children}
    </Popover>
  );
}

export type SelectListBoxProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'className'> & {
  /** `Select.Item` rows. */
  children: ReactNode;
  className?: string;
};

function SelectListBox({ children, className, ref, ...rest }: SelectListBoxProps): JSX.Element {
  const s = useSelectStyles();
  return (
    <ListBox {...(rest as object)} {...mergeProps(s.listbox, className)} ref={ref}>
      {children}
    </ListBox>
  );
}

export type SelectItemProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'className' | 'id' | 'value'
> & {
  /** Option value; this is what `value` / `onValueChange` carry. */
  value: string;
  /** Prevents selecting this option. */
  disabled?: boolean;
  /** Plain-text form of the row for typeahead and the trigger. Defaults to `value`. */
  textValue?: string;
  children: ReactNode;
  className?: string;
};

function SelectItem({
  children,
  className,
  value,
  disabled,
  textValue,
  ref,
  ...rest
}: SelectItemProps): JSX.Element {
  const s = useSelectStyles();
  return (
    <ListBoxItem
      {...(rest as object)}
      {...racItemProps({ value, label: textValue ?? value, disabled })}
      {...mergeProps(s.item, className)}
      ref={ref}
    >
      {children}
    </ListBoxItem>
  );
}

/**
 * Root-level keys of the assembled `Select` (VarUI names). They reach the select root; every
 * other attribute on the assembled `Select` lands on the trigger button.
 */
const SELECT_ROOT_KEYS = [
  'multiple',
  'open',
  'defaultOpen',
  'onOpenChange',
  'name',
  'form',
  'autoComplete',
  'autoFocus',
  'onFocus',
  'onBlur',
  'onKeyDown',
  'onKeyUp',
  'style',
  'excludeFromTabOrder',
] as const;

type SelectRootKey = (typeof SELECT_ROOT_KEYS)[number];

const ROOT_KEY_SET = new Set<string>([
  ...SELECT_ROOT_KEYS,
  'value',
  'defaultValue',
  'onValueChange',
  'disabled',
  'required',
  'invalid',
  'validate',
  'validationBehavior',
  'id',
  'aria-label',
  'aria-labelledby',
  'aria-describedby',
]);

export type SelectProps = Omit<
  ComponentPropsWithRef<'button'>,
  | SelectRootKey
  | 'value'
  | 'defaultValue'
  | 'disabled'
  | 'children'
  | 'className'
  | 'ref'
  | 'type'
  | 'placeholder'
> &
  SelectStateProps &
  SelectSelectionProps &
  FieldMeta & {
    /** Options shown in the dropdown listbox. */
    options: SelectOption[];
    /** Placeholder text when no value is selected. @default Select… */
    placeholder?: string;
    /** Name submitted with a form. */
    name?: string;
    /** Id of the form the select belongs to. */
    form?: string;
    /**
     * Element the dropdown listbox portals into instead of `document.body`. Needed when a
     * subtree renders under a different theme than the page ambient (the theme's CSS custom
     * properties only cascade to descendants of the themed element).
     */
    portalContainer?: Element;
    /** Classes for the root. */
    className?: string;
    /** Inline style for the root. */
    style?: CSSProperties;
    /** Control density. Falls back to the surrounding control size, then `md`. */
    size?: NonNullable<SelectVariantProps['size']>;
    /** Ref to the trigger `<button>` element. */
    ref?: Ref<HTMLButtonElement>;
  };

/**
 * Dropdown select. `Select` with `options` is the assembled preset; add `multiple` for several
 * values. `className` and `style` style the root; `ref` and native attributes (`data-*`,
 * `title`, `onClick`, ...) reach the trigger `<button>`. Compose `Root`, `Trigger`, `Value`,
 * `Popover`, `ListBox`, and `Item` for custom rows.
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
  // Root keys keep VarUI names: `SelectRoot` does the RAC conversion.
  const rootProps: Record<string, unknown> = {};
  const triggerProps: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(props)) {
    (ROOT_KEY_SET.has(key) ? rootProps : triggerProps)[key] = val;
  }
  return (
    <SelectRoot
      {...(rootProps as unknown as SelectRootProps)}
      className={className}
      size={resolvedSize}
      invalid={racInvalid(props.invalid, errorMessage)}
    >
      <RacFieldFrame slots={s} label={label} description={description} errorMessage={errorMessage}>
        <SelectTrigger {...(triggerProps as object)} placeholder={placeholder} ref={ref} />
      </RacFieldFrame>
      <SelectPopover portalContainer={portalContainer}>
        <SelectListBox>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              textValue={optionTextValue(option)}
            >
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
