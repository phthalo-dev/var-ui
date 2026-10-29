import type { JSX, Ref } from 'react';
import { Button as AriaButton, type ButtonProps as RACButtonProps } from 'react-aria-components';
import { button } from '@var-ui/core/components/button';
import type { ButtonVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type ButtonProps = Omit<RACButtonProps, 'className'> &
  ButtonVariantProps & {
    className?: string;
    /** Ref to the underlying `<button>` element. */
    ref?: Ref<HTMLButtonElement>;
  };

export function Button({
  tone,
  appearance,
  size = 'md',
  layout,
  elevated,
  className,
  ref,
  ...props
}: ButtonProps): JSX.Element {
  const styles = button({ tone, appearance, size, layout, elevated });
  return <AriaButton {...props} {...mergeProps(styles, className)} ref={ref} />;
}
