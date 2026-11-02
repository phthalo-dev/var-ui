import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Rating } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [value, setValue] = useState(4);

  return (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      <Rating label="Your rating" value={value} onValueChange={setValue} clearable />
      <span>{value === 0 ? 'No rating' : \`\${value} of 5\`}</span>
    </div>
  );
}`,
  astro: `<!-- No Astro binding for this demo — use @var-ui/react (read-only display: see the Rating Astro component) -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
