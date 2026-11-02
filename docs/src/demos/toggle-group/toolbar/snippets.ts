import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, ToggleGroup, Toolbar } from '@var-ui/react';

<Toolbar
  label="Formatting"
  startContent={
    <ToggleGroup aria-label="Text style" multiple>
      <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
      <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
    </ToggleGroup>
  }
  endContent={<Button>Share</Button>}
/>`,
  astro: `<!-- No Astro binding: ToggleGroup holds client state, use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
