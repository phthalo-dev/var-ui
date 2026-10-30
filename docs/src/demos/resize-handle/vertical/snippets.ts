import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ResizeHandle } from '@var-ui/react';

<div style={{ display: 'flex', flexDirection: 'column', height: 200 }}>
  <div style={{ height }}>Top</div>
  <ResizeHandle
    direction="vertical"
    value={height}
    minValue={60}
    maxValue={160}
    onValueChange={setHeight}
    aria-label="Resize panels"
  />
  <div style={{ flex: 1 }}>Bottom</div>
</div>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
