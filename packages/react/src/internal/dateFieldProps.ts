import type { CSSProperties } from 'react';
import type { FieldMeta } from '../components/Field';
import { toRacProps, type RacProps } from './racProps';

/**
 * RAC date/time fields (`DatePicker`, `TimeField`, ...) have no native
 * `<input>` to receive attributes, so `data-*` attributes go to the segmented
 * input element (the same element `ref` points at); everything else is RAC
 * state and stays with the RAC root.
 *
 * Input is in VarUI names. The first tuple member is the RAC root bag, already
 * converted to RAC names via `toRacProps` (`isDisabled`, `onChange`,
 * `isDateUnavailable`, ...); the second holds the `data-*` attributes.
 */
/** `toRacProps` plus the HTML names `min` / `max` -> RAC `minValue` / `maxValue` (date, time and calendar fields only). */
export function toRacDateProps<P extends object>(props: P) {
  const { min, max, ...rest } = props as P & { min?: unknown; max?: unknown };
  return {
    ...toRacProps(rest),
    ...(min !== undefined ? { minValue: min } : {}),
    ...(max !== undefined ? { maxValue: max } : {}),
  } as RacProps<Omit<P, 'min' | 'max'>> & { minValue?: unknown; maxValue?: unknown };
}

export function splitDataAttributes<P extends object>(
  props: P,
): [rootProps: RacProps<P>, dataProps: Record<string, unknown>] {
  const root: Record<string, unknown> = {};
  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    (key.startsWith('data-') ? data : root)[key] = value;
  }
  return [toRacDateProps(root) as RacProps<P>, data];
}

/**
 * State, naming and event props shared by every date/time field in VarUI names.
 * `Rac` is the RAC props type the field wraps; it only supplies the focus and key
 * event signatures. There is no native `onChange` on these fields (the segments are
 * not an `<input>`): use `onValueChange`.
 */
export type DateFieldBaseProps<
  Rac extends {
    onFocus?: unknown;
    onBlur?: unknown;
    onFocusChange?: unknown;
    onKeyDown?: unknown;
    onKeyUp?: unknown;
  },
> = FieldMeta &
  Pick<Rac, 'onFocus' | 'onBlur' | 'onFocusChange' | 'onKeyDown' | 'onKeyUp'> & {
    /** Disables the field. */
    disabled?: boolean;
    /** Makes the field read-only: focusable and selectable but not editable. */
    readOnly?: boolean;
    /** Marks the field required for form validation. */
    required?: boolean;
    /** Shows the error state. Defaults to whether `errorMessage` is set. */
    invalid?: boolean;
    /** `native` uses browser constraint validation; `aria` validates on the fly. @default aria */
    validationBehavior?: 'native' | 'aria';
    /** Name submitted with a form (value is serialized as ISO 8601). */
    name?: string;
    /** Id of the form the field belongs to. */
    form?: string;
    autoFocus?: boolean;
    id?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    'aria-details'?: string;
    /** Merged onto the root. */
    className?: string;
    /** Applied to the root. */
    style?: CSSProperties;
  };
