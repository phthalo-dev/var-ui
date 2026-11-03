import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { useState } from 'react';
import { Button, VisuallyHidden } from '@var-ui/react';

function Save() {
  const [saved, setSaved] = useState(false);
  return (
    <>
      <Button onClick={() => setSaved(true)}>Save</Button>
      <VisuallyHidden role="status">{saved ? 'Changes saved' : ''}</VisuallyHidden>
    </>
  );
}`,
  astro: `<!-- Needs client state: use @var-ui/react -->`,
  html: `<!-- No HTML demo yet: use @var-ui/react -->`,
} satisfies DemoSnippets;
