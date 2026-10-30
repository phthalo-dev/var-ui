import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, Drawer } from '@var-ui/react';

<Button onClick={() => setOpen(true)}>Open drawer</Button>
<Drawer open={open} onOpenChange={setOpen} title="Settings">
  <p>Drawer body content.</p>
</Drawer>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
