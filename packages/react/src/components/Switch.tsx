import type { JSX, ReactNode } from 'react';
import { Switch as AriaSwitch, type SwitchProps as RACSwitchProps } from 'react-aria-components';
import { switchStyles } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type SwitchProps = Omit<RACSwitchProps, 'children' | 'className'> & {
  /** Label rendered beside the switch control. */
  children?: ReactNode;
  className?: string;
};

export function Switch({ children, className, ...props }: SwitchProps): JSX.Element {
  const sw = switchStyles();
  return (
    <AriaSwitch {...props} {...mergeProps(sw.root, className)}>
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
