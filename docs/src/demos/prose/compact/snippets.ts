import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage, ChatMessageBubble, Prose, proseComponents } from '@var-ui/react';

<ChatMessage sender="assistant">
  <ChatMessageBubble>
    <Prose density="compact">
      <Markdown remarkPlugins={[remarkGfm]} components={proseComponents}>
        {reply}
      </Markdown>
    </Prose>
  </ChatMessageBubble>
</ChatMessage>`,
  astro: `---
import { Prose } from '@var-ui/astro';
import { Content } from '../notes/release.md';
---

<Prose density="compact">
  <Content />
</Prose>`,
  html: `<div data-density="compact" class="var-ui-prose">
  <h3>Build fixed</h3>
  <p>The failure came from a stale <code>dist</code> folder. I rebuilt core and the tests pass again:</p>
  <pre><code class="language-sh">vp run build
vp test run</code></pre>
  <ul>
    <li>2,642 tests passed</li>
    <li>See the <a href="#">CI run</a> for details</li>
  </ul>
</div>`,
} satisfies DemoSnippets;
