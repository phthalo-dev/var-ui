import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ToggleGroup } from '@var-ui/react';

<ToggleGroup aria-label="Text style" multiple defaultValue={['bold']}>
  <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
  <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
  <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
  <ToggleGroup.Item value="strike" disabled>
    Strike
  </ToggleGroup.Item>
</ToggleGroup>`,
  astro: `<!-- No Astro binding: ToggleGroup holds client state, use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
