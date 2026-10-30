import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, Drawer } from '@var-ui/react';

<Drawer>
  <Drawer.Trigger>
    <Button>Open drawer</Button>
  </Drawer.Trigger>
  <Drawer.Popup aria-label="Settings">
    <Drawer.Header>
      <Drawer.Title>Settings</Drawer.Title>
      <Drawer.Close />
    </Drawer.Header>
    <Drawer.Body>
      <p>Drawer body content.</p>
    </Drawer.Body>
  </Drawer.Popup>
</Drawer>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
