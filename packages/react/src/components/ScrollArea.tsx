import type { HTMLAttributes, JSX, ReactNode, Ref } from 'react';
import { resolveScrollAreaFade, scrollArea, type ScrollAreaVariantProps } from '@var-ui/core';
import { mergeProps } from './utils';

export type ScrollAreaProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ReactNode;
  /** @default 'vertical' */
  orientation?: NonNullable<ScrollAreaVariantProps['orientation']>;
  /** Edge fade masks. @default false */
  fade?: boolean | NonNullable<ScrollAreaVariantProps['fade']>;
  className?: string;
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
  orientation = 'vertical',
  fade = false,
  className,
  viewportClassName,
  viewportRef,
  ...props
}: ScrollAreaProps): JSX.Element {
  const fadeMode = resolveScrollAreaFade(fade, orientation);
  const s = scrollArea({ fade: fadeMode, orientation });
  const showVerticalFade = fadeMode === 'vertical' || fadeMode === 'both';
  const showHorizontalFade = fadeMode === 'horizontal' || fadeMode === 'both';

  return (
    <div {...props} {...mergeProps(s.root, className)}>
      <div ref={viewportRef} {...mergeProps(s.viewport, viewportClassName)}>
        {showVerticalFade ? (
          <div aria-hidden {...mergeProps(s.fadeTop)} data-edge="block-start" />
        ) : null}
        {showHorizontalFade ? (
          <div aria-hidden {...mergeProps(s.fadeStart)} data-edge="inline-start" />
        ) : null}
        {children}
        {showHorizontalFade ? (
          <div aria-hidden {...mergeProps(s.fadeEnd)} data-edge="inline-end" />
        ) : null}
        {showVerticalFade ? (
          <div aria-hidden {...mergeProps(s.fadeBottom)} data-edge="block-end" />
        ) : null}
      </div>
    </div>
  );
}
