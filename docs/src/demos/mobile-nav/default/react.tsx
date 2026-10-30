import { Button, MobileNav, SideNav } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative', height: 160 }}>
      <Button onClick={() => setOpen(true)}>Open menu</Button>
      <MobileNav open={open} onOpenChange={setOpen} header="Menu">
        <SideNav.Item label="Home" href="/" />
        <SideNav.Item label="Docs" href="/docs" />
      </MobileNav>
    </div>
  );
}
