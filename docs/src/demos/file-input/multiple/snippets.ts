import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { FileInput } from '@var-ui/react';
import { useState } from 'react';

const [files, setFiles] = useState<File[] | null>(null);

<FileInput
  label="Attachments"
  value={files}
  onValueChange={setFiles}
  multiple
  accept="image/*,.pdf"
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
