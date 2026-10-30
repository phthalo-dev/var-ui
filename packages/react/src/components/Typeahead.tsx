import type { ComponentPropsWithRef, JSX, ReactNode, Ref } from 'react';
import { combobox } from '@var-ui/core/components/combobox';
import { Combobox, type ComboboxOption, type ComboboxRootProps } from './Combobox';
import { RacFieldFrame, racInvalid } from './FieldFrame';
import { useControlSize } from '../internal/controlSizeContext';
import { optionTextValue } from '../internal/racProps';

export type TypeaheadOption = ComboboxOption;

/**
 * Props that belong to the RAC `ComboBox` root (selection, input text, menu state, validation).
 * Every other attribute lands on the `<input>`. The VarUI-named state keys (`value`, `disabled`,
 * ...) are handled by `splitRacFieldProps`.
 */
const TYPEAHEAD_ROOT_KEYS = [
  'inputValue',
  'defaultInputValue',
  'onInputChange',
  'defaultFilter',
  'formValue',
  'allowsCustomValue',
  'allowsEmptyCollection',
  'menuTrigger',
  'shouldFocusWrap',
  'onOpenChange',
  'name',
  'form',
  'autoFocus',
  'onFocus',
  'onBlur',
  'onFocusChange',
  'onKeyDown',
  'onKeyUp',
  'style',
  'slot',
] as const;

type TypeaheadRootKey =
  | (typeof TYPEAHEAD_ROOT_KEYS)[number]
  | 'value'
  | 'defaultValue'
  | 'onValueChange'
  | 'disabled'
  | 'required'
  | 'invalid'
  | 'readOnly'
  | 'validate'
  | 'validationBehavior'
  | 'id'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-describedby'
  | 'aria-details';

const ROOT_KEY_SET = new Set<string>([
  ...TYPEAHEAD_ROOT_KEYS,
  'value',
  'defaultValue',
  'onValueChange',
  'disabled',
  'required',
  'invalid',
  'readOnly',
  'validate',
  'validationBehavior',
  'id',
  'aria-label',
  'aria-labelledby',
  'aria-describedby',
  'aria-details',
]);

export type TypeaheadProps = Pick<
  ComboboxRootProps,
  Extract<TypeaheadRootKey, keyof ComboboxRootProps>
> &
  Omit<
    ComponentPropsWithRef<'input'>,
    TypeaheadRootKey | 'className' | 'children' | 'ref' | 'size'
  > & {
    /** Field label rendered above the input. */
    label?: ReactNode;
    /** Helper text shown below the control when there is no error. */
    description?: ReactNode;
    /** Validation message; when set, the field is shown in an error state. */
    errorMessage?: ReactNode;
    /** Options filtered as the user types: `{ value, label, disabled? }`. */
    options: TypeaheadOption[];
    /** Placeholder text shown when the input is empty. @default 'Search…' */
    placeholder?: string;
    /** Shown when no option matches. @default 'No results' */
    emptyContent?: ReactNode;
    /** Accessible name for the clear button. @default 'Clear' */
    clearLabel?: string;
    /** Merged onto the root. */
    className?: string;
    /** Control density. Falls back to the surrounding control size, then `md`. */
    size?: ComboboxRootProps['size'];
    /** Ref to the `<input>` element. */
    ref?: Ref<HTMLInputElement>;
  };

/**
 * Single-select search-as-you-type combobox built on the shared `Combobox` primitive.
 * `className`/`style` style the root; `ref` and native attributes reach the `<input>`.
 */
export function Typeahead({
  label,
  description,
  errorMessage,
  options,
  placeholder = 'Search…',
  emptyContent,
  clearLabel,
  className,
  size,
  ref,
  ...props
}: TypeaheadProps): JSX.Element {
  const contextSize = useControlSize();
  const resolvedSize = size ?? contextSize;
  const styles = combobox({ size: resolvedSize });
  // Root keys keep VarUI names: `Combobox.Root` does the RAC conversion.
  const rootProps: Record<string, unknown> = {};
  const inputProps: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(props)) {
    (ROOT_KEY_SET.has(key) ? rootProps : inputProps)[key] = val;
  }
  return (
    <Combobox.Root
      {...(rootProps as Omit<ComboboxRootProps, 'children'>)}
      size={resolvedSize}
      className={className}
      invalid={racInvalid(props.invalid, errorMessage)}
    >
      <RacFieldFrame
        slots={styles}
        label={label}
        description={description}
        errorMessage={errorMessage}
      >
        <Combobox.Input
          {...(inputProps as object)}
          placeholder={placeholder}
          clearLabel={clearLabel}
          clearable
          ref={ref}
        />
      </RacFieldFrame>
      <Combobox.Popover>
        <Combobox.ListBox items={options} emptyContent={emptyContent}>
          {(option) => (
            <Combobox.Item
              value={option.value}
              disabled={option.disabled}
              textValue={optionTextValue(option)}
            >
              {option.label}
            </Combobox.Item>
          )}
        </Combobox.ListBox>
      </Combobox.Popover>
    </Combobox.Root>
  );
}
