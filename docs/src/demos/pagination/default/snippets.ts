import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Pagination } from '@var-ui/react';

<Pagination page={page} onValueChange={setPage} totalPages={5} />`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
