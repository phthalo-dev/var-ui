import { mobileNav } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const s = mobileNav();
  // A non-modal `open` dialog renders in flow, which is what a static preview needs.
  return serializeHtmlTag(
    'div',
    { 'data-var-ui-mobile-nav': true },
    serializeHtmlTag(
      'dialog',
      {
        ...mergeProps(s.popup),
        'data-var-ui-mobile-nav-popup': true,
        'data-side': 'start',
        'aria-label': 'Navigation',
        open: true,
        style: 'position: relative; inset: auto; margin: 0; height: 160px',
      },
      'Menu',
    ),
  );
}
