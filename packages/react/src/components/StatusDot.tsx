import type { ComponentPropsWithRef, JSX } from 'react';
import { statusDot } from '@var-ui/core/components/statusDot';
import type { StatusDotVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type StatusDotProps = Omit<ComponentPropsWithRef<'span'>, 'children'> &
  StatusDotVariantProps;

export function StatusDot({
  tone = 'neutral',
  appearance = 'filled',
  pulse = false,
  'aria-label': ariaLabel,
  className,
  ref,
  ...rest
}: StatusDotProps): JSX.Element {
  return (
    <span
      {...rest}
      {...mergeProps(statusDot({ tone, appearance, pulse }), className)}
      ref={ref}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      aria-hidden={ariaLabel ? undefined : true}
    />
  );
}
