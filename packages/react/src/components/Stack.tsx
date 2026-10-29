import type { HTMLAttributes, JSX, Ref } from 'react';
import { stack } from '@var-ui/core/components/stack';
import type { StackVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type StackProps = HTMLAttributes<HTMLDivElement> & {
  /** Flex direction. @default column */
  direction?: NonNullable<StackVariantProps['direction']>;
  /** Spacing between children. @default md */
  gap?: NonNullable<StackVariantProps['gap']>;
  /** Cross-axis alignment. @default stretch */
  align?: NonNullable<StackVariantProps['align']>;
  /** Main-axis distribution. @default start */
  justify?: NonNullable<StackVariantProps['justify']>;
  /** Whether flex items wrap to new lines. @default false */
  wrap?: boolean;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Flex stack layout primitive. Vertical by default; see `HStack`/`VStack`.
 *
 * ```tsx
 * <Stack gap="lg">{sections}</Stack>
 * ```
 */
export function Stack({
  direction = 'column',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className,
  ref,
  ...props
}: StackProps): JSX.Element {
  return (
    <div
      {...props}
      {...mergeProps(
        stack({ direction, gap, align, justify, wrap: wrap ? 'wrap' : 'nowrap' }),
        className,
      )}
      ref={ref}
    />
  );
}

/** Horizontal stack — row direction with centered cross axis by default. */
export function HStack({ align = 'center', ...props }: Omit<StackProps, 'direction'>): JSX.Element {
  return <Stack {...props} align={align} direction="row" />;
}

/** Vertical stack — explicit alias for readability at call sites. */
export function VStack(props: Omit<StackProps, 'direction'>): JSX.Element {
  return <Stack {...props} direction="column" />;
}
