import { chatMessage, chatMessageBubble } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const m = chatMessage({ sender: 'assistant' });
  const first = chatMessageBubble({ sender: 'assistant', appearance: 'solid', group: 'first' });
  const last = chatMessageBubble({ sender: 'assistant', appearance: 'solid', group: 'last' });
  const name = serializeHtmlTag(
    'div',
    mergeProps(m.header),
    serializeHtmlTag('span', mergeProps(m.name), 'Navi'),
  );
  const bubbles = `${serializeHtmlTag('div', mergeProps(first.root), 'First part of a multi-part reply.')}${serializeHtmlTag('div', mergeProps(last.root), 'Second part.')}`;
  const content = serializeHtmlTag('div', mergeProps(m.content), `${name}${bubbles}`);
  return serializeHtmlTag('div', mergeProps(m.root), content);
}
