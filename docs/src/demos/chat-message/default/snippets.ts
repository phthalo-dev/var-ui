import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Avatar, ChatMessage, ChatMessageBubble, ChatMessageMetadata } from '@var-ui/react';

<ChatMessage
  sender="assistant"
  name="Navi"
  avatar={<Avatar name="Navi" size="sm" />}
  metadata={<ChatMessageMetadata date={new Date()} format="time" />}
>
  <ChatMessageBubble>Hello! How can I help?</ChatMessageBubble>
</ChatMessage>`,
  astro: `---
// No @var-ui/astro ChatMessage — core recipe row + avatar/bubble slots.
import { avatar, chatMessage, chatMessageBubble, textBlock } from '@var-ui/core';

const m = chatMessage({ sender: 'assistant' });
const bubble = chatMessageBubble({ sender: 'assistant', appearance: 'solid', group: 'none' });
const a = avatar({ size: 'sm' });
const time = textBlock({ size: 'sm', tone: 'secondary' });
---

<div class:list={[m.root]}>
  <div class:list={[m.avatar]}>
    <span class:list={[a.root]}>
      <span class:list={[a.initials]} role="img" aria-label="Navi">N</span>
    </span>
  </div>
  <div class:list={[m.content]}>
    <div class:list={[m.header]}><span class:list={[m.name]}>Navi</span></div>
    <div class:list={[bubble.root]}>Hello! How can I help?</div>
    <div class:list={[m.metadata]}>
      <time class:list={[time]} datetime="2026-07-19T21:35:00.000Z">2:35 PM</time>
    </div>
  </div>
</div>`,
  html: `<div data-sender="assistant" class="var-ui-chat-message"><div data-sender="assistant" class="var-ui-chat-message__avatar"><span data-size="sm" class="var-ui-avatar"><span data-size="sm" class="var-ui-avatar__initials" role="img" aria-label="Navi">N</span></span></div><div data-sender="assistant" class="var-ui-chat-message__content"><div data-sender="assistant" class="var-ui-chat-message__header"><span data-sender="assistant" class="var-ui-chat-message__name">Navi</span></div><div data-sender="assistant" data-appearance="solid" data-group="none" class="var-ui-chat-message-bubble">Hello! How can I help?</div><div data-sender="assistant" class="var-ui-chat-message__metadata"><div data-direction="row" data-gap="xs" data-align="center" data-justify="start" data-wrap="nowrap" class="var-ui-stack"><time data-size="sm" data-tone="secondary" data-weight="normal" data-line-clamp="false" class="var-ui-text-block" datetime="2026-07-19T21:35:00.000Z" title="Jul 19, 2026, 2:35 PM">2:35 PM</time></div></div></div></div>`,
} satisfies DemoSnippets;
