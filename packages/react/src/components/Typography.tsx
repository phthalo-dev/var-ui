import type { HTMLAttributes, JSX } from 'react';
import { createElement } from 'react';
import {
  heading,
  textBlock,
  type HeadingVariantProps,
  type TextBlockVariantProps,
} from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  /** Semantic heading level (document outline). @default 2 */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Visual size, independent of level. @default md */
  size?: NonNullable<HeadingVariantProps['size']>;
};

/**
 * Semantic heading with decoupled visual size.
 *
 * ```tsx
 * <Heading level={1} size="display">var-ui</Heading>
 * ```
 */
export function Heading({
  level = 2,
  size = 'md',
  className,
  ...props
}: HeadingProps): JSX.Element {
  return createElement(`h${level}`, {
    ...props,
    ...mergeProps(heading({ size }), className),
  });
}

export type TextProps = HTMLAttributes<HTMLElement> & {
  /** HTML element to render. @default p */
  as?: 'p' | 'span' | 'div';
  /** Typographic size. @default md */
  size?: NonNullable<TextBlockVariantProps['size']>;
  /** Text color: `primary`, `secondary`, or a semantic tone (`accent`, `success`, `warning`, `danger`, `info`). @default primary */
  tone?: NonNullable<TextBlockVariantProps['tone']>;
  /** Font weight. @default normal */
  weight?: NonNullable<TextBlockVariantProps['weight']>;
  /** Max lines before truncation. @default none */
  lineClamp?: 1 | 2 | 3;
};

/** Public numeric `lineClamp` stanzas resolved from the `textBlock.lineClamp` axis. */
const lineClampVariant: Record<
  NonNullable<TextProps['lineClamp']>,
  NonNullable<TextBlockVariantProps['lineClamp']>
> = { 1: '1', 2: '2', 3: '3' };

/**
 * Body text with size/tone/weight axes. Renders a `<p>` by default.
 *
 * ```tsx
 * <Text tone="secondary" size="sm">Supporting copy</Text>
 * ```
 */
export function Text({
  as = 'p',
  size = 'md',
  tone = 'primary',
  weight = 'normal',
  lineClamp,
  className,
  ...props
}: TextProps): JSX.Element {
  return createElement(as, {
    ...props,
    ...mergeProps(
      textBlock({
        size,
        tone,
        weight,
        lineClamp: lineClamp === undefined ? undefined : lineClampVariant[lineClamp],
      }),
      className,
    ),
  });
}
