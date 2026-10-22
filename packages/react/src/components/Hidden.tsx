import type { ElementType, HTMLAttributes, JSX, ReactNode } from 'react';
import { createElement } from 'react';
import { hiddenClassName, type HiddenMap } from '@var-ui/core';
import { cx } from 'typestyles';

export type HiddenProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  hide?: boolean | HiddenMap;
  /** @default 'div' */
  as?: ElementType;
};

export function Hidden({
  as = 'div',
  hide,
  className,
  children,
  ...props
}: HiddenProps): JSX.Element {
  return createElement(
    as,
    { ...props, className: cx(hiddenClassName({ hide }), className) },
    children,
  );
}
