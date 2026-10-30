import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, IconButton, Toolbar } from '@var-ui/react';

<Toolbar
  label="Editor toolbar"
  startContent={
    <>
      <IconButton icon="menu" aria-label="Menu" />
      <IconButton icon="search" aria-label="Search" />
    </>
  }
  centerContent={<Button>Untitled</Button>}
  endContent={<Button tone="accent" appearance="filled">Share</Button>}
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
