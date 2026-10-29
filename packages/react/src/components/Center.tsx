import type { HTMLAttributes, JSX, Ref } from 'react';
import { center } from '@var-ui/core/components/center';
import type { CenterVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type CenterProps = HTMLAttributes<HTMLDivElement> & {
  /** Use inline-grid so the box shrink-wraps inside text flow. @default false */
  inline?: NonNullable<CenterVariantProps['inline']>;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

/** Centers children on both axes. */
export function Center({ inline = false, className, ref, ...props }: CenterProps): JSX.Element {
  return <div {...props} {...mergeProps(center({ inline }), className)} ref={ref} />;
}
