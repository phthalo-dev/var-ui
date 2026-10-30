import type { JSX, Ref } from 'react';
import {
  Label,
  ProgressBar as AriaProgressBar,
  type ProgressBarProps as RACProgressBarProps,
} from 'react-aria-components';
import { progressBar } from '@var-ui/core/components/progressBar';
import type { ProgressBarVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type ProgressBarProps = Omit<
  RACProgressBarProps,
  'children' | 'className' | 'isIndeterminate'
> &
  ProgressBarVariantProps & {
    /** Label rendered above the track. */
    label?: string;
    /** Show the formatted value (e.g. "40%") next to the label. @default true */
    showValueText?: boolean;
    /** Additional CSS class names merged onto the root element. */
    className?: string;
    /** Ref to the underlying `<div>` element. */
    ref?: Ref<HTMLDivElement>;
  };

/**
 * Linear progress bar on react-aria ProgressBar (determinate or
 * indeterminate).
 *
 * ```tsx
 * <ProgressBar label="Uploading" value={40} />
 * <ProgressBar label="Working" indeterminate />
 * ```
 */
export function ProgressBar({
  label,
  tone = 'accent',
  indeterminate = false,
  appearance = 'solid',
  showValueText = true,
  className,
  ref,
  ...props
}: ProgressBarProps): JSX.Element {
  const p = progressBar({
    tone,
    appearance,
    indeterminate,
  });
  const showValue = showValueText && !indeterminate;
  return (
    <AriaProgressBar
      {...props}
      isIndeterminate={indeterminate}
      {...mergeProps(p.root, className)}
      ref={ref}
    >
      {({ percentage, valueText }) => (
        <>
          {label || showValue ? (
            <div {...mergeProps(p.header)}>
              {label ? <Label {...mergeProps(p.label)}>{label}</Label> : <span />}
              {showValue ? <span {...mergeProps(p.valueText)}>{valueText}</span> : null}
            </div>
          ) : null}
          <div {...mergeProps(p.track)}>
            <div
              {...mergeProps(p.fill)}
              style={indeterminate ? undefined : { width: `${percentage ?? 0}%` }}
            />
          </div>
        </>
      )}
    </AriaProgressBar>
  );
}
