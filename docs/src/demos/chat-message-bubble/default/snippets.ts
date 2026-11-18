import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ChatMessage, ChatMessageBubble } from '@var-ui/react';

<ChatMessage sender="assistant" name="Navi">
  <ChatMessageBubble group="first">First part of a multi-part reply.</ChatMessageBubble>
  <ChatMessageBubble group="last">Second part.</ChatMessageBubble>
</ChatMessage>`,
  astro: `---
// No @var-ui/astro ChatMessageBubble — core recipe with group corners.
import { chatMessage, chatMessageBubble } from '@var-ui/core';

const m = chatMessage({ sender: 'assistant' });
const first = chatMessageBubble({ sender: 'assistant', appearance: 'solid', group: 'first' });
const last = chatMessageBubble({ sender: 'assistant', appearance: 'solid', group: 'last' });
---

<div class:list={[m.root]}>
  <div class:list={[m.content]}>
    <div class:list={[m.header]}><span class:list={[m.name]}>Navi</span></div>
    <div class:list={[first.root]}>First part of a multi-part reply.</div>
    <div class:list={[last.root]}>Second part.</div>
  </div>
</div>`,
  html: `<div data-sender="assistant" class="var-ui-chat-message"><div data-sender="assistant" class="var-ui-chat-message__content"><div data-sender="assistant" class="var-ui-chat-message__header"><span data-sender="assistant" class="var-ui-chat-message__name">Navi</span></div><div data-sender="assistant" data-appearance="solid" data-group="first" class="var-ui-chat-message-bubble">First part of a multi-part reply.</div><div data-sender="assistant" data-appearance="solid" data-group="last" class="var-ui-chat-message-bubble">Second part.</div></div></div>`,
} satisfies DemoSnippets;
