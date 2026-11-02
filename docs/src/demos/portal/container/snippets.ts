import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { useRef } from 'react';
import { Portal } from '@var-ui/react';

function Example() {
  const hostRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <Portal container={hostRef}>
        <p>Rendered into the box below</p>
      </Portal>
      <div ref={hostRef} />
    </>
  );
}`,
  astro: `<!-- Client-only: use @var-ui/react -->`,
  html: `<!-- No HTML demo yet: use @var-ui/react -->`,
} satisfies DemoSnippets;
