import type { ElementType, HTMLAttributes, JSX, Ref } from 'react';
import { createElement } from 'react';
import { stack } from '@var-ui/core/components/stack';
import type { Gap, StackVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type StackProps = HTMLAttributes<HTMLElement> & {
  /** Flex direction. @default column */
  direction?: NonNullable<StackVariantProps['direction']>;
  /** Spacing between children. @default sm */
  gap?: Gap;
  /** Cross-axis alignment. @default stretch */
  align?: NonNullable<StackVariantProps['align']>;
  /** Main-axis distribution. @default start */
  justify?: NonNullable<StackVariantProps['justify']>;
  /** Whether flex items wrap to new lines. @default false */
  wrap?: boolean;
  /** HTML element to render — `span` works inside buttons and links. @default div */
  as?: 'div' | 'span';
  /** Ref to the underlying element. */
  ref?: Ref<HTMLElement>;
};

/**
 * Flex stack layout primitive. Vertical by default; use `HStack` for a centered row.
 *
 * ```tsx
 * <Stack gap="lg">{sections}</Stack>
 * <Stack as="span" gap="xs" direction="row">{inline}</Stack>
 * ```
 */
export function Stack({
  direction = 'column',
  gap = 'sm',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  as = 'div',
  className,
  ref,
  ...props
}: StackProps): JSX.Element {
  return createElement(as, {
    ...props,
    ...mergeProps(
      stack({ direction, gap, align, justify, wrap: wrap ? 'wrap' : 'nowrap' }),
      className,
    ),
    ref,
  });
}

/** Horizontal stack — row direction with centered cross axis by default. */
export function HStack({ align = 'center', ...props }: Omit<StackProps, 'direction'>): JSX.Element {
  return <Stack {...props} align={align} direction="row" />;
}
