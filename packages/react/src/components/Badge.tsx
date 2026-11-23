import type { HTMLAttributes, JSX, Ref } from 'react';
import { badge } from '@var-ui/core/components/badge';
import type { BadgeVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type { SurfaceAppearance as BadgeAppearance } from '@var-ui/core';

export type BadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, 'color'> &
  BadgeVariantProps & {
    /** Ref to the underlying `<span>` element. */
    ref?: Ref<HTMLSpanElement>;
  };

/**
 * Small semantic label chip.
 *
 * ```tsx
 * <Badge tone="success">Active</Badge>
 * <Badge color="violet">Reviewer</Badge>   // identity color, not status
 * ```
 */
export function Badge({
  tone = 'neutral',
  color,
  appearance = 'subtle',
  className,
  ref,
  ...props
}: BadgeProps): JSX.Element {
  return (
    <span {...props} {...mergeProps(badge({ tone, color, appearance }), className)} ref={ref} />
  );
}
