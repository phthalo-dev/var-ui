import { card, carousel } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

const chevronLeft =
  '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor"><path d="M15 6l-6 6 6 6"></path></svg>';
const chevronRight =
  '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor"><path d="M9 6l6 6-6 6"></path></svg>';

function renderSlide(title: string, body: string): string {
  const c = card();
  const titleEl = serializeHtmlTag('h3', mergeProps(c.title), title);
  const bodyEl = serializeHtmlTag('div', mergeProps(c.body), body);
  const cardEl = serializeHtmlTag('div', mergeProps(c.root), `${titleEl}${bodyEl}`);
  const s = carousel();
  return serializeHtmlTag('div', { ...mergeProps(s.item), 'data-carousel-item': true }, cardEl);
}

export function render(): string {
  const s = carousel();
  const items = [
    renderSlide('Default', 'Scroll-snap slide.'),
    renderSlide('Forest', 'Scroll-snap slide.'),
    renderSlide('Rose', 'Scroll-snap slide.'),
  ].join('');
  const viewport = serializeHtmlTag(
    'div',
    {
      ...mergeProps(s.viewport),
      'data-carousel-viewport': true,
      tabindex: '0',
      style: 'grid-auto-columns: 13.75rem',
    },
    items,
  );
  const prev = serializeHtmlTag(
    'button',
    { type: 'button', ...mergeProps(s.control), 'aria-label': 'Previous', disabled: true },
    chevronLeft,
  );
  const next = serializeHtmlTag(
    'button',
    { type: 'button', ...mergeProps(s.control), 'aria-label': 'Next', disabled: true },
    chevronRight,
  );
  const controls = serializeHtmlTag('div', mergeProps(s.controls), `${prev}${next}`);
  return serializeHtmlTag(
    'section',
    { ...mergeProps(s.root), role: 'region', 'aria-label': 'Featured themes' },
    `${viewport}${controls}`,
  );
}
