import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, Menu } from '@var-ui/react';

<Menu.FromSections
  trigger={<Button>File</Button>}
  sections={[
    {
      label: 'Edit',
      items: [
        { id: 'cut', label: 'Cut', shortcut: '⌘X' },
        { id: 'copy', label: 'Copy', shortcut: '⌘C' },
        { id: 'paste', label: 'Paste', shortcut: '⌘V' },
      ],
    },
    {
      label: 'Danger zone',
      items: [
        { id: 'archive', label: 'Archive' },
        { id: 'delete', label: 'Delete…', danger: true },
      ],
    },
  ]}
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
