import { Button, Drawer } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer open={open} onOpenChange={setOpen} title="Settings">
        <p>Drawer body content.</p>
      </Drawer>
    </>
  );
}
