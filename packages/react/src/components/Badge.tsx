import type { HTMLAttributes, JSX, Ref } from 'react';
import { badge, type BadgeVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type { SurfaceAppearance as BadgeAppearance } from '@var-ui/core';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  BadgeVariantProps & {
    /** Ref to the underlying `<span>` element. */
    ref?: Ref<HTMLSpanElement>;
  };

/**
 * Small semantic label chip.
 *
 * ```tsx
 * <Badge tone="success">Active</Badge>
 * ```
 */
export function Badge({
  tone = 'neutral',
  appearance = 'subtle',
  className,
  ref,
  ...props
}: BadgeProps): JSX.Element {
  return <span {...props} {...mergeProps(badge({ tone, appearance }), className)} ref={ref} />;
}
