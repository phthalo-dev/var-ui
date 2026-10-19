import { Button, Drawer } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Open drawer</Button>
      <Drawer isOpen={open} onOpenChange={setOpen} title="Settings">
        <p>Drawer body content.</p>
      </Drawer>
    </>
  );
}
