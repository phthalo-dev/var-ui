import type { ComponentPropsWithRef, ReactElement, Ref } from 'react';

/**
 * Props for overlay `Trigger` parts. A trigger renders no element of its own: it merges these
 * props (native attributes, handlers, `className`, `ref`) onto its single child element.
 */
export type OverlayTriggerProps = Omit<ComponentPropsWithRef<'button'>, 'children' | 'ref'> & {
  /** Single element that receives the trigger props. */
  children: ReactElement;
  /** Ref to the trigger element. */
  ref?: Ref<HTMLElement>;
};

/**
 * Props for overlay `Close` parts: either wraps a single child element, or renders the default
 * close `<button>` when no child is given.
 */
export type OverlayCloseProps = Omit<ComponentPropsWithRef<'button'>, 'children' | 'value'> & {
  children?: ReactElement;
};
