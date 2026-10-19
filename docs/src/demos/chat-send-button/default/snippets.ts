import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { useState } from 'react';
import { ChatSendButton } from '@var-ui/react';

function SendToggle() {
  const [isStreaming, setIsStreaming] = useState(false);
  return (
    <ChatSendButton
      isStreaming={isStreaming}
      onPress={() => setIsStreaming(true)}
      onStop={() => setIsStreaming(false)}
    />
  );
}`,
  astro: `---
// No @var-ui/astro ChatSendButton — static Button chrome (send state only).
// Send ↔ stop streaming toggle is React-only.
import { button } from '@var-ui/core';

const send = button({ tone: 'accent', appearance: 'filled' });
---

<button type="button" class:list={[send]} aria-label="Send message">↑</button>`,
  html: `<button type="button" data-tone="accent" data-appearance="filled" data-size="md" data-layout="default" class="var-ui-button" aria-label="Send message"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"></path></svg></button>`,
} satisfies DemoSnippets;
