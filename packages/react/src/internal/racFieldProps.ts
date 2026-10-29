/**
 * RAC field roots (`TextField`, `NumberField`, ...) own value, validation and
 * labelling state, so those props must reach the RAC root. Every other prop
 * is a native attribute and belongs on the native control. This splits a
 * field's props into those two bags.
 */
const RAC_ROOT_KEYS = [
  'value',
  'defaultValue',
  'onChange',
  'isDisabled',
  'isReadOnly',
  'isRequired',
  'isInvalid',
  'validate',
  'validationBehavior',
  'id',
  'aria-label',
  'aria-labelledby',
  'aria-describedby',
  'aria-details',
] as const;

export function splitRacFieldProps<
  P extends object,
  K extends string = (typeof RAC_ROOT_KEYS)[number],
>(
  props: P,
  extraKeys: readonly K[] = [],
): [
  Pick<P, Extract<keyof P, K | (typeof RAC_ROOT_KEYS)[number]>>,
  Omit<P, K | (typeof RAC_ROOT_KEYS)[number]>,
] {
  const keys = new Set<string>([...RAC_ROOT_KEYS, ...extraKeys]);
  const root: Record<string, unknown> = {};
  const native: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    (keys.has(key) ? root : native)[key] = value;
  }
  return [root as never, native as never];
}
