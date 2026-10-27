import type { ElementType, HTMLAttributes, JSX, ReactNode, Ref } from 'react';
import { createElement } from 'react';
import { hiddenClassName, type HiddenMap } from '@var-ui/core';
import { cx } from 'typestyles';

export type HiddenProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  hide?: boolean | HiddenMap;
  /** @default 'div' */
  as?: ElementType;
  /** Ref to the rendered root element. */
  ref?: Ref<HTMLElement>;
};

export function Hidden({
  as = 'div',
  hide,
  className,
  children,
  ref,
  ...props
}: HiddenProps): JSX.Element {
  return createElement(
    as,
    { ...props, ref, className: cx(hiddenClassName({ hide }), className) },
    children,
  );
}
