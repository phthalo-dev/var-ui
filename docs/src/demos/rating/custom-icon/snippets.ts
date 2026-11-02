import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Rating } from '@var-ui/react';

const heart = (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" />
  </svg>
);

export default function Preview() {
  return <Rating label="Favourite" defaultValue={2} max={5} icon={heart} tone="danger" />;
}`,
  astro: `<!-- No Astro binding for this demo — use @var-ui/react (read-only display: see the Rating Astro component) -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
