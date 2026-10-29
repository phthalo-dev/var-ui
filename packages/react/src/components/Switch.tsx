import type { JSX, ReactNode, Ref } from 'react';
import { Switch as AriaSwitch, type SwitchProps as RACSwitchProps } from 'react-aria-components';
import { switchStyles } from '@var-ui/core/components/switch';
import { mergeProps } from 'typestyles';

export type SwitchProps = Omit<RACSwitchProps, 'children' | 'className'> & {
  /** Label rendered beside the switch control. */
  children?: ReactNode;
  className?: string;
  /** Ref to the underlying `<label>` element. */
  ref?: Ref<HTMLLabelElement>;
};

export function Switch({ children, className, ref, ...props }: SwitchProps): JSX.Element {
  const sw = switchStyles();
  return (
    <AriaSwitch {...props} {...mergeProps(sw.root, className)} ref={ref}>
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
