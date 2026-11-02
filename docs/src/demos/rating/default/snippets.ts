import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Rating } from '@var-ui/react';

export default function Preview() {
  return <Rating label="Quality" defaultValue={3} />;
}`,
  astro: `<!-- No Astro binding for this demo — use @var-ui/react (read-only display: see the Rating Astro component) -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
