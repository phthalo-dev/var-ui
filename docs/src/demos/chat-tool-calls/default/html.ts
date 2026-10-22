import { chatToolCalls } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

const wrenchIcon =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0-5.6 5.6l-5.4 5.4a2 2 0 1 0 2.8 2.8l5.4-5.4a4 4 0 0 0 5.6-5.6l-2.1 2.1-1.8-1.8 2.1-2.1z"></path></svg>';
const chevronIcon =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"></path></svg>';

export function render(): string {
  // Collapsed 2+ group summary — expand/collapse is React-only.
  const t = chatToolCalls({ status: 'complete', expanded: false });
  const header = serializeHtmlTag(
    'button',
    {
      type: 'button',
      ...mergeProps(t.header),
      'aria-expanded': 'false',
      disabled: true,
    },
    `${serializeHtmlTag('span', mergeProps(t.statusIcon), wrenchIcon)}${serializeHtmlTag('span', mergeProps(t.name), 'run_tests')}${serializeHtmlTag('span', mergeProps(t.chevron), chevronIcon)}`,
  );
  return serializeHtmlTag('div', mergeProps(t.root), header);
}
