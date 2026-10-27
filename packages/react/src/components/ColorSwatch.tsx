import type { ButtonHTMLAttributes, JSX, Ref } from 'react';
import { colorSwatch, type ColorSwatchVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type ColorSwatchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  /** CSS color shown in the swatch. */
  color: string;
  size?: NonNullable<ColorSwatchVariantProps['size']>;
  /** Highlights the swatch as the active selection. */
  selected?: boolean;
  /** Ref to the underlying `<button>` element. */
  ref?: Ref<HTMLButtonElement>;
};

/**
 * Compact color chip for palettes and picker swatch rows. Mantine
 * `ColorSwatch` equivalent.
 */
export function ColorSwatch({
  color,
  size = 'md',
  selected,
  className,
  style,
  ref,
  ...props
}: ColorSwatchProps): JSX.Element {
  const cs = colorSwatch({ size });
  return (
    <button
      type="button"
      {...props}
      {...mergeProps(cs.root, className)}
      ref={ref}
      data-selected={selected || undefined}
      style={{ ...style, backgroundColor: color }}
      aria-pressed={selected}
    />
  );
}
