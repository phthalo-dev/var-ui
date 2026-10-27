import type { HTMLAttributes, JSX, ReactNode, Ref } from 'react';
import type { VariantOptions } from 'typestyles';
import {
  resolveScrollAreaFade,
  scrollArea,
  scrollAreaFade,
  scrollAreaFadeEdgesFor,
  scrollAreaOrientation,
} from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type ScrollAreaProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ReactNode;
  /** @default 'vertical' */
  orientation?: VariantOptions<typeof scrollAreaOrientation>;
  /** Edge fade masks. @default false */
  fade?: boolean | VariantOptions<typeof scrollAreaFade>;
  className?: string;
  /** Ref to the underlying root `<div>` element. */
  ref?: Ref<HTMLDivElement>;
  viewportClassName?: string;
  /** Ref for the scrollable viewport element. */
  viewportRef?: Ref<HTMLDivElement>;
};

/**
 * Accessible scroll container with optional edge fade masks.
 *
 * ```tsx
 * <ScrollArea fade="vertical" style={{ maxHeight: 320 }}>
 *   {longContent}
 * </ScrollArea>
 * ```
 */
export function ScrollArea({
  children,
  orientation = scrollAreaOrientation.default,
  fade = false,
  className,
  viewportClassName,
  viewportRef,
  ref,
  ...props
}: ScrollAreaProps): JSX.Element {
  const fadeMode = resolveScrollAreaFade(fade, orientation);
  const s = scrollArea({ fade: fadeMode, orientation });
  const edges = scrollAreaFadeEdgesFor(fadeMode);

  return (
    <div {...props} {...mergeProps(s.root, className)} ref={ref}>
      <div ref={viewportRef} {...mergeProps(s.viewport, viewportClassName)}>
        {edges.block ? (
          <div aria-hidden {...mergeProps(s.fadeTop)} data-edge="block-start" />
        ) : null}
        {edges.inline ? (
          <div aria-hidden {...mergeProps(s.fadeStart)} data-edge="inline-start" />
        ) : null}
        {children}
        {edges.inline ? (
          <div aria-hidden {...mergeProps(s.fadeEnd)} data-edge="inline-end" />
        ) : null}
        {edges.block ? (
          <div aria-hidden {...mergeProps(s.fadeBottom)} data-edge="block-end" />
        ) : null}
      </div>
    </div>
  );
}
