import type { JSX } from 'react';
import { statusDot, type StatusDotVariantProps } from '@var-ui/core';
import { mergeProps } from './utils';

export type StatusDotProps = StatusDotVariantProps & {
  'aria-label'?: string;
  className?: string;
};

export function StatusDot({
  tone = 'neutral',
  appearance = 'filled',
  pulse = false,
  'aria-label': ariaLabel,
  className,
}: StatusDotProps): JSX.Element {
  return (
    <span
      {...mergeProps(statusDot({ tone, appearance, pulse }), className)}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      aria-hidden={ariaLabel ? undefined : true}
    />
  );
}
