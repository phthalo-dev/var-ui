import { Button, CommandPalette } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Open palette</Button>
      <CommandPalette
        isOpen={open}
        onOpenChange={setOpen}
        hotkey={false}
        items={[
          { id: 'new-file', title: 'New file', meta: 'File', keywords: ['create', 'document'] },
          { id: 'new-folder', title: 'New folder', meta: 'File', keywords: ['directory'] },
          { id: 'theme', title: 'Toggle theme', meta: 'Appearance', keywords: ['dark', 'light'] },
          {
            id: 'command-palette',
            title: 'Command palette',
            meta: 'Navigation',
            keywords: ['search', 'goto'],
          },
          { id: 'settings', title: 'Open settings', meta: 'Navigation', keywords: ['prefs'] },
        ]}
        onAction={() => setOpen(false)}
      />
    </>
  );
}
