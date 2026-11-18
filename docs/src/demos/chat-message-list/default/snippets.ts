import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ChatMessage, ChatMessageBubble, ChatMessageList } from '@var-ui/react';

<ChatMessageList>
  <ChatMessage sender="assistant">
    <ChatMessageBubble>Hello! How can I help?</ChatMessageBubble>
  </ChatMessage>
  <ChatMessage sender="user">
    <ChatMessageBubble>What components ship in var-ui?</ChatMessageBubble>
  </ChatMessage>
</ChatMessageList>`,
  astro: `---
// No @var-ui/astro ChatMessageList — core recipe log region.
import { chatMessage, chatMessageBubble, chatMessageList } from '@var-ui/core';

const l = chatMessageList({ density: 'balanced' });
const assistant = chatMessage({ sender: 'assistant' });
const user = chatMessage({ sender: 'user' });
const assistantBubble = chatMessageBubble({ sender: 'assistant', appearance: 'solid', group: 'none' });
const userBubble = chatMessageBubble({ sender: 'user', appearance: 'solid', group: 'none' });
---

<div class:list={[l.root]} role="log" aria-live="polite">
  <div class:list={[l.inner]}>
    <div class:list={[assistant.root]}>
      <div class:list={[assistant.content]}>
        <div class:list={[assistantBubble.root]}>Hello! How can I help?</div>
      </div>
    </div>
    <div class:list={[user.root]}>
      <div class:list={[user.content]}>
        <div class:list={[userBubble.root]}>What components ship in var-ui?</div>
      </div>
    </div>
  </div>
</div>`,
  html: `<div data-density="balanced" class="var-ui-chat-message-list" role="log" aria-live="polite"><div data-density="balanced" class="var-ui-chat-message-list__inner"><div data-sender="assistant" class="var-ui-chat-message"><div data-sender="assistant" class="var-ui-chat-message__content"><div data-sender="assistant" data-appearance="solid" data-group="none" class="var-ui-chat-message-bubble">Hello! How can I help?</div></div></div><div data-sender="user" class="var-ui-chat-message"><div data-sender="user" class="var-ui-chat-message__content"><div data-sender="user" data-appearance="solid" data-group="none" class="var-ui-chat-message-bubble">What components ship in var-ui?</div></div></div></div></div>`,
} satisfies DemoSnippets;
