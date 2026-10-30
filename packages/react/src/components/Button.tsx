import type { ComponentPropsWithRef, CSSProperties, JSX, ReactNode } from 'react';
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
import { toRacProps } from '../internal/racProps';

type ButtonOwnProps = ButtonVariantProps & {
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** Inline style for the root element. */
  style?: CSSProperties;
  /** Button content. */
  children?: ReactNode;
  /** Disables the button. A disabled button does not fire `onClick`. */
  disabled?: boolean;
};

/**
 * A `<button>`: the default when no `href` is given. Every native button attribute and handler
 * (`type`, `name`, `form`, `onClick`, `onFocus`, ...) reaches the element; `onClick` fires for
 * mouse, touch and keyboard activation.
 */
export type ButtonAsButtonProps = Omit<
  ComponentPropsWithRef<'button'>,
  keyof ButtonOwnProps | 'ref'
> &
  ButtonOwnProps & {
    href?: undefined;
    /** Shows a loading state and ignores presses while an action is in flight. */
    loading?: boolean;
    /** Ref to the underlying `<button>` element. */
    ref?: ComponentPropsWithRef<'button'>['ref'];
  };

/** An `<a>` styled as a button: rendered when `href` is given. */
export type ButtonAsLinkProps = Omit<
  ComponentPropsWithRef<'a'>,
  keyof ButtonOwnProps | 'ref' | 'href'
> &
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
    return (
      <AriaLink
        {...(toRacProps(rest) as RACLinkProps)}
        {...merged}
        render={racRenderWithExtras('a', extras) as never}
      />
    );
  }

  return (
    <AriaButton
      {...(toRacProps(rest) as RACButtonProps)}
      {...merged}
      render={racRenderWithExtras('button', extras) as never}
    />
  );
}
