import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { useState } from 'react';
import { ChatComposer, ChatComposerInput, ChatSendButton } from '@var-ui/react';

function Composer() {
  const [value, setValue] = useState('');
  return (
    <ChatComposer actions={<ChatSendButton onPress={() => setValue('')} />}>
      <ChatComposerInput
        value={value}
        onChange={setValue}
        onSubmit={() => setValue('')}
        placeholder="Type a message…"
      />
    </ChatComposer>
  );
}`,
  astro: `---
// No @var-ui/astro ChatComposer — static core-recipe chrome (non-interactive).
import { button, chatComposer } from '@var-ui/core';

const c = chatComposer();
const send = button({ tone: 'accent', appearance: 'filled' });
---

<div class:list={[c.root]}>
  <div class:list={[c.inputRow]}>
    <textarea class:list={[c.input]} rows="1" placeholder="Type a message…" disabled></textarea>
  </div>
  <div class:list={[c.actions]}>
    <button type="button" class:list={[send]} aria-label="Send message" disabled>↑</button>
  </div>
</div>`,
  html: `<div data-appearance="default" class="var-ui-chat-composer"><div data-appearance="default" class="var-ui-chat-composer__inputRow"><textarea data-appearance="default" class="var-ui-chat-composer__input" rows="1" placeholder="Type a message…" aria-label="Message" disabled></textarea></div><div data-appearance="default" class="var-ui-chat-composer__actions"><button type="button" data-tone="accent" data-appearance="filled" data-size="md" data-layout="default" class="var-ui-button" aria-label="Send message" disabled><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"></path></svg></button></div></div>`,
} satisfies DemoSnippets;
