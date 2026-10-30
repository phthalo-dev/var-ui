import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { FileInput } from '@var-ui/react';

<FileInput label="Upload" value={file} onValueChange={setFile} accept=".pdf,image/*" />`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
