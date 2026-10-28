import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, CommandPalette } from '@var-ui/react';
import { useState } from 'react';

const [open, setOpen] = useState(false);

<Button onPress={() => setOpen(true)}>
  Open palette
</Button>
<CommandPalette
  isOpen={open}
  onOpenChange={setOpen}
  hotkey={false}
  items={[
    { id: 'new-file', title: 'New file', meta: 'File', keywords: ['create'] },
    { id: 'theme', title: 'Toggle theme', meta: 'Appearance', keywords: ['dark'] },
    { id: 'settings', title: 'Open settings', meta: 'Navigation' },
  ]}
/>`,
  astro: `<!-- React-only secondary demo — see default for Astro -->`,
  html: `<!-- React-only secondary demo — see default for HTML -->`,
} satisfies DemoSnippets;
