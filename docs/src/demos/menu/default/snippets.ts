import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, Menu } from '@var-ui/react';

<Menu>
  <Menu.Trigger>
    <Button>Song</Button>
  </Menu.Trigger>
  <Menu.Popup>
    <Menu.Item id="lib" onAction={() => {}}>Add to Library</Menu.Item>
    <Menu.Separator />
    <Menu.Section title="Danger">
      <Menu.Item id="delete" onAction={() => {}}>Delete</Menu.Item>
    </Menu.Section>
  </Menu.Popup>
</Menu>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
