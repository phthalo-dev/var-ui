import type { ComponentPropsWithRef, JSX } from 'react';
import { Link as AriaLink, type LinkProps as RACLinkProps } from 'react-aria-components';
import { link } from '@var-ui/core/components/link';
import { cx } from 'typestyles';
import { toRacProps } from '../internal/racProps';

export type LinkProps = Omit<ComponentPropsWithRef<'a'>, 'className'> & {
  /** Renders the link as disabled (not focusable or activatable). */
  disabled?: boolean;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
};

/**
 * Link on react-aria `Link`. Native `<a>` attributes (`href`, `target`, `onClick`, ...) and `ref`
 * reach the anchor.
 */
export function Link({ className, disabled, ...props }: LinkProps): JSX.Element {
  return (
    <AriaLink
      {...(props as RACLinkProps)}
      {...toRacProps({ disabled })}
      className={cx(link, className)}
    />
  );
}
