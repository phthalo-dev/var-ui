import type { JSX } from 'react';
import { spinner, visuallyHidden, type SpinnerVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type SpinnerProps = SpinnerVariantProps & {
  label?: string;
  className?: string;
};

export function Spinner({
  size = 'md',
  tone = 'accent',
  appearance = 'solid',
  label = 'Loading',
  className,
}: SpinnerProps): JSX.Element {
  const s = spinner({ size, tone, appearance });

  return (
    <span role="status" {...mergeProps(s.root, className)}>
      <span {...mergeProps(s.indicator)} aria-hidden="true" />
      <span {...mergeProps(visuallyHidden())}>{label}</span>
    </span>
  );
}
