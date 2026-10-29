import { useImperativeHandle, useRef, type JSX, type ReactNode, type Ref } from 'react';
import { Switch as AriaSwitch, type SwitchProps as RACSwitchProps } from 'react-aria-components';
import { switchStyles } from '@var-ui/core/components/switch';
import { mergeProps } from 'typestyles';

export type SwitchProps = Omit<RACSwitchProps, 'children' | 'className' | 'inputRef'> & {
  /** Label rendered beside the switch control. */
  children?: ReactNode;
  className?: string;
  /**
   * Ref to the native `<input type="checkbox" role="switch">`. react-aria-components sends the
   * field attributes it knows (`id`, `name`, `value`, `aria-*`, handlers) to the input and the
   * rest to the `<label>`.
   */
  ref?: Ref<HTMLInputElement>;
};

export function Switch({ children, className, ref, ...props }: SwitchProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  // RAC's `inputRef` only takes an object ref; this also serves callback refs.
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
  const sw = switchStyles();
  return (
    <AriaSwitch {...props} {...mergeProps(sw.root, className)} inputRef={inputRef}>
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
