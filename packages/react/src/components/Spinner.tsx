import type { ComponentPropsWithRef, JSX } from 'react';
import { spinner } from '@var-ui/core/components/spinner';
import { visuallyHidden } from '@var-ui/core/components/visuallyHidden';
import type { SpinnerVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type SpinnerProps = Omit<ComponentPropsWithRef<'span'>, 'children'> &
  SpinnerVariantProps & {
    /** Visually hidden text announced to assistive tech. @default Loading */
    label?: string;
  };

export function Spinner({
  size = 'md',
  tone = 'accent',
  appearance = 'solid',
  label = 'Loading',
  className,
  ref,
  ...rest
}: SpinnerProps): JSX.Element {
  const s = spinner({ size, tone, appearance });

  return (
    <span role="status" {...rest} {...mergeProps(s.root, className)} ref={ref}>
      <span {...mergeProps(s.indicator)} aria-hidden="true" />
      <span {...mergeProps(visuallyHidden())}>{label}</span>
    </span>
  );
}
