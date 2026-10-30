import { Button, Drawer, HStack } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<'start' | 'end' | 'bottom'>('start');

  return (
    <HStack gap="md" wrap align="center">
      <Button
        onClick={() => {
          setPlacement('start');
          setOpen(true);
        }}
      >
        Start
      </Button>
      <Button
        onClick={() => {
          setPlacement('bottom');
          setOpen(true);
        }}
      >
        Bottom
      </Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title={`${placement} drawer`}
        placement={placement}
      >
        <p>Panel slides in from the {placement} edge.</p>
      </Drawer>
    </HStack>
  );
}
