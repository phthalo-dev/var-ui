import { AlertDialog, Button } from '@var-ui/react';

export default function Preview() {
  return (
    <AlertDialog>
      <AlertDialog.Trigger>
        <Button>Publish</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Backdrop>
        <AlertDialog.Popup>
          <AlertDialog.Header>
            <AlertDialog.Title>Publish post?</AlertDialog.Title>
          </AlertDialog.Header>
          <AlertDialog.Description>
            Your draft will become visible to everyone with the link.
          </AlertDialog.Description>
          <AlertDialog.Actions>
            <AlertDialog.Close>
              <Button>Keep editing</Button>
            </AlertDialog.Close>
            <AlertDialog.Close>
              <Button tone="accent" appearance="filled" onClick={() => {}}>
                Publish
              </Button>
            </AlertDialog.Close>
          </AlertDialog.Actions>
        </AlertDialog.Popup>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
