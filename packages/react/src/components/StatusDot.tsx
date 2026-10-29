import type { JSX, Ref } from 'react';
import { statusDot } from '@var-ui/core/components/statusDot';
import type { StatusDotVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type StatusDotProps = StatusDotVariantProps & {
  'aria-label'?: string;
  className?: string;
  /** Ref to the underlying `<span>` element. */
  ref?: Ref<HTMLSpanElement>;
};

export function StatusDot({
  tone = 'neutral',
  appearance = 'filled',
  pulse = false,
  'aria-label': ariaLabel,
  className,
  ref,
}: StatusDotProps): JSX.Element {
  return (
    <span
      {...mergeProps(statusDot({ tone, appearance, pulse }), className)}
      ref={ref}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      aria-hidden={ariaLabel ? undefined : true}
    />
  );
}
