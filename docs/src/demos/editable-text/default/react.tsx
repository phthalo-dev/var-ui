import { useState } from 'react';
import { EditableText, Heading } from '@var-ui/react';

export default function Preview() {
  const [name, setName] = useState('Road trip');
  return (
    <EditableText value={name} onCommit={setName} aria-label="Playlist name">
      <Heading level={2}>{name}</Heading>
    </EditableText>
  );
}
