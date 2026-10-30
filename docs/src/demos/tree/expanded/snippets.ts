import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Tree } from '@var-ui/react';

<Tree
  aria-label="Project files"
  selectionMode="single"
  defaultExpanded={['src', 'components']}
  defaultValue="button"
  items={[
    {
      id: 'src',
      label: 'src',
      children: [
        {
          id: 'components',
          label: 'components',
          children: [{ id: 'button', label: 'Button.tsx' }],
        },
      ],
    },
  ]}
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
