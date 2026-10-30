import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Pagination } from '@var-ui/react';
import { useState } from 'react';

const [page, setPage] = useState(3);

<>
  <p>Page {page} of 12</p>
  <Pagination page={page} onValueChange={setPage} totalPages={12} />
</>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
