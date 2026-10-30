import { AlertDialog } from '@var-ui/react';

export default function Preview() {
  return (
    <AlertDialog
      triggerLabel="Delete"
      title="Delete item?"
      description="This cannot be undone."
      confirmLabel="Delete"
      destructive
      onConfirm={() => {}}
    />
  );
}
