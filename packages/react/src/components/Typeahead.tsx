import type { ComponentPropsWithRef, JSX, ReactNode, Ref } from 'react';
import type { ComboBoxProps as RACComboBoxProps } from 'react-aria-components';
import { combobox } from '@var-ui/core/components/combobox';
import { Combobox, type ComboboxOption, type ComboboxRootProps } from './Combobox';
import { RacFieldFrame, racInvalid } from './FieldFrame';
import { useControlSize } from '../internal/controlSizeContext';
import { splitRacFieldProps } from '../internal/racFieldProps';

export type TypeaheadOption = ComboboxOption;

/**
 * RAC-owned `ComboBox` props (selection, input text, menu state, validation). They keep their
 * RAC names until the vocabulary PR. Every other attribute lands on the `<input>`.
 */
const TYPEAHEAD_ROOT_KEYS = [
  'selectedKey',
  'defaultSelectedKey',
  'onSelectionChange',
  'inputValue',
  'defaultInputValue',
  'onInputChange',
  'items',
  'defaultItems',
  'defaultFilter',
  'formValue',
  'allowsCustomValue',
  'allowsEmptyCollection',
  'menuTrigger',
  'shouldFocusWrap',
  'disabledKeys',
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
] as const satisfies readonly (keyof RACComboBoxProps<TypeaheadOption>)[];

type TypeaheadRootKey =
  | (typeof TYPEAHEAD_ROOT_KEYS)[number]
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'isDisabled'
  | 'isRequired'
  | 'isInvalid'
  | 'isReadOnly'
  | 'validate'
  | 'validationBehavior'
  | 'id'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-describedby'
  | 'aria-details';

export type TypeaheadProps = Pick<
  ComboboxRootProps<TypeaheadOption>,
  Extract<TypeaheadRootKey, keyof ComboboxRootProps<TypeaheadOption>>
> &
  Omit<
    ComponentPropsWithRef<'input'>,
    TypeaheadRootKey | 'className' | 'children' | 'ref' | 'size' | 'disabled' | 'required'
  > & {
    /** Field label rendered above the input. */
    label?: ReactNode;
    /** Helper text shown below the control when there is no error. */
    description?: ReactNode;
    /** Validation message; when set, the field is shown in an error state. */
    errorMessage?: ReactNode;
    /** Options filtered as the user types. */
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
    size?: ComboboxRootProps<TypeaheadOption>['size'];
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
  const [rootProps, inputProps] = splitRacFieldProps(props, TYPEAHEAD_ROOT_KEYS);
  return (
    <Combobox.Root
      {...(rootProps as object)}
      size={resolvedSize}
      className={className}
      isInvalid={racInvalid(rootProps.isInvalid, errorMessage)}
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
            <Combobox.Item id={option.id} textValue={option.label}>
              {option.label}
            </Combobox.Item>
          )}
        </Combobox.ListBox>
      </Combobox.Popover>
    </Combobox.Root>
  );
}
