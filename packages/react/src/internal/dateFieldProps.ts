/**
 * RAC date/time fields (`DatePicker`, `TimeField`, ...) have no native
 * `<input>` to receive attributes, so `data-*` attributes go to the segmented
 * input element (the same element `ref` points at); everything else is RAC
 * state and stays with the RAC root.
 */
export function splitDataAttributes<P extends object>(
  props: P,
): [rootProps: P, dataProps: Record<string, unknown>] {
  const root: Record<string, unknown> = {};
  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    (key.startsWith('data-') ? data : root)[key] = value;
  }
  return [root as P, data];
}
