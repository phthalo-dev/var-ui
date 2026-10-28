import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { useState } from 'react';
import { EditableText, Heading } from '@var-ui/react';

function PlaylistName() {
  const [name, setName] = useState('Road trip');
  return (
    <EditableText value={name} onCommit={setName} aria-label="Playlist name">
      <Heading level={2}>{name}</Heading>
    </EditableText>
  );
}`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
