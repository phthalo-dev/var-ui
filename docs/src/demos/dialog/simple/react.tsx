import { Button, Dialog } from '@var-ui/react';

export default function Preview() {
  return (
    <Dialog>
      <Dialog.Trigger>
        <Button>Open dialog</Button>
      </Dialog.Trigger>
      <Dialog.Popup>
        <Dialog.Header>
          <Dialog.Title>Notifications</Dialog.Title>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Description>You are all caught up.</Dialog.Description>
        <Dialog.Actions>
          <Dialog.Close>
            <Button>Close</Button>
          </Dialog.Close>
        </Dialog.Actions>
      </Dialog.Popup>
    </Dialog>
  );
}
