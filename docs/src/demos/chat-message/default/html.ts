import { avatar, chatMessage, chatMessageBubble, stack, textBlock } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

const DEMO_ISO = '2026-07-19T21:35:00.000Z';
const DEMO_LABEL = '2:35 PM';
const DEMO_TITLE = 'Jul 19, 2026, 2:35 PM';

export function render(): string {
  const m = chatMessage({ sender: 'assistant' });
  const bubble = chatMessageBubble({ sender: 'assistant', appearance: 'solid', group: 'none' });
  const a = avatar({ size: 'sm' });
  const initials = serializeHtmlTag(
    'span',
    { ...mergeProps(a.initials), role: 'img', 'aria-label': 'Navi' },
    'N',
  );
  const avatarEl = serializeHtmlTag(
    'div',
    mergeProps(m.avatar),
    serializeHtmlTag('span', mergeProps(a.root), initials),
  );
  const name = serializeHtmlTag(
    'div',
    mergeProps(m.header),
    serializeHtmlTag('span', mergeProps(m.name), 'Navi'),
  );
  const bubbleEl = serializeHtmlTag('div', mergeProps(bubble.root), 'Hello! How can I help?');
  const time = serializeHtmlTag(
    'time',
    {
      ...mergeProps(textBlock({ size: 'sm', tone: 'secondary' })),
      datetime: DEMO_ISO,
      title: DEMO_TITLE,
    },
    DEMO_LABEL,
  );
  const metadata = serializeHtmlTag(
    'div',
    mergeProps(m.metadata),
    serializeHtmlTag(
      'div',
      mergeProps(
        stack({ direction: 'row', gap: 'xs', align: 'center', justify: 'start', wrap: 'nowrap' }),
      ),
      time,
    ),
  );
  const content = serializeHtmlTag('div', mergeProps(m.content), `${name}${bubbleEl}${metadata}`);
  return serializeHtmlTag('div', mergeProps(m.root), `${avatarEl}${content}`);
}
