import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Toc } from '@var-ui/react';

<Toc
  activeId="examples"
  items={[
    { id: 'intro', text: 'Intro', level: 2 },
    { id: 'examples', text: 'Examples', level: 2 },
    { id: 'default', text: 'Default', level: 3 },
    { id: 'props', text: 'Props', level: 2 },
  ]}
/>`,
  astro: `---
import { Toc } from '@var-ui/astro';
---
<Toc
  activeId="examples"
  items={[
    { id: 'intro', text: 'Intro', level: 2 },
    { id: 'examples', text: 'Examples', level: 2 },
    { id: 'default', text: 'Default', level: 3 },
    { id: 'props', text: 'Props', level: 2 },
  ]}
/>`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
