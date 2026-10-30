import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Toc } from '@var-ui/react';

<Toc title="On this page">
  <Toc.Item label="Examples" href="#examples" selected />
  <Toc.Item label="Default" href="#default" nested />
  <Toc.Item label="Nested items" href="#nested" nested />
  <Toc.Item label="Props" href="#props" />
  <Toc.Item label="Accessibility" href="#accessibility" />
</Toc>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
