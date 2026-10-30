import { cloneElement, isValidElement, type ReactElement, type Ref } from 'react';
import { Focusable, Pressable } from 'react-aria-components';
import { cx } from 'typestyles';
import { mergeRefs } from '../internal/mergeRefs';

type OverlayChildProps = Record<string, unknown> & { ref?: Ref<unknown> };

/** Calls `existing` (when it is a function) and then `ours`, with the same arguments. */
export function composeHandlers(
  existing: unknown,
  ours: unknown,
): ((...args: unknown[]) => void) | undefined {
  const first = typeof existing === 'function' ? existing : undefined;
  const second = typeof ours === 'function' ? ours : undefined;
  if (!first || !second) return (first ?? second) as ((...args: unknown[]) => void) | undefined;
  return (...args: unknown[]) => {
    first(...args);
    second(...args);
  };
}

const isHandlerName = (name: string) => /^on[A-Z]/.test(name);

/**
 * Clones `child` with `props` merged on: `className`s concatenate, refs merge, and every `on*`
 * handler present on both runs the child's first.
 */
export function mergeOverlayChild(child: ReactElement, props: OverlayChildProps): ReactElement {
  if (!isValidElement(child)) {
    throw new Error('Overlay Trigger and Close require a single React element child');
  }

  const childProps = child.props as OverlayChildProps;
  const mergedProps: OverlayChildProps = {
    ...props,
    className: cx(
      childProps.className as string | undefined,
      props.className as string | undefined,
    ),
  };

  for (const name of Object.keys(props)) {
    if (isHandlerName(name) && name in childProps) {
      mergedProps[name] = composeHandlers(childProps[name], props[name]);
    }
  }

  mergedProps.ref =
    childProps.ref && props.ref
      ? mergeRefs(childProps.ref, props.ref)
      : (props.ref ?? childProps.ref);

  return cloneElement(child, mergedProps);
}

/**
 * How a wired child registers with react-aria's trigger context: `press` (Pressable, for
 * Dialog/Popover/Menu triggers and Close buttons), `focusable` (Focusable, for Tooltip), or
 * `none` (plain merge). react-aria injects trigger props through context rather than
 * `cloneElement`, so host elements such as `<button>` must be wrapped to register; react-aria
 * components (`Button`) already register themselves.
 */
export type OverlayChildMode = 'press' | 'focusable' | 'none';

/**
 * `mergeOverlayChild` plus the react-aria registration wrapper for host elements.
 *
 * `onActivate` runs when the child is activated: `onClick` for host elements (react-aria's
 * `Pressable` takes its handlers from its own props, not the child's) and `onPress` for
 * components, never both, so it fires once.
 */
export function wireOverlayChild(
  child: ReactElement,
  props: OverlayChildProps,
  mode: OverlayChildMode,
  onActivate?: (event: Event | null) => void,
): ReactElement {
  const isHost = typeof child.type === 'string';
  const merged = mergeOverlayChild(child, {
    ...props,
    ...(onActivate
      ? isHost
        ? { onClick: (e: { nativeEvent?: Event }) => onActivate(e.nativeEvent ?? null) }
        : { onPress: () => onActivate(null) }
      : null),
  });
  if (mode === 'none' || !isHost) return merged;
  const element = merged as ReactElement<{ className?: string }, string>;
  return mode === 'press' ? <Pressable>{element}</Pressable> : <Focusable>{element}</Focusable>;
}
