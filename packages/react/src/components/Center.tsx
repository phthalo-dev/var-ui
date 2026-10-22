import type { HTMLAttributes, JSX } from 'react';
import { center, type CenterVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type CenterProps = HTMLAttributes<HTMLDivElement> & {
  /** Use inline-grid so the box shrink-wraps inside text flow. @default false */
  inline?: NonNullable<CenterVariantProps['inline']>;
};

/** Centers children on both axes. */
export function Center({ inline = false, className, ...props }: CenterProps): JSX.Element {
  return <div {...props} {...mergeProps(center({ inline }), className)} />;
}
