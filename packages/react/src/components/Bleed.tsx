import type { HTMLAttributes, JSX, Ref } from 'react';
import { bleed } from '@var-ui/core/components/bleed';
import { recipeVars, styleVars } from '@var-ui/core/components/styleVars';
import { mergeProps } from 'typestyles';

const bleedVars = recipeVars(bleed);

export type BleedProps = HTMLAttributes<HTMLDivElement> & {
  /** `content` keeps the children on the page column; `edge` lets them bleed too. @default content */
  align?: 'content' | 'edge';
  /** The frame container's own inline padding, which the bleed also covers. Any CSS length. @default 0px */
  gutter?: string;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Spans the frame edge to edge from inside a padded, centred column. The frame (an ancestor) must
 * be an inline-size container: `container-type: inline-size`.
 *
 * ```tsx
 * <Bleed gutter="2rem">{pageBar}</Bleed>
 * ```
 */
export function Bleed({
  align = 'content',
  gutter,
  className,
  style,
  ref,
  ...props
}: BleedProps): JSX.Element {
  const vars = styleVars([[bleedVars.gutter, gutter]]);
  return (
    <div
      {...props}
      {...mergeProps(bleed({ align }), className)}
      style={vars ? { ...vars, ...style } : style}
      ref={ref}
    />
  );
}
