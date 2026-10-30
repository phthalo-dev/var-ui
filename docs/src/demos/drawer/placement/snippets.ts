import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, Drawer } from '@var-ui/react';

<Drawer>
  <Drawer.Trigger>
    <Button>Open from start</Button>
  </Drawer.Trigger>
  <Drawer.Popup placement="start" aria-label="Filters">
    <Drawer.Header>
      <Drawer.Title>Filters</Drawer.Title>
      <Drawer.Close />
    </Drawer.Header>
    <Drawer.Body>
      <p>Popup slides in from the start edge.</p>
    </Drawer.Body>
  </Drawer.Popup>
</Drawer>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
