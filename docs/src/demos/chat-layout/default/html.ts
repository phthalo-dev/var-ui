import {
  avatar,
  button,
  chatComposer,
  chatLayout,
  chatMessage,
  chatMessageBubble,
  chatMessageList,
} from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

const arrowUpIcon =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"></path></svg>';

function messageRow(
  sender: 'assistant' | 'user',
  name: string,
  text: string,
  initial: string,
): string {
  const m = chatMessage({ sender });
  const bubble = chatMessageBubble({ sender, variant: 'filled', group: 'none' });
  const a = avatar({ size: 'sm' });
  const initials = serializeHtmlTag(
    'span',
    { ...mergeProps(a.initials), role: 'img', 'aria-label': name },
    initial,
  );
  const avatarEl = serializeHtmlTag(
    'div',
    mergeProps(m.avatar),
    serializeHtmlTag('span', mergeProps(a.root), initials),
  );
  const header = serializeHtmlTag(
    'div',
    mergeProps(m.header),
    serializeHtmlTag('span', mergeProps(m.name), name),
  );
  const content = serializeHtmlTag(
    'div',
    mergeProps(m.content),
    `${header}${serializeHtmlTag('div', mergeProps(bubble.root), text)}`,
  );
  return serializeHtmlTag('div', mergeProps(m.root), `${avatarEl}${content}`);
}

export function render(): string {
  const l = chatLayout();
  const list = chatMessageList({ density: 'balanced' });
  const c = chatComposer();

  const listInner = serializeHtmlTag(
    'div',
    mergeProps(list.inner),
    messageRow('assistant', 'Assistant', 'Hello! How can I help?', 'A'),
  );
  const listRoot = serializeHtmlTag(
    'div',
    { ...mergeProps(list.root), role: 'log', 'aria-live': 'polite' },
    listInner,
  );
  const messageArea = serializeHtmlTag('div', mergeProps(l.messageArea), listRoot);

  const input = serializeHtmlTag(
    'textarea',
    {
      ...mergeProps(c.input),
      rows: '1',
      placeholder: 'Type a message…',
      'aria-label': 'Message',
      disabled: true,
    },
    '',
  );
  const inputRow = serializeHtmlTag('div', mergeProps(c.inputRow), input);
  const send = serializeHtmlTag(
    'button',
    {
      type: 'button',
      ...mergeProps(button({ tone: 'accent', appearance: 'filled' })),
      'aria-label': 'Send message',
      disabled: true,
    },
    arrowUpIcon,
  );
  const actions = serializeHtmlTag('div', mergeProps(c.actions), send);
  const composer = serializeHtmlTag('div', mergeProps(c.root), `${inputRow}${actions}`);
  const dock = serializeHtmlTag('div', mergeProps(l.dock), composer);
  const root = serializeHtmlTag('div', mergeProps(l.root), `${messageArea}${dock}`);
  return `<div style="height: 280px">${root}</div>`;
}
