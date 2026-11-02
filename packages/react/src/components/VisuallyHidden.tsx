import type { ComponentPropsWithRef, JSX } from 'react';
import { visuallyHidden } from '@var-ui/core/components/visuallyHidden';
import { mergeProps } from 'typestyles';

export type VisuallyHiddenProps = ComponentPropsWithRef<'span'>;

/**
 * Text that is invisible but still read by screen readers and found by find-in-page. Use it for
 * a label a sighted user does not need, such as the name of an icon-only button.
 *
 * ```tsx
 * <button type="button">
 *   <TrashIcon aria-hidden="true" />
 *   <VisuallyHidden>Delete project</VisuallyHidden>
 * </button>
 * ```
 */
export function VisuallyHidden({ className, ref, ...rest }: VisuallyHiddenProps): JSX.Element {
  return <span {...rest} {...mergeProps(visuallyHidden(), className)} ref={ref} />;
}
