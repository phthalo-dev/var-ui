import type { JSX } from 'react';
import { textBlock } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type TimestampProps = {
  /** Date value to format. Accepts a `Date`, ISO string, or epoch milliseconds. */
  date: Date | string | number;
  /** Output format: relative ("5 minutes ago"), date, time, or datetime. @default relative */
  format?: 'relative' | 'date' | 'time' | 'datetime';
  /** BCP 47 locale for formatting. Uses the runtime default when omitted. */
  locale?: string;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
};

const DIVISIONS: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> = [
  { amount: 60, unit: 'seconds' },
  { amount: 60, unit: 'minutes' },
  { amount: 24, unit: 'hours' },
  { amount: 7, unit: 'days' },
  { amount: 4.34524, unit: 'weeks' },
  { amount: 12, unit: 'months' },
  { amount: Number.POSITIVE_INFINITY, unit: 'years' },
];

function formatRelative(target: Date, locale?: string): string {
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  let duration = (target.getTime() - Date.now()) / 1000;
  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return formatter.format(Math.round(duration), 'years');
}

function formatAbsolute(
  target: Date,
  format: 'date' | 'time' | 'datetime',
  locale?: string,
): string {
  const options: Intl.DateTimeFormatOptions =
    format === 'date'
      ? { dateStyle: 'medium' }
      : format === 'time'
        ? { timeStyle: 'short' }
        : { dateStyle: 'medium', timeStyle: 'short' };
  return new Intl.DateTimeFormat(locale, options).format(target);
}

/**
 * Locale-aware `<time>` element; relative by default, with the absolute
 * datetime in the title tooltip.
 *
 * ```tsx
 * <Timestamp date={comment.createdAt} />
 * <Timestamp date={invoice.due} format="date" />
 * ```
 */
export function Timestamp({
  date,
  format = 'relative',
  locale,
  className,
}: TimestampProps): JSX.Element {
  const target = date instanceof Date ? date : new Date(date);
  const text =
    format === 'relative' ? formatRelative(target, locale) : formatAbsolute(target, format, locale);
  return (
    <time
      dateTime={target.toISOString()}
      title={formatAbsolute(target, 'datetime', locale)}
      {...mergeProps(textBlock({ size: 'sm', tone: 'secondary' }), className)}
    >
      {text}
    </time>
  );
}
