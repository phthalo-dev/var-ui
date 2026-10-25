import { textBlock } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  return [
    serializeHtmlTag('p', mergeProps(textBlock({})), 'Primary text is the default.'),
    serializeHtmlTag(
      'p',
      mergeProps(textBlock({ tone: 'secondary' })),
      'Secondary text for supporting copy.',
    ),
    serializeHtmlTag('p', mergeProps(textBlock({ tone: 'accent' })), 'Accent text for emphasis.'),
    serializeHtmlTag(
      'p',
      mergeProps(textBlock({ tone: 'success' })),
      'Success text for confirmations.',
    ),
    serializeHtmlTag('p', mergeProps(textBlock({ tone: 'warning' })), 'Warning text for cautions.'),
    serializeHtmlTag(
      'p',
      mergeProps(textBlock({ tone: 'danger' })),
      'Danger text for errors and validation messages.',
    ),
    serializeHtmlTag(
      'p',
      mergeProps(textBlock({ tone: 'info' })),
      'Info text for neutral notices.',
    ),
  ].join('\n');
}
