import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { useState } from 'react';
import {
  Avatar,
  ChatComposer,
  ChatComposerInput,
  ChatLayout,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageList,
  ChatSendButton,
} from '@var-ui/react';

function ChatShell() {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState(['Hello! How can I help?']);

  function send(text: string) {
    setMessages((prev) => [...prev, text]);
    setValue('');
  }

  return (
    <ChatLayout
      composer={
        <ChatComposer actions={<ChatSendButton onPress={() => send(value)} />}>
          <ChatComposerInput value={value} onChange={setValue} onSubmit={send} />
        </ChatComposer>
      }
    >
      <ChatMessageList>
        {messages.map((text, index) => (
          <ChatMessage
            key={\`\${text}-\${index}\`}
            sender={index % 2 === 0 ? 'assistant' : 'user'}
            name={index % 2 === 0 ? 'Assistant' : 'You'}
            avatar={<Avatar name={index % 2 === 0 ? 'Assistant' : 'You'} size="sm" />}
          >
            <ChatMessageBubble>{text}</ChatMessageBubble>
          </ChatMessage>
        ))}
      </ChatMessageList>
    </ChatLayout>
  );
}`,
  astro: `---
// No @var-ui/astro ChatLayout — static core-recipe shell.
// Scroll-to-bottom / composer submit behavior is React-only.
import {
  avatar,
  button,
  chatComposer,
  chatLayout,
  chatMessage,
  chatMessageBubble,
  chatMessageList,
} from '@var-ui/core';

const l = chatLayout();
const list = chatMessageList({ density: 'balanced' });
const m = chatMessage({ sender: 'assistant' });
const bubble = chatMessageBubble({ sender: 'assistant', variant: 'filled', group: 'none' });
const a = avatar({ size: 'sm' });
const c = chatComposer();
const send = button({ tone: 'accent', appearance: 'filled' });
---

<div style="height: 280px">
  <div class:list={[l.root]}>
    <div class:list={[l.messageArea]}>
      <div class:list={[list.root]} role="log" aria-live="polite">
        <div class:list={[list.inner]}>
          <div class:list={[m.root]}>
            <div class:list={[m.avatar]}>
              <span class:list={[a.root]}>
                <span class:list={[a.initials]} role="img" aria-label="Assistant">A</span>
              </span>
            </div>
            <div class:list={[m.content]}>
              <div class:list={[m.header]}><span class:list={[m.name]}>Assistant</span></div>
              <div class:list={[bubble.root]}>Hello! How can I help?</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class:list={[l.dock]}>
      <div class:list={[c.root]}>
        <div class:list={[c.inputRow]}>
          <textarea class:list={[c.input]} rows="1" placeholder="Type a message…" disabled></textarea>
        </div>
        <div class:list={[c.actions]}>
          <button type="button" class:list={[send]} aria-label="Send message" disabled>↑</button>
        </div>
      </div>
    </div>
  </div>
</div>`,
  html: `<div style="height: 280px"><div data-appearance="default" class="var-ui-chat-layout"><div data-appearance="default" class="var-ui-chat-layout__messageArea"><div data-density="balanced" class="var-ui-chat-message-list" role="log" aria-live="polite"><div data-density="balanced" class="var-ui-chat-message-list__inner"><div data-sender="assistant" class="var-ui-chat-message"><div data-sender="assistant" class="var-ui-chat-message__avatar"><span data-size="sm" class="var-ui-avatar"><span data-size="sm" class="var-ui-avatar__initials" role="img" aria-label="Assistant">A</span></span></div><div data-sender="assistant" class="var-ui-chat-message__content"><div data-sender="assistant" class="var-ui-chat-message__header"><span data-sender="assistant" class="var-ui-chat-message__name">Assistant</span></div><div data-sender="assistant" data-variant="filled" data-group="none" class="var-ui-chat-message-bubble">Hello! How can I help?</div></div></div></div></div></div><div data-appearance="default" class="var-ui-chat-layout__dock"><div data-appearance="default" class="var-ui-chat-composer"><div data-appearance="default" class="var-ui-chat-composer__inputRow"><textarea data-appearance="default" class="var-ui-chat-composer__input" rows="1" placeholder="Type a message…" aria-label="Message" disabled></textarea></div><div data-appearance="default" class="var-ui-chat-composer__actions"><button type="button" data-tone="accent" data-appearance="filled" data-size="md" data-layout="default" class="var-ui-button" aria-label="Send message" disabled><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"></path></svg></button></div></div></div></div></div>`,
} satisfies DemoSnippets;
