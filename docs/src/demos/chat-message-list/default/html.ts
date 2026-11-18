import { chatMessage, chatMessageBubble, chatMessageList } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

function message(sender: 'assistant' | 'user', text: string): string {
  const m = chatMessage({ sender });
  const bubble = chatMessageBubble({ sender, appearance: 'solid', group: 'none' });
  const content = serializeHtmlTag(
    'div',
    mergeProps(m.content),
    serializeHtmlTag('div', mergeProps(bubble.root), text),
  );
  return serializeHtmlTag('div', mergeProps(m.root), content);
}

export function render(): string {
  const l = chatMessageList({ density: 'balanced' });
  const inner = serializeHtmlTag(
    'div',
    mergeProps(l.inner),
    `${message('assistant', 'Hello! How can I help?')}${message('user', 'What components ship in var-ui?')}`,
  );
  return serializeHtmlTag(
    'div',
    { ...mergeProps(l.root), role: 'log', 'aria-live': 'polite' },
    inner,
  );
}
