import type { HTMLAttributes, JSX, Ref } from 'react';
import { badge } from '@var-ui/core/components/badge';
import type { BadgeVariantProps } from '@var-ui/core';
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
 * <Badge category="3">Reviewer</Badge>   // identity hue, not status
 * ```
 */
export function Badge({
  tone = 'neutral',
  category,
  appearance = 'subtle',
  className,
  ref,
  ...props
}: BadgeProps): JSX.Element {
  return (
    <span {...props} {...mergeProps(badge({ tone, category, appearance }), className)} ref={ref} />
  );
}
