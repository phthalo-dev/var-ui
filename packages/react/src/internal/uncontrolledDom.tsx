import type { ReactElement } from 'react';

type DomProps = Record<string, unknown>;

/**
 * RAC text fields keep their value in state and render it as a controlled `value` on the
 * `<input>`, even when the app passed none. React then resets any value written straight to the
 * element on the next render, which is exactly what form libraries do (`register()`'s default
 * values, `setValue()`, `reset()`), and what a native `form.reset()` expects to own.
 *
 * Returns a RAC `render` function for `Input`/`TextArea` that drops the controlled `value` when
 * the field is uncontrolled and hands the element its initial value as `defaultValue`, so the
 * DOM stays the source of truth (RAC still follows the typing through `onChange`).
 * Returns `undefined` for a controlled field.
 */
export function uncontrolledDomRender(
  tag: 'input' | 'textarea',
  controlled: boolean,
  defaultValue: string | undefined,
): ((domProps: never) => ReactElement) | undefined {
  if (controlled) return undefined;
  return ((domProps: DomProps) => {
    const { value: _value, ...rest } = domProps;
    const Tag = tag as 'input';
    return <Tag {...rest} defaultValue={defaultValue} />;
  }) as unknown as (domProps: never) => ReactElement;
}
