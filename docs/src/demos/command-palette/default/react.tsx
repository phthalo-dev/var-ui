import { Button, CommandPalette } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open palette</Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        hotkey={false}
        items={[
          { id: 'docs', title: 'Docs', meta: 'Guides', onSelect: () => {} },
          { id: 'components', title: 'Components', meta: 'Library', onSelect: () => {} },
        ]}
      />
    </>
  );
}
