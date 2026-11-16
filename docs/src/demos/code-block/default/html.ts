import { codeBlock } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const cb = codeBlock();
  const code = 'const greeting = "hello";';
  const language = serializeHtmlTag('span', mergeProps(cb.language), 'tsx');
  const title = serializeHtmlTag('div', mergeProps(cb.title), language);
  const header = serializeHtmlTag(
    'div',
    { ...mergeProps(cb.header), 'data-codeblock-header': true },
    title,
  );
  const codeEl = serializeHtmlTag('code', mergeProps(cb.code), code);
  const pre = serializeHtmlTag(
    'pre',
    {
      ...mergeProps(cb.pre),
      'data-codeblock-pre': true,
    },
    codeEl,
  );
  const body = serializeHtmlTag(
    'div',
    {
      ...mergeProps(cb.body),
      'data-codeblock-body': true,
    },
    pre,
  );
  return serializeHtmlTag(
    'div',
    {
      ...mergeProps(cb.root),
      'data-codeblock': true,
    },
    `${header}${body}`,
  );
}
