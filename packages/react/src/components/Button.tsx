import type { ComponentPropsWithRef, JSX } from 'react';
import {
  Button as AriaButton,
  Link as AriaLink,
  type ButtonProps as RACButtonProps,
  type LinkProps as RACLinkProps,
} from 'react-aria-components';
import { button } from '@var-ui/core/components/button';
import type { ButtonVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';
import { pickRacDroppedDomProps, racRenderWithExtras } from '../internal/racDomProps';

type ButtonOwnProps = ButtonVariantProps & {
  /** Additional CSS class names merged onto the root element. */
  className?: string;
};

/** Native `<button>` attributes RAC does not model itself (`title`, `tabIndex`, `form`, ...). */
type NativeButtonProps = Omit<
  ComponentPropsWithRef<'button'>,
  keyof RACButtonProps | keyof ButtonOwnProps | 'children' | 'style' | 'href'
>;

/** Native `<a>` attributes RAC does not model itself. */
type NativeAnchorProps = Omit<
  ComponentPropsWithRef<'a'>,
  keyof RACLinkProps | keyof ButtonOwnProps | 'children' | 'style' | 'href'
>;

/** A `<button>`: the default when no `href` is given. */
export type ButtonAsButtonProps = Omit<RACButtonProps, 'className'> &
  NativeButtonProps &
  ButtonOwnProps & {
    href?: undefined;
    /** Ref to the underlying `<button>` element. */
    ref?: ComponentPropsWithRef<'button'>['ref'];
  };

/** An `<a>` styled as a button: rendered when `href` is given. */
export type ButtonAsLinkProps = Omit<RACLinkProps, 'className'> &
  NativeAnchorProps &
  ButtonOwnProps & {
    /** Renders an `<a>` instead of a `<button>`. */
    href: string;
    /** Ref to the underlying `<a>` element. */
    ref?: ComponentPropsWithRef<'a'>['ref'];
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

/**
 * Button chrome. Renders a `<button>`, or an `<a>` (via react-aria's link
 * support) when `href` is set, so a button can be a link.
 */
export function Button(props: ButtonProps): JSX.Element {
  const { tone, appearance, size = 'md', layout, elevated, className, ...rest } = props;
  const styles = button({ tone, appearance, size, layout, elevated });
  const merged = mergeProps(styles, className);
  const extras = pickRacDroppedDomProps(rest);

  if (props.href !== undefined) {
    const linkRest = rest as Omit<ButtonAsLinkProps, keyof ButtonOwnProps>;
    return (
      <AriaLink
        {...(linkRest as RACLinkProps)}
        {...merged}
        render={racRenderWithExtras('a', extras, linkRest.render as never) as never}
      />
    );
  }

  const buttonRest = rest as Omit<ButtonAsButtonProps, keyof ButtonOwnProps>;
  return (
    <AriaButton
      {...(buttonRest as RACButtonProps)}
      {...merged}
      render={racRenderWithExtras('button', extras, buttonRest.render as never) as never}
    />
  );
}
