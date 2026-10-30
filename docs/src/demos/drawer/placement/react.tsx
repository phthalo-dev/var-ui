import { Button, Drawer, HStack } from '@var-ui/react';

const placements = ['start', 'end', 'bottom'] as const;

export default function Preview() {
  return (
    <HStack gap="md" wrap align="center">
      {placements.map((placement) => (
        <Drawer key={placement}>
          <Drawer.Trigger>
            <Button>{placement}</Button>
          </Drawer.Trigger>
          <Drawer.Popup placement={placement} aria-label={`${placement} drawer`}>
            <Drawer.Header>
              <Drawer.Title>{placement} drawer</Drawer.Title>
              <Drawer.Close />
            </Drawer.Header>
            <Drawer.Body>
              <p>Popup slides in from the {placement} edge.</p>
            </Drawer.Body>
          </Drawer.Popup>
        </Drawer>
      ))}
    </HStack>
  );
}
