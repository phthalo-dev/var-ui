import type { ComponentPropsWithRef, JSX, ReactNode } from 'react';
import { Link as AriaLink, type LinkProps as RACLinkProps } from 'react-aria-components';
import { link } from '@var-ui/core/components/link';
import type { LinkVariantProps } from '@var-ui/core/components/link';
import type { IconName } from '@var-ui/core';
import { mergeProps } from 'typestyles';
import { Icon } from '../icons';
import { toRacProps } from '../internal/racProps';

/** A registry icon name (`'chevronLeft'`) or any node (an `<svg>`, a custom icon). */
type LinkIcon = IconName | Exclude<ReactNode, string>;

export type LinkProps = Omit<ComponentPropsWithRef<'a'>, 'className'> & {
  /** Renders the link as disabled (not focusable or activatable). */
  disabled?: boolean;
  /** `accent` is the link colour; `primary` / `secondary` are text colours for quiet links. @default accent */
  tone?: NonNullable<LinkVariantProps['tone']>;
  /** Font size. `inherit` matches the surrounding text, so links in a sentence fit it. @default inherit */
  size?: NonNullable<LinkVariantProps['size']>;
  /** Icon before the text, sized to the text (`1em`). Decorative: the link text names the link. */
  startIcon?: LinkIcon;
  /** Icon after the text, sized to the text (`1em`) ("View raw ↗"). */
  endIcon?: LinkIcon;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
};

function renderIcon(icon: LinkIcon, className: Record<string, string>): JSX.Element {
  return (
    <span {...className} aria-hidden="true">
      {typeof icon === 'string' ? <Icon name={icon as IconName} /> : icon}
    </span>
  );
}

/**
 * Link on react-aria `Link`. Native `<a>` attributes (`href`, `target`, `onClick`, ...) and `ref`
 * reach the anchor.
 *
 * ```tsx
 * <Link href="/runs" tone="secondary" size="sm" startIcon="chevronLeft">Back to runs</Link>
 * ```
 */
export function Link({
  className,
  disabled,
  tone,
  size,
  startIcon,
  endIcon,
  children,
  ...props
}: LinkProps): JSX.Element {
  const l = link({ tone, size });
  const iconClass = mergeProps(l.icon);
  return (
    <AriaLink
      {...(props as RACLinkProps)}
      {...toRacProps({ disabled })}
      {...mergeProps(l.root, className)}
    >
      {startIcon != null ? renderIcon(startIcon, iconClass) : null}
      {children}
      {endIcon != null ? renderIcon(endIcon, iconClass) : null}
    </AriaLink>
  );
}
