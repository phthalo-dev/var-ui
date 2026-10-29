import type { JSX, Ref } from 'react';
import { spinner } from '@var-ui/core/components/spinner';
import { visuallyHidden } from '@var-ui/core/components/visuallyHidden';
import type { SpinnerVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type SpinnerProps = SpinnerVariantProps & {
  label?: string;
  className?: string;
  /** Ref to the root `<span>` element. */
  ref?: Ref<HTMLSpanElement>;
};

export function Spinner({
  size = 'md',
  tone = 'accent',
  appearance = 'solid',
  label = 'Loading',
  className,
  ref,
}: SpinnerProps): JSX.Element {
  const s = spinner({ size, tone, appearance });

  return (
    <span role="status" {...mergeProps(s.root, className)} ref={ref}>
      <span {...mergeProps(s.indicator)} aria-hidden="true" />
      <span {...mergeProps(visuallyHidden())}>{label}</span>
    </span>
  );
}
