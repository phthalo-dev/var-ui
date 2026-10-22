import type { HTMLAttributes, JSX } from 'react';
import { aspectRatio } from '@var-ui/core';
import { cx } from 'typestyles';

export type AspectRatioProps = HTMLAttributes<HTMLDivElement> & {
  /** width / height, e.g. `16 / 9` or `1`. Defaults to the recipe's 16/9. */
  ratio?: number;
};

/**
 * Constrains children (images, embeds, maps) to a fixed aspect ratio.
 *
 * ```tsx
 * <AspectRatio ratio={4 / 3}><img src={cover} alt="…" /></AspectRatio>
 * ```
 */
export function AspectRatio({ ratio, className, style, ...props }: AspectRatioProps): JSX.Element {
  return (
    <div
      {...props}
      className={cx(aspectRatio(), className)}
      style={ratio ? { ...style, aspectRatio: String(ratio) } : style}
    />
  );
}
