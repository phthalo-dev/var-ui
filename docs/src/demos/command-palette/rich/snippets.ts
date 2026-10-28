import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { CommandPalette, createCommandPalette } from '@var-ui/react';

// Drive the palette from anywhere (event handlers, route loaders, other modules).
export const palette = createCommandPalette();
// palette.open(); palette.toggle();

<CommandPalette
  controller={palette}
  hotkey={['mod+k', 'mod+shift+p']}
  highlightMatches
  items={[
    {
      id: 'save',
      title: 'Save',
      group: 'File',
      icon: <SaveIcon />,
      shortcut: ['⌘', 'S'],
      onSelect: save,
    },
  ]}
/>`,
  astro: `<!-- React-only secondary demo — see default for Astro -->`,
  html: `<!-- React-only secondary demo — see default for HTML -->`,
} satisfies DemoSnippets;
