import type { JSX } from 'react';
import { Button as AriaButton, type ButtonProps as RACButtonProps } from 'react-aria-components';
import { button, type ButtonVariantProps } from '@var-ui/core';
import { mergeProps } from './utils';

export type ButtonProps = Omit<RACButtonProps, 'className'> &
  ButtonVariantProps & {
    className?: string;
  };

export function Button({
  tone,
  appearance,
  size = 'md',
  layout,
  elevated,
  className,
  ...props
}: ButtonProps): JSX.Element {
  const styles = button({ tone, appearance, size, layout, elevated });
  return <AriaButton {...props} {...mergeProps(styles, className)} />;
}
