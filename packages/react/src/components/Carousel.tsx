import type { JSX, ReactNode, Ref } from 'react';
import { Children, useRef } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { carousel } from '@var-ui/core';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';

export type CarouselProps = {
  /** Slides to render inside the scroll viewport. */
  children: ReactNode;
  /** Accessible name for the carousel region. */
  label: string;
  /** Accessible name for the scrollable viewport. @default `label` */
  viewportLabel?: string;
  /** Accessible name for each slide group. @default (index, count) => `${index} of ${count}` */
  getSlideLabel?: (index: number, count: number) => string;
  /** CSS length for each snap item. @default 280px */
  itemWidth?: string;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** Ref to the underlying `<section>` element. */
  ref?: Ref<HTMLElement>;
};

function defaultSlideLabel(index: number, count: number): string {
  return `${index} of ${count}`;
}

/**
 * Scroll-snap carousel with prev/next nudge buttons. CSS-first: no index
 * state, no autoplay — the viewport is natively scrollable and focusable.
 *
 * ```tsx
 * <Carousel label="Featured">{cards}</Carousel>
 * ```
 */
export function Carousel({
  children,
  label,
  viewportLabel,
  getSlideLabel = defaultSlideLabel,
  itemWidth,
  className,
  ref,
}: CarouselProps): JSX.Element {
  const s = carousel();
  const viewportRef = useRef<HTMLDivElement>(null);

  const slides = Children.toArray(children);
  const slideCount = slides.length;

  const nudge = (direction: 1 | -1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const item = viewport.querySelector('[data-carousel-item]');
    const step = item instanceof HTMLElement ? item.offsetWidth : viewport.clientWidth;
    viewport.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return (
    <section
      {...mergeProps(s.root, className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      ref={ref}
    >
      <div
        ref={viewportRef}
        {...mergeProps(s.viewport)}
        data-carousel-viewport
        tabIndex={0}
        role="group"
        aria-label={viewportLabel ?? label}
        style={itemWidth ? { gridAutoColumns: itemWidth } : undefined}
      >
        {slides.map((child, index) => (
          <div
            key={index}
            {...mergeProps(s.item)}
            data-carousel-item
            role="group"
            aria-roledescription="slide"
            aria-label={getSlideLabel(index + 1, slideCount)}
          >
            {child}
          </div>
        ))}
      </div>
      <div {...mergeProps(s.controls)}>
        <AriaButton {...mergeProps(s.control)} aria-label="Previous" onPress={() => nudge(-1)}>
          <Icon name="chevronLeft" size="sm" />
        </AriaButton>
        <AriaButton {...mergeProps(s.control)} aria-label="Next" onPress={() => nudge(1)}>
          <Icon name="chevronRight" size="sm" />
        </AriaButton>
      </div>
    </section>
  );
}
