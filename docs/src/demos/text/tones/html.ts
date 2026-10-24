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
    serializeHtmlTag(
      'p',
      mergeProps(textBlock({ tone: 'danger' })),
      'Danger text for errors and validation messages.',
    ),
  ].join('\n');
}
