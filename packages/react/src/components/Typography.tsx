import type { HTMLAttributes, JSX, Ref } from 'react';
import { createElement } from 'react';
import { heading, textBlock } from '@var-ui/core/components/typography';
import type { HeadingVariantProps, TextBlockVariantProps } from '@var-ui/core';
import { recipeVars, styleVars } from '@var-ui/core/components/styleVars';
import { mergeProps } from 'typestyles';

const textVars = recipeVars(textBlock);

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  /** Semantic heading level (document outline). @default 2 */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Visual size, independent of level. @default md */
  size?: NonNullable<HeadingVariantProps['size']>;
  /** Ref to the underlying heading element. */
  ref?: Ref<HTMLHeadingElement>;
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
  ref,
  ...props
}: HeadingProps): JSX.Element {
  return createElement(`h${level}`, {
    ...props,
    ref,
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
  /** Uppercase eyebrow/overline label treatment. @default false */
  eyebrow?: boolean;
  /** Whitespace handling — `pre-wrap` preserves newlines and wrapping (agent output, memory bodies). @default normal */
  whiteSpace?: 'normal' | 'pre-wrap';
  /** Max lines before truncation. Counts above 3 go through the `lineClamp` variable. */
  lineClamp?: number;
  /** Ref to the underlying text element. */
  ref?: Ref<HTMLElement>;
};

/** Public numeric `lineClamp` stanzas resolved from the `textBlock.lineClamp` axis. */
const lineClampVariant: Record<1 | 2 | 3, NonNullable<TextBlockVariantProps['lineClamp']>> = {
  1: '1',
  2: '2',
  3: '3',
};

/**
 * Body text with size/tone/weight axes. Renders a `<p>` by default.
 *
 * ```tsx
 * <Text tone="secondary" size="sm">Supporting copy</Text>
 * <Text eyebrow size="xs">Steps</Text>
 * <Text whiteSpace="pre-wrap" lineClamp={20}>{agentOutput}</Text>
 * ```
 */
export function Text({
  as = 'p',
  size = 'md',
  tone = 'primary',
  weight = 'normal',
  eyebrow = false,
  whiteSpace = 'normal',
  lineClamp,
  className,
  ref,
  ...props
}: TextProps): JSX.Element {
  let clampVariant: NonNullable<TextBlockVariantProps['lineClamp']> | undefined;
  let clampStyle: Record<string, string> | undefined;
  if (lineClamp !== undefined) {
    if (lineClamp === 1 || lineClamp === 2 || lineClamp === 3) {
      clampVariant = lineClampVariant[lineClamp];
    } else {
      if (!Number.isInteger(lineClamp) || lineClamp < 1) {
        throw new Error('[var-ui] Text lineClamp must be a positive integer.');
      }
      clampVariant = 'n';
      clampStyle = styleVars([[textVars.lineClamp, lineClamp]]);
    }
  }
  return createElement(as, {
    ...props,
    ...mergeProps(
      textBlock({
        size,
        tone,
        weight,
        eyebrow,
        whiteSpace,
        lineClamp: clampVariant,
      }),
      className,
    ),
    ref,
    style: clampStyle ? { ...props.style, ...clampStyle } : props.style,
  });
}
