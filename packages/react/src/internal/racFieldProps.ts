import { toRacProps, type RacProps } from './racProps';

/**
 * RAC field roots (`TextField`, `NumberField`, ...) own value, validation and
 * labelling state, so those props must reach the RAC root. Every other prop
 * is a native attribute and belongs on the native control.
 *
 * Input is in VarUI names (`disabled`, `required`, `readOnly`, `invalid`,
 * `onValueChange`, ...). The first tuple member is the RAC root bag, already
 * converted to RAC names via {@link toRacProps} (`isDisabled`, `onChange`, ...);
 * the second is the untouched native remainder, including the native `onChange`.
 */
const ROOT_KEYS = [
  'value',
  'defaultValue',
  'onValueChange',
  'disabled',
  'readOnly',
  'required',
  'invalid',
  'validate',
  'validationBehavior',
  'id',
  'aria-label',
  'aria-labelledby',
  'aria-describedby',
  'aria-details',
] as const;

export function splitRacFieldProps<P extends object, K extends string = (typeof ROOT_KEYS)[number]>(
  props: P,
  /** Extra keys (VarUI names) that also belong to the RAC root. */
  extraKeys: readonly K[] = [],
): [
  RacProps<Pick<P, Extract<keyof P, K | (typeof ROOT_KEYS)[number]>>>,
  Omit<P, K | (typeof ROOT_KEYS)[number]>,
] {
  const keys = new Set<string>([...ROOT_KEYS, ...extraKeys]);
  const root: Record<string, unknown> = {};
  const native: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    (keys.has(key) ? root : native)[key] = value;
  }
  return [toRacProps(root) as never, native as never];
}
