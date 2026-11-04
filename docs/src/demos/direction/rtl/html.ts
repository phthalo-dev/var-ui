import { breadcrumbs, icon, sideNav, textBlock } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

const chevronRight =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"></path></svg>';

export function render(): string {
  const s = sideNav();
  const b = breadcrumbs();
  const i = icon({ size: 'sm' });
  const heading = serializeHtmlTag('div', mergeProps(s.heading), 'Docs');
  const stickyTop = serializeHtmlTag('div', mergeProps(s.stickyTop), heading);
  const overview = serializeHtmlTag(
    'a',
    { ...mergeProps(s.item), href: '#overview', 'data-selected': true },
    serializeHtmlTag('span', mergeProps(s.itemLabel), 'Overview'),
  );
  const hidden = serializeHtmlTag(
    'a',
    { ...mergeProps(s.item), href: '#hidden' },
    serializeHtmlTag('span', mergeProps(s.itemLabel), 'Hidden'),
  );
  const section = serializeHtmlTag(
    'div',
    mergeProps(s.section),
    serializeHtmlTag('div', mergeProps(s.sectionTitle), 'Main') + overview + hidden,
  );
  const nav = serializeHtmlTag(
    'nav',
    { ...mergeProps(s.root), 'aria-label': 'Side navigation', 'data-var-ui-side-nav': true },
    stickyTop + serializeHtmlTag('div', mergeProps(s.scrollable), section),
  );
  const chrome = serializeHtmlTag(
    'div',
    {
      style:
        'height: 17.5rem; width: 15rem; border: 0.0625rem solid var(--var-ui-color-border-subtle); border-radius: 0.5rem; overflow: hidden;',
    },
    nav,
  );
  const items = [
    { id: 'home', label: 'Home', href: '#' },
    { id: 'here', label: 'Current' },
  ];
  const lastId = items[items.length - 1]?.id;
  const lis = items
    .map((item) => {
      const isCurrent = item.id === lastId;
      const link =
        item.href && !isCurrent
          ? serializeHtmlTag('a', { ...mergeProps(b.link), href: item.href }, item.label)
          : serializeHtmlTag('span', { ...mergeProps(b.link), 'data-disabled': true }, item.label);
      return serializeHtmlTag(
        'li',
        { ...mergeProps(b.item), ...(isCurrent ? { 'data-current': true } : {}) },
        link,
      );
    })
    .join('');
  const crumbs = serializeHtmlTag(
    'nav',
    { ...mergeProps(b.root), 'aria-label': 'Breadcrumb' },
    serializeHtmlTag('ol', mergeProps(b.list), lis),
  );
  const mirrored = serializeHtmlTag(
    'div',
    { style: 'display: flex; gap: 0.5rem; align-items: center;' },
    serializeHtmlTag('span', { ...mergeProps(i), 'data-mirror': true }, chevronRight) +
      serializeHtmlTag('p', mergeProps(textBlock({})), 'mirrored chevrons') +
      serializeHtmlTag('span', { ...mergeProps(i), 'data-mirror': true }, chevronRight),
  );
  const text = serializeHtmlTag('p', mergeProps(textBlock({})), 'dir=rtl island');
  return serializeHtmlTag('div', { dir: 'rtl' }, chrome + crumbs + mirrored + text);
}
