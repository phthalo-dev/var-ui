import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, Drawer } from '@var-ui/react';
import { useState } from 'react';

const [open, setOpen] = useState(false);

<Button onPress={() => setOpen(true)}>
  Open from start
</Button>
<Drawer
  isOpen={open}
  onOpenChange={setOpen}
  title="Filters"
  placement="start"
>
  <p>Panel slides in from the start edge.</p>
</Drawer>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
