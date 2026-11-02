import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ToggleGroup } from '@var-ui/react';

<ToggleGroup aria-label="View" defaultValue="list">
  <ToggleGroup.Item value="list">List</ToggleGroup.Item>
  <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
  <ToggleGroup.Item value="board">Board</ToggleGroup.Item>
</ToggleGroup>`,
  astro: `<!-- No Astro binding: ToggleGroup holds client state, use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
