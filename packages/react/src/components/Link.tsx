import type { JSX, Ref } from 'react';
import { Link as AriaLink, type LinkProps as RACLinkProps } from 'react-aria-components';
import { link } from '@var-ui/core/components/link';
import { cx } from 'typestyles';

export type LinkProps = Omit<RACLinkProps, 'className'> & {
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** Ref to the underlying `<a>` element. */
  ref?: Ref<HTMLAnchorElement>;
};

export function Link({ className, ref, ...props }: LinkProps): JSX.Element {
  return <AriaLink {...props} className={cx(link, className)} ref={ref} />;
}
