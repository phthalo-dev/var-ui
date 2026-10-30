import { Button, CommandPalette, useCommandPalette } from '@var-ui/react';
import { useState } from 'react';

const glyph = (d: string) => (
  <svg
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d={d} />
  </svg>
);

export default function Preview() {
  const palette = useCommandPalette();
  const [last, setLast] = useState('Nothing yet');
  const run = (label: string) => () => setLast(label);
  return (
    <>
      <Button onClick={palette.open}>Open palette</Button>
      <p>Last command: {last}</p>
      <CommandPalette
        controller={palette}
        hotkey={false}
        highlightMatches
        items={[
          {
            id: 'new-file',
            title: 'New file',
            group: 'File',
            icon: glyph('M4 2h5l3 3v9H4zM9 2v3h3'),
            shortcut: ['⌘', 'N'],
            onSelect: run('New file'),
          },
          {
            id: 'save',
            title: 'Save',
            group: 'File',
            icon: glyph('M3 3h8l2 2v8H3zM5 3v4h5V3'),
            shortcut: ['⌘', 'S'],
            onSelect: run('Save'),
          },
          {
            id: 'settings',
            title: 'Open settings',
            group: 'Navigation',
            icon: glyph('M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM8 1v2M8 13v2M1 8h2M13 8h2'),
            shortcut: 'G S',
            onSelect: run('Open settings'),
          },
        ]}
      />
    </>
  );
}
