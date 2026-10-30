import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { SearchInput } from '@var-ui/react';
import { useState } from 'react';

const [query, setQuery] = useState('docs');

<SearchInput value={query} onValueChange={setQuery} placeholder="Search…" aria-label="Search" />`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
