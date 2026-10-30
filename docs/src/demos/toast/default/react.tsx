import { Button, HStack, ToastProvider, toast, useToast } from '@var-ui/react';

function ToastDemoButtons() {
  const { add } = useToast();

  return (
    <HStack gap="sm" wrap>
      <Button
        onClick={() =>
          add({
            tone: 'success',
            title: 'Saved',
            description: 'Your draft was stored.',
          })
        }
      >
        useToast
      </Button>
      <Button
        onClick={() =>
          toast.show({
            tone: 'info',
            title: 'Syncing',
            description: 'Changes are uploading in the background.',
          })
        }
      >
        toast.show
      </Button>
      <Button
        tone="accent"
        appearance="ghost"
        onClick={() => {
          const id = toast.show({ tone: 'info', title: 'Uploading…', durationMs: 0 });
          window.setTimeout(() => {
            toast.update(id, { tone: 'success', title: 'Upload complete' });
          }, 900);
        }}
      >
        toast.update
      </Button>
    </HStack>
  );
}

export default function Preview() {
  return (
    <ToastProvider placement="bottom-end" maxVisibleToasts={3}>
      <ToastDemoButtons />
    </ToastProvider>
  );
}
