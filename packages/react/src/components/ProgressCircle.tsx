import type { ComponentPropsWithRef, CSSProperties, JSX, ReactNode } from 'react';
import { ProgressBar as AriaProgressBar } from 'react-aria-components';
import { progressCircle } from '@var-ui/core/components/progressCircle';
import type { ProgressCircleVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';
import { toRacProps } from '../internal/racProps';

export type ProgressCircleProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'role' | 'style' | 'color'
> &
  ProgressCircleVariantProps & {
    /**
     * Progress, between `min` and `max`. Leave it out (or pass `indeterminate`) when the amount
     * of work is unknown.
     */
    value?: number;
    /** @default 0 */
    min?: number;
    /** @default 100 */
    max?: number;
    /** Accessible name (`aria-label`). Required unless `aria-label` / `aria-labelledby` is set. */
    label?: string;
    /** Spoken value (`aria-valuetext`), replacing the formatted percentage. */
    valueLabel?: string;
    /** `Intl.NumberFormat` options for the spoken value. @default `{ style: 'percent' }` */
    formatOptions?: Intl.NumberFormatOptions;
    /** Content centered inside the ring, e.g. the percentage. Receives the formatted value. */
    children?: ReactNode | ((state: { percentage: number; valueText: string }) => ReactNode);
    style?: CSSProperties;
  };

/**
 * Circular progress, determinate or indeterminate, on react-aria's ProgressBar
 * (`role="progressbar"` with `aria-valuenow` / `aria-valuemin` / `aria-valuemax` / `aria-valuetext`).
 * Indeterminate when `value` is undefined or `indeterminate` is set; there is no `aria-valuenow`
 * then. The ring is an SVG whose dash length follows `--var-ui-progress-circle-progress`.
 *
 * ```tsx
 * <ProgressCircle label="Upload" value={40}>40%</ProgressCircle>
 * <ProgressCircle label="Loading" />
 * ```
 */
export function ProgressCircle({
  value,
  min = 0,
  max = 100,
  label,
  valueLabel,
  formatOptions,
  size = 'md',
  tone = 'accent',
  appearance = 'solid',
  indeterminate,
  children,
  className,
  style,
  ref,
  ...rest
}: ProgressCircleProps): JSX.Element {
  const isIndeterminate = indeterminate ?? value === undefined;
  const p = progressCircle({ size, tone, appearance, indeterminate: isIndeterminate });
  return (
    <AriaProgressBar
      aria-label={label}
      {...(rest as object)}
      {...toRacProps({ indeterminate: isIndeterminate })}
      value={value ?? min}
      minValue={min}
      maxValue={max}
      valueLabel={valueLabel}
      formatOptions={formatOptions}
      {...mergeProps(p.root, className)}
      ref={ref}
      style={style}
    >
      {({ percentage, valueText }) => {
        const fraction = (percentage ?? 0) / 100;
        return (
          <>
            <svg
              viewBox="0 0 100 100"
              aria-hidden="true"
              focusable="false"
              {...mergeProps(p.ring)}
              style={
                isIndeterminate
                  ? undefined
                  : ({ '--var-ui-progress-circle-progress': fraction } as CSSProperties)
              }
            >
              <circle cx="50" cy="50" r="42" pathLength={100} {...mergeProps(p.track)} />
              <circle cx="50" cy="50" r="42" pathLength={100} {...mergeProps(p.fill)} />
            </svg>
            {children != null && children !== false ? (
              <span {...mergeProps(p.content)}>
                {typeof children === 'function'
                  ? children({ percentage: percentage ?? 0, valueText: valueText ?? '' })
                  : children}
              </span>
            ) : null}
          </>
        );
      }}
    </AriaProgressBar>
  );
}
