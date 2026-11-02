import type { ComponentPropsWithRef, JSX } from 'react';
import { Label, Meter as AriaMeter } from 'react-aria-components';
import { getMeterTone, meter } from '@var-ui/core/components/meter';
import type { MeterVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type MeterProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'role' | 'color'> &
  MeterVariantProps & {
    /** The measured value, clamped to `min`..`max`. */
    value: number;
    /** @default 0 */
    min?: number;
    /** @default 100 */
    max?: number;
    /** Upper bound of the "low" region, as on `<meter>`. @default min */
    low?: number;
    /** Lower bound of the "high" region, as on `<meter>`. @default max */
    high?: number;
    /** The ideal value, as on `<meter>`. The tone is derived from where `value` sits relative to it. @default midpoint */
    optimum?: number;
    /** Visible label above the track; also the accessible name. */
    label?: string;
    /** Show the formatted value next to the label. @default true */
    showValueText?: boolean;
    /** Spoken and displayed value, replacing the formatted one. */
    valueLabel?: string;
    /** `Intl.NumberFormat` options for the value. @default `{ style: 'percent' }` */
    formatOptions?: Intl.NumberFormatOptions;
  };

/**
 * A scalar measurement within a known range, on react-aria's Meter
 * (`role="meter progressbar"` with `aria-valuenow` / `aria-valuemin` / `aria-valuemax`). Unlike
 * `ProgressBar` it is not an operation in flight. The tone follows the native `<meter>` rules
 * from `low`, `high` and `optimum` (good, warning, danger) unless `tone` is set.
 *
 * A div rather than the native `<meter>` element: its fill is only styleable through
 * browser-specific pseudo-elements, which differ between engines.
 *
 * ```tsx
 * <Meter label="Disk usage" value={80} high={75} optimum={20} />
 * ```
 */
export function Meter({
  value,
  min = 0,
  max = 100,
  low,
  high,
  optimum,
  label,
  showValueText = true,
  valueLabel,
  formatOptions,
  size = 'md',
  tone,
  appearance = 'solid',
  className,
  ref,
  ...rest
}: MeterProps): JSX.Element {
  const resolvedTone = tone ?? getMeterTone({ value, min, max, low, high, optimum });
  const m = meter({ size, tone: resolvedTone, appearance });
  return (
    <AriaMeter
      {...(rest as object)}
      value={value}
      minValue={min}
      maxValue={max}
      valueLabel={valueLabel}
      formatOptions={formatOptions}
      {...mergeProps(m.root, className)}
      ref={ref}
    >
      {({ percentage, valueText }) => (
        <>
          {label || showValueText ? (
            <div {...mergeProps(m.header)}>
              {label ? <Label {...mergeProps(m.label)}>{label}</Label> : <span />}
              {showValueText ? <span {...mergeProps(m.valueText)}>{valueText}</span> : null}
            </div>
          ) : null}
          <div {...mergeProps(m.track)}>
            <div {...mergeProps(m.fill)} style={{ width: `${percentage}%` }} />
          </div>
        </>
      )}
    </AriaMeter>
  );
}
