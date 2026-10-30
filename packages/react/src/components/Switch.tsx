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
import { Switch as AriaSwitch, type SwitchProps as RACSwitchProps } from 'react-aria-components';
import { switchStyles } from '@var-ui/core/components/switch';
import { mergeProps } from 'typestyles';
import { racRenderWithExtras } from '../internal/racDomProps';
import { toRacProps } from '../internal/racProps';

export type SwitchProps = Omit<
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
  /** Controlled on/off state. */
  checked?: boolean;
  /** Initial state when uncontrolled. */
  defaultChecked?: boolean;
  /** Called with the new on/off state. */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Native change event from the `<input role="switch">` (`event.target` is the input). It is
   * attached on the root `<label>` in the capture phase, because react-aria stops `change` from
   * bubbling, so `event.currentTarget` is the label and the handler runs before `onCheckedChange`.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /** Disables the switch. */
  disabled?: boolean;
  /** Makes the switch read-only (focusable, not toggleable). */
  readOnly?: boolean;
  /** Label rendered beside the switch control. */
  children?: ReactNode;
  /** Classes for the root `<label>`. */
  className?: string;
  /** Inline style for the root `<label>`. */
  style?: CSSProperties;
  /**
   * Ref to the native `<input type="checkbox" role="switch">`. react-aria-components sends the
   * field attributes it knows (`id`, `name`, `value`, `aria-*`, handlers) to the input and the
   * rest to the `<label>`.
   */
  ref?: Ref<HTMLInputElement>;
};

export function Switch({
  children,
  className,
  style,
  onChange,
  ref,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  readOnly,
  ...rest
}: SwitchProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  // RAC's `inputRef` only takes an object ref; this also serves callback refs.
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
  const sw = switchStyles();
  const racProps = toRacProps({ checked, defaultChecked, onCheckedChange, disabled, readOnly });
  return (
    <AriaSwitch
      {...(rest as RACSwitchProps)}
      {...racProps}
      {...mergeProps(sw.root, className)}
      style={style}
      inputRef={inputRef}
      render={racRenderWithExtras('label', onChange ? { onChangeCapture: onChange } : {}) as never}
    >
      {({ isSelected }) => (
        <>
          <span {...mergeProps(sw.track)} data-selected={isSelected || undefined}>
            <span {...mergeProps(sw.thumb)} data-selected={isSelected || undefined} />
          </span>
          <span {...mergeProps(sw.label)}>{children}</span>
        </>
      )}
    </AriaSwitch>
  );
}
