import {
  layout,
  layoutContent,
  layoutHeader,
  layoutPanel,
  layoutShellPaddingAssignments,
  textBlock,
} from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

function styleFromAssignments(assignments: Record<string, string>): string {
  return Object.entries(assignments)
    .map(([name, value]) => `${name}:${value}`)
    .join(';');
}

export function render(): string {
  const shell = layout({ height: 'auto' });
  const h = layoutHeader({});
  const header = serializeHtmlTag(
    'div',
    mergeProps(h.header),
    serializeHtmlTag('div', mergeProps(h.headerInner), 'Explorer'),
  );
  const pStart = layoutPanel({ hasDivider: true });
  const start = serializeHtmlTag(
    'div',
    { ...mergeProps(pStart.panel), 'data-side': 'start', style: 'width:11.25rem' },
    'Nav',
  );
  const content = serializeHtmlTag(
    'div',
    mergeProps(layoutContent({ padding: 'inherit' }).content),
    serializeHtmlTag('p', mergeProps(textBlock({ size: 'sm' })), 'Main content'),
  );
  const pEnd = layoutPanel({ hasDivider: true });
  const end = serializeHtmlTag(
    'div',
    {
      ...mergeProps(pEnd.panel),
      'data-side': 'end',
      style: 'width:15rem',
      role: 'complementary',
      'aria-label': 'Details',
    },
    'Inspector',
  );
  const middle = serializeHtmlTag('div', mergeProps(shell.middle), `${start}${content}${end}`);
  const inner = serializeHtmlTag('div', mergeProps(shell.inner), `${header}${middle}`);
  const outer = serializeHtmlTag('div', mergeProps(shell.outer), inner);
  return serializeHtmlTag(
    'div',
    {
      ...mergeProps(shell.root),
      style: styleFromAssignments(layoutShellPaddingAssignments(0)),
      'data-has-header': '',
      'data-has-start': '',
      'data-has-end': '',
    },
    outer,
  );
}
