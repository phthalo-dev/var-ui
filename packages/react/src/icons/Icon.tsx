import type { JSX, ReactNode } from 'react';
import { icon, type IconName, type IconVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';
import { emptyFallback } from './emptyFallback';
import { useIcons } from './IconProvider';

export type IconProps = {
  /** Semantic name resolved via `IconProvider`; unmapped names render the empty fallback. */
  name?: IconName;
  /** Caller-supplied node — bypasses the registry entirely. */
  children?: ReactNode;
  size?: NonNullable<IconVariantProps['size']>;
  className?: string;
  'aria-label'?: string;
  'data-mirror'?: boolean | '';
};

/**
 * Registry-resolved icon shell. Decorative by default (`aria-hidden`); pass
 * `aria-label` to expose it as an image to assistive tech.
 *
 * ```tsx
 * <Icon name="search" />            // provider glyph (or empty fallback)
 * <Icon aria-label="Beta"><MySvg /></Icon>  // custom node, still recipe-sized
 * ```
 */
export function Icon({
  name,
  children,
  size = 'md',
  className,
  'aria-label': ariaLabel,
  'data-mirror': dataMirror,
}: IconProps): JSX.Element {
  const icons = useIcons();
  const glyph = children ?? (name ? icons[name] : undefined) ?? emptyFallback;
  return (
    <span
      {...mergeProps(icon({ size }), className)}
      data-mirror={dataMirror === false || dataMirror == null ? undefined : ''}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
    >
      {glyph}
    </span>
  );
}
