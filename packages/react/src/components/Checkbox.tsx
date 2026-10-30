import {
  useImperativeHandle,
  useRef,
  type ChangeEventHandler,
  type ComponentPropsWithRef,
  type CSSProperties,
  type JSX,
  type ReactNode,
  type Ref,
} from 'react';
import {
  Checkbox as AriaCheckbox,
  type CheckboxProps as RACCheckboxProps,
} from 'react-aria-components';
import { checkbox } from '@var-ui/core/components/checkbox';
import { mergeProps } from 'typestyles';
import { racRenderWithExtras } from '../internal/racDomProps';
import { toRacProps } from '../internal/racProps';

export type CheckboxProps = Omit<
  ComponentPropsWithRef<'input'>,
  | 'type'
  | 'size'
  | 'checked'
  | 'defaultChecked'
  | 'disabled'
  | 'required'
  | 'readOnly'
  | 'children'
  | 'className'
  | 'style'
  | 'onChange'
  | 'ref'
> & {
  /** Controlled checked state. */
  checked?: boolean;
  /** Initial checked state when uncontrolled. */
  defaultChecked?: boolean;
  /** Shows the mixed state. The native input stays unchecked-or-checked; this is purely visual and announced as `mixed`. */
  indeterminate?: boolean;
  /** Called with the new checked state. */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Native change event from the `<input>` (`event.target` is the input). It is attached on the
   * root `<label>` in the capture phase, because react-aria stops `change` from bubbling, so
   * `event.currentTarget` is the label and the handler runs before `onCheckedChange`.
   * Read `event.target.checked`; this makes `register()` from form libraries work.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /** Disables the checkbox. */
  disabled?: boolean;
  /** Makes the checkbox read-only (focusable, not toggleable). */
  readOnly?: boolean;
  /** Marks the checkbox required for form validation. */
  required?: boolean;
  /** Shows the error state. */
  invalid?: boolean;
  /** Label rendered beside the checkbox control. */
  children?: ReactNode;
  /** Classes for the root `<label>`. */
  className?: string;
  /** Inline style for the root `<label>`. */
  style?: CSSProperties;
  /**
   * Ref to the native `<input type="checkbox">`. react-aria-components sends the field attributes
   * it knows (`id`, `name`, `value`, `aria-*`, handlers) to the input and the rest to the `<label>`.
   */
  ref?: Ref<HTMLInputElement>;
};

export function Checkbox({
  children,
  className,
  style,
  onChange,
  ref,
  checked,
  defaultChecked,
  indeterminate,
  onCheckedChange,
  disabled,
  readOnly,
  required,
  invalid,
  ...rest
}: CheckboxProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  // RAC's `inputRef` only takes an object ref; this also serves callback refs.
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
  const cb = checkbox();
  const racProps = toRacProps({
    checked,
    defaultChecked,
    indeterminate,
    onCheckedChange,
    disabled,
    readOnly,
    required,
    invalid,
  });
  return (
    <AriaCheckbox
      {...(rest as RACCheckboxProps)}
      {...racProps}
      {...mergeProps(cb.root, className)}
      style={style}
      inputRef={inputRef}
      render={racRenderWithExtras('label', onChange ? { onChangeCapture: onChange } : {}) as never}
    >
      {({ isSelected, isIndeterminate }) => (
        <>
          <span
            {...mergeProps(cb.box)}
            data-selected={isSelected || undefined}
            data-indeterminate={isIndeterminate || undefined}
          >
            {isIndeterminate ? '−' : isSelected ? '✓' : ''}
          </span>
          <span {...mergeProps(cb.label)}>{children}</span>
        </>
      )}
    </AriaCheckbox>
  );
}
