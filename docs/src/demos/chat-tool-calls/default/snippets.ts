import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ChatToolCalls } from '@var-ui/react';

<ChatToolCalls
  calls={[
    { name: 'read_file', status: 'complete', target: 'App.tsx', duration: '0.3s' },
    { name: 'run_tests', status: 'complete', resultDetail: <span>42 passed</span> },
  ]}
/>`,
  astro: `---
// No @var-ui/astro ChatToolCalls — static collapsed group chrome.
// Expand/collapse of 2+ calls is React-only.
import { chatToolCalls } from '@var-ui/core';

const t = chatToolCalls({ status: 'complete', expanded: false });
---

<div class:list={[t.root]}>
  <button type="button" class:list={[t.header]} aria-expanded="false" disabled>
    <span class:list={[t.name]}>run_tests</span>
  </button>
</div>`,
  html: `<div data-status="complete" class="var-ui-chat-tool-calls"><button type="button" data-status="complete" class="var-ui-chat-tool-calls__header" aria-expanded="false" disabled><span data-status="complete" class="var-ui-chat-tool-calls__statusIcon"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0-5.6 5.6l-5.4 5.4a2 2 0 1 0 2.8 2.8l5.4-5.4a4 4 0 0 0 5.6-5.6l-2.1 2.1-1.8-1.8 2.1-2.1z"></path></svg></span><span data-status="complete" class="var-ui-chat-tool-calls__name">run_tests</span><span data-status="complete" class="var-ui-chat-tool-calls__chevron"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"></path></svg></span></button></div>`,
} satisfies DemoSnippets;
