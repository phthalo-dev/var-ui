import type { HTMLAttributes, JSX, Ref } from 'react';
import { aspectRatio } from '@var-ui/core/components/aspectRatio';
import { cx } from 'typestyles';

export type AspectRatioProps = HTMLAttributes<HTMLDivElement> & {
  /** width / height, e.g. `16 / 9` or `1`. Defaults to the recipe's 16/9. */
  ratio?: number;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Constrains children (images, embeds, maps) to a fixed aspect ratio.
 *
 * ```tsx
 * <AspectRatio ratio={4 / 3}><img src={cover} alt="…" /></AspectRatio>
 * ```
 */
export function AspectRatio({
  ratio,
  className,
  style,
  ref,
  ...props
}: AspectRatioProps): JSX.Element {
  return (
    <div
      {...props}
      ref={ref}
      className={cx(aspectRatio(), className)}
      style={ratio ? { ...style, aspectRatio: String(ratio) } : style}
    />
  );
}
