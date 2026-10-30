import type { JSX, ReactElement, ReactNode, Ref } from 'react';
import { Button as AriaButton, Link as AriaLink } from 'react-aria-components';

/**
 * Native attributes react-aria-components silently drops from its
 * `filterDOMProps` pass (it only forwards `id`, `data-*`, `lang`/`dir`/`hidden`
 * and mouse/pointer events). Everything matched here is re-applied to the DOM
 * element through RAC's `render` prop so a RAC-backed component behaves like
 * the plain element it wraps.
 */
const DROPPED_BY_RAC =
  /^(aria-|title$|role$|tabIndex$|accessKey$|draggable$|spellCheck$|contentEditable$|autoCapitalize$|enterKeyHint$|inputMode$|nonce$|popover)/;

/** Picks the attributes from `props` that RAC would otherwise drop. */
export function pickRacDroppedDomProps(props: object): Record<string, unknown> {
  const picked: Record<string, unknown> = {};
  for (const key of Object.keys(props)) {
    if (DROPPED_BY_RAC.test(key)) picked[key] = (props as Record<string, unknown>)[key];
  }
  return picked;
}

type RenderFn = (domProps: never, renderProps: never) => ReactElement;

/**
 * Builds a RAC `render` function that renders `tag` with RAC's computed DOM
 * props and then the `extras` on top. Returns `undefined` when there is
 * nothing to add (so RAC keeps its default element). A caller-supplied `render`
 * receives the merged props instead.
 */
export function racRenderWithExtras(
  tag: 'button' | 'a' | 'label' | 'div',
  extras: Record<string, unknown>,
  userRender?: RenderFn,
): RenderFn | undefined {
  if (Object.keys(extras).length === 0) return userRender;
  return ((domProps: Record<string, unknown>, renderProps: never) => {
    const merged = { ...domProps, ...extras };
    if (userRender)
      return (userRender as (p: unknown, r: never) => ReactElement)(merged, renderProps);
    const Tag = tag as 'button';
    return <Tag {...merged} />;
  }) as unknown as RenderFn;
}

type LinkOrButtonProps = {
  href?: string;
  isDisabled?: boolean;
  ref?: Ref<HTMLElement>;
  children?: ReactNode;
  [prop: string]: unknown;
};

/**
 * RAC `Link` (when `href` is set) or `Button`, with native attributes RAC would
 * drop re-applied (see {@link pickRacDroppedDomProps}). Shared by the nav rows.
 */
export function RacLinkOrButton({ href, ref, children, ...rest }: LinkOrButtonProps): JSX.Element {
  const extras = pickRacDroppedDomProps(rest);
  return href ? (
    <AriaLink
      href={href}
      {...(rest as object)}
      render={racRenderWithExtras('a', extras, rest.render as never) as never}
      ref={ref as Ref<HTMLAnchorElement>}
    >
      {children}
    </AriaLink>
  ) : (
    <AriaButton
      {...(rest as object)}
      render={racRenderWithExtras('button', extras, rest.render as never) as never}
      ref={ref as Ref<HTMLButtonElement>}
    >
      {children}
    </AriaButton>
  );
}
