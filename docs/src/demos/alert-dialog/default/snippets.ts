import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { AlertDialog } from '@var-ui/react';

<AlertDialog
  triggerLabel="Delete"
  title="Delete item?"
  description="This cannot be undone."
  confirmLabel="Delete"
  destructive
  onConfirm={() => {}}
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
