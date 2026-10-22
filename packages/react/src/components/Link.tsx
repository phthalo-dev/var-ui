import type { JSX } from 'react';
import { Link as AriaLink, type LinkProps as RACLinkProps } from 'react-aria-components';
import { link } from '@var-ui/core';
import { cx } from 'typestyles';

export type LinkProps = Omit<RACLinkProps, 'className'> & {
  /** Additional CSS class names merged onto the root element. */
  className?: string;
};

export function Link({ className, ...props }: LinkProps): JSX.Element {
  return <AriaLink {...props} className={cx(link, className)} />;
}
